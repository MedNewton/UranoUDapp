import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { usePortfolio } from '@/context/PortfolioContext';
import uShareLogo from '@/assets/img/pool_logo.webp';
import usdcLogo from '@/assets/img/usdc_logo.webp';

const BuyModal = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const { addProject } = usePortfolio();
  const [amount, setAmount] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset modal when opened/closed
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setShowConfirm(false);
      setIsProcessing(false);
    }
  }, [isOpen]);

  // Handle amount change
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
      setShowConfirm(parseFloat(value) > 0);
    }
  };

  // Calculate received amount (conversion simulation)
  const receivedAmount = parseFloat(amount) / 10 || 0;
  const formattedReceived = receivedAmount.toFixed(2);

  // Handle purchase confirmation
  const handleConfirm = async () => {
    setIsProcessing(true);
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    const addedProject = addProject();
    setIsProcessing(false);
    onClose();
    if (addedProject) {
      console.log(`Transaction completed: ${addedProject.name} added to portfolio`);
    }
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
          <h2 className={`text-lg font-conthrax ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Swap Tokens
          </h2>
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
        <div className="relative p-5 space-y-4">
          {/* YOU PAY Section */}
          <div>
            <label className={`block text-xs font-conthrax uppercase tracking-wider mb-2 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              You Pay
            </label>
            <div className={`rounded-xl p-4 ${
              isDark
                ? 'bg-[#0f0f1a] border border-[#2a2a4e]'
                : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  className={`text-2xl font-bold bg-transparent border-none focus:outline-none w-full ${
                    isDark ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'
                  }`}
                />
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full shrink-0 ${
                  isDark
                    ? 'bg-[#1a1a2e] border border-[#2a2a4e]'
                    : 'bg-white border border-gray-200 shadow-sm'
                }`}>
                  <img src={usdcLogo || '/placeholder-usdc.webp'} alt="USDC" className="w-6 h-6 object-contain" />
                  <span className={`font-conthrax text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>USDC</span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  ≈ ${amount || '0.00'}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    Balance: 1,250.00
                  </span>
                  <button className="text-xs font-conthrax text-[#14EFC0] hover:text-[#12d4ad] transition-colors">
                    MAX
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Swap Arrow */}
          <div className="flex justify-center">
            <div className={`p-2 rounded-xl ${
              isDark
                ? 'bg-[#1a1a2e] border border-[#2a2a4e]'
                : 'bg-gray-100 border border-gray-200'
            }`}>
              <svg className="w-5 h-5 text-[#14EFC0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>

          {/* YOU RECEIVE Section */}
          <div>
            <label className={`block text-xs font-conthrax uppercase tracking-wider mb-2 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              You Receive
            </label>
            <div className={`rounded-xl p-4 ${
              isDark
                ? 'bg-[#14EFC0]/5 border border-[#14EFC0]/20'
                : 'bg-teal-50 border border-teal-200'
            }`}>
              <div className="flex items-center justify-between gap-3">
                <span className={`text-2xl font-bold ${isDark ? 'text-[#14EFC0]' : 'text-teal-600'}`}>
                  {formattedReceived}
                </span>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full shrink-0 ${
                  isDark
                    ? 'bg-[#1a1a2e] border border-[#14EFC0]/30'
                    : 'bg-white border border-teal-300 shadow-sm'
                }`}>
                  <img src={uShareLogo} alt="uShare" className="w-6 h-6 object-contain" />
                  <span className={`font-conthrax text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>uShare</span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  ≈ ${amount || '0.00'}
                </span>
                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  Balance: 0.00
                </span>
              </div>
            </div>
          </div>

          {/* Conversion Rate Info */}
          <div className={`flex items-center justify-between p-3 rounded-lg ${
            isDark ? 'bg-[#1a1a2e]/50' : 'bg-gray-50'
          }`}>
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Conversion Rate
            </span>
            <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              1 uShare = 10 USDC
            </span>
          </div>

          {/* Transaction Details */}
          <div className={`space-y-2 p-3 rounded-lg ${
            isDark ? 'bg-[#1a1a2e]/50' : 'bg-gray-50'
          }`}>
            <div className="flex justify-between">
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Network Fee</span>
              <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>~$0.05</span>
            </div>
            <div className="flex justify-between">
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Slippage Tolerance</span>
              <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>0.5%</span>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={showConfirm ? handleConfirm : undefined}
            disabled={!showConfirm || isProcessing}
            className={`w-full py-4 rounded-xl font-conthrax text-sm transition-all ${
              showConfirm && !isProcessing
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
                Processing...
              </span>
            ) : showConfirm ? (
              'Confirm Swap'
            ) : (
              'Enter an amount'
            )}
          </button>

          {/* Security Note */}
          <p className={`text-center text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Secured by smart contract • Instant settlement
          </p>
        </div>
      </div>
    </div>
  );
};

export default BuyModal;
