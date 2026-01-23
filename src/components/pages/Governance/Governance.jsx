import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardBox from '@/components/ui/DashboardBox';
import { useTheme } from '@/context/ThemeContext';

const Governance = () => {
  const { isDark } = useTheme();
  const textColor = isDark ? 'text-gray-200' : 'text-gray-900';
  const subTextColor = isDark ? 'text-gray-400' : 'text-gray-600';
  
  // Stato per il filtro attivo
  const [activeFilter, setActiveFilter] = useState('all');

  // Dati di esempio per le proposte di governance
  const proposals = [
    {
      id: 1,
      title: 'Upgrade Treasury Management',
      description: 'Proposal to upgrade the treasury management system to improve yield generation and risk management.',
      status: 'active',
      votes: { for: 65, against: 35 },
      endDate: '2025-05-15',
      creator: '0x71C...a1B2',
      category: 'Treasury'
    },
    {
      id: 2,
      title: 'Add New Collateral Type',
      description: 'Add support for WBTC as collateral with a 150% collateralization ratio.',
      status: 'passed',
      votes: { for: 82, against: 18 },
      endDate: '2025-04-10',
      creator: '0x94D...c7F3',
      category: 'Protocol'
    },
    {
      id: 3,
      title: 'Reduce Governance Quorum',
      description: 'Reduce the minimum quorum required for governance votes from 10% to 5% of total supply.',
      status: 'rejected',
      votes: { for: 42, against: 58 },
      endDate: '2025-04-05',
      creator: '0x3A7...e9D4',
      category: 'Governance'
    },
    {
      id: 4,
      title: 'Increase Developer Fund',
      description: 'Increase the developer fund allocation from 5% to 7% of protocol fees to support ongoing development.',
      status: 'pending',
      votes: { for: 0, against: 0 },
      endDate: '2025-05-30',
      creator: '0x8B2...f5E6',
      category: 'Treasury'
    },
  ];

  // Filtra le proposte in base al filtro attivo
  const filteredProposals = activeFilter === 'all' 
    ? proposals 
    : proposals.filter(proposal => proposal.status === activeFilter);

  // Funzione per ottenere il colore dello stato
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-[#14EFC0]/20 text-[#14EFC0] border border-[#14EFC0]/30';
      case 'passed': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'pending': return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  // Funzione per ottenere il testo dello stato
  const getStatusText = (status) => {
    switch(status) {
      case 'active': return 'Active';
      case 'passed': return 'Passed';
      case 'rejected': return 'Rejected';
      case 'pending': return 'Pending';
      default: return status;
    }
  };

  return (
    <main className="pt-24 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header con titolo e statistiche */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className={`text-3xl font-conthrax ${textColor}`}>Governance</h1>

          <div className="flex gap-4">
            <div className={`px-5 py-3 rounded-lg text-center ${isDark ? 'bg-[#1a1a2e]/50' : 'bg-gray-100'}`}>
              <p className={`text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-1`}>Total Proposals</p>
              <p className={`text-2xl font-bold ${textColor}`}>{proposals.length}</p>
            </div>
            <div className={`px-5 py-3 rounded-lg text-center ${isDark ? 'bg-[#14EFC0]/10 border border-[#14EFC0]/20' : 'bg-teal-50 border border-teal-200'}`}>
              <p className={`text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-1`}>Active Proposals</p>
              <p className="text-2xl font-bold text-[#14EFC0]">
                {proposals.filter(p => p.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        {/* Box per creare nuova proposta */}
        <DashboardBox variant="card" className="p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className={`text-lg font-conthrax uppercase tracking-wider ${subTextColor} mb-2`}>Create Proposal</h2>
              <p className={`text-sm ${textColor}`}>Submit a new governance proposal to improve the protocol</p>
            </div>
            <Link
              to="/governance/create"
              className="px-6 py-3 bg-[#14EFC0] text-black rounded-lg font-conthrax text-sm hover:bg-[#12d4ad] transition-colors whitespace-nowrap"
            >
              New Proposal
            </Link>
          </div>
        </DashboardBox>

        {/* Filtri */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'active', 'passed', 'rejected', 'pending'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg font-conthrax text-sm transition-all ${
                activeFilter === filter
                  ? isDark
                    ? 'bg-[#14EFC0]/20 text-[#14EFC0] border border-[#14EFC0]/30'
                    : 'bg-teal-100 text-teal-700 border border-teal-300'
                  : isDark
                    ? 'bg-[#1a1a2e]/50 text-gray-400 border border-[#2a2a4e] hover:border-[#3a3a5e]'
                    : 'bg-gray-100 text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Elenco proposte */}
        <div className="space-y-4">
          {filteredProposals.map((proposal) => (
            <Link to={`/governance/${proposal.id}`} key={proposal.id} className="block">
              <DashboardBox variant="row" className="p-6">
                <div className="flex flex-col">
                  {/* Header della proposta */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                    <div className="flex-1">
                      <h3 className={`text-lg font-conthrax mb-2 ${textColor}`}>{proposal.title}</h3>
                      <p className={`${subTextColor} text-sm`}>{proposal.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(proposal.status)}`}>
                      {getStatusText(proposal.status)}
                    </span>
                  </div>

                  {/* Barra di avanzamento per i voti (solo per proposte attive) */}
                  {proposal.status === 'active' && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-[#14EFC0] font-conthrax">For: {proposal.votes.for}%</span>
                        <span className="text-red-400 font-conthrax">Against: {proposal.votes.against}%</span>
                      </div>
                      <div className={`h-2 w-full rounded-full overflow-hidden ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-200'}`}>
                        <div
                          className="h-full bg-gradient-to-r from-[#14EFC0] to-[#2dbdc5] transition-all duration-500"
                          style={{ width: `${proposal.votes.for}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Footer con metadati */}
                  <div className={`flex flex-wrap justify-between items-center gap-4 pt-4 border-t ${isDark ? 'border-[#1a1a2e]' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-6">
                      <div>
                        <p className={`text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-1`}>Category</p>
                        <span className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-[#1a1a2e] text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                          {proposal.category}
                        </span>
                      </div>
                      <div>
                        <p className={`text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-1`}>Created by</p>
                        <p className={`text-sm font-mono ${textColor}`}>{proposal.creator}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-1`}>End Date</p>
                      <p className={`text-sm ${textColor}`}>{proposal.endDate}</p>
                    </div>
                  </div>
                </div>
              </DashboardBox>
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {filteredProposals.length === 0 && (
          <DashboardBox variant="card" className="p-12 text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={subTextColor}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <p className={`${textColor} text-lg mb-2`}>No proposals found</p>
            <p className={`${subTextColor} text-sm`}>Try changing your filter or create a new proposal</p>
          </DashboardBox>
        )}
      </div>
    </main>
  );
};

export default Governance;
