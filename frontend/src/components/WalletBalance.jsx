import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';

const WalletBalance = ({ transactionCount }) => {
  const { balance, refreshBalance, signer, isLoading: web3Loading, error: web3Error } = useWeb3();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    const fetchBalance = async () => {
      if (!signer) return;

      setIsRefreshing(true);
      setLocalError('');

      try {
        await refreshBalance();
      } catch (err) {
        console.error("Error fetching balance:", err);
        setLocalError('Could not fetch balance.');
      } finally {
        setIsRefreshing(false);
      }
    };

    fetchBalance();

  }, [signer, transactionCount, refreshBalance]);

  const renderContent = () => {
    const isLoading = web3Loading || isRefreshing;
    const error = web3Error || localError;

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
        <p className="text-4xl font-bold text-accent">
          {balance ? parseFloat(balance).toFixed(4) : '0.0000'} 
          <span className="text-2xl font-medium text-gray-500 ml-2">tBDAG</span>
        </p>
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
