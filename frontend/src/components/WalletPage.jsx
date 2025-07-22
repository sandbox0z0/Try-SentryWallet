import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, DollarSign, Send, Clock, RefreshCw, ExternalLink } from 'lucide-react';
import WalletManager from './WalletManager';
import WalletBalance from './WalletBalance';
import SendTransaction from './SendTransaction';
import { useWeb3 } from '../context/Web3Context';

const WalletPage = () => {
  const { user } = useOutletContext();
  const { signer, isAuthenticated, refreshBalance } = useWeb3();
  const [transactionCount, setTransactionCount] = useState(0);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [showWalletManager, setShowWalletManager] = useState(false);

  useEffect(() => {
    // Load transaction history from session storage
    const savedHistory = sessionStorage.getItem('sentryWalletTransactionHistory');
    if (savedHistory) {
      setTransactionHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleWalletUnlocked = (wallet, signerInstance) => {
    console.log("🔑 Wallet unlocked in WalletPage");
    setShowWalletManager(false);
  };

  const handleTransactionSuccess = (transactionHash) => {
    setTransactionCount(prev => prev + 1);
    
    // Add to transaction history
    const newTransaction = {
      hash: transactionHash,
      timestamp: new Date().toISOString(),
      type: 'send'
    };
    
    const updatedHistory = [newTransaction, ...transactionHistory].slice(0, 10); // Keep only last 10 transactions
    setTransactionHistory(updatedHistory);
    
    // Save to session storage
    sessionStorage.setItem('sentryWalletTransactionHistory', JSON.stringify(updatedHistory));
  };

  const handleRefreshBalance = async () => {
    if (refreshBalance) {
      await refreshBalance();
      setTransactionCount(prev => prev + 1);
    }
  };

  if (showWalletManager || !isAuthenticated || !signer) {
    return (
      <WalletManager 
        user={user} 
        onWalletUnlocked={handleWalletUnlocked}
        onBack={() => setShowWalletManager(false)} 
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center">
          <Wallet className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-accent mb-4">My Wallet</h1>
        <p className="text-gray-600 font-mono text-sm break-all bg-gray-100 rounded-lg p-3 max-w-2xl mx-auto">
          {signer?.address}
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Balance Section */}
          <motion.div
            className="neumorphic rounded-3xl p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-accent flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Balance
              </h2>
              <button
                onClick={handleRefreshBalance}
                className="p-2 text-gray-400 hover:text-primary transition-colors duration-200 hover:bg-primary/10 rounded-lg"
                title="Refresh Balance"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <WalletBalance transactionCount={transactionCount} />
          </motion.div>

          {/* Send Transaction Section */}
          <motion.div
            className="neumorphic rounded-3xl p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold text-accent mb-4 flex items-center">
              <Send className="w-5 h-5 mr-2" />
              Send Transaction
            </h2>
            <SendTransaction onTransactionSuccess={handleTransactionSuccess} />
          </motion.div>
        </div>

        {/* Right Column - Transaction History */}
        <div>
          <motion.div
            className="neumorphic rounded-3xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl font-semibold text-accent mb-6 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Recent Activity
            </h2>

            {transactionHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No transactions yet</p>
                <p className="text-gray-400 text-sm">Your transaction history will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactionHistory.map((tx, index) => (
                  <motion.div
                    key={tx.hash}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                        <Send className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-accent">Transaction Sent</p>
                        <p className="text-xs text-gray-500">
                          {new Date(tx.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <a
                      href={`https://primordial.bdagscan.com/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-primary hover:text-primary/80 transition-colors duration-200 text-sm font-medium"
                    >
                      <span className="mr-1">View</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Explorer Link */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <a
                href="https://primordial.bdagscan.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-all duration-200"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View on BlockDAG Explorer
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Network Status */}
      <motion.div
        className="mt-8 text-center py-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl border border-primary/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h3 className="text-lg font-bold text-accent mb-2">
          Connected to BlockDAG Primordial Testnet
        </h3>
        <p className="text-gray-600">
          Experience ultra-fast transactions with minimal fees on the BlockDAG network
        </p>
      </motion.div>
    </div>
  );
};

export default WalletPage;