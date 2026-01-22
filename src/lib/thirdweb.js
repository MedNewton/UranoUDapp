import { createThirdwebClient } from "thirdweb";
import { arbitrumSepolia } from "thirdweb/chains";

// Create the thirdweb client
export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
});

// Define the chain (Arbitrum Sepolia)
export const chain = arbitrumSepolia;

// Supported wallets configuration
export const wallets = [
  "io.metamask",
  "com.coinbase.wallet",
  "me.rainbow",
  "io.rabby",
  "com.trustwallet.app",
];
