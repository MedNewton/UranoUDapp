import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardBox from '@/components/ui/DashboardBox';
import { useTheme } from '@/context/ThemeContext';
import { usePortfolio } from '@/context/PortfolioContext';
import { useWallet } from '@/context/WalletContext';
import logoUrano from '@/assets/img/pool_logo.png';

// Importazione delle immagini
import logoPlaceholder from '@/assets/img/logo_urano.png';
import logoBono from '@/assets/img/bono_logo.png';
import uranoTorquoiseVertical from '@/assets/img/urano-turqoise vetical.png';
import uranoBlackVertical from '@/assets/img/urano-black vetical.png';

const Portfolio = () => {
  const { isDark } = useTheme();
  const { activeProjects } = usePortfolio();
  const { isConnected } = useWallet();
  const textColor = isDark ? 'text-gray-200' : 'text-gray-900';
  const subTextColor = isDark ? 'text-gray-400' : 'text-gray-600';

  // Stato per tracciare i valori del portfolio
  const [netWorth, setNetWorth] = useState('0.00');
  const [holdings, setHoldings] = useState('0.00');
  const [staked, setStaked] = useState('0.00');
  const [vested, setVested] = useState('0.00');
  const [claimable, setClaimable] = useState('0.00');

  // Aggiorna i valori del portfolio quando vengono aggiunti progetti
  useEffect(() => {
    if (activeProjects.length > 0) {
      // Calcola i valori in base ai progetti attivi
      // Per ora impostiamo dei valori fissi basati sul numero di progetti
      setHoldings('10.00');
      setNetWorth('1,259.64');
      
      if (activeProjects.length >= 2) {
        setStaked('0.00');
        setVested('10.00');
        setClaimable('10.00');
      }
    }
  }, [activeProjects]);

  // Mappa dei dati visivi per i progetti
  const projectData = {
    'Aave Protocol': {
      title: 'Palazzo Carafa uShares',
      image: logoBono,
      backgroundColor: 'bg-black',
      logo: logoBono,
      website: 'https://www.bonoingegneria.it/',
    },
    'Gearbox Protocol': {
      title: 'uShare2',
      image: uranoTorquoiseVertical,
      backgroundColor: 'bg-white',
      logo: logoPlaceholder,
      website: 'https://example.com/beta',
    },
    'Uniswap': {
      title: 'uShare3',
      image: uranoBlackVertical,
      backgroundColor: 'bg-purple-700',
      logo: logoPlaceholder,
      website: 'https://example.com/gamma',
    },
  };

  return (
    <main className="pt-24">
      <div className="container mx-auto px-4 py-8">
        <h1 className={`text-3xl font-conthrax mb-8 text-center ${textColor}`}>Portfolio</h1>
        
        {isConnected && (
          <DashboardBox className="mb-10 p-8 max-w-5xl mx-auto overflow-hidden">
            <div className="relative">
              <div className="absolute top-0 right-0 mt-2 mr-2">
                <div className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center bg-gray-800/50 cursor-pointer hover:border-[#2dbdc5] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
              </div>
              
              <div className="w-full">
                <div className="mb-8">
                  <h2 className={`text-sm ${subTextColor}`}>Net Worth</h2>
                  <p className={`text-3xl font-bold ${textColor}`}>
                    ${netWorth}
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-8">
                  {/* URANO Holdings */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <img src={logoUrano} alt="Urano Logo" className="w-5 h-auto object-contain" />
                      <span className={`text-sm ${subTextColor}`}>URANO Holdings</span>
                    </div>
                    <p className={`text-xl font-bold ${textColor}`}>{holdings}</p>
                    
                    {/* Pulsante Swap */}
                    <div className="mt-6">
                      <button className="bg-black text-gray-300 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-900 transition-colors w-full justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 3l4 4-4 4" />
                          <path d="M20 7H4" />
                          <path d="M8 21l-4-4 4-4" />
                          <path d="M4 17h16" />
                        </svg>
                        Buy
                      </button>
                    </div>
                  </div>
                  
                  {/* URANO Staked */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <img src={logoUrano} alt="Urano Logo" className="w-5 h-auto object-contain" />
                      <span className={`text-sm ${subTextColor}`}>URANO Staked</span>
                    </div>
                    <p className={`text-xl font-bold ${textColor}`}>{staked}</p>
                    
                    {/* Pulsante Stake JUP */}
                    <div className="mt-6">
                      <button className="bg-black text-gray-300 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-900 transition-colors w-full justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <ellipse cx="12" cy="5" rx="9" ry="3" />
                          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                        </svg>
                        Stake
                      </button>
                    </div>
                  </div>
                  
                  {/* URANO Vested */}
                  <div>
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2 mb-3">
                        <img src={logoUrano} alt="Urano Logo" className="w-5 h-auto object-contain" />
                        <span className={`text-sm ${subTextColor}`}>URANO Vested</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <img src={logoUrano} alt="Urano Logo" className="w-5 h-auto object-contain" />
                        <span className={`text-sm ${subTextColor}`}>URANO Claimable</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <p className={`text-xl font-bold ${textColor}`}>{vested}</p>
                      <p className={`text-xl font-bold ${textColor}`}>{claimable}</p>
                    </div>
                    
                    {/* Pulsante Claim */}
                    <div className="mt-6">
                      <button className="bg-black text-gray-300 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-900 transition-colors w-full justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2C9 7 6 9 2 12c4 3 7 5 10 10 3-5 6-7 10-10-4-3-7-5-10-10z" />
                          <circle cx="12" cy="12" r="3" />
                          <path d="M6 16l-4 4" />
                          <path d="M18 16l4 4" />
                          <path d="M16 6l4-4" />
                          <path d="M8 6L4 2" />
                        </svg>
                        Claim
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DashboardBox>
        )}
        
        {!isConnected && (
          <div className="text-center py-12">
            <p className={`${textColor} text-lg mb-4`}>Connect your wallet to view your portfolio</p>
          </div>
        )}
        
        {/* Grid di box per i progetti */}
        {isConnected && activeProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-4">
            {activeProjects.map((item) => (
              <DashboardBox 
                key={item.id}
                className="overflow-hidden flex flex-col hover:shadow-lg hover:shadow-[#2dbdc5]/20 transition-all duration-300"
              >
                {/* Immagine principale */}
                <div className={`relative w-full h-36 overflow-hidden flex items-center justify-center ${projectData[item.name]?.backgroundColor}`}>
                  <img 
                    src={projectData[item.name]?.image} 
                    alt={item.name}
                    className="h-28 w-auto object-contain transition-transform duration-500 hover:scale-110"
                  />
                 {/*  <div className="absolute top-0 left-0 m-3">
                    <span className="bg-[#2dbdc5] text-white px-3 py-1 rounded-full text-xs font-conthrax">
                      Featured Project
                    </span>
                  </div> */}
                </div>
                
                {/* Intestazione con logo e nome */}
                <div className={`bg-black p-4 flex justify-between items-center ${item.name === 'Aave Protocol' ? 'border-t border-white/30' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-white p-1">
                      <img 
                        src={projectData[item.name]?.logo || logoUrano}
                        alt={`${item.name} logo`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h3 className={`text-lg font-conthrax ${textColor}`}>
                      {projectData[item.name].title}
                    </h3>
                  </div>
                  <Link 
                    to={projectData[item.name]?.website || '#'} 
                    className="text-[#2dbdc5] hover:text-[#14efc0] transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                </div>
                
                {/* Statistiche principali come nell'immagine */}
                <div className="p-4 flex flex-col">
                  <div className="flex justify-between items-center mb-3">
                    <span className={`${subTextColor}`}>Your uShares</span>
                    <div className="text-right">
                      <p className={`text-xl ${textColor}`}>370</p>
                      <p className="text-sm text-[#2dbdc5]">$10,280</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className={`${subTextColor}`}>Estimated ROI</span>
                    <p className={`text-xl ${textColor}`}>37.85%</p>
                  </div>
                </div>
              </DashboardBox>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Portfolio;
