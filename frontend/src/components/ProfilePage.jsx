import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Shield, Clock } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useOutletContext();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-3xl flex items-center justify-center">
          <User className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-accent mb-4">Profile</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Your SentryWallet account information and settings
        </p>
      </motion.div>

      {/* Profile Information */}
      <motion.div
        className="neumorphic rounded-3xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-accent mb-6 flex items-center">
          <Shield className="w-6 h-6 mr-3" />
          Account Information
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Avatar and Basic Info */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
              {user?.user_metadata?.avatar_url ? (
                <img 
                  src={user.user_metadata.avatar_url} 
                  alt="Profile Avatar" 
                  className="w-16 h-16 rounded-full border-4 border-primary/20"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-accent">
                  {user?.user_metadata?.full_name || 'SentryWallet User'}
                </h3>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Full Name
              </label>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-accent font-medium">
                  {user?.user_metadata?.full_name || 'Not provided'}
                </p>
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Email Address
              </label>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-accent font-medium">{user?.email}</p>
                {user?.email_confirmed_at && (
                  <p className="text-green-600 text-sm mt-1 flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* User ID */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                User ID
              </label>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-accent font-mono text-sm break-all">
                  {user?.id}
                </p>
              </div>
            </div>

            {/* Account Created */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Account Created
              </label>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-accent font-medium">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Unknown'}
                </p>
                <p className="text-gray-500 text-sm">
                  {user?.created_at ? new Date(user.created_at).toLocaleTimeString('en-US') : ''}
                </p>
              </div>
            </div>

            {/* Last Sign In */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Last Sign In
              </label>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-accent font-medium">
                  {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Unknown'}
                </p>
                <p className="text-gray-500 text-sm">
                  {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleTimeString('en-US') : ''}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Authentication Provider Info */}
        {user?.app_metadata?.provider && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-accent mb-4">Authentication Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-sm font-medium text-gray-600">Provider</p>
                <p className="text-accent font-medium capitalize">
                  {user.app_metadata.provider}
                </p>
              </div>
              {user?.app_metadata?.providers && (
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-600">Available Providers</p>
                  <p className="text-accent font-medium">
                    {user.app_metadata.providers.join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Security Information */}
      <motion.div
        className="mt-8 neumorphic rounded-3xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl font-semibold text-accent mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Security & Privacy
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center text-green-600">
              <Shield className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Wallet encryption enabled</span>
            </div>
            <div className="flex items-center text-green-600">
              <Shield className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Supabase authentication secured</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center text-green-600">
              <Shield className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">On-chain inheritance protocol</span>
            </div>
            <div className="flex items-center text-green-600">
              <Shield className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">BlockDAG network secured</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Network Information */}
      <motion.div
        className="mt-8 text-center py-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl border border-primary/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-lg font-bold text-accent mb-2">
          Connected to BlockDAG Primordial Testnet
        </h3>
        <p className="text-gray-600">
          Your account is secured with blockchain technology on the BlockDAG network
        </p>
      </motion.div>
    </div>
  );
};

export default ProfilePage;