
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { supabase } from '../utils/wallet';
import { Loader2, AlertCircle, CheckCircle, UserPlus } from 'lucide-react';
import SentryInheritanceABI from '../contracts/SentryInheritance.json';

const CONTRACT_ADDRESS = process.env.REACT_APP_INHERITANCE_CONTRACT_ADDRESS;

const NomineeManager = ({ user, wallet }) => {
  const [nomineeEmail, setNomineeEmail] = useState(''); // Off-chain email
  const [nomineeAddress, setNomineeAddress] = useState(''); // On-chain address
  const [sharePercentage, setSharePercentage] = useState(''); // On-chain share
  const [currentNomineeOnChain, setCurrentNomineeOnChain] = useState(null); // { address, share }
  const [currentNomineeOffChain, setCurrentNomineeOffChain] = useState(''); // Off-chain email

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const inheritanceContract = new ethers.Contract(CONTRACT_ADDRESS, SentryInheritanceABI, wallet);

  useEffect(() => {
    const fetchNomineeData = async () => {
      if (!user || !wallet || !CONTRACT_ADDRESS) return;

      setIsLoading(true);
      setError('');

      try {
        // Fetch off-chain nominee email
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('nominee_email')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }
        if (profileData && profileData.nominee_email) {
          setCurrentNomineeOffChain(profileData.nominee_email);
          setNomineeEmail(profileData.nominee_email);
        }

        // Fetch on-chain nominee data
        const onChainShare = await inheritanceContract.nominees(wallet.address);
        if (onChainShare > 0) {
          setCurrentNomineeOnChain({ address: wallet.address, share: onChainShare.toString() });
          setNomineeAddress(wallet.address);
          setSharePercentage(onChainShare.toString());
        }

      } catch (err) {
        setError('Could not fetch nominee information.');
        console.error("Error fetching nominee:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNomineeData();
  }, [user, wallet]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    if (!ethers.utils.isAddress(nomineeAddress)) {
      setError('Invalid nominee BlockDAG address.');
      setIsSaving(false);
      return;
    }
    const share = parseInt(sharePercentage);
    if (isNaN(share) || share <= 0 || share > 100) {
      setError('Share percentage must be a number between 1 and 100.');
      setIsSaving(false);
      return;
    }

    try {
      // Save off-chain email
      const { error: supabaseError } = await supabase
        .from('profiles')
        .update({ nominee_email: nomineeEmail })
        .eq('id', user.id);

      if (supabaseError) {
        throw supabaseError;
      }
      setCurrentNomineeOffChain(nomineeEmail);

      // Save on-chain nominee
      const tx = await inheritanceContract.setNominee(nomineeAddress, share);
      await tx.wait();

      setCurrentNomineeOnChain({ address: nomineeAddress, share: sharePercentage });
      setSuccess('Nominee saved successfully on-chain and off-chain!');
    } catch (err) {
      setError(err.reason || 'Failed to save nominee. Please try again.');
      console.error("Error saving nominee:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="ml-2">Loading Nominee Info...</span>
      </div>
    );
  }

  return (
    <div className="neumorphic-inset rounded-2xl p-6">
      {currentNomineeOffChain && !error && (
        <div className="mb-4 text-sm text-gray-600">
          Current Off-chain Nominee Email: <span className="font-semibold text-accent">{currentNomineeOffChain}</span>
        </div>
      )}
      {currentNomineeOnChain && !error && (
        <div className="mb-4 text-sm text-gray-600">
          Current On-chain Nominee: <span className="font-semibold text-accent">{currentNomineeOnChain.address}</span> (Share: <span className="font-semibold text-accent">{currentNomineeOnChain.share}%</span>)
        </div>
      )}
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label htmlFor="nomineeEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Nominee's Email Address (Off-chain)
          </label>
          <input
            id="nomineeEmail"
            type="email"
            value={nomineeEmail}
            onChange={(e) => setNomineeEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="nominee@example.com"
            required
            disabled={isSaving}
          />
        </div>

        <div>
          <label htmlFor="nomineeAddress" className="block text-sm font-medium text-gray-700 mb-2">
            Nominee's BlockDAG Address (On-chain)
          </label>
          <input
            id="nomineeAddress"
            type="text"
            value={nomineeAddress}
            onChange={(e) => setNomineeAddress(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="0x..."
            required
            disabled={isSaving}
          />
        </div>

        <div>
          <label htmlFor="sharePercentage" className="block text-sm font-medium text-gray-700 mb-2">
            Share Percentage (1-100)
          </label>
          <input
            id="sharePercentage"
            type="number"
            value={sharePercentage}
            onChange={(e) => setSharePercentage(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="e.g., 50 for 50%"
            required
            min="1"
            max="100"
            disabled={isSaving}
          />
        </div>

        {error && (
          <div className="flex items-center text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center text-green-600 text-sm">
            <CheckCircle className="w-4 h-4 mr-2" />
            <span>{success}</span>
          </div>
        )}

        <button
          type="submit"
          className={`w-full flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            isSaving
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-accent hover:bg-accent/90 text-white'
          }`}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5 mr-2" />
              Save Nominee On-Chain
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default NomineeManager;
