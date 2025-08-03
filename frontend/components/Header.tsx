'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogOut, Settings, Search, Menu, X, Moon, Sun } from 'lucide-react';
import { auth, User as UserType } from '@/lib/auth';
import toast from 'react-hot-toast';

export default function Header() {
  const [user, setUser] = useState<UserType | null>(null);
  // openMenu: null | 'profile' | 'mobile'
  const [openMenu, setOpenMenu] = useState<null | 'profile' | 'mobile'>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setUser(auth.getCurrentUser());
    
    // Load dark mode preference from localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    
    // Apply dark mode to document
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleLogout = () => {
    auth.logout();
    setUser(null);
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    // Apply dark mode to document
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast.success(newDarkMode ? 'Dark mode enabled' : 'Light mode enabled');
  };

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-linkedin-600 to-linkedin-700 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">ProfessionalHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-linkedin-600 dark:hover:text-linkedin-400 transition-colors">
              Home
            </Link>
            {user && (
              <>
                <Link href="/profile" className="text-gray-700 dark:text-gray-300 hover:text-linkedin-600 dark:hover:text-linkedin-400 transition-colors">
                  Profile
                </Link>
                <Link href="/users" className="text-gray-700 dark:text-gray-300 hover:text-linkedin-600 dark:hover:text-linkedin-400 transition-colors">
                  People
                </Link>
              </>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={handleDarkModeToggle}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setOpenMenu(openMenu === 'profile' ? null : 'profile')}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-linkedin-600 dark:hover:text-linkedin-400 transition-colors"
                  aria-label="Open profile menu"
                >
                  <div className="w-8 h-8 bg-linkedin-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block">{user.name}</span>
                </button>

                {/* Dropdown Menu */}
                {openMenu === 'profile' && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setOpenMenu(null)}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setOpenMenu(null)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setOpenMenu(null);
                      }}
                      className="flex items-center w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="btn-secondary">
                  Sign In
                </Link>
                <Link href="/register" className="btn-primary">
                  Join Now
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setOpenMenu(openMenu === 'mobile' ? null : 'mobile')}
              className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-linkedin-600 dark:hover:text-linkedin-400 transition-colors"
              aria-label="Open mobile menu"
            >
              {openMenu === 'mobile' ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {openMenu === 'mobile' && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-4">
                              <Link
                  href="/"
                  className="text-gray-700 dark:text-gray-300 hover:text-linkedin-600 dark:hover:text-linkedin-400 transition-colors"
                  onClick={() => setOpenMenu(null)}
                >
                  Home
                </Link>
                {user && (
                  <>
                    <Link
                      href="/profile"
                      className="text-gray-700 dark:text-gray-300 hover:text-linkedin-600 dark:hover:text-linkedin-400 transition-colors"
                      onClick={() => setOpenMenu(null)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/users"
                      className="text-gray-700 dark:text-gray-300 hover:text-linkedin-600 dark:hover:text-linkedin-400 transition-colors"
                      onClick={() => setOpenMenu(null)}
                    >
                      People
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setOpenMenu(null);
                      }}
                      className="flex items-center text-gray-700 dark:text-gray-300 hover:text-linkedin-600 dark:hover:text-linkedin-400 transition-colors"
                    >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 