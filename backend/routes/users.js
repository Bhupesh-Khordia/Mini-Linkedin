const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users
// @access  Public
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id/posts
// @desc    Get posts by user ID
// @access  Public
router.get('/:id/posts', async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.id })
      .populate('author', 'name email profilePicture')
      .populate('comments.user', 'name email profilePicture')
      .sort({ createdAt: -1 });
    
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  auth,
  body('name', 'Name is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, bio, profilePicture } = req.body;

  // Build profile object
  const profileFields = {};
  if (name) profileFields.name = name;
  if (bio !== undefined) profileFields.bio = bio;
  if (profilePicture !== undefined) profileFields.profilePicture = profilePicture;

  try {
    let user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user
    user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: profileFields },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/follow/:id
// @desc    Follow/unfollow a user
// @access  Private
router.put('/follow/:id', auth, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }
    
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);
    
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if already following
    const alreadyFollowing = currentUser.following.find(
      follow => follow.toString() === req.params.id
    );
    
    if (alreadyFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        follow => follow.toString() !== req.params.id
      );
      userToFollow.followers = userToFollow.followers.filter(
        follower => follower.toString() !== req.user._id.toString()
      );
    } else {
      // Follow
      currentUser.following.push(req.params.id);
      userToFollow.followers.push(req.user._id);
    }
    
    await currentUser.save();
    await userToFollow.save();
    
    const updatedUser = await User.findById(req.user._id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 