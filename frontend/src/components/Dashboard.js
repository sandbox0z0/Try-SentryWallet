import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, LogOut, User, Wallet, Settings } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        navigate('/login');
        return;
      }

      if (!session) {
        navigate('/login');
        return;
      }

      setUser(session.user);
      setLoading(false);
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
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    } else {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-accent">Loading your wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-background">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-primary mr-3" />
            <span className="text-2xl font-bold text-accent">SentryWallet</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {user?.user_metadata?.avatar_url && (
              <img 
                src={user.user_metadata.avatar_url} 
                alt="Avatar" 
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-accent font-medium">
              {user?.user_metadata?.full_name || user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-accent transition-colors duration-300"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-accent mb-4">
              Welcome to SentryWallet
            </h1>
            <p className="text-xl text-gray-600">
              Your secure crypto wallet is ready to use!
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <motion.div
              className="neumorphic rounded-3xl p-8 text-center"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-primary/20 rounded-2xl flex items-center justify-center">
                <Wallet className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-accent mb-4">Your Wallet</h3>
              <p className="text-gray-600">
                Manage your crypto assets with ease
              </p>
              <button className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-300">
                View Balance
              </button>
            </motion.div>

            <motion.div
              className="neumorphic rounded-3xl p-8 text-center"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-accent/20 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-accent mb-4">Security</h3>
              <p className="text-gray-600">
                Set up social recovery guardians
              </p>
              <button className="mt-4 px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors duration-300">
                Configure
              </button>
            </motion.div>

            <motion.div
              className="neumorphic rounded-3xl p-8 text-center"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-green-500/20 rounded-2xl flex items-center justify-center">
                <Settings className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-accent mb-4">Settings</h3>
              <p className="text-gray-600">
                Customize your wallet preferences
              </p>
              <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors duration-300">
                Open Settings
              </button>
            </motion.div>
          </div>

          {/* User Info Card */}
          <motion.div
            className="neumorphic rounded-3xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-accent mb-6 flex items-center">
              <User className="w-6 h-6 mr-3" />
              Account Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Email Address
                </label>
                <p className="text-accent font-medium">{user?.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Full Name
                </label>
                <p className="text-accent font-medium">
                  {user?.user_metadata?.full_name || 'Not provided'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Last Sign In
                </label>
                <p className="text-accent font-medium">
                  {new Date(user?.last_sign_in_at).toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Account Created
                </label>
                <p className="text-accent font-medium">
                  {new Date(user?.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Placeholder for Future Features */}
          <motion.div
            className="mt-12 text-center py-16 border-2 border-dashed border-gray-300 rounded-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              More Features Coming Soon
            </h3>
            <p className="text-gray-500">
              Transaction history, DeFi integrations, and more will be available soon!
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;