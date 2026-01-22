import { createContext, useContext, useState, useEffect } from 'react';
import { useActiveAccount, useActiveWallet, useDisconnect } from "thirdweb/react";
import { client } from '@/lib/thirdweb';

// Create the context
const WalletContext = createContext();

// Custom hook to use the context
export const useWallet = () => useContext(WalletContext);

// Provider component
export const WalletProvider = ({ children }) => {
  // Get active account and wallet from thirdweb
  const activeAccount = useActiveAccount();
  const activeWallet = useActiveWallet();
  const { disconnect } = useDisconnect();

  // Derived state
  const isConnected = !!activeAccount;
  const walletAddress = activeAccount?.address || '';

  // Format address for display (0x1234...5678)
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const displayAddress = formatAddress(walletAddress);

  // Balance state (can be fetched separately if needed)
  const [balance, setBalance] = useState({
    urano: '0',
    eth: '0'
  });

  // KYC modal state
  const [kycModalShown, setKycModalShown] = useState(false);

  // State for controlling connect modal
  const [showConnectModal, setShowConnectModal] = useState(false);

  // Function to open connect modal
  const openConnectModal = () => {
    setShowConnectModal(true);
  };

  // Function to close connect modal
  const closeConnectModal = () => {
    setShowConnectModal(false);
  };

  // Function to disconnect wallet
  const disconnectWallet = () => {
    if (activeWallet) {
      disconnect(activeWallet);
    }
  };

  // Toggle function for compatibility with existing code
  const toggleWalletConnection = () => {
    if (isConnected) {
      disconnectWallet();
    } else {
      openConnectModal();
    }
  };

  // Check KYC modal shown state on mount
  useEffect(() => {
    const kyc_shown = localStorage.getItem('urano_kyc_shown') === 'true';
    if (kyc_shown) {
      setKycModalShown(true);
    }
  }, []);

  // Function to mark KYC modal as shown
  const setKycShown = () => {
    setKycModalShown(true);
    localStorage.setItem('urano_kyc_shown', 'true');
  };

  // Context value
  const value = {
    isConnected,
    walletAddress,
    displayAddress,
    balance,
    toggleWalletConnection,
    disconnectWallet,
    openConnectModal,
    closeConnectModal,
    showConnectModal,
    kycModalShown,
    setKycShown,
    activeAccount,
    activeWallet,
    client
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
