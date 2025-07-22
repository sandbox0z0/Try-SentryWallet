import React, { useState } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, Send } from 'lucide-react';

const SendTransaction = ({ wallet, onTransactionSuccess }) => {
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!toAddress || !amount) {
      setError('Please fill in both fields.');
      return;
    }
    if (!ethers.utils.isAddress(toAddress)) {
      setError('Invalid recipient address.');
      return;
    }

    setIsLoading(true);
    setError('');
    setTxHash('');

    try {
      const tx = {
        to: toAddress,
        value: ethers.utils.parseEther(amount),
      };

      const transaction = await wallet.sendTransaction(tx);
      setTxHash(`Transaction sent! Hash: ${transaction.hash}`);
      
      await transaction.wait();

      // Notify parent component of success
      if (onTransactionSuccess) {
        onTransactionSuccess();
      }

      // Reset form
      setToAddress('');
      setAmount('');

    } catch (err) {
      console.error("Transaction failed:", err);
      setError(err.reason || 'Transaction failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="neumorphic-inset rounded-2xl p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="0x..."
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (tBDAG)
          </label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="0.0"
            required
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="flex items-center text-red-600">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        )}
        
        {txHash && (
            <div className="text-green-600 text-sm break-all">
                {txHash}
            </div>
        )}

        <motion.button
          type="submit"
          className={`w-full flex items-center justify-center px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-primary hover:bg-primary/90 text-white shadow-lg'
          }`}
          disabled={isLoading}
          whileHover={!isLoading ? { scale: 1.02 } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Send tBDAG
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default SendTransaction;
