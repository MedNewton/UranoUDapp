import React, { useState, useEffect } from 'react';
import uShareLogo from '@/assets/img/pool_logo.png'; // Usa il logo esistente per uShare
import usdcLogo from '@/assets/img/usdc_logo.png'; // Dobbiamo creare questa immagine
import { usePortfolio } from '@/context/PortfolioContext';

const BuyModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState('0.00');
  const [showConfirm, setShowConfirm] = useState(false);
  const [inputActive, setInputActive] = useState(false);
  const { addProject } = usePortfolio();
  
  // Reimpostazione della modal quando viene aperta/chiusa
  useEffect(() => {
    if (isOpen) {
      setAmount('0.00');
      setShowConfirm(false);
    }
  }, [isOpen]);

  // Gestisce la modifica dell'importo
  const handleAmountChange = (e) => {
    const value = e.target.value;
    
    // Permette solo numeri e un punto decimale
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
      // Mostra il pulsante di conferma solo se c'è un importo valido maggiore di zero
      setShowConfirm(parseFloat(value) > 0);
    }
  };

  // Calcola il valore ricevuto (simulazione di conversione)
  const receivedAmount = parseFloat(amount) / 10;
  
  // Conversione formattata per la visualizzazione
  const formattedReceived = receivedAmount.toFixed(2);
  
  // Se la modal non è aperta, non renderizzare nulla
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
      <div className="bg-black border border-[#2dbdc5]/30 rounded-lg shadow-xl w-full max-w-md relative overflow-hidden">
        {/* Pulsante di chiusura */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Sezione "YOU PAY" */}
        <div className="p-6">
          <h2 className="text-gray-400 font-conthrax mb-4 text-lg">YOU PAY</h2>
          
          <div className="bg-gray-900/80 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                onFocus={() => setInputActive(true)}
                onBlur={() => setInputActive(false)}
                className={`text-2xl font-bold bg-transparent text-white border-none focus:outline-none w-full ${inputActive ? 'border-b border-[#2dbdc5]' : ''}`}
              />
              <div className="flex items-center bg-gray-800 px-4 py-2.5 rounded-full min-w-[110px]">
                <img src={usdcLogo || '/placeholder-usdc.png'} alt="USDC" className="w-7 h-auto object-contain mr-2.5" />
                <span className="text-white font-conthrax text-sm">USDC</span>
              </div>
            </div>
            
            <div className="flex justify-between mt-3">
              <span className="text-gray-400 text-xs">${amount}</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">Balance: 0.003380</span>
                <button className="text-[#2dbdc5] text-xs">MAX</button>
              </div>
            </div>
          </div>
          
          {/* Frecce di conversione */}
          <div className="flex justify-center items-center gap-2 my-4">
            <svg className="w-5 h-5 text-[#2dbdc5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <svg className="w-5 h-5 text-[#2dbdc5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            
            <div className="ml-auto bg-gray-800/50 rounded-lg px-3 py-1.5">
              <span className="text-gray-300 text-xs font-conthrax">CONVERSION RATE</span>
              <p className="text-white text-xs">10 USDC = 1 uSHARE</p>
            </div>
          </div>
          
          {/* Sezione "YOU RECEIVE" */}
          <h2 className="text-gray-400 font-conthrax mb-4 text-lg">YOU RECEIVE</h2>
          
          <div className="bg-gray-900/80 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-white">{formattedReceived}</span>
              <div className="flex items-center bg-gray-800 px-4 py-2.5 rounded-full min-w-[110px]">
                <img src={uShareLogo} alt="uShare" className="w-7 h-auto object-contain mr-2.5" />
                <span className="text-white font-conthrax text-sm">uShare</span>
              </div>
            </div>
            
            <div className="flex justify-between mt-3">
              <span className="text-gray-400 text-xs">${amount}</span>
              <span className="text-gray-400 text-xs">Balance: 0.00</span>
            </div>
          </div>
          
          {/* Pulsante di conferma o messaggio per inserire un importo */}
          <button 
            onClick={showConfirm ? () => {
              // Aggiungi un progetto al portfolio
              const addedProject = addProject();
              // Chiudi il modale
              onClose();
              // Feedback di notifica (opzionale)
              if (addedProject) {
                console.log(`Operazione completata: ${addedProject.name} aggiunto al portfolio`);
              }
            } : undefined}
            className={`w-full py-3 px-4 rounded-md font-conthrax transition-colors ${showConfirm 
              ? 'bg-[#2dbdc5] text-white hover:bg-[#25a4ab] cursor-pointer' 
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
            disabled={!showConfirm}
          >
            {showConfirm ? 'Confirm' : 'Enter an amount'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyModal;
