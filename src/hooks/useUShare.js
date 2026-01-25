import { useCallback } from "react";
import { prepareContractCall, readContract } from "thirdweb";
import { useReadContract, useSendTransaction } from "thirdweb/react";
import { staking, uShareMarket, usdc } from "@/config/contracts";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function useUShare(userAddress) {
  const address = userAddress ?? ZERO_ADDRESS;
  const enabled = Boolean(userAddress);

  const { data: preSaleDuration } = useReadContract({
    contract: uShareMarket,
    method: "PRE_SALE_DURATION",
    params: [],
  });

  const { data: stakedAmount } = useReadContract({
    contract: staking,
    method: "amountStaked",
    params: [address],
    enabled,
  });

  const { mutateAsync: sendTx } = useSendTransaction();

  const getUShareInfo = useCallback(
    (uShareId) =>
      readContract({
        contract: uShareMarket,
        method: "getuShareInfo",
        params: [uShareId],
      }),
    []
  );

  const approveUsdc = async (amount) => {
    const approveTx = prepareContractCall({
      contract: usdc,
      method: "approve",
      params: [uShareMarket.address, amount],
    });
    return sendTx(approveTx);
  };

  const buyOnPreSale = async (uShareId, amount, price) => {
    const totalCost = (amount * price) / 1000000000000000000n;
    await approveUsdc(totalCost);

    const buyTx = prepareContractCall({
      contract: uShareMarket,
      method: "buyuShareOnPreSale",
      params: [uShareId, amount],
    });
    return sendTx(buyTx);
  };

  const buyPublic = async (uShareId, amount, price) => {
    const totalCost = (amount * price) / 1000000000000000000n;
    await approveUsdc(totalCost);

    const buyTx = prepareContractCall({
      contract: uShareMarket,
      method: "buyuShare",
      params: [uShareId, amount],
    });
    return sendTx(buyTx);
  };

  const claimRedistribution = async (uShareId, amount) => {
    const tx = prepareContractCall({
      contract: uShareMarket,
      method: "claimRedistribution",
      params: [uShareId, amount],
    });
    return sendTx(tx);
  };

  const checkPreSaleEligibility = (minRequired) =>
    stakedAmount ? stakedAmount >= minRequired : false;

  return {
    preSaleDuration,
    stakedAmount,
    getUShareInfo,
    buyOnPreSale,
    buyPublic,
    claimRedistribution,
    checkPreSaleEligibility,
  };
}
