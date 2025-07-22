import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';

const WalletBalance = ({ wallet, transactionCount }) => {
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBalance = async () => {
      if (!wallet) return;

      setIsLoading(true);
      setError('');

      try {
        const balanceWei = await wallet.getBalance();
        const balanceEther = ethers.utils.formatEther(balanceWei);
        // Format to a reasonable number of decimal places for display
        setBalance(parseFloat(balanceEther).toFixed(4));
      } catch (err) {
        console.error("Error fetching balance:", err);
        setError('Could not fetch balance.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();

  }, [wallet, transactionCount]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-3 text-gray-500">Fetching balance...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center text-red-600">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      );
    }

    return (
      <div className="text-center">
        <p className="text-4xl font-bold text-accent">{balance} <span className="text-2xl font-medium text-gray-500">tBDAG</span></p>
      </div>
    );
  };

  return (
    <motion.div
      className="neumorphic-inset rounded-2xl p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      {renderContent()}
    </motion.div>
  );
};

export default WalletBalance;
