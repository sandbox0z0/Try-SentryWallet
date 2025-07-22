import { ethers } from 'ethers';

const rpcUrl = process.env.REACT_APP_BLOCKDAG_RPC_URL || 'https://testnet-rpc.blockdag.network';
const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

export const getProvider = () => provider;

export const getSigner = (privateKey) => {
  return new ethers.Wallet(privateKey, provider);
};

export const getInheritanceContract = (signer) => {
  const contractAddress = '0xcEa4a4163057CD9F4Da08267Fd6d12D6De11EE90';
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
  return new ethers.Contract(contractAddress, contractAbi, signer);
};

export const isValidAddress = (address) => {
  return ethers.utils.isAddress(address);
};