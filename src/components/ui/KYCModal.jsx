import React, { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useWallet } from '@/context/WalletContext';
import { fetchKycAndCheckMismatch } from '@/lib/kyc';
import VerifyIdentityModal from '@/components/ui/VerifyIdentityModal';

const KYCModal = ({ isOpen, onClose, onCompleted }) => {
  const { isDark } = useTheme();
  const { isConnected, walletAddress } = useWallet();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [kycStatus, setKycStatus] = useState({
    verified: false,
    personaWallet: null,
    mismatch: false,
    loading: false,
  });
  const [errorMessage, setErrorMessage] = useState('');

  const steps = [
    {
      id: 1,
      title: 'Identity Verification',
      description: 'Complete KYC verification using our secure partner Persona',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      status: 'pending'
    },
    {
      id: 2,
      title: 'Mint UID NFT',
      description: 'Claim your on-chain identity credential on Arbitrum',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      status: 'locked'
    }
  ];

  useEffect(() => {
    if (!isOpen || !walletAddress) {
      setCurrentStep(0);
      return;
    }

    let cancelled = false;
    setKycStatus((prev) => ({ ...prev, loading: true, mismatch: false }));
    setErrorMessage('');

    fetchKycAndCheckMismatch(walletAddress)
      .then(({ verified, personaWallet, mismatch }) => {
        if (cancelled) return;
        setKycStatus({
          verified,
          personaWallet,
          mismatch,
          loading: false,
        });
        setCurrentStep(verified ? 1 : 0);
        if (mismatch) {
          setErrorMessage(
            'Wallet mismatch detected. Please connect the wallet used during Persona verification.'
          );
        }
      })
      .catch(() => {
        if (cancelled) return;
        setKycStatus({
          verified: false,
          personaWallet: null,
          mismatch: false,
          loading: false,
        });
        setCurrentStep(0);
        setErrorMessage('Unable to fetch KYC status. Please try again.');
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, walletAddress]);

  if (!isOpen) return null;

  const handleBegin = async () => {
    if (!walletAddress || kycStatus.loading) return;

    if (kycStatus.mismatch) {
      setErrorMessage(
        'Wallet mismatch detected. Please connect the wallet used during Persona verification.'
      );
      return;
    }

    if (kycStatus.verified) {
      if (onCompleted) {
        onCompleted();
      } else {
        onClose();
      }
      return;
    }
    setErrorMessage('');
    setIsPersonaOpen(true);
  };

  const isActionDisabled =
    !kycStatus.verified &&
    (!isConnected || kycStatus.loading || isPersonaOpen || kycStatus.mismatch);

  const actionLabel = !isConnected
    ? 'Connect wallet to verify'
    : kycStatus.loading
    ? 'Checking status...'
    : kycStatus.verified
    ? 'Continue'
    : isPersonaOpen
    ? 'Verification in progress'
    : kycStatus.mismatch
    ? 'Wallet mismatch'
    : 'Begin Verification';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`relative w-full max-w-lg rounded-2xl overflow-hidden ${
        isDark
          ? 'bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] border border-[#2a2a4e]'
          : 'bg-white border border-gray-200'
      }`}>
        {/* Glow effects */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#14EFC0]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className={`relative flex items-center justify-between p-6 border-b ${
          isDark ? 'border-[#2a2a4e]' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${
              isDark ? 'bg-[#14EFC0]/10' : 'bg-teal-50'
            }`}>
              <svg className="w-6 h-6 text-[#14EFC0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className={`text-lg font-conthrax ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Verify Identity
              </h2>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Required for regulatory compliance
              </p>
            </div>
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
        <div className="relative p-6 space-y-6">
          {/* Intro Text */}
          <div className={`text-center p-4 rounded-xl ${
            isDark ? 'bg-[#14EFC0]/5 border border-[#14EFC0]/20' : 'bg-teal-50 border border-teal-100'
          }`}>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Urano requires identity verification to ensure secure and compliant transactions on our platform.
            </p>
          </div>

          {!isConnected && (
            <div className={`text-center p-3 rounded-lg ${
              isDark ? 'bg-[#1a1a2e]/50 text-gray-400' : 'bg-gray-50 text-gray-600'
            }`}>
              <p className="text-xs">Connect your wallet to start KYC verification.</p>
            </div>
          )}

          {errorMessage && (
            <div className={`p-3 rounded-lg ${
              isDark ? 'bg-amber-500/10 text-amber-300' : 'bg-amber-50 text-amber-700'
            }`}>
              <p className="text-xs">{errorMessage}</p>
            </div>
          )}

          {/* Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              (() => {
                const isStepComplete = index === 0 ? kycStatus.verified : currentStep > index;
                const isStepActive = index === 0 ? !kycStatus.verified : currentStep === index;
                return (
              <div
                key={step.id}
                className={`relative flex items-start gap-4 p-4 rounded-xl transition-all ${
                  isStepActive
                    ? isDark
                      ? 'bg-[#14EFC0]/10 border border-[#14EFC0]/30'
                      : 'bg-teal-50 border border-teal-200'
                    : isStepComplete
                      ? isDark
                        ? 'bg-[#1a1a2e]/50 border border-[#14EFC0]/20'
                        : 'bg-gray-50 border border-teal-200'
                      : isDark
                        ? 'bg-[#1a1a2e]/30 border border-[#2a2a4e]'
                        : 'bg-gray-50 border border-gray-200'
                }`}
              >
                {/* Step Icon */}
                <div className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${
                  isStepComplete
                    ? 'bg-[#14EFC0] text-black'
                    : isStepActive
                      ? isDark
                        ? 'bg-[#14EFC0]/20 text-[#14EFC0]'
                        : 'bg-teal-100 text-teal-600'
                      : isDark
                        ? 'bg-[#2a2a4e] text-gray-500'
                        : 'bg-gray-200 text-gray-400'
                }`}>
                  {isStepComplete ? (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isStepActive && isPersonaOpen ? (
                    <svg className="animate-spin w-7 h-7" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    step.icon
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-conthrax uppercase tracking-wider ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      Step {step.id}
                    </span>
                    {isStepComplete && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#14EFC0]/20 text-[#14EFC0]">
                        Complete
                      </span>
                    )}
                    {isStepActive && isPersonaOpen && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'
                      }`}>
                        In Progress
                      </span>
                    )}
                  </div>
                  <h3 className={`font-conthrax text-sm mb-1 ${
                    isStepActive || isStepComplete
                      ? isDark ? 'text-white' : 'text-gray-900'
                      : isDark ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {step.description}
                  </p>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`absolute left-11 top-[72px] w-0.5 h-4 ${
                    isStepComplete ? 'bg-[#14EFC0]' : isDark ? 'bg-[#2a2a4e]' : 'bg-gray-200'
                  }`} />
                )}
              </div>
                );
              })()
            ))}
          </div>

          {/* Network Info */}
          <div className={`flex items-center gap-3 p-3 rounded-lg ${
            isDark ? 'bg-[#1a1a2e]/50' : 'bg-gray-50'
          }`}>
            <div className={`p-2 rounded-lg ${isDark ? 'bg-[#2a2a4e]' : 'bg-gray-200'}`}>
              <svg className="w-4 h-4 text-[#14EFC0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Your UID will be minted on <span className="font-medium text-[#14EFC0]">Arbitrum</span> network
              </p>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className={`p-4 rounded-lg ${
            isDark ? 'bg-amber-500/5 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'
          }`}>
            <div className="flex items-start gap-3">
              <svg className={`w-5 h-5 shrink-0 mt-0.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Your information is encrypted and securely stored. We only use it for verification purposes and will never share it with third parties.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleBegin}
            disabled={isActionDisabled}
            className={`w-full py-4 rounded-xl font-conthrax text-sm transition-all ${
              isActionDisabled
                ? isDark
                  ? 'bg-[#2a2a4e] text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#14EFC0] text-black hover:bg-[#12d4ad] hover:shadow-lg hover:shadow-[#14EFC0]/20'
            }`}
          >
            {isPersonaOpen ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Verification in progress...
              </span>
            ) : (
              actionLabel
            )}
          </button>

          {/* Footer Links */}
          <div className="flex items-center justify-center gap-4">
            <a href="#" className={`text-xs transition-colors ${
              isDark ? 'text-gray-500 hover:text-[#14EFC0]' : 'text-gray-400 hover:text-teal-600'
            }`}>
              Privacy Policy
            </a>
            <span className={isDark ? 'text-gray-600' : 'text-gray-300'}>•</span>
            <a href="#" className={`text-xs transition-colors ${
              isDark ? 'text-gray-500 hover:text-[#14EFC0]' : 'text-gray-400 hover:text-teal-600'
            }`}>
              Terms of Service
            </a>
          </div>
        </div>
      </div>
      <VerifyIdentityModal
        isOpen={isPersonaOpen}
        onClose={() => setIsPersonaOpen(false)}
        onComplete={() => {
          setKycStatus((prev) => ({ ...prev, verified: true, mismatch: false }));
          setCurrentStep(1);
          setIsPersonaOpen(false);
          if (onCompleted) {
            onCompleted();
          } else {
            onClose();
          }
        }}
        walletAddress={walletAddress}
      />
    </div>
  );
};

export default KYCModal;
