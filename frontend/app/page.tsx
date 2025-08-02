'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Send } from 'lucide-react';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import { postsAPI } from '@/lib/api';
import { auth, User } from '@/lib/auth';
import toast from 'react-hot-toast';

interface Post {
  _id: string;
  content: string;
  author: User;
  likes: string[];
  comments: any[];
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    setUser(currentUser);
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await postsAPI.getAll();
      setPosts(response.data);
    } catch (error) {
      toast.error('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!user) {
      toast.error('Please login to create a post');
      return;
    }

    if (!newPost.trim()) {
      toast.error('Please enter some content');
      return;
    }

    setIsCreating(true);
    try {
      const response = await postsAPI.create({ content: newPost });
      setPosts([response.data, ...posts]);
      setNewPost('');
      toast.success('Post created successfully');
    } catch (error) {
      toast.error('Failed to create post');
    } finally {
      setIsCreating(false);
    }
  };

  const handlePostDeleted = (postId: string) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts(posts.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-linkedin-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading posts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Create Post Section */}
        {user && (
          <div className="card p-6 mb-6">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-linkedin-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-linkedin-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  rows={3}
                  maxLength={1000}
                />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {newPost.length}/1000 characters
                  </span>
                  <button
                    onClick={handleCreatePost}
                    disabled={isCreating || !newPost.trim()}
                    className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    <span>Post</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No posts yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {user ? 'Be the first to share something!' : 'Sign in to see posts from your network.'}
              </p>
              {!user && (
                <button
                  onClick={() => router.push('/login')}
                  className="btn-primary"
                >
                  Sign In
                </button>
              )}
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onPostDeleted={handlePostDeleted}
                onPostUpdated={handlePostUpdated}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
} 