import { useCallback } from "react";
import { prepareContractCall, readContract } from "thirdweb";
import { useReadContract, useSendTransaction } from "thirdweb/react";
import { governance, staking } from "@/config/contracts";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function useGovernance(userAddress) {
  const address = userAddress ?? ZERO_ADDRESS;
  const enabled = Boolean(userAddress);

  const { data: proposalCount } = useReadContract({
    contract: governance,
    method: "proposalCount",
    params: [],
  });

  const { data: votingPower } = useReadContract({
    contract: staking,
    method: "amountStaked",
    params: [address],
    enabled,
  });

  const { mutateAsync: sendTx } = useSendTransaction();

  const getProposal = useCallback(
    (id) =>
      readContract({
        contract: governance,
        method: "getProposal",
        params: [id],
      }),
    []
  );

  const getAllProposals = useCallback(async () => {
    if (!proposalCount) return [];
    const proposals = [];
    for (let i = 1n; i <= proposalCount; i++) {
      const proposal = await getProposal(i);
      proposals.push(proposal);
    }
    return proposals;
  }, [getProposal, proposalCount]);

  const proposalResult = useCallback(
    (id) =>
      readContract({
        contract: governance,
        method: "proposalResult",
        params: [id],
      }),
    []
  );

  const vote = useCallback(
    (proposalId, support) => {
      const tx = prepareContractCall({
        contract: governance,
        method: "vote",
        params: [proposalId, support],
      });
      return sendTx(tx);
    },
    [sendTx]
  );

  const finalize = useCallback(
    (proposalId) => {
      const tx = prepareContractCall({
        contract: governance,
        method: "finalize",
        params: [proposalId],
      });
      return sendTx(tx);
    },
    [sendTx]
  );

  const propose = useCallback(
    (proposalType, description) => {
      const tx = prepareContractCall({
        contract: governance,
        method: "propose",
        params: [proposalType, description],
      });
      return sendTx(tx);
    },
    [sendTx]
  );

  return {
    proposalCount,
    votingPower,
    getProposal,
    getAllProposals,
    proposalResult,
    vote,
    finalize,
    propose,
  };
}
