import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, LogOut, User, Wallet, UserPlus, AlertCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          setError('Authentication error. Please try logging in again.');
          navigate('/login');
          return;
        }

        if (!session) {
          navigate('/login');
          return;
        }

        setUser(session.user);
        
        // Redirect to wallet page if on base dashboard route
        if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
          navigate('/dashboard/wallet');
        }
      } catch (error) {
        setError('Failed to load user session. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session) {
          navigate('/login');
        } else {
          setUser(session.user);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError('Failed to logout. Please try again.');
      } else {
        navigate('/');
      }
    } catch (error) {
      setError('Network error during logout. Please check your connection.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-accent font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navigation = [
    {
      name: 'My Wallet',
      href: '/dashboard/wallet',
      icon: Wallet,
    },
    {
      name: 'Nominee Settings',
      href: '/dashboard/nominee',
      icon: UserPlus,
    },
    {
      name: 'Profile',
      href: '/dashboard/profile',
      icon: User,
    },
  ];

  return (
    <div className="min-h-screen gradient-background">
      {/* Error Message */}
      {error && (
        <motion.div
          className="fixed top-4 right-4 z-50 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center shadow-lg max-w-md"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <AlertCircle className="w-5 h-5 mr-3 text-red-600" />
          <span>{error}</span>
          <button
            onClick={() => setError('')}
            className="ml-auto text-red-600 hover:text-red-800 transition-colors"
          >
            ×
          </button>
        </motion.div>
      )}

      <div className="flex h-screen">
        {/* Sidebar */}
        <motion.div
          className="w-64 bg-white/80 backdrop-blur-sm border-r border-gray-200 shadow-lg"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center">
                <Shield className="w-8 h-8 text-primary mr-3" />
                <span className="text-xl font-bold text-accent">SentryWallet</span>
              </div>
            </div>

            {/* User Info */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center">
                {user?.user_metadata?.avatar_url && (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt="Avatar" 
                    className="w-10 h-10 rounded-full border-2 border-primary/20 mr-3"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-accent truncate">
                    {user?.user_metadata?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-accent'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </NavLink>
              ))}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>

            {/* Network Info */}
            <div className="p-4 border-t border-gray-100">
              <div className="text-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  BlockDAG Testnet
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-8"
          >
            <Outlet context={{ user, supabase }} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;