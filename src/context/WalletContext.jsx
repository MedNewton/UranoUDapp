import { createContext, useContext, useState, useEffect } from 'react';
import {
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
  useDisconnect,
  useReadContract,
  useSwitchActiveWalletChain,
} from "thirdweb/react";
import { client, chain } from '@/lib/thirdweb';
import { uranoToken, usdc } from '@/config/contracts';
import { formatTokenAmount } from '@/utils/format';

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

  const activeChain = useActiveWalletChain();
  const switchChain = useSwitchActiveWalletChain();

  const isCorrectNetwork = !activeAccount
    ? true
    : activeChain?.id === chain.id;

  const { data: uranoBalance } = useReadContract({
    contract: uranoToken,
    method: "balanceOf",
    params: [walletAddress],
    enabled: isConnected,
  });

  const { data: usdcBalance } = useReadContract({
    contract: usdc,
    method: "balanceOf",
    params: [walletAddress],
    enabled: isConnected,
  });

  const balance = {
    urano: formatTokenAmount(uranoBalance ?? 0n, 18),
    usdc: formatTokenAmount(usdcBalance ?? 0n, 6),
    rawUrano: uranoBalance ?? 0n,
    rawUsdc: usdcBalance ?? 0n,
  };

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
    client,
    activeChain,
    isCorrectNetwork,
    switchToRequiredChain: () => switchChain(chain),
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
