import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        navigate('/dashboard');
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user);
          navigate('/dashboard');
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        console.error('Error logging in:', error.message);
        alert('Error logging in: ' + error.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen gradient-background flex items-center justify-center px-4">
      <div className="absolute inset-0 hero-image opacity-30"></div>
      
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Back Button */}
        <motion.button
          className="flex items-center text-accent hover:text-primary transition-colors duration-300 mb-8"
          onClick={() => navigate('/')}
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </motion.button>

        {/* Login Card */}
        <motion.div
          className="neumorphic rounded-3xl p-8 text-center"
          variants={cardVariants}
        >
          {/* Logo */}
          <div className="w-20 h-20 mx-auto mb-6 bg-primary/20 rounded-3xl flex items-center justify-center">
            <Shield className="w-10 h-10 text-primary" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-accent mb-2">
            Login to SentryWallet
          </h1>
          
          <p className="text-gray-600 mb-8">
            Sign in with your Google account to continue.
          </p>

          {/* Google Login Button */}
          <motion.button
            className={`w-full flex items-center justify-center px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
              loading 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-primary'
            }`}
            onClick={handleGoogleLogin}
            disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </motion.button>

          {/* Security Note */}
          <div className="mt-6 text-sm text-gray-500 leading-relaxed">
            <Shield className="w-4 h-4 inline mr-1" />
            Your account is secured with industry-standard encryption and social recovery features.
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          className="mt-6 text-center text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </motion.div>
      </motion.div>

      {/* Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-primary/20 rounded-full animate-float"></div>
      <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-accent/20 rounded-full animate-float-delayed"></div>
      <div className="absolute bottom-1/4 right-1/3 w-4 h-4 bg-primary/30 rounded-full animate-float-delayed-2"></div>
    </div>
  );
};

export default LoginPage;