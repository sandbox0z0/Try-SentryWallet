# `frontend/src/components` Directory Documentation

This directory contains all the reusable React components that make up the user interface of the SentryWallet application. Components are organized by their primary function or the view they represent, promoting modularity and reusability.

## Folder Purpose

The `components` folder is dedicated to housing all the UI building blocks. From full-page views like the Dashboard and Login page to smaller, specialized elements like wallet displays and transaction forms, this directory centralizes the visual and interactive elements of the application.

## File-by-File Breakdown

### `Dashboard.js`
*   **Primary Responsibility:** The main user dashboard displayed after successful authentication. It provides an overview of the SentryWallet features and acts as a gateway to the `WalletManager`.
*   **Key Exports:** `Dashboard` (React Component).
*   **Props/State:** Manages `user` (Supabase user object), `loading` (for initial user session check), `showWalletManager` (to conditionally render `WalletManager`), and `error` states. Accepts `user` and `onBack` props when rendered by `App.js`.
*   **External Services:** Interacts with Supabase for user session management (`supabase.auth.getSession`, `supabase.auth.onAuthStateChange`, `supabase.auth.signOut`).
*   **Interactions:** Renders `WalletManager.jsx` when `showWalletManager` is true. Uses `react-router-dom` for navigation.

### `HomePage.js`
*   **Primary Responsibility:** The public-facing landing page of the SentryWallet application. It highlights the project's unique selling points and guides users to the login/signup page.
*   **Key Exports:** `HomePage` (React Component).
*   **Props/State:** Manages no internal state. Uses `react-router-dom` for navigation.
*   **Interactions:** Navigates to the `/login` route.

### `LoginPage.js`
*   **Primary Responsibility:** Handles user authentication, including both sign-up and sign-in functionalities via email/password and Google OAuth.
*   **Key Exports:** `LoginPage` (React Component).
*   **Props/State:** Manages `loading`, `isSignUp`, `showPassword`, `formData` (for email, password, fullName), and `error` states. Uses `react-router-dom` for navigation.
*   **External Services:** Heavily interacts with Supabase for all authentication operations (`supabase.auth.getSession`, `supabase.auth.signUp`, `supabase.auth.signInWithPassword`, `supabase.auth.signInWithOAuth`, `supabase.auth.onAuthStateChange`).
*   **Interactions:** Redirects to `/dashboard` upon successful authentication.

### `NomineeManager.jsx`
*   **Primary Responsibility:** Manages the user's nominee settings, allowing them to designate both an off-chain email and an on-chain BlockDAG address with a share percentage for inheritance.
*   **Key Exports:** `NomineeManager` (React Component).
*   **Props/State:** Accepts `user` (Supabase user object) and `wallet` (ethers.js wallet instance) as props. Manages `nomineeEmail`, `nomineeAddress`, `sharePercentage`, `currentNomineeOnChain`, `currentNomineeOffChain`, `isLoading`, `isSaving`, `error`, and `success` states.
*   **External Services:** Interacts with Supabase (`supabase.from('profiles')`) to store/retrieve off-chain nominee emails and with the `SentryInheritance` smart contract (via `ethers.js`) to set on-chain nominees.
*   **Interactions:** Used by `WalletDashboard.jsx` to provide the inheritance feature UI.

### `SendTransaction.jsx`
*   **Primary Responsibility:** Provides a user interface for sending tBDAG tokens from the connected wallet to another address on the BlockDAG network.
*   **Key Exports:** `SendTransaction` (React Component).
*   **Props/State:** Accepts `wallet` (ethers.js wallet instance) and `onTransactionSuccess` (callback) as props. Manages `toAddress`, `amount`, `isLoading`, `error`, and `txHash` states.
*   **External Services:** Interacts directly with the blockchain via the `wallet.sendTransaction()` method from `ethers.js`.
*   **Interactions:** Used by `WalletDashboard.jsx`. Calls `onTransactionSuccess` upon successful transaction to trigger balance updates.

