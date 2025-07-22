import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext(null);

const rpcUrl = process.env.REACT_APP_BLOCKDAG_RPC_URL || 'https://rpc.primordial.bdagscan.com';

export const Web3Provider = ({ children }) => {
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [networkConnected, setNetworkConnected] = useState(false);

  // Create provider with connection monitoring
  const provider = useMemo(() => {
    const providerInstance = new ethers.providers.JsonRpcProvider(rpcUrl);
    
    // Monitor network connectivity
    const checkNetwork = async () => {
      try {
        await providerInstance.getNetwork();
        setNetworkConnected(true);
        console.log("✅ Connected to BlockDAG network");
      } catch (e) {
        setNetworkConnected(false);
        console.error("❌ Network connection failed:", e);
      }
    };
    
    checkNetwork();
    return providerInstance;
  }, []);

  // Check network connectivity on mount
  useEffect(() => {
    const checkInitialNetwork = async () => {
      try {
        const network = await provider.getNetwork();
        setNetworkConnected(true);
        console.log("Network connected:", network);
      } catch (e) {
        setNetworkConnected(false);
        console.error("Initial network check failed:", e);
      }
    };
    
    checkInitialNetwork();
  }, [provider]);

  const logout = useCallback(() => {
    setSigner(null);
    setAddress(null);
    setBalance(null);
    setIsAuthenticated(false);
    setError(null);
    setIsLoading(false);
    console.log("🔓 Wallet logged out");
  }, []);

  const refreshBalance = useCallback(async (currentSigner = signer) => {
    if (!currentSigner) return null;
    
    try {
      setError(null);
      const walletBalance = await currentSigner.getBalance();
      const formattedBalance = ethers.utils.formatEther(walletBalance);
      setBalance(formattedBalance);
      console.log("💰 Balance updated:", formattedBalance);
      return formattedBalance;
    } catch (e) {
      console.error("Failed to refresh balance:", e);
      const errorMessage = e.reason || e.message || "Failed to fetch wallet balance";
      setError(errorMessage);
      setBalance(null);
      return null;
    }
  }, [signer]);

  const unlockWallet = useCallback(async (privateKey) => {
    if (!privateKey) {
      throw new Error("Private key is required");
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log("🔐 Unlocking wallet...");
      
      // Ensure network is connected
      if (!networkConnected) {
        try {
          await provider.getNetwork();
          setNetworkConnected(true);
        } catch (e) {
          throw new Error("Could not connect to BlockDAG network. Please check your connection.");
        }
      }

      // Create the signer
      const walletSigner = new ethers.Wallet(privateKey, provider);
      
      // Verify the signer can get its address (validates private key)
      const walletAddress = await walletSigner.getAddress();
      console.log("📧 Wallet address:", walletAddress);
      
      // Set the signer and address
      setSigner(walletSigner);
      setAddress(walletAddress);
      setIsAuthenticated(true);
      
      // Fetch initial balance
      await refreshBalance(walletSigner);
      
      console.log("✅ Wallet unlocked successfully");
      return walletSigner;
      
    } catch (e) {
      console.error("Failed to unlock wallet:", e);
      logout(); // Reset state on failure
      
      let errorMessage = "Failed to unlock wallet.";
      if (e.message.includes("invalid private key")) {
        errorMessage = "Invalid private key format.";
      } else if (e.message.includes("network") || e.message.includes("connect")) {
        errorMessage = "Could not connect to BlockDAG network. Please check your connection.";
      } else {
        errorMessage = e.message || errorMessage;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [provider, logout, refreshBalance, networkConnected]);

  // Create contract helper function
  const getInheritanceContract = useCallback((signerOverride = null) => {
    const contractAddress = process.env.REACT_APP_INHERITANCE_CONTRACT_ADDRESS || '0xcEa4a4163057CD9F4Da08267Fd6d12D6De11EE90';
    const contractAbi = [
      {
      "inputs": [],
      "name": "claimFunds",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
      },
      {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
      },
      {
      "anonymous": false,
      "inputs": [
      {
      "indexed": true,
      "internalType": "address",
      "name": "nominee",
      "type": "address"
      },
      {
      "indexed": false,
      "internalType": "uint256",
      "name": "amountClaimed",
      "type": "uint256"
      }
      ],
      "name": "FundsClaimed",
      "type": "event"
      },
      {
      "anonymous": false,
      "inputs": [
      {
      "indexed": true,
      "internalType": "address",
      "name": "nominee",
      "type": "address"
      }
      ],
      "name": "NomineeRemoved",
      "type": "event"
      },
      {
      "anonymous": false,
      "inputs": [
      {
      "indexed": true,
      "internalType": "address",
      "name": "nominee",
      "type": "address"
      },
      {
      "indexed": false,
      "internalType": "uint256",
      "name": "share",
      "type": "uint256"
      }
      ],
      "name": "NomineeSet",
      "type": "event"
      },
      {
      "anonymous": false,
      "inputs": [
      {
      "indexed": true,
      "internalType": "address",
      "name": "triggeredBy",
      "type": "address"
      }
      ],
      "name": "RecoveryTriggered",
      "type": "event"
      },
      {
      "inputs": [
      {
      "internalType": "address",
      "name": "_nomineeAddress",
      "type": "address"
      }
      ],
      "name": "removeNominee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
      },
      {
      "inputs": [
      {
      "internalType": "address",
      "name": "_nomineeAddress",
      "type": "address"
      },
      {
      "internalType": "uint256",
      "name": "_sharePercentage",
      "type": "uint256"
      }
      ],
      "name": "setNominee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
      },
      {
      "inputs": [],
      "name": "triggerRecovery",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
      },
      {
      "stateMutability": "payable",
      "type": "receive"
      },
      {
      "inputs": [
      {
      "internalType": "address",
      "name": "",
      "type": "address"
      }
      ],
      "name": "hasClaimed",
      "outputs": [
      {
      "internalType": "bool",
      "name": "",
      "type": "bool"
      }
      ],
      "stateMutability": "view",
      "type": "function"
      },
      {
      "inputs": [],
      "name": "isRecoveryTriggered",
      "outputs": [
      {
      "internalType": "bool",
      "name": "",
      "type": "bool"
      }
      ],
      "stateMutability": "view",
      "type": "function"
      },
      {
      "inputs": [
      {
      "internalType": "address",
      "name": "",
      "type": "address"
      }
      ],
      "name": "nominees",
      "outputs": [
      {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
      }
      ],
      "stateMutability": "view",
      "type": "function"
      },
      {
      "inputs": [],
      "name": "owner",
      "outputs": [
      {
      "internalType": "address",
      "name": "",
      "type": "address"
      }
      ],
      "stateMutability": "view",
      "type": "function"
      },
      {
      "inputs": [],
      "name": "totalShares",
      "outputs": [
      {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
      }
      ],
      "stateMutability": "view",
      "type": "function"
      },
      {
      "inputs": [],
      "name": "trustedOracle",
      "outputs": [
      {
      "internalType": "address",
      "name": "",
      "type": "address"
      }
      ],
      "stateMutability": "view",
      "type": "function"
      }
      ];

    const activeSigner = signerOverride || signer;
    if (!activeSigner) {
      throw new Error("No signer available. Please unlock your wallet first.");
    }

    return new ethers.Contract(contractAddress, contractAbi, activeSigner);
  }, [signer]);

  const value = useMemo(() => ({
    provider,
    signer,
    address,
    balance,
    isAuthenticated,
    error,
    isLoading,
    networkConnected,
    unlockWallet,
    logout,
    refreshBalance,
    getInheritanceContract
  }), [
    provider, 
    signer, 
    address, 
    balance, 
    isAuthenticated, 
    error, 
    isLoading, 
    networkConnected,
    unlockWallet, 
    logout, 
    refreshBalance, 
    getInheritanceContract
  ]);

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