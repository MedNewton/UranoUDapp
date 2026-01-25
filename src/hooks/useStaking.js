import { prepareContractCall } from "thirdweb";
import { useReadContract, useSendTransaction } from "thirdweb/react";
import { staking, uranoToken } from "@/config/contracts";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function useStaking(userAddress) {
  const address = userAddress ?? ZERO_ADDRESS;
  const enabled = Boolean(userAddress);

  const { data: userInfo, refetch: refetchUserInfo } = useReadContract({
    contract: staking,
    method: "userInfo",
    params: [address],
    enabled,
  });

  const { data: stakedAmount } = useReadContract({
    contract: staking,
    method: "amountStaked",
    params: [address],
    enabled,
  });

  const { data: totalStaked } = useReadContract({
    contract: staking,
    method: "s_totalStaked",
    params: [],
  });

  const { data: rewardPerSecond } = useReadContract({
    contract: staking,
    method: "s_rewardPerSecond",
    params: [],
  });

  const { data: totalReward } = useReadContract({
    contract: staking,
    method: "s_totalReward",
    params: [],
  });

  const { data: minimumDuration } = useReadContract({
    contract: staking,
    method: "MINIMUM_DURATION",
    params: [],
  });

  const { mutateAsync: sendTx } = useSendTransaction();

  const stake = async (amount) => {
    const approveTx = prepareContractCall({
      contract: uranoToken,
      method: "approve",
      params: [staking.address, amount],
    });
    await sendTx(approveTx);

    const stakeTx = prepareContractCall({
      contract: staking,
      method: "stake",
      params: [amount],
    });
    const result = await sendTx(stakeTx);
    if (refetchUserInfo) await refetchUserInfo();
    return result;
  };

  const withdraw = async (amount) => {
    const tx = prepareContractCall({
      contract: staking,
      method: "withdraw",
      params: [amount],
    });
    const result = await sendTx(tx);
    if (refetchUserInfo) await refetchUserInfo();
    return result;
  };

  const claimRewards = async () => {
    const tx = prepareContractCall({
      contract: staking,
      method: "claimRewards",
      params: [],
    });
    const result = await sendTx(tx);
    if (refetchUserInfo) await refetchUserInfo();
    return result;
  };

  const stakingTimestamp = userInfo?.stakingTimestamp
    ? Number(userInfo.stakingTimestamp)
    : 0;
  const minDuration = minimumDuration ? Number(minimumDuration) : 0;
  const now = Date.now() / 1000;

  const canWithdraw = stakingTimestamp
    ? now - stakingTimestamp >= minDuration
    : false;
  const timeUntilWithdraw = stakingTimestamp
    ? Math.max(0, stakingTimestamp + minDuration - now)
    : 0;

  return {
    userInfo,
    stakedAmount,
    totalStaked,
    rewardPerSecond,
    totalReward,
    minimumDuration,
    canWithdraw,
    timeUntilWithdraw,
    stake,
    withdraw,
    claimRewards,
  };
}