### `WalletBalance.jsx`
*   **Primary Responsibility:** Fetches and displays the user's live tBDAG balance from the BlockDAG testnet.
*   **Key Exports:** `WalletBalance` (React Component).
*   **Props/State:** Accepts `wallet` (ethers.js wallet instance) and `transactionCount` (to trigger re-fetch) as props. Manages `balance`, `isLoading`, and `error` states.
*   **External Services:** Interacts with the blockchain via the `wallet.getBalance()` method from `ethers.js`.
*   **Interactions:** Used by `WalletDashboard.jsx`. Re-fetches balance when `wallet` or `transactionCount` props change.

### `WalletCard.js`
*   **Primary Responsibility:** (Note: This component appears to be part of an older wallet management approach and might be deprecated or replaced by `WalletManager.jsx` and `WalletDashboard.jsx` in the current architecture.) It was likely intended to display individual wallet details, balance, and send functionality.
*   **Key Exports:** `WalletCard` (React Component).
*   **Props/State:** Accepts `wallet`, `balance`, `isActive`, `onSend`, `latestTxHash`, `isLoading`, and `onSetActive` props. Manages `showSendForm`, `sendForm`, `sendLoading`, `sendError`, and `copied` states.
*   **External Services:** Interacts with `blockdag.js` utilities for address validation and transaction sending.
*   **Interactions:** (Likely) used by `WalletManager.js` (the older version) to render a list of wallets.

### `WalletDashboard.jsx`
*   **Primary Responsibility:** The central dashboard for an unlocked wallet. It aggregates and displays the wallet's address, balance, transaction sending capabilities, and nominee management.
*   **Key Exports:** `WalletDashboard` (React Component).
*   **Props/State:** Accepts `wallet` (ethers.js wallet instance) as a prop. Manages `transactionCount` (to trigger balance refreshes) and `user` (Supabase user object) states.
*   **External Services:** Fetches the authenticated user from Supabase (`supabase.auth.getUser()`).
*   **Interactions:** Imports and renders `WalletBalance.jsx`, `SendTransaction.jsx`, and `NomineeManager.jsx`, passing necessary props to them. Orchestrates the `onTransactionSuccess` callback to update the balance.

### `WalletManager.jsx`
*   **Primary Responsibility:** Orchestrates the initial wallet creation and unlocking flow. It determines whether a user has an existing wallet and presents the appropriate UI (create password or unlock with password).
*   **Key Exports:** `WalletManager` (React Component).
*   **Props/State:** Accepts `user` (Supabase user object) and `onBack` (callback) as props. Manages `isLoading`, `hasWallet`, `password`, `confirmPassword`, `error`, `decryptedWallet`, and `showPassword` states.
*   **External Services:** Interacts with Supabase via `getEncryptedWalletFromSupabase` from `../utils/wallet.js` to check for existing wallets. Uses `createAndSaveWallet` and `loadAndDecryptWallet` from `../utils/wallet.js` for wallet persistence.
*   **Interactions:** Rendered by `Dashboard.js`. Upon successful wallet creation or unlock, it renders `WalletDashboard.jsx`.

### `WorkInProgress.js`
*   **Primary Responsibility:** A placeholder component indicating features under development. It provides a temporary landing page for users while core functionalities are being built.
*   **Key Exports:** `WorkInProgress` (React Component).
*   **Props/State:** Manages `user` (Supabase user object) and `loading` states. Uses `react-router-dom` for navigation.
*   **External Services:** Interacts with Supabase for user session management.
*   **Interactions:** Displays a list of upcoming features and allows users to log out.

## Interactions & Dependencies

The components in this directory form the core user experience. `App.js` routes to `HomePage.js`, `LoginPage.js`, and `Dashboard.js`. `Dashboard.js` then conditionally renders `WalletManager.jsx` to handle wallet setup. Once a wallet is ready, `WalletManager.jsx` passes control to `WalletDashboard.jsx`, which acts as a container for `WalletBalance.jsx`, `SendTransaction.jsx`, and `NomineeManager.jsx`. These sub-components interact with `ethers.js` and Supabase (via `../utils/wallet.js`) to perform blockchain operations and data persistence. `WalletCard.js` appears to be an older component that might not be actively used in the current flow but remains in the directory.
