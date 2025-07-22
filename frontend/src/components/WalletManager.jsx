
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Key, Eye, EyeOff, Shield } from 'lucide-react';
import { 
  createAndSaveWallet, 
  loadAndDecryptWallet, 
  getEncryptedWalletFromSupabase 
} from '../utils/wallet';
import { useWeb3 } from '../context/Web3Context';

const WalletManager = ({ user, onWalletUnlocked, onBack }) => {
  const { unlockWallet, isLoading: web3Loading, error: web3Error } = useWeb3();
  const [isLoading, setIsLoading] = useState(true);
  const [hasWallet, setHasWallet] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // For testing purposes - uncomment and add a test private key when needed
  const TEST_PRIVATE_KEY = null; // "0x..." // Add test key here if needed

  useEffect(() => {
    const checkWalletExists = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError('');
      
      try {
        const encryptedWallet = await getEncryptedWalletFromSupabase(user.id);
        setHasWallet(!!encryptedWallet);
      } catch (err) {
        setError('Could not check wallet status. Please try again.');
        setHasWallet(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkWalletExists();
  }, [user]);

  const handleCreateWallet = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
    }

    setIsLoading(true);
    setError('');

    try {
      const wallet = await createAndSaveWallet(password, user.id);
      console.log("💎 Wallet created successfully");
      
      // Unlock the wallet in Web3Context
      const signer = await unlockWallet(wallet.privateKey);
      
      if (onWalletUnlocked) {
        onWalletUnlocked(wallet, signer);
      }
    } catch (err) {
      setError(err.message || 'Failed to create wallet.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlockWallet = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // If we have a test private key for development, use it
      if (TEST_PRIVATE_KEY) {
        console.log("🧪 Using test private key for development");
        const signer = await unlockWallet(TEST_PRIVATE_KEY);
        if (onWalletUnlocked) {
          const mockWallet = { privateKey: TEST_PRIVATE_KEY };
          onWalletUnlocked(mockWallet, signer);
        }
        return;
      }

      const wallet = await loadAndDecryptWallet(password, user.id);
      console.log("🔓 Wallet decrypted successfully");
      
      // Unlock the wallet in Web3Context
      const signer = await unlockWallet(wallet.privateKey);
      
      if (onWalletUnlocked) {
        onWalletUnlocked(wallet, signer);
      }
    } catch (err) {
      const errorMessage = err.message || 'Incorrect password or failed to decrypt wallet.';
      setError(errorMessage);
      console.error("Wallet unlock error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Render Loading State
  if (isLoading && hasWallet === null) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Wallet...</p>
      </div>
    );
  }

  // Common Form Styling
  const inputGroupClass = "relative mb-4";
  const inputClass = "w-full pl-4 pr-10 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200";
  const buttonClass = `w-full flex items-center justify-center px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${(isLoading || web3Loading) ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 text-white shadow-lg'}`;

  const displayError = error || web3Error;

  // Render Create or Unlock Form
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="neumorphic rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-primary/20 rounded-3xl flex items-center justify-center">
              <Key className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-accent mb-2">
              {hasWallet ? 'Unlock Your Wallet' : 'Create a Wallet Password'}
            </h1>
            <p className="text-gray-600">
              {hasWallet 
                ? 'Enter your password to decrypt and access your wallet.'
                : 'This password will encrypt your wallet. Store it safely.'
              }
            </p>
          </div>

          {displayError && (
            <motion.div
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {displayError}
            </motion.div>
          )}

          <form onSubmit={hasWallet ? handleUnlockWallet : handleCreateWallet}>
            <div className={inputGroupClass}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 mt-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {!hasWallet && (
              <div className={inputGroupClass}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}

            <motion.button
              type="submit"
              className={buttonClass}
              disabled={isLoading || web3Loading}
              whileHover={!(isLoading || web3Loading) ? { scale: 1.02 } : {}}
              whileTap={!(isLoading || web3Loading) ? { scale: 0.98 } : {}}
            >
              {(isLoading || web3Loading) ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                hasWallet ? 'Unlock Wallet' : 'Create Wallet'
              )}
            </motion.button>
          </form>
          
          <div className="mt-6 text-center">
            {onBack && (
              <button
                onClick={onBack}
                className="text-sm text-gray-600 hover:text-primary transition-colors"
              >
                Back to Dashboard
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WalletManager;
