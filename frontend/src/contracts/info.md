# `frontend/src/contracts` Directory Documentation

This directory is dedicated to housing the smart contract artifacts and source code relevant to the frontend application. It serves as a bridge between the decentralized blockchain logic and the user interface.

## Folder Purpose

The `contracts` folder centralizes all information related to the smart contracts that the SentryWallet frontend interacts with. This includes the Solidity source code for development and the compiled ABI (Application Binary Interface) for runtime interaction.

## File-by-File Breakdown

### `SentryInheritance.json`
*   **Primary Responsibility:** Contains the Application Binary Interface (ABI) of the `SentryInheritance` smart contract. The ABI is a JSON array that describes the contract's functions, events, and data structures, allowing the frontend (using `ethers.js`) to encode and decode calls to the contract.
*   **Key Exports:** The JSON object representing the contract's ABI.
*   **Interactions:** Imported by `NomineeManager.jsx` to create an `ethers.Contract` instance, enabling interaction with the deployed `SentryInheritance` smart contract.

### `SentryInheritance.sol`
*   **Primary Responsibility:** The Solidity source code for the `SentryInheritance` smart contract. This contract implements the core logic for the social recovery feature, allowing an owner to set nominees and their shares, trigger recovery, and enable nominees to claim funds.
*   **Key Exports:** The `SentryInheritance` smart contract definition.
*   **Interactions:** This file is compiled (typically using tools like Remix or Hardhat) to generate the ABI (which is then saved as `SentryInheritance.json`) and bytecode for deployment to the BlockDAG testnet. The deployed contract is then interacted with by the frontend.

## Interactions & Dependencies

The files in this directory are crucial for the frontend's interaction with the blockchain. `SentryInheritance.json` provides the necessary interface for `NomineeManager.jsx` to call functions and listen for events on the deployed `SentryInheritance.sol` contract. The `CONTRACT_ADDRESS` environment variable (defined in `.env.local`) works in conjunction with the ABI to specify which deployed contract instance the frontend should communicate with. This setup ensures that the frontend can securely and correctly interact with the on-chain inheritance logic.
