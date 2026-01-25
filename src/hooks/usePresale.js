import { prepareContractCall, readContract } from "thirdweb";
import { useReadContract, useSendTransaction } from "thirdweb/react";
import { presale, usdc } from "@/config/contracts";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function usePresale(userAddress) {
  const address = userAddress ?? ZERO_ADDRESS;
  const enabled = Boolean(userAddress);

  const { data: isKycVerified } = useReadContract({
    contract: presale,
    method: "kycVerified",
    params: [address],
    enabled,
  });

  const { data: whitelistInfo } = useReadContract({
    contract: presale,
    method: "whitelist",
    params: [address],
    enabled,
  });

  const { data: userInfo } = useReadContract({
    contract: presale,
    method: "getUserInfo",
    params: [address],
    enabled,
  });

  const { data: strategicRound } = useReadContract({
    contract: presale,
    method: "getStrategicRoundInfo",
    params: [],
  });

  const { data: seedRound } = useReadContract({
    contract: presale,
    method: "getSeedRoundInfo",
    params: [],
  });

  const { data: privateRound } = useReadContract({
    contract: presale,
    method: "getPrivateRoundInfo",
    params: [],
  });

  const { data: institutionalRound } = useReadContract({
    contract: presale,
    method: "getInstitutionalRoundInfo",
    params: [],
  });

  const { data: communityRound } = useReadContract({
    contract: presale,
    method: "getCommunityRoundInfo",
    params: [],
  });

  const { data: statistics } = useReadContract({
    contract: presale,
    method: "getStatistics",
    params: [],
  });

  const { data: tgeTime } = useReadContract({
    contract: presale,
    method: "tgeTime",
    params: [],
  });

  const { data: vestingStarted } = useReadContract({
    contract: presale,
    method: "vestingStarted",
    params: [],
  });

  const { mutateAsync: sendTx } = useSendTransaction();

  const getUserPurchases = async (round) =>
    readContract({
      contract: presale,
      method: "getUserPurchases",
      params: [address, round],
    });

  const getUserVestingInfo = async (round) =>
    readContract({
      contract: presale,
      method: "getUserVestingInfo",
      params: [address, round],
    });

  const getWhitelistClaimable = async () =>
    readContract({
      contract: presale,
      method: "getWhitelistClaimable",
      params: [address],
    });

  const calculateTokenAmount = async (round, usdcAmount) =>
    readContract({
      contract: presale,
      method: "calculateTokenAmount",
      params: [round, usdcAmount],
    });

  const calculateVestedAmount = async (totalVestedTokens, round) =>
    readContract({
      contract: presale,
      method: "calculateVestedAmount",
      params: [totalVestedTokens, round],
    });

  const institutionalAllowed = async () =>
    readContract({
      contract: presale,
      method: "institutionalAllowed",
      params: [address],
    });

  const buyTokens = async (round, usdcAmount, inviteCode = "") => {
    const approveTx = prepareContractCall({
      contract: usdc,
      method: "approve",
      params: [presale.address, usdcAmount],
    });
    await sendTx(approveTx);

    const buyTx = prepareContractCall({
      contract: presale,
      method: "buyTokens",
      params: [round, usdcAmount, inviteCode],
    });
    return sendTx(buyTx);
  };

  const claimTokens = async (round, purchaseIndex) => {
    const tx = prepareContractCall({
      contract: presale,
      method: "claimTokens",
      params: [round, purchaseIndex],
    });
    return sendTx(tx);
  };

  const claimWhitelistTokens = async () => {
    const tx = prepareContractCall({
      contract: presale,
      method: "claimWhitelistTokens",
      params: [],
    });
    return sendTx(tx);
  };

  const registerInviteCode = async (code) => {
    const tx = prepareContractCall({
      contract: presale,
      method: "registerInviteCode",
      params: [code],
    });
    return sendTx(tx);
  };

  return {
    isKycVerified,
    whitelistInfo,
    userInfo,
    rounds: {
      strategic: strategicRound,
      seed: seedRound,
      private: privateRound,
      institutional: institutionalRound,
      community: communityRound,
    },
    statistics,
    tgeTime,
    vestingStarted,
    getUserPurchases,
    getUserVestingInfo,
    getWhitelistClaimable,
    calculateTokenAmount,
    calculateVestedAmount,
    institutionalAllowed,
    buyTokens,
    claimTokens,
    claimWhitelistTokens,
    registerInviteCode,
  };
}
