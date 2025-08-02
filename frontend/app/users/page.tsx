'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Users, UserPlus, UserMinus } from 'lucide-react';
import Header from '@/components/Header';
import { auth, User as UserType } from '@/lib/auth';
import { usersAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = auth.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    
    setCurrentUser(user);
    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    if (!currentUser) {
      toast.error('Please login to follow users');
      return;
    }

    try {
      const response = await usersAPI.follow(userId);
      const updatedCurrentUser = response.data;
      setCurrentUser(updatedCurrentUser);
      auth.updateUser(updatedCurrentUser);
      
      // Update the users list to reflect the follow/unfollow action
      setUsers(users.map(user => {
        if (user._id === userId) {
          const isFollowing = updatedCurrentUser.following.includes(userId);
          return {
            ...user,
            followers: isFollowing 
              ? [...user.followers, currentUser._id]
              : user.followers.filter(id => id !== currentUser._id)
          };
        }
        return user;
      }));
      
      const isFollowing = updatedCurrentUser.following.includes(userId);
      toast.success(isFollowing ? 'User followed' : 'User unfollowed');
    } catch (error) {
      toast.error('Failed to follow/unfollow user');
    }
  };

  const isFollowing = (userId: string) => {
    return currentUser?.following.includes(userId) || false;
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">People</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Discover and connect with other professionals</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-linkedin-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No users found</h3>
            <p className="text-gray-500 dark:text-gray-400">Be the first to join the community!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {users
              .filter(user => user._id !== currentUser._id) // Exclude current user
              .map((user) => (
                <div key={user._id} className="card p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-linkedin-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                      {user.bio && (
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">
                          {user.bio}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{user.followers.length} followers</span>
                        <span>{user.following.length} following</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => handleFollow(user._id)}
                      className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-colors ${
                        isFollowing(user._id)
                          ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                          : 'bg-linkedin-600 text-white hover:bg-linkedin-700'
                      }`}
                    >
                      {isFollowing(user._id) ? (
                        <>
                          <UserMinus className="w-4 h-4" />
                          <span>Unfollow</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          <span>Follow</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>
    </div>
  );
} 