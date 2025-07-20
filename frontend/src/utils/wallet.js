
import { ethers } from 'ethers';
import CryptoJS from 'crypto-js';
import { createClient } from '@supabase/supabase-js';

// It's better to have a single Supabase client instance.
// Let's create it here and export it.
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be provided in environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Creates a new Ethereum wallet.
 * @returns {ethers.Wallet} A new wallet object.
 */
const createNewWallet = () => {
  return ethers.Wallet.createRandom();
};

/**
 * Encrypts the wallet's private key with a user-provided password.
 * @param {string} privateKey - The private key to encrypt.
 * @param {string} password - The password to use for encryption.
 * @returns {string} The encrypted private key as a string.
 */
const encryptWallet = (privateKey, password) => {
  return CryptoJS.AES.encrypt(privateKey, password).toString();
};

/**
 * Decrypts an encrypted private key with a user-provided password.
 * @param {string} encryptedPrivateKey - The encrypted private key.
 * @param {string} password - The password to use for decryption.
 * @returns {string} The decrypted private key.
 */
const decryptWallet = (encryptedPrivateKey, password) => {
  const bytes = CryptoJS.AES.decrypt(encryptedPrivateKey, password);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  if (!originalText) {
    throw new Error("Decryption failed. Invalid password.");
  }
  return originalText;
};

/**
 * Saves the encrypted wallet to the user's profile in Supabase.
 * @param {string} encryptedWallet - The encrypted wallet data.
 * @param {string} userId - The user's ID.
 */
const saveWalletToSupabase = async (encryptedWallet, userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ encrypted_wallet: encryptedWallet })
    .eq('id', userId);

  if (error) {
    console.error("Error saving wallet to Supabase:", error);
    throw new Error("Could not save the wallet to your profile.");
  }
  return data;
};

/**
 * Fetches the encrypted wallet from the user's profile in Supabase.
 * @param {string} userId - The user's ID.
 * @returns {string|null} The encrypted wallet data, or null if not found.
 */
export const getEncryptedWalletFromSupabase = async (userId) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('encrypted_wallet')
        .eq('id', userId)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error("Error fetching wallet from Supabase:", error);
        throw new Error("Could not retrieve your wallet data.");
    }

    return data ? data.encrypted_wallet : null;
};


/**
 * Orchestrates the creation, encryption, and saving of a new wallet.
 * @param {string} password - The user's chosen password for encryption.
 * @param {string} userId - The user's ID.
 * @returns {ethers.Wallet} The newly created and saved wallet instance.
 */
export const createAndSaveWallet = async (password, userId) => {
  if (!password || !userId) {
    throw new Error("Password and User ID are required.");
  }
  const newWallet = createNewWallet();
  const encryptedWallet = encryptWallet(newWallet.privateKey, password);
  await saveWalletToSupabase(encryptedWallet, userId);
  return newWallet;
};

/**
 * Orchestrates the loading and decryption of an existing wallet.
 * @param {string} password - The user's password for decryption.
 * @param {string} userId - The user's ID.
 * @returns {ethers.Wallet} The decrypted wallet instance.
 */
export const loadAndDecryptWallet = async (password, userId) => {
    if (!password || !userId) {
        throw new Error("Password and User ID are required.");
    }
    const encryptedWallet = await getEncryptedWalletFromSupabase(userId);
    if (!encryptedWallet) {
        throw new Error("No wallet found for this user.");
    }
    const privateKey = decryptWallet(encryptedWallet, password);
    return new ethers.Wallet(privateKey);
};
