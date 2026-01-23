import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import DashboardBox from '@/components/ui/DashboardBox';

const GovernanceDetail = () => {
  const { proposalId } = useParams();
  const { isDark } = useTheme();
  const textColor = isDark ? 'text-gray-200' : 'text-gray-900';
  const subTextColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const [userVote, setUserVote] = useState(null);
  const [voteAmount, setVoteAmount] = useState('');
  const [showVoteModal, setShowVoteModal] = useState(false);

  // Dati del proposal (in un'app reale, questi dati verrebbero caricati in base al proposalId)
  const proposal = {
    id: proposalId,
    title: 'UIP-128: Miglioramento del protocollo di staking',
    status: 'Active',
    description: 'Questa proposta mira a migliorare il protocollo di staking di Urano introducendo nuovi meccanismi di ricompensa e nuove funzionalità per gli staker. L\'obiettivo è aumentare l\'adozione e la partecipazione alla governance del protocollo.',
    author: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    createdAt: '2025-04-15',
    votingEnds: '2025-05-30',
    details: [
      {
        title: 'Motivazione',
        content: 'Il protocollo di staking attuale ha alcune limitazioni che potrebbero essere migliorate per incentivare una maggiore partecipazione. Questa proposta introduce modifiche che rendono lo staking più accessibile e vantaggioso.'
      },
      {
        title: 'Specifiche',
        content: 'Le modifiche proposte includono:\n\n1. Riduzione del periodo minimo di staking da 14 a 7 giorni\n2. Introduzione di ricompense bonus per gli staker a lungo termine\n3. Implementazione di un sistema di vesting graduale per le ricompense\n4. Aggiunta di un livello di governance privilegiato per gli staker di lunga data'
      },
      {
        title: 'Attuazione',
        content: 'L\'implementazione avverrà in tre fasi:\n\n**Fase 1**: Aggiornamento dei contratti smart per supportare i nuovi parametri di staking\n**Fase 2**: Migrazione degli staker esistenti al nuovo sistema\n**Fase 3**: Lancio delle nuove funzionalità di governance'
      },
      {
        title: 'Requisiti tecnici',
        content: 'Sarà necessario eseguire un audit completo dei nuovi contratti smart prima dell\'implementazione. Il team di sviluppo ha già iniziato a lavorare sul codice necessario e prevede di completare lo sviluppo entro 4 settimane.'
      },
    ],
    votingStats: {
      quorum: 60,
      currentParticipation: 47,
      forVotes: 76,
      againstVotes: 24,
      requiredForApproval: 66,
    },
    voterInfo: {
      totalVoters: 142,
      topVoters: [
        { address: '0xabc...123', power: '120,000 URANO', vote: 'For' },
        { address: '0xdef...456', power: '95,000 URANO', vote: 'For' },
        { address: '0xghi...789', power: '82,500 URANO', vote: 'Against' },
      ]
    }
  };

  const handleVote = (voteType) => {
    setUserVote(voteType);
    setShowVoteModal(true);
  };

  const handleConfirmVote = () => {
    // Qui implementeremmo la logica per inviare il voto alla blockchain
    console.log(`Voting ${userVote} with ${voteAmount} URANO tokens`);
    setShowVoteModal(false);
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
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
            proposal.status === 'Active'
              ? 'bg-[#14EFC0]/20 text-[#14EFC0] border border-[#14EFC0]/30'
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}>
            {proposal.status}
          </div>
          <h1 className={`text-2xl md:text-3xl font-conthrax ${textColor} mb-3`}>{proposal.title}</h1>
          <p className={`${subTextColor} mb-6 text-sm md:text-base leading-relaxed`}>{proposal.description}</p>

          <div className={`flex flex-wrap gap-4 md:gap-6 text-sm p-4 rounded-lg ${isDark ? 'bg-[#1a1a2e]/50' : 'bg-gray-100'}`}>
            <div>
              <p className={`text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-1`}>Author</p>
              <p className={`${textColor} font-mono text-sm`}>{proposal.author.slice(0, 10)}...{proposal.author.slice(-4)}</p>
            </div>
            <div>
              <p className={`text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-1`}>Created</p>
              <p className={`${textColor} text-sm`}>{proposal.createdAt}</p>
            </div>
            <div>
              <p className={`text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-1`}>Voting Ends</p>
              <p className={`${textColor} text-sm`}>{proposal.votingEnds}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonna principale - Dettagli proposta */}
          <div className="lg:col-span-2 space-y-6">
            <DashboardBox variant="card" className="p-6">
              <h2 className={`text-lg font-conthrax uppercase tracking-wider ${subTextColor} mb-6`}>Proposal Details</h2>

              {proposal.details.map((detail, index) => (
                <div key={index} className={`mb-6 last:mb-0 pb-6 last:pb-0 ${index < proposal.details.length - 1 ? `border-b ${isDark ? 'border-[#1a1a2e]' : 'border-gray-200'}` : ''}`}>
                  <h3 className={`text-base font-conthrax ${textColor} mb-3`}>{detail.title}</h3>
                  <div className={`${subTextColor} whitespace-pre-line text-sm leading-relaxed`} dangerouslySetInnerHTML={{ __html: detail.content }} />
                </div>
              ))}
            </DashboardBox>

            <DashboardBox variant="card" className="p-6">
              <h2 className={`text-lg font-conthrax uppercase tracking-wider ${subTextColor} mb-6`}>Recent Votes</h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${isDark ? 'border-[#1a1a2e]' : 'border-gray-200'}`}>
                      <th className={`text-left py-3 px-4 text-xs font-conthrax uppercase tracking-wider ${subTextColor}`}>Voter</th>
                      <th className={`text-left py-3 px-4 text-xs font-conthrax uppercase tracking-wider ${subTextColor}`}>Voting Power</th>
                      <th className={`text-left py-3 px-4 text-xs font-conthrax uppercase tracking-wider ${subTextColor}`}>Vote</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-[#1a1a2e]' : 'divide-gray-200'}`}>
                    {proposal.voterInfo.topVoters.map((voter, index) => (
                      <tr key={index}>
                        <td className={`py-3 px-4 ${textColor} font-mono text-sm`}>{voter.address}</td>
                        <td className={`py-3 px-4 ${textColor} text-sm`}>{voter.power}</td>
                        <td className={`py-3 px-4 text-sm ${voter.vote === 'For' ? 'text-[#14EFC0]' : 'text-red-400'}`}>{voter.vote}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-center">
                <button className={`text-sm transition-colors ${isDark ? 'text-[#14EFC0] hover:text-[#12d4ad]' : 'text-teal-600 hover:text-teal-700'}`}>
                  View all {proposal.voterInfo.totalVoters} votes
                </button>
              </div>
            </DashboardBox>
          </div>

          {/* Colonna laterale - Statistiche e azioni */}
          <div className="space-y-6">
            {/* Box statistiche di voto */}
            <DashboardBox variant="card" className="p-6">
              <h2 className={`text-lg font-conthrax uppercase tracking-wider ${subTextColor} mb-6`}>Voting Statistics</h2>

              {/* Barra di progresso partecipazione */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className={`text-xs font-conthrax uppercase tracking-wider ${subTextColor}`}>Quorum</span>
                  <span className={`text-sm ${textColor}`}>{proposal.votingStats.currentParticipation}% / {proposal.votingStats.quorum}%</span>
                </div>
                <div className={`w-full rounded-full h-2 ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-200'}`}>
                  <div className="bg-[#14EFC0] h-2 rounded-full transition-all" style={{ width: `${(proposal.votingStats.currentParticipation / proposal.votingStats.quorum) * 100}%` }}></div>
                </div>
              </div>

              {/* Barra di progresso voti */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className={`text-xs font-conthrax uppercase tracking-wider ${subTextColor}`}>Votes</span>
                  <span className={`text-sm ${textColor}`}>
                    <span className="text-[#14EFC0]">{proposal.votingStats.forVotes}%</span> For - <span className="text-red-400">{proposal.votingStats.againstVotes}%</span> Against
                  </span>
                </div>
                <div className={`w-full rounded-full h-2 flex overflow-hidden ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-200'}`}>
                  <div className="bg-[#14EFC0] h-2 transition-all" style={{ width: `${proposal.votingStats.forVotes}%` }}></div>
                  <div className="bg-red-400 h-2 transition-all" style={{ width: `${proposal.votingStats.againstVotes}%` }}></div>
                </div>
              </div>

              {/* Barra threshold approvazione */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className={`text-xs font-conthrax uppercase tracking-wider ${subTextColor}`}>Approval Threshold</span>
                  <span className={`text-sm ${textColor}`}>{proposal.votingStats.forVotes}% / {proposal.votingStats.requiredForApproval}%</span>
                </div>
                <div className={`w-full rounded-full h-2 relative ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-200'}`}>
                  <div className="bg-[#14EFC0] h-2 rounded-full transition-all" style={{ width: `${proposal.votingStats.forVotes}%` }}></div>
                  <div className="absolute top-0 h-full w-0.5 bg-amber-400" style={{ left: `${proposal.votingStats.requiredForApproval}%` }}></div>
                </div>
              </div>
            </DashboardBox>

            {/* Box azioni di voto */}
            <DashboardBox variant="card" className="p-6">
              <h2 className={`text-lg font-conthrax uppercase tracking-wider ${subTextColor} mb-6`}>Cast Your Vote</h2>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => handleVote('for')}
                  className={`py-3 px-4 rounded-lg font-conthrax text-sm transition-colors ${
                    isDark
                      ? 'bg-[#14EFC0]/20 text-[#14EFC0] border border-[#14EFC0]/30 hover:bg-[#14EFC0]/30'
                      : 'bg-teal-100 text-teal-700 border border-teal-300 hover:bg-teal-200'
                  }`}
                >
                  Vote For
                </button>
                <button
                  onClick={() => handleVote('against')}
                  className={`py-3 px-4 rounded-lg font-conthrax text-sm transition-colors ${
                    isDark
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
              Enter the amount of URANO tokens you want to use for voting.
            </p>
            <div className="mb-6">
              <label className={`block text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-2`}>Amount</label>
              <div className="flex">
                <input
                  type="text"
                  value={voteAmount}
                  onChange={(e) => setVoteAmount(e.target.value)}
                  className={`flex-1 rounded-l-lg px-4 py-3 focus:outline-none transition-all ${
                    isDark
                      ? 'bg-[#1a1a2e]/50 border border-[#2a2a4e] text-gray-200 placeholder-gray-500 focus:border-[#14EFC0]/60'
                      : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-teal-500'
                  }`}
                  placeholder="0.00"
                />
                <div className={`px-4 py-3 rounded-r-lg border border-l-0 flex items-center ${
                  isDark
                    ? 'bg-[#1a1a2e] border-[#2a2a4e]'
                    : 'bg-gray-100 border-gray-300'
                }`}>
                  <span className={`font-conthrax text-sm ${textColor}`}>URANO</span>
                </div>
              </div>
            </div>
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
                disabled={!voteAmount || isNaN(parseFloat(voteAmount)) || parseFloat(voteAmount) <= 0}
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
