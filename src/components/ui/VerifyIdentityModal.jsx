import React, { useEffect, useMemo, useState } from 'react';
import Persona from 'persona-react';
import { waitForKycStatus } from '@/lib/kyc';
import { useTheme } from '@/context/ThemeContext';

const getPersonaConfig = () => ({
  templateId: import.meta.env.VITE_PERSONA_TEMPLATE_ID ?? import.meta.env.NEXT_PUBLIC_PERSONA_TEMPLATE_ID,
  environmentId: import.meta.env.VITE_PERSONA_ENV_ID ?? import.meta.env.NEXT_PUBLIC_PERSONA_ENV_ID,
});

const VerifyIdentityModal = ({ isOpen, onClose, onComplete, walletAddress }) => {
  const { isDark } = useTheme();
  const [showFlow, setShowFlow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errorText, setErrorText] = useState('');

  const referenceId = useMemo(() => walletAddress || undefined, [walletAddress]);
  const { templateId, environmentId } = getPersonaConfig();
  const envError = !templateId || !environmentId;

  useEffect(() => {
    if (!isOpen) {
      setShowFlow(false);
      setBusy(false);
      setErrorText('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startVerification = () => {
    setErrorText('');
    setBusy(true);
    setShowFlow(true);
  };

  const handleComplete = async () => {
    try {
      if (walletAddress) {
        setBusy(true);
        const ok = await waitForKycStatus(walletAddress, { tries: 20, delayMs: 2000 });
        if (!ok) {
          throw new Error('We could not confirm your verification yet. Please try again shortly.');
        }
      }
      onComplete();
      onClose();
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : 'Verification could not be confirmed.');
    } finally {
      setBusy(false);
      setShowFlow(false);
    }
  };

  const handleCancel = () => {
    setShowFlow(false);
    setBusy(false);
  };

  const handleError = (err) => {
    setErrorText(err instanceof Error ? err.message : String(err));
    setShowFlow(false);
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className={`relative w-full rounded-2xl overflow-hidden flex flex-col ${
        showFlow ? 'max-w-4xl h-[85vh]' : 'max-w-2xl'
      } ${
        isDark
          ? 'bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] border border-[#2a2a4e]'
          : 'bg-white border border-gray-200'
      }`}>
        <div className={`flex items-center justify-between p-6 border-b ${
          isDark ? 'border-[#2a2a4e]' : 'border-gray-200'
        }`}>
          <div>
            <h2 className={`text-lg font-conthrax ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Verify your identity
            </h2>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Complete Persona verification to proceed
            </p>
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

        {!showFlow ? (
          <div className="p-6 space-y-5">
            {envError ? (
              <div className={`p-4 rounded-lg ${
                isDark ? 'bg-amber-500/10 text-amber-300' : 'bg-amber-50 text-amber-700'
              }`}>
                <p className="text-sm">
                  Persona env vars missing. Set `NEXT_PUBLIC_PERSONA_TEMPLATE_ID` and
                  `NEXT_PUBLIC_PERSONA_ENV_ID`.
                </p>
              </div>
            ) : (
              <>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  We use Persona to verify identity. This only takes a few minutes.
                </p>
                {errorText && (
                  <div className={`p-3 rounded-lg ${
                    isDark ? 'bg-amber-500/10 text-amber-300' : 'bg-amber-50 text-amber-700'
                  }`}>
                    <p className="text-xs">{errorText}</p>
                  </div>
                )}
                <button
                  onClick={startVerification}
                  disabled={busy || !walletAddress}
                  className={`w-full py-3 rounded-xl font-conthrax text-sm transition-all ${
                    busy || !walletAddress
                      ? isDark
                        ? 'bg-[#2a2a4e] text-gray-500 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-[#14EFC0] text-black hover:bg-[#12d4ad] hover:shadow-lg hover:shadow-[#14EFC0]/20'
                  }`}
                >
                  {busy ? 'Starting...' : 'Start verification'}
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="relative flex-1 min-h-0">
            {busy && (
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className={`px-4 py-2 rounded-lg text-xs ${
                  isDark ? 'bg-[#1a1a2e] text-gray-300' : 'bg-white text-gray-700'
                }`}>
                  Loading verification...
                </div>
              </div>
            )}
            <div className="absolute inset-0 persona-iframe">
              <Persona
                templateId={templateId}
                environmentId={environmentId}
                referenceId={referenceId}
                onLoad={() => setBusy(false)}
                onReady={() => setBusy(false)}
                onComplete={handleComplete}
                onCancel={handleCancel}
                onError={handleError}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyIdentityModal;
