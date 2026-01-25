import { prepareContractCall, readContract } from "thirdweb";
import { useReadContract, useSendTransaction } from "thirdweb/react";
import { vesting } from "@/config/contracts";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function useVesting(userAddress) {
  const address = userAddress ?? ZERO_ADDRESS;
  const enabled = Boolean(userAddress);

  const { data: tgeTimestamp } = useReadContract({
    contract: vesting,
    method: "tgeTimestamp",
    params: [],
  });

  const { data: merkleRoot } = useReadContract({
    contract: vesting,
    method: "merkleRoot",
    params: [],
  });

  const { data: totalClaimed } = useReadContract({
    contract: vesting,
    method: "totalClaimed",
    params: [address],
    enabled,
  });

  const { mutateAsync: sendTx } = useSendTransaction();

  const claimable = async (data, merkleProof) =>
    readContract({
      contract: vesting,
      method: "claimable",
      params: [data, merkleProof],
    });

  const claim = async (data, merkleProof) => {
    const tx = prepareContractCall({
      contract: vesting,
      method: "claim",
      params: [data, merkleProof],
    });
    return sendTx(tx);
  };

  return {
    tgeTimestamp,
    merkleRoot,
    totalClaimed,
    claimable,
    claim,
  };
}
