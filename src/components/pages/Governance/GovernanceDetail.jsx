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
          <Link to="/governance" className={`${subTextColor} hover:underline flex items-center gap-2`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Proposals
          </Link>
        </div>

        {/* Intestazione proposta */}
        <div className="mb-8">
          <div className={`inline-block px-3 py-1 rounded-full text-sm ${proposal.status === 'Active' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'} mb-4`}>
            {proposal.status}
          </div>
          <h1 className={`text-3xl font-conthrax ${textColor} mb-2`}>{proposal.title}</h1>
          <p className={`${subTextColor} mb-6`}>{proposal.description}</p>
          
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <span className={subTextColor}>Author:</span>
              <span className={`${textColor} ml-2`}>{proposal.author}</span>
            </div>
            <div>
              <span className={subTextColor}>Created:</span>
              <span className={`${textColor} ml-2`}>{proposal.createdAt}</span>
            </div>
            <div>
              <span className={subTextColor}>Voting Ends:</span>
              <span className={`${textColor} ml-2`}>{proposal.votingEnds}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonna principale - Dettagli proposta */}
          <div className="lg:col-span-2">
            <DashboardBox className="mb-8">
              <div className="p-6">
                <h2 className={`text-xl font-conthrax ${textColor} mb-6`}>Proposal Details</h2>
                
                {proposal.details.map((detail, index) => (
                  <div key={index} className="mb-6 last:mb-0">
                    <h3 className={`text-lg font-conthrax ${textColor} mb-3`}>{detail.title}</h3>
                    <div className={`${subTextColor} whitespace-pre-line`} dangerouslySetInnerHTML={{ __html: detail.content }} />
                  </div>
                ))}
              </div>
            </DashboardBox>

            <DashboardBox className="mb-8">
              <div className="p-6">
                <h2 className={`text-xl font-conthrax ${textColor} mb-6`}>Recent Votes</h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800/50">
                        <th className={`text-left py-3 px-4 ${subTextColor}`}>Voter</th>
                        <th className={`text-left py-3 px-4 ${subTextColor}`}>Voting Power</th>
                        <th className={`text-left py-3 px-4 ${subTextColor}`}>Vote</th>
                      </tr>
                    </thead>
                    <tbody>
                      {proposal.voterInfo.topVoters.map((voter, index) => (
                        <tr key={index} className="border-b border-gray-800/10 last:border-0">
                          <td className={`py-3 px-4 ${textColor}`}>{voter.address}</td>
                          <td className={`py-3 px-4 ${textColor}`}>{voter.power}</td>
                          <td className={`py-3 px-4 ${voter.vote === 'For' ? 'text-green-500' : 'text-red-500'}`}>{voter.vote}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 text-center">
                  <button className={`${subTextColor} hover:underline text-sm`}>
                    View all {proposal.voterInfo.totalVoters} votes
                  </button>
                </div>
              </div>
            </DashboardBox>
          </div>

          {/* Colonna laterale - Statistiche e azioni */}
          <div>
            {/* Box statistiche di voto */}
            <DashboardBox className="mb-8">
              <div className="p-6">
                <h2 className={`text-xl font-conthrax ${textColor} mb-6`}>Voting Statistics</h2>
                
                {/* Barra di progresso partecipazione */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className={`text-sm ${subTextColor}`}>Quorum</span>
                    <span className={`text-sm ${textColor}`}>{proposal.votingStats.currentParticipation}% / {proposal.votingStats.quorum}%</span>
                  </div>
                  <div className="w-full bg-gray-800/50 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(proposal.votingStats.currentParticipation / proposal.votingStats.quorum) * 100}%` }}></div>
                  </div>
                </div>
                
                {/* Barra di progresso voti */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className={`text-sm ${subTextColor}`}>Votes</span>
                    <span className={`text-sm ${textColor}`}>{proposal.votingStats.forVotes}% For - {proposal.votingStats.againstVotes}% Against</span>
                  </div>
                  <div className="w-full bg-gray-800/50 rounded-full h-2.5 flex overflow-hidden">
                    <div className="bg-green-500 h-2.5" style={{ width: `${proposal.votingStats.forVotes}%` }}></div>
                    <div className="bg-red-500 h-2.5" style={{ width: `${proposal.votingStats.againstVotes}%` }}></div>
                  </div>
                </div>
                
                {/* Barra threshold approvazione */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className={`text-sm ${subTextColor}`}>Approval Threshold</span>
                    <span className={`text-sm ${textColor}`}>{proposal.votingStats.forVotes}% / {proposal.votingStats.requiredForApproval}%</span>
                  </div>
                  <div className="w-full bg-gray-800/50 rounded-full h-2.5 relative">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${proposal.votingStats.forVotes}%` }}></div>
                    <div className="absolute top-0 h-full w-0.5 bg-yellow-500" style={{ left: `${proposal.votingStats.requiredForApproval}%` }}></div>
                  </div>
                </div>
              </div>
            </DashboardBox>
            
            {/* Box azioni di voto */}
            <DashboardBox>
              <div className="p-6">
                <h2 className={`text-xl font-conthrax ${textColor} mb-6`}>Cast Your Vote</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button 
                    onClick={() => handleVote('for')} 
                    className="py-3 px-4 rounded-lg bg-green-500/20 text-green-500 hover:bg-green-500/30 transition-colors font-medium"
                  >
                    Vote For
                  </button>
                  <button 
                    onClick={() => handleVote('against')} 
                    className="py-3 px-4 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors font-medium"
                  >
                    Vote Against
                  </button>
                </div>
                
                <p className={`text-sm ${subTextColor}`}>
                  Your voting power is determined by the amount of URANO tokens you have staked. The more tokens you stake, the more voting power you have.
                </p>
              </div>
            </DashboardBox>
          </div>
        </div>
      </div>
      
      {/* Modal per il voto */}
      {showVoteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <DashboardBox className="max-w-lg w-full">
            <div className="p-6">
              <h3 className={`text-xl font-conthrax ${textColor} mb-4`}>
                Vote {userVote === 'for' ? 'For' : 'Against'} Proposal
              </h3>
              <p className={`${subTextColor} mb-6`}>
                Enter the amount of URANO tokens you want to use for voting.
              </p>
              <div className="mb-6">
                <label className={`block text-sm ${subTextColor} mb-2`}>Amount</label>
                <div className="flex">
                  <input 
                    type="text" 
                    value={voteAmount} 
                    onChange={(e) => setVoteAmount(e.target.value)} 
                    className="flex-1 bg-gray-800/50 border border-gray-700 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    placeholder="0.00"
                  />
                  <div className="bg-gray-800 px-4 py-2 rounded-r-lg border border-gray-700 border-l-0 flex items-center">
                    <span className={textColor}>URANO</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button 
                  onClick={() => setShowVoteModal(false)} 
                  className="px-4 py-2 rounded-lg bg-gray-800/50 text-gray-400 hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmVote} 
                  className={`px-4 py-2 rounded-lg ${userVote === 'for' ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'} transition-colors`}
                  disabled={!voteAmount || isNaN(parseFloat(voteAmount)) || parseFloat(voteAmount) <= 0}
                >
                  Confirm Vote
                </button>
              </div>
            </div>
          </DashboardBox>
        </div>
      )}
    </main>
  );
};

export default GovernanceDetail;
