'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Trash2, MoreVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { postsAPI } from '@/lib/api';
import { auth, User } from '@/lib/auth';
import toast from 'react-hot-toast';

interface Comment {
  _id: string;
  text: string;
  user: User;
  createdAt: string;
}

interface Post {
  _id: string;
  content: string;
  author: User;
  likes: string[];
  comments: Comment[];
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

interface PostCardProps {
  post: Post;
  onPostDeleted?: (postId: string) => void;
  onPostUpdated?: (post: Post) => void;
}

export default function PostCard({ post, onPostDeleted, onPostUpdated }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const currentUser = auth.getCurrentUser();

  // Check if current user liked the post
  useState(() => {
    if (currentUser && post.likes.includes(currentUser._id)) {
      setIsLiked(true);
    }
  });

  const handleLike = async () => {
    if (!currentUser) {
      toast.error('Please login to like posts');
      return;
    }

    try {
      const response = await postsAPI.like(post._id);
      const updatedPost = response.data;
      setIsLiked(!isLiked);
      onPostUpdated?.(updatedPost);
      toast.success(isLiked ? 'Post unliked' : 'Post liked');
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleComment = async () => {
    if (!currentUser) {
      toast.error('Please login to comment');
      return;
    }

    if (!commentText.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      const response = await postsAPI.comment(post._id, { text: commentText });
      const updatedPost = response.data;
      setCommentText('');
      setIsCommenting(false);
      onPostUpdated?.(updatedPost);
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleDelete = async () => {
    if (!currentUser || currentUser._id !== post.author._id) {
      toast.error('You can only delete your own posts');
      return;
    }

    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await postsAPI.delete(post._id);
      onPostDeleted?.(post._id);
      toast.success('Post deleted');
    } catch (error) {
      toast.error('Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!currentUser) {
      toast.error('Please login to delete comments');
      return;
    }

    try {
      const response = await postsAPI.deleteComment(post._id, commentId);
      const updatedPost = response.data;
      onPostUpdated?.(updatedPost);
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="post-card">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-linkedin-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {post.author.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        
        {currentUser && currentUser._id === post.author._id && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">{post.likeCount}</span>
          </button>
          
          <button
            onClick={() => setIsCommenting(!isCommenting)}
            className="flex items-center space-x-1 text-gray-500 hover:text-linkedin-600 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{post.commentCount}</span>
          </button>
        </div>
      </div>

      {/* Comment Section */}
      {isCommenting && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex space-x-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 input-field"
              onKeyPress={(e) => e.key === 'Enter' && handleComment()}
            />
            <button onClick={handleComment} className="btn-primary">
              Comment
            </button>
          </div>
        </div>
      )}

      {/* Comments */}
      {post.comments.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="space-y-3">
            {post.comments.map((comment) => (
              <div key={comment._id} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-linkedin-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-medium">
                    {comment.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-sm text-gray-900">
                          {comment.user.name}
                        </span>
                        <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                      </div>
                      {currentUser && currentUser._id === comment.user._id && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 