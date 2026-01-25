import { createThirdwebClient } from "thirdweb";
import { sepolia } from "thirdweb/chains";

// Create the thirdweb client
export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
});

// Define the chain (Ethereum Sepolia)
export const chain = sepolia;

// Supported wallets configuration
export const wallets = [
  "io.metamask",
  "com.coinbase.wallet",
  "me.rainbow",
  "io.rabby",
  "com.trustwallet.app",
];
