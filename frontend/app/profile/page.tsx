'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, User, Calendar, Mail } from 'lucide-react';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import { auth, User as UserType } from '@/lib/auth';
import { usersAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface Post {
  _id: string;
  content: string;
  author: UserType;
  likes: string[];
  comments: any[];
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
  });
  const router = useRouter();

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    setUser(currentUser);
    setEditForm({
      name: currentUser.name,
      bio: currentUser.bio || '',
    });
    fetchUserPosts(currentUser._id);
  }, [router]);

  const fetchUserPosts = async (userId: string) => {
    try {
      const response = await usersAPI.getPosts(userId);
      setPosts(response.data);
    } catch (error) {
      toast.error('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!editForm.name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      const response = await usersAPI.updateProfile(editForm);
      const updatedUser = response.data;
      setUser(updatedUser);
      auth.updateUser(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-4xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
        {/* Responsive Profile Header */}
        <div className="card p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-0">
            <div className="flex flex-col xs:flex-row xs:items-center xs:space-x-6 items-center text-center sm:text-left w-full sm:w-auto">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-linkedin-600 rounded-full flex items-center justify-center mx-auto sm:mx-0">
                <span className="text-white text-2xl sm:text-3xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="mt-3 xs:mt-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white break-words">{user.name}</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base break-all">{user.email}</p>
                {user.bio && (
                  <p className="text-gray-700 dark:text-gray-300 mt-2 max-w-xs sm:max-w-md text-sm sm:text-base break-words">{user.bio}</p>
                )}
                <div className="flex flex-wrap gap-4 mt-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 justify-center sm:justify-start">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{user.followers.length} followers</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{user.following.length} following</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center sm:justify-end mt-4 sm:mt-0">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn-secondary flex items-center space-x-2 px-3 py-2 text-sm"
              >
                <Edit className="w-4 h-4" />
                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
              </button>
            </div>
          </div>

          {/* Edit Profile Form */}
          {isEditing && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="input-field mt-1"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={3}
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="input-field mt-1"
                    placeholder="Tell us about yourself..."
                    maxLength={500}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {editForm.bio.length}/500 characters
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={handleEditSubmit}
                    className="btn-primary"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({
                        name: user.name,
                        bio: user.bio || '',
                      });
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Posts Section */}
        <div className="space-y-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Your Posts</h2>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-linkedin-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-500">Start sharing your thoughts with the community!</p>
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