import { prepareContractCall } from "thirdweb";
import { useReadContract, useSendTransaction } from "thirdweb/react";
import { staking, uranoToken } from "@/config/contracts";
import { useEffect, useState } from "react";

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

  const { data: lastRewardTimestamp } = useReadContract({
    contract: staking,
    method: "s_lastRewardTimestamp",
    params: [],
  });

  const { data: totalReward } = useReadContract({
    contract: staking,
    method: "s_totalReward",
    params: [],
  });

  const { data: accumulatedRewardPerUnit } = useReadContract({
    contract: staking,
    method: "s_accumulatedRewardPerUnitStaked",
    params: [],
  });

  const { data: decimalPrecision } = useReadContract({
    contract: staking,
    method: "DECIMAL_PRECISION",
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
  const [nowSeconds, setNowSeconds] = useState(() => Math.floor(Date.now() / 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      setNowSeconds(Math.floor(Date.now() / 1000));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const canWithdraw = stakingTimestamp
    ? nowSeconds - stakingTimestamp >= minDuration
    : false;
  const timeUntilWithdraw = stakingTimestamp
    ? Math.max(0, stakingTimestamp + minDuration - nowSeconds)
    : 0;

  const pendingRewards = (() => {
    if (!userInfo || !decimalPrecision || decimalPrecision === 0n) return 0n;
    const staked = userInfo.stakedAmount ?? 0n;
    const debt = userInfo.rewardDebt ?? 0n;
    const earned = userInfo.rewardEarned ?? 0n;
    if (staked === 0n) return earned;

    let liveAccumulated = accumulatedRewardPerUnit ?? 0n;
    const total = totalStaked ?? 0n;
    const rate = rewardPerSecond ?? 0n;
    const last = lastRewardTimestamp ?? 0n;
    const now = BigInt(nowSeconds);

    if (total > 0n && rate > 0n && now > last) {
      const delta = now - last;
      const additional = (delta * rate * decimalPrecision) / total;
      liveAccumulated += additional;
    }

    const deltaAccumulated = liveAccumulated > debt ? liveAccumulated - debt : 0n;
    const accrued = (staked * deltaAccumulated) / decimalPrecision;
    return earned + accrued;
  })();

  return {
    userInfo,
    stakedAmount,
    totalStaked,
    rewardPerSecond,
    totalReward,
    pendingRewards,
    minimumDuration,
    canWithdraw,
    timeUntilWithdraw,
    stake,
    withdraw,
    claimRewards,
  };
}
