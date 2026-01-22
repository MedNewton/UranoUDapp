import React from 'react';

const KYCModal = ({ isOpen, onClose, onCompleted }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md relative">
        {/* Pulsante di chiusura */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Contenuto del modal */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-6">
            Verify your identity
          </h2>
          
          <div className="text-center mb-8">
            <p className="text-gray-800 dark:text-gray-200 font-medium">
              Urano requires identity verification
            </p>
          </div>
          
          {/* Passi KYC */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            {/* Passo 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                First, complete KYC using Persona
              </p>
            </div>
            
            {/* Passo 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                Then claim your UID NFT for identity management
              </p>
            </div>
          </div>
          
          {/* Informazioni aggiuntive */}
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              This UID will be minted on the Arbitrum network. If you hold a UID on Ethereum Mainnet, you still need a UID on Arbitrum.
            </p>
          </div>
          
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-6">
            <p>
              All information you provide is kept secure and will not be used for any purpose beyond executing your transactions. 
              <a href="#" className="text-[#2dbdc5] ml-1 hover:underline"></a>
            </p>
          </div>
          
          {/* Pulsante Begin */}
          <button
            onClick={onCompleted || onClose}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-md font-medium hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors"
          >
            Begin
          </button>
        </div>
      </div>
    </div>
  );
};

export default KYCModal;
