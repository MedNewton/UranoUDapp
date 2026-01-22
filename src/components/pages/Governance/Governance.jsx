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
      case 'active': return 'bg-[#2dbdc5]/20 text-[#2dbdc5]';
      case 'passed': return 'bg-green-500/20 text-green-500';
      case 'rejected': return 'bg-red-500/20 text-red-500';
      case 'pending': return 'bg-yellow-500/20 text-yellow-500';
      default: return 'bg-gray-500/20 text-gray-500';
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
        <div className="max-w-6xl mx-auto">
          {/* Header con titolo e statistiche */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className={`text-3xl font-conthrax mb-4 md:mb-0 ${textColor}`}>Governance</h1>
            
            <div className="flex gap-6">
              <div className="text-center">
                <p className={`text-sm ${subTextColor}`}>Total Proposals</p>
                <p className={`text-2xl font-conthrax ${textColor}`}>{proposals.length}</p>
              </div>
              <div className="text-center">
                <p className={`text-sm ${subTextColor}`}>Active Proposals</p>
                <p className={`text-2xl font-conthrax text-[#2dbdc5]`}>
                  {proposals.filter(p => p.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          {/* Box per creare nuova proposta */}
          <DashboardBox className="p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h2 className={`text-xl font-conthrax mb-2 ${textColor}`}>Create Proposal</h2>
                <p className={`${subTextColor}`}>Submit a new governance proposal to improve the protocol</p>
              </div>
              <Link 
                to="/governance/create" 
                className="mt-4 md:mt-0 px-6 py-3 bg-[#2dbdc5] text-white rounded-lg font-conthrax hover:bg-[#25a4ab] transition-colors"
              >
                New Proposal
              </Link>
            </div>
          </DashboardBox>

          {/* Filtri */}
          <div className="flex flex-wrap gap-4 mb-6">
            {['all', 'active', 'passed', 'rejected', 'pending'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full font-conthrax transition-colors ${activeFilter === filter 
                  ? 'bg-[#2dbdc5]/10 text-[#2dbdc5]' 
                  : `${subTextColor}`
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          {/* Elenco proposte */}
          <div className="space-y-6">
            {filteredProposals.map((proposal) => (
              <Link to={`/governance/${proposal.id}`} key={proposal.id}>
                <DashboardBox className="p-6 hover:shadow-lg hover:shadow-[#2dbdc5]/20 transition-all duration-300">
                  <div className="flex flex-col">
                    {/* Header della proposta */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className={`text-xl font-conthrax mb-2 ${textColor}`}>{proposal.title}</h3>
                        <p className={`${subTextColor} text-sm mb-4`}>{proposal.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(proposal.status)}`}>
                        {getStatusText(proposal.status)}
                      </span>
                    </div>
                    
                    {/* Barra di avanzamento per i voti (solo per proposte attive) */}
                    {proposal.status === 'active' && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-green-500 font-conthrax">For: {proposal.votes.for}%</span>
                          <span className="text-red-500 font-conthrax">Against: {proposal.votes.against}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-[#2dbdc5]"
                            style={{ width: `${proposal.votes.for}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {/* Footer con metadati */}
                    <div className="flex flex-wrap justify-between mt-2 pt-4 border-t border-gray-700/30">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className={`text-xs ${subTextColor}`}>Category</p>
                          <p className={`text-sm ${textColor}`}>{proposal.category}</p>
                        </div>
                        <div>
                          <p className={`text-xs ${subTextColor}`}>Created by</p>
                          <p className={`text-sm ${textColor}`}>{proposal.creator}</p>
                        </div>
                      </div>
                      <div>
                        <p className={`text-xs ${subTextColor}`}>End Date</p>
                        <p className={`text-sm ${textColor}`}>{proposal.endDate}</p>
                      </div>
                    </div>
                  </div>
                </DashboardBox>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Governance;
