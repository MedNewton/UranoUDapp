export function calculateVestedAmount(
  totalAmount,
  tgePercentage,
  cliffSeconds,
  vestingSeconds,
  tgeTimestamp,
  currentTimestamp
) {
  if (!totalAmount) return 0n;
  if (!tgeTimestamp || !currentTimestamp) return 0n;

  if (currentTimestamp < tgeTimestamp) {
    return 0n;
  }

  const timeSinceTGE = currentTimestamp - tgeTimestamp;
  const tgeAmount = (totalAmount * tgePercentage) / 10000n;
  const remainingAmount = totalAmount - tgeAmount;

  if (timeSinceTGE < cliffSeconds) {
    return tgeAmount;
  }

  const timeAfterCliff = timeSinceTGE - cliffSeconds;

  if (timeAfterCliff >= vestingSeconds) {
    return totalAmount;
  }

  const vestedFromLinear = (remainingAmount * timeAfterCliff) / vestingSeconds;
  return tgeAmount + vestedFromLinear;
}

export function calculateAPR(rewardPerSecond, totalStaked) {
  if (!rewardPerSecond || !totalStaked || totalStaked === 0n) return 0;
  const yearlyRewards = rewardPerSecond * BigInt(365 * 24 * 60 * 60);
  return Number((yearlyRewards * 10000n) / totalStaked) / 100;
}
