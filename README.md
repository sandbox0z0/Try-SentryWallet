# SentryWallet: The Smart Wallet You Can't Lose

## 💡 Inspiration

In the world of Web3, two major hurdles prevent mainstream adoption:

1.  **Seed Phrase Management:** Users constantly fear losing their seed phrases, which can lead to irreversible loss of funds.
2.  **Gas Fees:** The need to acquire and manage native tokens for transaction fees (gas) creates a significant barrier to entry for new users.

SentryWallet was born from the idea of solving these problems by combining the best of Web2 user experience with the power and security of Web3, all powered by the innovative BlockDAG network.

## ✨ What it Does

SentryWallet is a smart, recoverable crypto wallet designed for the everyday user. It offers:

*   **Web2 Login (Supabase Auth):** Users can sign in seamlessly using familiar Web2 methods (e.g., Google, email/password) via Supabase, eliminating the need for complex seed phrases.
*   **Social Recovery (On-chain Inheritance):** Our unique feature allows users to designate trusted nominees (friends, family) on-chain. In the event of a recovery, these nominees can claim a pre-defined share of the wallet's funds, acting as a digital will.
*   **Gasless Transactions (BlockDAG):** Built on the BlockDAG testnet, SentryWallet leverages its high throughput and low fees. Future iterations will implement meta-transactions to abstract away gas fees entirely, providing a truly gasless user experience.
*   **Secure Wallet Management:** Wallets are generated client-side, encrypted with a user-defined password, and securely stored in the user's Supabase profile.

## 🚀 How We Built It

SentryWallet is a full-stack application built with a modern and robust technology stack:

### Frontend
*   **React.js:** For a dynamic and responsive user interface.
*   **Tailwind CSS:** For rapid and consistent styling.
*   **Framer Motion:** For smooth and engaging animations.
*   **Ethers.js:** For seamless interaction with the BlockDAG blockchain.
*   **Supabase:** Our Backend-as-a-Service (BaaS) for user authentication and secure storage of encrypted wallet data and off-chain nominee information.

### Smart Contract
*   **Solidity:** The `SentryInheritance.sol` smart contract is the core of our social recovery feature, deployed on the BlockDAG testnet. It manages nominee shares and the fund claiming process.

## ⚙️ Setup and Installation

To run SentryWallet locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd SentryWallet
    ```

2.  **Set up Supabase:**
    *   Create a new project on [Supabase](https://supabase.com/).
    *   Navigate to "Authentication" -> "Providers" and enable "Google" if you wish to use Google login.
    *   Go to "SQL Editor" and run the following SQL script to set up your `profiles` table and RLS policies:

        ```sql
        CREATE TABLE public.profiles (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          encrypted_wallet TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          nominee_email TEXT
        );

        COMMENT ON TABLE public.profiles IS 'Stores user profile information, including their encrypted wallet and nominee details.';
        COMMENT ON COLUMN public.profiles.id IS 'Foreign key to auth.users.id.';
        COMMENT ON COLUMN public.profiles.encrypted_wallet IS 'The user''s wallet, encrypted with their password as a JSON string.';

        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Users can view their own profile."
        ON public.profiles FOR SELECT
        USING (auth.uid() = id);

        CREATE POLICY "Users can insert their own profile."
        ON public.profiles FOR INSERT
        WITH CHECK (auth.uid() = id);

        CREATE POLICY "Users can update their own profile."
        ON public.profiles FOR UPDATE
        USING (auth.uid() = id);

        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS TRIGGER
        LANGUAGE plpgsql
        SECURITY DEFINER SET search_path = public
        AS $$
        BEGIN
          INSERT INTO public.profiles (id)
          VALUES (new.id);
          RETURN new;
        END;
        $$;

        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
        ```

3.  **Deploy the Smart Contract:**
    *   Compile and deploy the `SentryInheritance.sol` contract (found in `frontend/src/contracts/SentryInheritance.sol`) to the BlockDAG testnet using Remix or your preferred deployment tool.
    *   **Important:** Note down the deployed contract address and its ABI.

4.  **Configure Environment Variables:**
    *   Create a `.env.local` file in the `frontend/` directory.
    *   Add your Supabase and deployed contract details:
        ```
        REACT_APP_SUPABASE_URL=YOUR_SUPABASE_URL
        REACT_APP_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
        REACT_APP_BLOCKDAG_RPC_URL=https://rpc.primordial.bdagscan.com # Or your preferred BlockDAG RPC
        REACT_APP_INHERITANCE_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
        ```

5.  **Install Dependencies and Run:**
    ```bash
    cd frontend
    yarn install
    yarn start
    ```
    The application will open in your browser, usually at `http://localhost:3000`.

## 🛣️ Future Enhancements

*   **Meta-transactions for Gasless UX:** Implement a relayer network to sponsor gas fees, making transactions truly gasless for the end-user.
*   **Advanced Social Recovery:** Introduce multi-signature recovery, time-locks, and more sophisticated guardian management.
*   **Nominee Claim UI:** Develop a dedicated interface for nominees to claim their inheritance after a recovery event.
*   **Transaction History:** Integrate with a BlockDAG explorer API to display a comprehensive transaction history within the wallet.
*   **Multi-chain Support:** Extend compatibility to other EVM-compatible chains.
*   **Mobile Application:** Develop native mobile applications for iOS and Android.

## 🤝 Contributing

We welcome contributions! Please feel free to fork the repository, open issues, or submit pull requests.

## 📄 License

This project is licensed under the MIT License.