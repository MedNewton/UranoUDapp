import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import DashboardBox from '@/components/ui/DashboardBox';
import { useGovernance } from '@/hooks/useGovernance';
import { useToast } from '@/context/ToastContext';
import { useWallet } from '@/context/WalletContext';
import { formatDate, formatTokenAmount } from '@/utils/format';
import { handleTransaction } from '@/utils/transactions';

const GovernanceDetail = () => {
  const { proposalId } = useParams();
  const { isDark } = useTheme();
  const textColor = isDark ? 'text-gray-200' : 'text-gray-900';
  const subTextColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const [userVote, setUserVote] = useState(null);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const { addToast } = useToast();
  const { isConnected, isCorrectNetwork } = useWallet();
  const { getProposal, vote, finalize, votingPower } = useGovernance();
  const [proposal, setProposal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const proposalIdValue = useMemo(() => {
    try {
      return BigInt(proposalId);
    } catch {
      return null;
    }
  }, [proposalId]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!proposalIdValue) return;
      setIsLoading(true);
      try {
        const data = await getProposal(proposalIdValue);
        if (isMounted) setProposal(data);
      } catch {
        if (isMounted) setProposal(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [getProposal, proposalIdValue]);

  const now = Date.now() / 1000;
  const startTime = Number(proposal?.startTime ?? 0n);
  const endTime = Number(proposal?.endTime ?? 0n);
  const status = (() => {
    if (!proposal) return 'Pending';
    if (now < startTime) return 'Pending';
    if (now <= endTime) return 'Active';
    if (Number(proposal.result ?? 0) === 1) return 'Passed';
    if (Number(proposal.result ?? 0) === 2) return 'Rejected';
    return 'Ended';
  })();

  const votesFor = proposal?.votesFor ?? 0n;
  const votesAgainst = proposal?.votesAgainst ?? 0n;
  const votesTotal = votesFor + votesAgainst;
  const votesForPct = votesTotal === 0n ? 0 : Number((votesFor * 10000n) / votesTotal) / 100;
  const votesAgainstPct = Math.max(0, 100 - votesForPct);
  const canVote = status === 'Active' && isConnected && isCorrectNetwork;
  const canFinalize = proposal && status !== 'Active' && !proposal.finalized && now > endTime;

  const handleVote = (voteType) => {
    setUserVote(voteType);
    setShowVoteModal(true);
  };

  const handleConfirmVote = async () => {
    if (!proposalIdValue || !userVote) return;
    await handleTransaction(vote(proposalIdValue, userVote === 'for'), () => {
      addToast({
        type: 'success',
        title: 'Vote submitted',
        message: `Vote ${userVote === 'for' ? 'for' : 'against'} proposal #${proposalId}`,
      });
      setShowVoteModal(false);
    }, (error) => {
      addToast({ type: 'error', title: 'Vote failed', message: error.message });
    });
  };

  const handleFinalize = async () => {
    if (!proposalIdValue) return;
    await handleTransaction(finalize(proposalIdValue), () => {
      addToast({
        type: 'success',
        title: 'Proposal finalized',
        message: `Finalized proposal #${proposalId}`,
      });
    }, (error) => {
      addToast({ type: 'error', title: 'Finalize failed', message: error.message });
    });
  };

  return (
    <main className="pt-24 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/governance" className={`${subTextColor} hover:text-[#14EFC0] transition-colors flex items-center gap-2`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Governance
          </Link>
        </div>

        {/* Intestazione proposta */}
        <div className="mb-8">
          {isLoading && (
            <DashboardBox variant="card" className="p-6">
              <p className={`${subTextColor} text-sm`}>Loading proposal...</p>
            </DashboardBox>
          )}
          {!isLoading && !proposal && (
            <DashboardBox variant="card" className="p-6">
              <p className="text-sm text-red-400">Proposal not found.</p>
            </DashboardBox>
          )}
          {proposal && (
            <>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                status === 'Active'
                  ? 'bg-[#14EFC0]/20 text-[#14EFC0] border border-[#14EFC0]/30'
                  : status === 'Passed'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : status === 'Rejected'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {status}
              </div>
              <h1 className={`text-2xl md:text-3xl font-conthrax ${textColor} mb-3`}>Proposal #{proposal.id}</h1>
              <p className={`${subTextColor} mb-6 text-sm md:text-base leading-relaxed`}>{proposal.description}</p>

              <div className={`flex flex-wrap gap-4 md:gap-6 text-sm p-4 rounded-lg ${isDark ? 'bg-[#1a1a2e]/50' : 'bg-gray-100'}`}>
                <div>
                  <p className={`text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-1`}>Type</p>
                  <p className={`${textColor} text-sm`}>{proposal.proposalType === 1 ? 'Long' : 'Short'}</p>
                </div>
                <div>
                  <p className={`text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-1`}>Created</p>
                  <p className={`${textColor} text-sm`}>{formatDate(proposal.startTime)}</p>
                </div>
                <div>
                  <p className={`text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-1`}>Voting Ends</p>
                  <p className={`${textColor} text-sm`}>{formatDate(proposal.endTime)}</p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonna principale - Dettagli proposta */}
          <div className="lg:col-span-2 space-y-6">
            <DashboardBox variant="card" className="p-6">
              <h2 className={`text-lg font-conthrax uppercase tracking-wider ${subTextColor} mb-6`}>Proposal Details</h2>

              {proposal ? (
                <div className={`${subTextColor} whitespace-pre-line text-sm leading-relaxed`}>
                  {proposal.description}
                </div>
              ) : (
                <p className={`${subTextColor} text-sm`}>No proposal details available.</p>
              )}
            </DashboardBox>

            <DashboardBox variant="card" className="p-6">
              <h2 className={`text-lg font-conthrax uppercase tracking-wider ${subTextColor} mb-6`}>Recent Votes</h2>

              <p className={`${subTextColor} text-sm`}>
                On-chain vote history is not indexed in this UI yet.
              </p>
            </DashboardBox>
          </div>

          {/* Colonna laterale - Statistiche e azioni */}
          <div className="space-y-6">
            {/* Box statistiche di voto */}
            <DashboardBox variant="card" className="p-6">
              <h2 className={`text-lg font-conthrax uppercase tracking-wider ${subTextColor} mb-6`}>Voting Statistics</h2>

              {/* Barra di progresso voti */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className={`text-xs font-conthrax uppercase tracking-wider ${subTextColor}`}>Votes</span>
                  <span className={`text-sm ${textColor}`}>
                    <span className="text-[#14EFC0]">{votesForPct}%</span> For - <span className="text-red-400">{votesAgainstPct}%</span> Against
                  </span>
                </div>
                <div className={`w-full rounded-full h-2 flex overflow-hidden ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-200'}`}>
                  <div className="bg-[#14EFC0] h-2 transition-all" style={{ width: `${votesForPct}%` }}></div>
                  <div className="bg-red-400 h-2 transition-all" style={{ width: `${votesAgainstPct}%` }}></div>
                </div>
              </div>

              {proposal && (
                <div className="text-xs text-gray-400">
                  Votes For: {formatTokenAmount(votesFor, 18, 2)} URANO
                  <span className="mx-2">|</span>
                  Votes Against: {formatTokenAmount(votesAgainst, 18, 2)} URANO
                </div>
              )}
            </DashboardBox>

            {/* Box azioni di voto */}
            <DashboardBox variant="card" className="p-6">
              <h2 className={`text-lg font-conthrax uppercase tracking-wider ${subTextColor} mb-6`}>Cast Your Vote</h2>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => handleVote('for')}
                  disabled={!canVote}
                  className={`py-3 px-4 rounded-lg font-conthrax text-sm transition-colors ${
                    !canVote
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : isDark
                        ? 'bg-[#14EFC0]/20 text-[#14EFC0] border border-[#14EFC0]/30 hover:bg-[#14EFC0]/30'
                        : 'bg-teal-100 text-teal-700 border border-teal-300 hover:bg-teal-200'
                  }`}
                >
                  Vote For
                </button>
                <button
                  onClick={() => handleVote('against')}
                  disabled={!canVote}
                  className={`py-3 px-4 rounded-lg font-conthrax text-sm transition-colors ${
                    !canVote
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : isDark
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                        : 'bg-red-100 text-red-700 border border-red-300 hover:bg-red-200'
                  }`}
                >
                  Vote Against
                </button>
              </div>

              <p className={`text-sm ${subTextColor} leading-relaxed`}>
                Your voting power is determined by the amount of URANO tokens you have staked. The more tokens you stake, the more voting power you have.
              </p>
              <p className={`text-xs ${subTextColor} mt-4`}>
                Voting power: {formatTokenAmount(votingPower ?? 0n, 18, 2)} URANO
              </p>
              {canFinalize && (
                <button
                  onClick={handleFinalize}
                  className="mt-6 w-full py-3 rounded-lg font-conthrax text-sm bg-amber-500 text-black hover:bg-amber-400 transition-colors"
                >
                  Finalize Proposal
                </button>
              )}
            </DashboardBox>
          </div>
        </div>
      </div>
      
      {/* Modal per il voto */}
      {showVoteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <DashboardBox variant="card" className="max-w-lg w-full p-6">
            <h3 className={`text-lg font-conthrax uppercase tracking-wider ${subTextColor} mb-4`}>
              Vote {userVote === 'for' ? 'For' : 'Against'} Proposal
            </h3>
            <p className={`${subTextColor} mb-6 text-sm`}>
              Your vote will use your full staking voting power.
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setShowVoteModal(false)}
                className={`px-5 py-2.5 rounded-lg font-conthrax text-sm transition-colors ${
                  isDark
                    ? 'border border-[#2a2a4e] text-gray-300 hover:border-[#3a3a5e]'
                    : 'border border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmVote}
                className={`px-5 py-2.5 rounded-lg font-conthrax text-sm transition-colors ${
                  userVote === 'for'
                    ? 'bg-[#14EFC0] text-black hover:bg-[#12d4ad]'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
                disabled={!canVote}
              >
                Confirm Vote
              </button>
            </div>
          </DashboardBox>
        </div>
      )}
    </main>
  );
};

export default GovernanceDetail;
