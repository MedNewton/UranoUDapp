export const CONTRACT_ERRORS = {
  // ERC20
  ERC20InsufficientBalance: "Insufficient token balance",
  ERC20InsufficientAllowance: "Insufficient token allowance",
  "insufficient balance": "Insufficient token balance",

  // Staking
  Staking__ZeroAmount: "Amount must be greater than zero",
  Staking__ZeroRewardPerSecond: "Staking rewards are not configured yet",
  Staking__NoRewards: "No rewards available to claim",
  Staking__InsufficientStakedAmount: "Insufficient staked balance",
  Staking__MinimunDurationNotPassed: "You must wait 7 days before withdrawing",

  // Presale
  "KYC not verified": "Please complete KYC verification first",
  "Round not active": "This presale round is not currently active",
  "Round not started": "This round has not started yet",
  "Round ended": "This presale round has ended",
  "Amount below minimum": "Amount is below the minimum purchase",
  "Round cap exceeded": "This round has reached its cap",
  "Not authorized for institutional round": "Institutional access required",
  "Vesting not started": "Token vesting has not started yet",
  "TGE time not reached": "TGE has not occurred yet",
  "No tokens available to claim": "No tokens available to claim",
  "Not whitelisted": "You are not on the whitelist",
  "Code already registered": "This invite code is already taken",
  "Already registered a code": "You already have an invite code",

  // uShare Market
  uShareMarket__uShareNotActive: "This uShare sale is not active",
  uShareMarket__InvalidAmountInStaking:
    "You need more staked URANO for pre-sale access",
  uShareMarket__uSharePublicSaleNotStarted:
    "Public sale has not started yet (pre-sale in progress)",
  uShareMarket__TooSmalluShareAmount: "Amount is below minimum purchase",
  uShareMarket__InsufficientuShareAmount: "Not enough uShares available",
  uShareMarket__RedistributionNotActive:
    "Redistribution phase has not started",
  uShareMarket__CashflowStillActive:
    "Cannot redistribute while cashflow is active",
  uStaking__NoRewards: "No cashflow rewards available to claim",

  // Governance
  UranoGovernance__VotingNotStarted: "Voting has not started yet",
  UranoGovernance__VotingEnded: "Voting period has ended",
  UranoGovernance__AlreadyVoted: "You have already voted on this proposal",
  UranoGovernance__NoVotingPower: "You need staked URANO to vote",

  // Generic
  "user rejected": "Transaction was rejected by user",
  "user denied": "Transaction was rejected by user",
  ACTION_REJECTED: "Transaction was rejected by user",
  "rejected by user": "Transaction was rejected by user",
  "insufficient funds": "Insufficient funds for transaction",
  "execution reverted": "Transaction reverted by contract",
  "Internal JSON-RPC error": "RPC error. Please try again.",
};

export function getErrorMessage(error) {
  const errorString = [
    error?.shortMessage,
    error?.message,
    String(error),
  ]
    .filter(Boolean)
    .join(" | ");

  const lower = errorString.toLowerCase();

  for (const [key, message] of Object.entries(CONTRACT_ERRORS)) {
    if (lower.includes(String(key).toLowerCase())) {
      return message;
    }
  }

  return "An unexpected error occurred. Please try again.";
}
