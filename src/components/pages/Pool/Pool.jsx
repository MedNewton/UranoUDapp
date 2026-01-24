import { useParams } from 'react-router-dom';
import { useState } from 'react';
import DashboardBox from '@/components/ui/DashboardBox';
import KYCModal from '@/components/ui/KYCModal';
import BuyModal from '@/components/ui/BuyModal';
import ClaimModal from '@/components/ui/ClaimModal';
import { useTheme } from '@/context/ThemeContext';
import { useWallet } from '@/context/WalletContext';
import logoBono from '@/assets/img/bono_logo.webp';

// Import PDF files
import presentazioneBook from '@/assets/pdf/presentazione_book.pdf';
import computoMetrico from '@/assets/pdf/computo_metrico_estimativo.pdf';
import quadroEconomico from '@/assets/pdf/quadro_economico_palazzo_carafa.pdf';
import relazioneFattibilita from '@/assets/pdf/relazione_fattibilità.pdf';

const Pool = () => {
  const { poolId } = useParams();
  const { isDark } = useTheme();
  const { isConnected, walletAddress, toggleWalletConnection } = useWallet();
  
  // Stati per controllare la visibilità delle varie finestre modali
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [hasCompletedKYC, setHasCompletedKYC] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // 'buy' or 'claim'
  
  const textColor = isDark ? 'text-gray-200' : 'text-gray-900';
  const subTextColor = isDark ? 'text-gray-400' : 'text-gray-600';

  // Database di esempi di pool
  const poolsDatabase = {
    "1": {
      // 1. Titolo custom per la pool
      poolTitle: "Palazzo Carafa - Heritage Boutique & Events",
      
      // 2. Descrizione del progetto (testo sotto il titolo)
      poolSubtitle: "Restoration and enhancement of the historic Carafa Castle, located in Capriglia Irpina (Italy), originally built in the 16th century on the ruins of a medieval castle dating back to the 10th century, traditionally considered the birthplace of Pope Paul IV. The project transforms this listed property into an exclusive hospitality and event hub, featuring a Boutique B&B with frescoed rooms, a wine cellar, a panoramic rooftop lounge bar, and multifunctional spaces for private events and ceremonies, combining historical value, tourism, and high profitability.",
      
      // 3. Box RWA customizzato
      rwaDetails: {
        location: "Naples, Italy",
        type: "Historic Renovation",
        timeline: "36 months"
      },
      
      // 4. Company Name primario
      companyName: "Bono Ingegneria S.r.l.",
      
      // 5. Descrizione nella tab Company Name
      companyDescription: "Leading company for project development, construction management, and asset valorisation in the real estate and tourism sector",
      
      // 6. Website URL
      website: "https://www.bonoingegneria.it",
      
      // 7. Analysis content
      analysis: {
        author: "Peter Regent",
        overview: `The project has been deemed highly bankable, financially sustainable, and capable of generating stable and significant cash flows.
All technical and financial documentation has been produced, signed, and validated by qualified sector specialists and is available to investors upon request for further due diligence.
A complete technical, economic, and financial feasibility assessment is available, including:
\n• Urban and Architectural Feasibility Report, prepared and signed by certified professionals: Arch. Alessia Picariello, Des. Guido Pappalardo, Eng. Gemma Manzi, Eng. Daniele Pierro, Eng. Vincenzo Retta, and Surveyor Gerardo Bordone.
\n• Detailed Economic and Financial Plan (PEF), prepared by the technical team of Bono Ingegneria S.r.l., based on market-standard assumptions and validated by independent financial experts.
\n• Sensitivity analysis on revenues and operational costs.
\n• Comprehensive risk assessment and business sustainability evaluation.
Key financial indicators:
\n• IRR post-tax: 30.10%
\n• NPV post-tax: $4,617,173
\n• Average DSCR (Debt Service Coverage Ratio): 2.75
\n• Minimum LLCR (Loan Life Coverage Ratio): 3.39`,
        strengths: "Prime location, historical significance, growing tourism market, experienced development team",
        risks: "Potential construction delays due to archaeological findings, market fluctuations, regulatory approvals"
      },
      
      // 8. Investment Structure e attachments
      investment: {
        dealType: "The entire project value of $4,588,800 will be tokenized and uShares Tokens will grant proportional rights to revenue participation and profit sharing",
        revenueStreams: `Profits will derive from:
• Hospitality activities (Boutique B&B with 5 unique rooms)
• High-end wine bar and tasting rooms
• Rooftop lounge bar and panoramic event space
• Private events, ceremonies, and cultural initiatives`,
        projections: `• Estimated annual revenues: $1,948,666
• Estimated annual operating costs: $909,062
• Expected annual EBITDA: $1,039,604`
      },
      
      attachments: [
        { name: 'Palazzo Carafa Prospectus', size: '39.9MB', file: presentazioneBook },
        { name: 'Architectural Plans', size: '4.9MB', file: computoMetrico },
        { name: 'Financial Projections', size: '4.0MB', file: quadroEconomico },
        { name: 'Feasibility Study', size: '2.2MB', file: relazioneFattibilita }
      ],
      
      // Dati originali
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec ante vel ante placerat placerat. Nullam nec ante vel ante placerat placerat.",
      tvl: "4,600,000 USD",
      apr: "9.20%",
      roi: "37.85%",
      interest: "$ 6,500,000 – 7,000,000",
      date: "February 2027",
      status: "Annual",
      rating: "9.2"
    },
    "2": {
      // 1. Titolo custom per la pool
      poolTitle: "Urban Development XYZ",
      
      // 2. Testo sotto il primo box in alto a sinistra
      poolSubtitle: "Commercial Real Estate Project",
      
      // 3. Box RWA customizzato
      rwaDetails: {
        title: "Mixed-Use Development",
        description: "Construction of a modern mixed-use property in growing urban center",
        location: "Metro Area",
        type: "Commercial Development",
        timeline: "24 months"
      },
      
      // 4. Company Name primario
      companyName: "HRC",
      
      // 5. Descrizione nella tab Company Name
      companyDescription: "HRC is a commercial real estate developer with a focus on creating sustainable, multi-purpose spaces in emerging urban centers around the country.",
      
      // 6. Website URL
      website: "https://www.hrc-development.com",
      
      // 7. Analysis content
      analysis: {
        author: "Andrew Galloway",
        overview: "This project capitalizes on the growing demand for mixed-use spaces in urban centers, creating a balance of retail, office, and residential units.",
        strengths: "Strategic location, diversified revenue streams, growing local economy",
        risks: "Market competition, potential economic downturn, construction cost increases"
      },
      
      // 8. Investment Structure e attachments
      investment: {
        dealType: "Equity partnership in development project",
        revenueStreams: "Retail leases, office rentals, residential sales",
        projections: "$1.2M annual rental income after stabilization"
      },
      
      attachments: [
        { name: 'project_overview.pdf', size: '2.4MB' },
        { name: 'market_analysis.pdf', size: '1.8MB' },
        { name: 'financial_model.xlsx', size: '1.2MB' }
      ],
      
      // Dati originali
      description: "Operation XYZ focuses on commercial real estate development in emerging urban centers. The project aims to create mixed-use spaces that combine retail, office, and residential units.",
      tvl: "405,091 USD",
      apr: "4.75%",
      roi: "20%",
      interest: "$19,241.82",
      date: "Mar 10, 2027",
      status: "Semi-Annual",
      rating: "3.9"
    },
    "3": {
      // Copia dei dati del pool 2 per il pool 3
      poolTitle: "Urban Development XYZ",
      poolSubtitle: "Commercial Real Estate Project",
      rwaDetails: {
        title: "Mixed-Use Development",
        description: "Construction of a modern mixed-use property in growing urban center",
        location: "Metro Area",
        type: "Commercial Development",
        timeline: "24 months"
      },
      companyName: "HRC",
      companyDescription: "HRC is a commercial real estate developer with a focus on creating sustainable, multi-purpose spaces in emerging urban centers around the country.",
      website: "https://www.hrc-development.com",
      analysis: {
        author: "Marc Wagner",
        overview: "This project capitalizes on the growing demand for mixed-use spaces in urban centers, creating a balance of retail, office, and residential units.",
        strengths: "Strategic location, diversified revenue streams, growing local economy",
        risks: "Market competition, potential economic downturn, construction cost increases"
      },
      investment: {
        dealType: "Equity partnership in development project",
        revenueStreams: "Retail leases, office rentals, residential sales",
        projections: "$1.2M annual rental income after stabilization"
      },
      attachments: [
        { name: 'project_overview.pdf', size: '2.4MB' },
        { name: 'market_analysis.pdf', size: '1.8MB' },
        { name: 'financial_model.xlsx', size: '1.2MB' }
      ],
      description: "Operation XYZ focuses on commercial real estate development in emerging urban centers. The project aims to create mixed-use spaces that combine retail, office, and residential units.",
      tvl: "405,091 USD",
      apr: "4.75%",
      roi: "10%",
      interest: "$19,241.82",
      date: "Mar 10, 2027",
      status: "Semi-Annual",
      rating: "3.9"
    }
  };
  
  // Recupera i dati specifici della pool in base all'ID
  const poolData = poolsDatabase[poolId] || {
    companyName: "Unknown Pool",
    description: "Details not available for this pool.",
    tvl: "N/A",
    apr: "N/A",
    interest: "N/A",
    date: "N/A",
    status: "N/A",
    rating: "N/A"
  };

  // Gli attachments ora sono specifici per ogni pool e definiti nel poolsDatabase

  const transactions = [
    { id: 1, hash: '0x94e0...5029', type: 'Withdrawal', amount: '-$646.50 USDC', date: 'Jan 27, 2024', tx: 'Tx' },
    { id: 2, hash: '0x94e0...5029', type: 'Withdrawal', amount: '-$646.50 USDC', date: 'Jan 27, 2024', tx: 'Tx' },
    { id: 3, hash: '0x94e0...5029', type: 'Withdrawal', amount: '-$646.50 USDC', date: 'Jan 27, 2024', tx: 'Tx' },
  ];

  return (
    <>
      <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Box sinistro fisso */}
          <div className="lg:w-1/3 lg:sticky lg:top-24 lg:self-start">
            <DashboardBox variant="card" className="p-6">
              <h1 className={`text-xl lg:text-2xl font-conthrax mb-4 ${textColor}`}>
                {poolData.poolTitle || poolData.companyName}
              </h1>
              <p className={`${subTextColor} mb-6 text-sm leading-relaxed`}>
                {poolData.poolSubtitle || poolData.description}
              </p>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${isDark ? 'bg-[#1a1a2e]/50' : 'bg-gray-100'}`}>
                  <p className={`text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-2`}>Indicative Return Rate</p>
                  <p className="text-3xl font-conthrax text-[#14EFC0]">{poolData.roi}</p>
                </div>
              </div>
              <button
                onClick={toggleWalletConnection}
                className={`
                  w-full px-4 py-3 rounded-lg font-conthrax text-sm mt-6 transition-all
                  ${isConnected
                    ? isDark
                      ? 'bg-[#1a1a2e] text-[#14EFC0] border border-[#14EFC0]/30 hover:border-[#14EFC0]/60'
                      : 'bg-gray-100 text-teal-600 border border-teal-300 hover:border-teal-500'
                    : 'bg-[#14EFC0] text-black hover:bg-[#12d4ad]'
                  }
                `}
              >
                {isConnected ? `${walletAddress}` : 'Connect Wallet'}
              </button>
            </DashboardBox>

            {/* Pulsanti Buy e Claim (visibili solo quando il wallet è connesso) */}
            {isConnected && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  onClick={() => {
                    if (hasCompletedKYC) {
                      setIsBuyModalOpen(true);
                    } else {
                      setPendingAction('buy');
                      setIsKYCModalOpen(true);
                    }
                  }}
                  className="bg-[#14EFC0] text-black px-6 py-3 rounded-lg font-conthrax text-sm hover:bg-[#12d4ad] transition-colors"
                >
                  Buy
                </button>
                <button
                  onClick={() => {
                    if (hasCompletedKYC) {
                      setIsClaimModalOpen(true);
                    } else {
                      setPendingAction('claim');
                      setIsKYCModalOpen(true);
                    }
                  }}
                  className={`px-6 py-3 rounded-lg font-conthrax text-sm transition-colors ${
                    isDark
                      ? 'border border-[#2a2a4e] text-gray-300 hover:border-[#14EFC0] hover:text-[#14EFC0]'
                      : 'border border-gray-300 text-gray-700 hover:border-teal-500 hover:text-teal-600'
                  }`}
                >
                  Claim
                </button>
              </div>
            )}
          </div>

          {/* Contenuto destro scrollabile */}
          <div className="lg:w-2/3 space-y-6">
            {/* Box 1: Stats (fisso) */}
            <DashboardBox variant="card" className="p-6">
              <div className="flex flex-col items-start">
                <p className={`text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-2`}>RWA Value</p>
                <p className={`text-3xl lg:text-4xl font-bold ${textColor}`}>{poolData.tvl}</p>
              </div>
            </DashboardBox>

            {/* Box 2: Cross Layout */}
            <DashboardBox variant="card" className="p-6">
              <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-0">
                {/* Top Left */}
                <div className="sm:pb-6 sm:pr-6 sm:border-r sm:border-b border-[#1a1a2e]">
                  <p className={`text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-2`}>Projected RWA Value at Maturity</p>
                  <p className={`text-xl lg:text-2xl font-semibold ${textColor}`}>
                    {poolData.interest}
                  </p>
                </div>

                {/* Top Right */}
                <div className="sm:pb-6 sm:pl-6 sm:border-b border-[#1a1a2e]">
                  <p className={`text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-2`}>Maturity Date</p>
                  <p className={`text-xl lg:text-2xl font-semibold ${textColor}`}>
                    {poolData.date}
                  </p>
                </div>

                {/* Bottom Left */}
                <div className="sm:pt-6 sm:pr-6 sm:border-r border-[#1a1a2e]">
                  <p className={`text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-2`}>Payout Frequency</p>
                  <p className="text-xl lg:text-2xl font-semibold text-[#14EFC0]">
                    {poolData.status}
                  </p>
                </div>

                {/* Bottom Right */}
                <div className="sm:pt-6 sm:pl-6">
                  <p className={`text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-2`}>Payout Yield (APR)</p>
                  <p className={`text-xl lg:text-2xl font-semibold ${textColor}`}>
                    {poolData.apr}
                  </p>
                </div>
              </div>
            </DashboardBox>

            {/* Box 3: Company Info */}
            <DashboardBox variant="card" className="p-6">
              <h2 className={`text-lg font-conthrax uppercase tracking-wider ${subTextColor} mb-6`}>
                Company
              </h2>
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDark ? 'bg-[#1a1a2e]/50' : 'bg-gray-100'}`}>
                  <img src={logoBono} alt={poolData.companyName} className="w-8 h-8 object-contain" />
                </div>
                <h3 className={`text-lg font-conthrax ${textColor}`}>{poolData.companyName}</h3>
              </div>
              <p className={`${subTextColor} text-sm leading-relaxed`}>
                {poolData.companyDescription || poolData.description}
              </p>
              <div className="flex flex-wrap justify-between items-center mt-6 gap-3">
                <span className="px-4 py-1.5 rounded-full text-xs font-medium bg-[#14EFC0]/20 text-[#14EFC0] border border-[#14EFC0]/30">
                  Verified
                </span>
                <a href={poolData.website} target="_blank" rel="noopener noreferrer" className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
                  isDark
                    ? 'border border-[#2a2a4e] text-gray-300 hover:border-[#14EFC0] hover:text-[#14EFC0]'
                    : 'border border-gray-300 text-gray-700 hover:border-teal-500 hover:text-teal-600'
                }`}>
                  Website
                </a>
              </div>
            </DashboardBox>

            {/* Box 4: Analysis */}
            <DashboardBox variant="card" className="p-6">
              <h2 className={`text-lg font-conthrax uppercase tracking-wider ${subTextColor} mb-6`}>
                Analysis
              </h2>
              <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-[#1a1a2e]/50' : 'bg-gray-100'}`}>
                    <img src={logoBono} alt={poolData.companyName} className="w-6 h-6 object-contain" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${textColor}`}>{poolData.analysis.author}</h3>
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${isDark ? 'bg-[#1a1a2e]/50' : 'bg-gray-100'}`}>
                  <span className={`text-xs ${subTextColor}`}>Rating:</span>
                  <span className="text-[#14EFC0] font-semibold">{poolData.rating}</span>
                </div>
              </div>
              <p className={`${subTextColor} text-sm mb-6 leading-relaxed`} style={{ whiteSpace: 'pre-wrap' }}>
                {poolData.analysis?.overview || poolData.description}
              </p>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${isDark ? 'bg-[#14EFC0]/5 border border-[#14EFC0]/20' : 'bg-teal-50 border border-teal-200'}`}>
                  <p className={`text-xs font-conthrax uppercase tracking-wider ${isDark ? 'text-[#14EFC0]' : 'text-teal-600'} mb-2`}>Strengths</p>
                  <p className={`text-sm ${textColor}`}>{poolData.analysis?.strengths || "No data available"}</p>
                </div>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-amber-500/5 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'}`}>
                  <p className={`text-xs font-conthrax uppercase tracking-wider ${isDark ? 'text-amber-400' : 'text-amber-600'} mb-2`}>Risks</p>
                  <p className={`text-sm ${textColor}`}>{poolData.analysis?.risks || "No data available"}</p>
                </div>
              </div>
              <div className="flex flex-wrap justify-between items-center mt-6 gap-3">
                <span className="px-4 py-1.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Feedback
                </span>
                <button className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
                  isDark
                    ? 'border border-[#2a2a4e] text-gray-300 hover:border-[#14EFC0] hover:text-[#14EFC0]'
                    : 'border border-gray-300 text-gray-700 hover:border-teal-500 hover:text-teal-600'
                }`}>
                  Executive
                </button>
              </div>
            </DashboardBox>

            {/* Box 5: Investment Structure */}
            <DashboardBox variant="card" className="p-6">
              <h2 className={`text-lg font-conthrax uppercase tracking-wider ${subTextColor} mb-6`}>
                Investment Structure
              </h2>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-8">
                  <p className={`sm:w-1/3 text-xs font-conthrax uppercase tracking-wider ${subTextColor}`}>Deal Type + Asset Scope</p>
                  <p className={`sm:w-2/3 text-sm ${textColor}`}>
                    {poolData.investment?.dealType || "On-chain capital for this pool is being raised into a single tranche"}
                  </p>
                </div>
                <div className={`border-t ${isDark ? 'border-[#1a1a2e]' : 'border-gray-200'}`}></div>
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-8">
                  <p className={`sm:w-1/3 text-xs font-conthrax uppercase tracking-wider ${subTextColor}`}>Revenue Streams</p>
                  <p className={`sm:w-2/3 text-sm ${textColor}`} style={{ whiteSpace: 'pre-wrap' }}>
                    {poolData.investment?.revenueStreams || "Senior The capital invested in this pool will be repaid pari passu with other senior debt, if any, raised by the company"}
                  </p>
                </div>
                <div className={`border-t ${isDark ? 'border-[#1a1a2e]' : 'border-gray-200'}`}></div>
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-8">
                  <p className={`sm:w-1/3 text-xs font-conthrax uppercase tracking-wider ${subTextColor}`}>Projections</p>
                  <p className={`sm:w-2/3 text-sm ${textColor}`} style={{ whiteSpace: 'pre-wrap' }}>{poolData.investment?.projections || "Yes"}</p>
                </div>
                <div className={`border-t ${isDark ? 'border-[#1a1a2e]' : 'border-gray-200'}`}></div>
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-8">
                  <p className={`sm:w-1/3 text-xs font-conthrax uppercase tracking-wider ${subTextColor}`}>About</p>
                  <p className={`sm:w-2/3 text-sm ${textColor}`}>
                    Investors can access borrower-related updates via the investment gated Discord Channel
                  </p>
                </div>

                {/* Attachments section */}
                <div className={`border-t ${isDark ? 'border-[#1a1a2e]' : 'border-gray-200'}`}></div>
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-8">
                  <p className={`sm:w-1/3 text-xs font-conthrax uppercase tracking-wider ${subTextColor}`}>Attachments</p>
                  <div className="sm:w-2/3 space-y-3">
                    {poolData.attachments && poolData.attachments.length > 0 ? (
                      poolData.attachments.map((file, index) => (
                        <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-[#1a1a2e]/50' : 'bg-gray-100'}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-[#2a2a4e]' : 'bg-gray-200'}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#14EFC0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <span className={`text-sm ${textColor}`}>{file.name}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`text-xs ${subTextColor}`}>{file.size}</span>
                            <a
                              href={file.file}
                              download={file.name}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                isDark
                                  ? 'bg-[#2a2a4e] hover:bg-[#14EFC0] hover:text-black text-gray-300'
                                  : 'bg-gray-200 hover:bg-teal-500 hover:text-white text-gray-600'
                              }`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className={`${subTextColor} text-sm`}>No attachments available</p>
                    )}
                  </div>
                </div>
              </div>
            </DashboardBox>

            {/* Box 6: Transactions */}
            <DashboardBox variant="card" className="p-6">
              <h2 className={`text-lg font-conthrax uppercase tracking-wider ${subTextColor} mb-6`}>Transactions</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`text-xs font-conthrax uppercase tracking-wider ${subTextColor} text-left`}>
                      <th className="pb-4">Hash</th>
                      <th className="pb-4">Type</th>
                      <th className="pb-4">Amount</th>
                      <th className="pb-4">Date</th>
                      <th className="pb-4">Tx</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-[#1a1a2e]' : 'divide-gray-200'}`}>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className={`text-sm ${textColor}`}>
                        <td className="py-4 font-mono">{tx.hash}</td>
                        <td className="py-4">{tx.type}</td>
                        <td className="py-4">{tx.amount}</td>
                        <td className="py-4">{tx.date}</td>
                        <td className="py-4">
                          <a href="#" className="text-[#14EFC0] hover:underline">{tx.tx}</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DashboardBox>
          </div>
        </div>
      </div>
      
      {/* Finestra modale KYC */}
      <KYCModal
        isOpen={isKYCModalOpen}
        onClose={() => {
          setIsKYCModalOpen(false);
          setPendingAction(null);
        }}
        onCompleted={() => {
          setIsKYCModalOpen(false);
          setHasCompletedKYC(true);
          // Open the appropriate modal based on which action triggered KYC
          if (pendingAction === 'buy') {
            setIsBuyModalOpen(true);
          } else if (pendingAction === 'claim') {
            setIsClaimModalOpen(true);
          }
          setPendingAction(null);
        }}
      />

      {/* Finestra modale per l'acquisto */}
      <BuyModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
      />

      {/* Finestra modale per il claim */}
      <ClaimModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
      />
    </>
  );
};

export default Pool;
