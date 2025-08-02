const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/posts
// @desc    Create a post
// @access  Private
router.post('/', [
  auth,
  body('content', 'Content is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newPost = new Post({
      content: req.body.content,
      author: req.user._id
    });

    const post = await newPost.save();
    await post.populate('author', 'name email profilePicture');
    
    res.json(post);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name email profilePicture')
      .populate('comments.user', 'name email profilePicture')
      .sort({ createdAt: -1 });
    
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email profilePicture')
      .populate('comments.user', 'name email profilePicture');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check user owns post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    await post.deleteOne();
    res.json({ message: 'Post removed' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/posts/like/:id
// @desc    Like/unlike a post
// @access  Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if post has already been liked
    const alreadyLiked = post.likes.find(
      like => like.toString() === req.user._id.toString()
    );
    
    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter(
        like => like.toString() !== req.user._id.toString()
      );
    } else {
      // Like
      post.likes.push(req.user._id);
    }
    
    await post.save();
    await post.populate('author', 'name email profilePicture');
    await post.populate('comments.user', 'name email profilePicture');
    
    res.json(post);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/posts/comment/:id
// @desc    Comment on a post
// @access  Private
router.post('/comment/:id', [
  auth,
  body('text', 'Text is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const newComment = {
      text: req.body.text,
      user: req.user._id
    };
    
    post.comments.unshift(newComment);
    await post.save();
    await post.populate('author', 'name email profilePicture');
    await post.populate('comments.user', 'name email profilePicture');
    
    res.json(post);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/posts/comment/:id/:comment_id
// @desc    Delete comment
// @access  Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Pull out comment
    const comment = post.comments.find(
      comment => comment._id.toString() === req.params.comment_id
    );
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment does not exist' });
    }
    
    // Check user
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    // Get remove index
    const removeIndex = post.comments
      .map(comment => comment._id.toString())
      .indexOf(req.params.comment_id);
    
    post.comments.splice(removeIndex, 1);
    await post.save();
    await post.populate('author', 'name email profilePicture');
    await post.populate('comments.user', 'name email profilePicture');
    
    res.json(post);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 