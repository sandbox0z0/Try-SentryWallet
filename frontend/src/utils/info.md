# `frontend/src/utils` Directory Documentation

This directory contains various utility functions and helper modules that provide common functionalities used across the SentryWallet frontend application. These utilities are designed to be reusable and encapsulate specific logic, such as blockchain interactions, data storage, and cryptographic operations.

## Folder Purpose

The `utils` folder centralizes shared logic that doesn't directly belong to a specific React component but is essential for the application's operation. This promotes code reusability, reduces redundancy, and improves the overall maintainability of the codebase.

## File-by-File Breakdown

### `blockdag.js`
*   **Primary Responsibility:** Provides a set of functions for interacting with the BlockDAG network using `ethers.js`. This includes operations like getting a provider, creating/importing wallets, fetching balances, sending transactions, and validating addresses.
*   **Key Exports:** `getProvider`, `createWallet`, `importWallet`, `getWalletBalance`, `sendTransaction`, `getTransactionHistory`, `isValidAddress`, `createSigner`, `getNetworkInfo`, `signMessage`, `verifyMessage`.
*   **External Services:** Connects to the BlockDAG RPC URL (configured via environment variables).
*   **Interactions:** Used by `WalletManager.jsx`, `WalletBalance.jsx`, and `SendTransaction.jsx` to perform blockchain-related operations.

### `storage.js`
*   **Primary Responsibility:** (Note: This file contains functions for local storage management, but its primary use case for wallet storage has been superseded by Supabase integration. It might be deprecated or its functions might be used for other local preferences.) It provides utilities for saving, loading, and managing data in the browser's local storage, including encryption/decryption capabilities.
*   **Key Exports:** `saveWallets`, `loadWallets`, `hasWallets`, `clearWallets`, `savePasswordHint`, `getPasswordHint`, `clearPasswordHint`, `validatePassword`, `generateWalletId`, `saveUserPreferences`, `loadUserPreferences`.
*   **External Services:** Interacts with `localStorage` and `crypto-js` for encryption.
*   **Interactions:** While some functions might still be used for general preferences, the core wallet storage is now handled by `wallet.js` and Supabase.

### `wallet.js`
*   **Primary Responsibility:** Orchestrates the secure creation, encryption, storage, and decryption of user wallets by interacting with the Supabase backend. It acts as the primary interface for wallet persistence.
*   **Key Exports:** `supabase` (Supabase client instance), `getEncryptedWalletFromSupabase`, `createAndSaveWallet`, `loadAndDecryptWallet`.
*   **External Services:** Connects to Supabase (using `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` from environment variables) and uses `crypto-js` for encryption.
*   **Interactions:** Used by `WalletManager.jsx` for the core wallet creation and unlocking flows. The `supabase` client is also exported for direct use by other components like `Dashboard.js` and `NomineeManager.jsx` for user authentication and profile management.

## Interactions & Dependencies

The utilities in this folder are foundational to the SentryWallet application. `wallet.js` is critical for secure wallet persistence, leveraging Supabase for storage and `crypto-js` for encryption. `blockdag.js` provides the necessary `ethers.js` wrappers for all on-chain interactions. While `storage.js` contains local storage utilities, its role in wallet management has been largely replaced by `wallet.js`. These utility files are imported and used by various React components in the `frontend/src/components` directory to perform their respective tasks, ensuring a clean separation of concerns and promoting code reusability.
