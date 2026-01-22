import React, { createContext, useContext, useState, useEffect } from 'react';

// Creazione del contesto
const WalletContext = createContext();

// Custom hook per usare il contesto
export const useWallet = () => useContext(WalletContext);

// Provider del contesto
export const WalletProvider = ({ children }) => {
  // Stato per tracciare se il wallet è connesso
  const [isConnected, setIsConnected] = useState(false);
  // Simula l'indirizzo del wallet
  const [walletAddress, setWalletAddress] = useState('');
  // Simula il saldo del wallet
  const [balance, setBalance] = useState({
    urano: '0',
    eth: '0'
  });
  // Flag per tener traccia se la modale KYC è già stata mostrata
  const [kycModalShown, setKycModalShown] = useState(false);

  // Funzione per simulare la connessione/disconnessione del wallet
  const toggleWalletConnection = () => {
    if (isConnected) {
      // Disconnette il wallet
      setIsConnected(false);
      setWalletAddress('');
      setBalance({ urano: '0', eth: '0' });
      // Salva lo stato in localStorage per persistenza
      localStorage.removeItem('urano_wallet_connected');
      localStorage.removeItem('urano_wallet_address');
    } else {
      // Simula la connessione di un wallet con un indirizzo di esempio
      const randomAddr = `0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)}`;
      setIsConnected(true);
      setWalletAddress(randomAddr);
      // Simula dei saldi casuali
      setBalance({
        urano: (Math.random() * 500).toFixed(2),
        eth: (Math.random() * 5).toFixed(4)
      });
      // Salva lo stato in localStorage per persistenza
      localStorage.setItem('urano_wallet_connected', 'true');
      localStorage.setItem('urano_wallet_address', randomAddr);
    }
  };

  // Controlla se il wallet era già connesso e recupera altri stati (persistenza dello stato)
  useEffect(() => {
    const wasConnected = localStorage.getItem('urano_wallet_connected') === 'true';
    const savedAddress = localStorage.getItem('urano_wallet_address');
    const kyc_shown = localStorage.getItem('urano_kyc_shown') === 'true';
    
    if (kyc_shown) {
      setKycModalShown(true);
    }
    
    if (wasConnected && savedAddress) {
      setIsConnected(true);
      setWalletAddress(savedAddress);
      // Simula dei saldi casuali ma persistenti
      setBalance({
        urano: (Math.random() * 500).toFixed(2),
        eth: (Math.random() * 5).toFixed(4)
      });
    }
  }, []);

  // Funzione per segnare che la modale KYC è stata mostrata
  const setKycShown = () => {
    setKycModalShown(true);
    localStorage.setItem('urano_kyc_shown', 'true');
  };

  // Valori esposti dal contesto
  const value = {
    isConnected,
    walletAddress,
    balance,
    toggleWalletConnection,
    kycModalShown,
    setKycShown
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
