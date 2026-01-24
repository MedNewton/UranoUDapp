import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import uShareLogo from '@/assets/img/pool_logo.webp';

const ClaimModal = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  // Mock data - in production this would come from blockchain
  const claimableRewards = {
    uShare: '12.45',
    usdValue: '124.50',
    lastClaim: '2025-01-10',
    nextReward: '2025-02-01'
  };

  // Reset modal state when opened/closed
  useEffect(() => {
    if (isOpen) {
      setIsProcessing(false);
      setClaimSuccess(false);
    }
  }, [isOpen]);

  // Handle claim confirmation
  const handleClaim = async () => {
    setIsProcessing(true);
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setClaimSuccess(true);
    // Auto close after success
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`relative w-full max-w-md rounded-2xl overflow-hidden ${
        isDark
          ? 'bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] border border-[#2a2a4e]'
          : 'bg-white border border-gray-200'
      }`}>
        {/* Glow effect */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#14EFC0]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#14EFC0]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className={`relative flex items-center justify-between p-5 border-b ${
          isDark ? 'border-[#2a2a4e]' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isDark ? 'bg-[#14EFC0]/10' : 'bg-teal-50'}`}>
              <svg className="w-5 h-5 text-[#14EFC0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className={`text-lg font-conthrax ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Claim Rewards
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? 'text-gray-400 hover:text-white hover:bg-[#2a2a4e]'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="relative p-5 space-y-5">
          {claimSuccess ? (
            // Success State
            <div className="text-center py-8">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                isDark ? 'bg-[#14EFC0]/20' : 'bg-teal-100'
              }`}>
                <svg className="w-10 h-10 text-[#14EFC0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className={`text-xl font-conthrax mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Claim Successful!
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {claimableRewards.uShare} uShare has been added to your wallet
              </p>
            </div>
          ) : (
            <>
              {/* Claimable Amount */}
              <div className={`rounded-xl p-5 text-center ${
                isDark
                  ? 'bg-[#14EFC0]/5 border border-[#14EFC0]/20'
                  : 'bg-teal-50 border border-teal-200'
              }`}>
                <p className={`text-xs font-conthrax uppercase tracking-wider mb-2 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Available to Claim
                </p>
                <div className="flex items-center justify-center gap-3 mb-2">
                  <img src={uShareLogo} alt="uShare" className="w-8 h-8 object-contain" />
                  <span className={`text-3xl font-bold ${isDark ? 'text-[#14EFC0]' : 'text-teal-600'}`}>
                    {claimableRewards.uShare}
                  </span>
                  <span className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>uShare</span>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  ≈ ${claimableRewards.usdValue} USD
                </p>
              </div>

              {/* Reward Details */}
              <div className={`space-y-3 p-4 rounded-xl ${
                isDark ? 'bg-[#1a1a2e]/50' : 'bg-gray-50'
              }`}>
                <div className="flex justify-between items-center">
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Last Claim
                  </span>
                  <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {claimableRewards.lastClaim}
                  </span>
                </div>
                <div className={`border-t ${isDark ? 'border-[#2a2a4e]' : 'border-gray-200'}`} />
                <div className="flex justify-between items-center">
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Next Reward Date
                  </span>
                  <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {claimableRewards.nextReward}
                  </span>
                </div>
                <div className={`border-t ${isDark ? 'border-[#2a2a4e]' : 'border-gray-200'}`} />
                <div className="flex justify-between items-center">
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Network Fee
                  </span>
                  <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    ~$0.02
                  </span>
                </div>
              </div>

              {/* Info Banner */}
              <div className={`flex items-start gap-3 p-3 rounded-lg ${
                isDark ? 'bg-[#1a1a2e]/50' : 'bg-gray-50'
              }`}>
                <svg className={`w-5 h-5 shrink-0 mt-0.5 ${isDark ? 'text-[#14EFC0]' : 'text-teal-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Rewards are distributed based on your share of the pool and the project's performance. Claiming will transfer tokens directly to your connected wallet.
                </p>
              </div>

              {/* Claim Button */}
              <button
                onClick={handleClaim}
                disabled={isProcessing || parseFloat(claimableRewards.uShare) === 0}
                className={`w-full py-4 rounded-xl font-conthrax text-sm transition-all ${
                  !isProcessing && parseFloat(claimableRewards.uShare) > 0
                    ? 'bg-[#14EFC0] text-black hover:bg-[#12d4ad] hover:shadow-lg hover:shadow-[#14EFC0]/20'
                    : isDark
                      ? 'bg-[#2a2a4e] text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing Claim...
                  </span>
                ) : parseFloat(claimableRewards.uShare) > 0 ? (
                  `Claim ${claimableRewards.uShare} uShare`
                ) : (
                  'No Rewards Available'
                )}
              </button>

              {/* Security Note */}
              <p className={`text-center text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Secured by smart contract • Instant settlement
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClaimModal;
