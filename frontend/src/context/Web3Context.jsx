import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext(null);

const rpcUrl = process.env.REACT_APP_BLOCKDAG_RPC_URL || 'https://testnet-rpc.blockdag.network';

export const Web3Provider = ({ children }) => {
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const provider = useMemo(() => new ethers.providers.JsonRpcProvider(rpcUrl), []);

  const logout = useCallback(() => {
    setSigner(null);
    setAddress(null);
    setBalance(null);
    setIsAuthenticated(false);
    setError(null);
    setIsLoading(false);
  }, []);

  const refreshBalance = useCallback(async (currentSigner) => {
    if (!currentSigner) return;
    try {
      const walletAddress = await currentSigner.getAddress();
      const walletBalance = await provider.getBalance(walletAddress);
      setBalance(ethers.utils.formatEther(walletBalance));
    } catch (e) {
      console.error("Failed to refresh balance:", e);
      setError("Failed to fetch wallet balance.");
      setBalance(null); // Clear balance on error
    }
  }, [provider]);

  const unlockWallet = useCallback(async (privateKey) => {
    setIsLoading(true);
    setError(null);
    try {
      const walletSigner = new ethers.Wallet(privateKey, provider);
      setSigner(walletSigner);
      const walletAddress = await walletSigner.getAddress();
      setAddress(walletAddress);
      setIsAuthenticated(true);
      await refreshBalance(walletSigner);
    } catch (e) {
      console.error("Failed to unlock wallet:", e);
      logout(); // Reset state on failure
      setError("Failed to unlock wallet. Invalid private key or network issue.");
    } finally {
      setIsLoading(false);
    }
  }, [provider, logout, refreshBalance]);

  const value = useMemo(() => ({
    provider,
    signer,
    address,
    balance,
    isAuthenticated,
    error,
    isLoading,
    unlockWallet,
    logout,
    refreshBalance
  }), [provider, signer, address, balance, isAuthenticated, error, isLoading, unlockWallet, logout, refreshBalance]);

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};