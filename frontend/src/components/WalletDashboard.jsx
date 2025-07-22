import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, DollarSign, Send, UserPlus } from 'lucide-react';
import WalletBalance from './WalletBalance';
import SendTransaction from './SendTransaction';
import NomineeManager from './NomineeManager';
import { supabase } from '../utils/wallet';
import WalletManager from './WalletManager';
import { getSigner } from '../utils/blockdag';
import { useOutletContext } from 'react-router-dom';

const WalletDashboard = () => {
  const [signer, setSigner] = useState(null);
  const [showWalletManager, setShowWalletManager] = useState(true);
  const [transactionCount, setTransactionCount] = useState(0);
  const { user } = useOutletContext();

  const handleWalletUnlocked = (unlockedWallet) => {
    const signerInstance = getSigner(unlockedWallet.privateKey);
    setSigner(signerInstance);
    setShowWalletManager(false);
  };

  const handleTransactionSuccess = () => {
    setTransactionCount(prev => prev + 1);
  };

  if (showWalletManager || !signer) {
    return (
      <WalletManager 
        user={user} 
        onWalletUnlocked={handleWalletUnlocked}
        onBack={() => setShowWalletManager(false)} 
      />
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <motion.div
        className="neumorphic rounded-3xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-primary/20 rounded-3xl flex items-center justify-center">
            <Wallet className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-accent mb-2">Your Wallet</h1>
          <p className="text-gray-600 font-mono text-sm break-all bg-gray-100 rounded-lg p-2">
            {signer.address}
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-accent mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Balance
          </h2>
          <WalletBalance wallet={signer} transactionCount={transactionCount} />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-accent mb-4 flex items-center">
            <Send className="w-5 h-5 mr-2" />
            Send Transaction
          </h2>
          <SendTransaction wallet={signer} onTransactionSuccess={handleTransactionSuccess} />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-accent mb-4 flex items-center">
            <UserPlus className="w-5 h-5 mr-2" />
            Nominee Manager
          </h2>
          <NomineeManager user={user} />
        </div>
      </motion.div>
    </div>
  );
};

export default WalletDashboard;