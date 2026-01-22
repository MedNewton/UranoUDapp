import { useParams } from 'react-router-dom';
import { useState } from 'react';
import DashboardBox from '@/components/ui/DashboardBox';
import KYCModal from '@/components/ui/KYCModal';
import BuyModal from '@/components/ui/BuyModal';
import { useTheme } from '@/context/ThemeContext';
import { useWallet } from '@/context/WalletContext';
import logoBono from '@/assets/img/bono_logo.webp';
import logoUrano from '@/assets/img/pool_logo.webp';

// Import PDF files
import presentazioneBook from '@/assets/pdf/presentazione_book.pdf';
import computoMetrico from '@/assets/pdf/computo_metrico_estimativo.pdf';
import quadroEconomico from '@/assets/pdf/quadro_economico_palazzo_carafa.pdf';
import relazioneFattibilita from '@/assets/pdf/relazione_fattibilità.pdf';

const Pool = () => {
  const { poolId } = useParams();
  const { isDark } = useTheme();
  const { isConnected, walletAddress, toggleWalletConnection, kycModalShown, setKycShown } = useWallet();
  
  // Stati per controllare la visibilità delle varie finestre modali
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [hasCompletedKYC, setHasCompletedKYC] = useState(false);
  
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
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Box sinistro fisso */}
          <div className="lg:w-1/3 lg:sticky lg:top-24 lg:self-start">
            <DashboardBox className="p-6">
              <h1 className={`text-2xl font-conthrax mb-4 ${textColor}`}>
                {poolData.poolTitle || poolData.companyName}
              </h1>
              <p className={`${subTextColor} mb-6 text-sm`}>
                {poolData.poolSubtitle || poolData.description}
              </p>
              <div className="space-y-4">
                <div>
                  <p className={`text-sm ${subTextColor} mb-1`}>Estimated ROI</p>
                  <p className={`text-3xl font-conthrax ${textColor}`}>{poolData.roi}</p>
                </div>
              </div>
              <button
                onClick={toggleWalletConnection}
                className={`
                  w-full px-4 py-2 rounded-lg font-semibold mt-6 transition-colors
                  ${isConnected 
                    ? 'bg-gray-800 text-[#2dbdc5] hover:bg-gray-700' 
                    : 'bg-[#2dbdc5] text-white hover:bg-[#25a4ab]'
                  }
                `}
              >
                {isConnected ? `${walletAddress}` : 'Connect Wallet'}
              </button>
            </DashboardBox>

            {/* Pulsanti Buy e Claim (visibili solo quando il wallet è connesso) */}
            {isConnected && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <button 
                  onClick={() => {
                    if (hasCompletedKYC || kycModalShown) {
                      // Se ha completato il KYC o il modale è già stato mostrato, vai direttamente al modale di acquisto
                      setIsBuyModalOpen(true);
                    } else {
                      // Prima volta: mostra il modale KYC e segna che è stato mostrato
                      setIsKYCModalOpen(true);
                      setKycShown(); // Usa la funzione dal contesto che aggiorna anche il localStorage
                    }
                  }}
                  className="bg-[#2dbdc5] text-white px-6 py-3 rounded-lg font-conthrax hover:bg-[#25a4ab] transition-colors"
                >
                  Buy
                </button>
                <button className="border border-[#2dbdc5] text-[#2dbdc5] px-6 py-3 rounded-lg font-conthrax hover:bg-[#2dbdc5] hover:text-white transition-colors">
                  Claim
                </button>
              </div>
            )}
          </div>

          {/* Contenuto destro scrollabile */}
          <div className="lg:w-2/3 space-y-8">
            {/* Box 1: Stats (fisso) */}
            <DashboardBox className="p-6">
              <div className="flex flex-col items-start">
                <p className={`text-lg font-conthrax ${subTextColor} mb-2`}>RWA VALUE</p>
                <p className={`text-4xl font-semibold ${textColor}`}>{poolData.tvl}</p>
              </div>
            </DashboardBox>

            {/* Box 2: Cross Layout */}
            <DashboardBox className="p-6">
              <div className="relative grid grid-cols-2">
                {/* Top Left */}
                <div className="pb-8 pr-8">
                  <p className={`text-sm ${subTextColor} mb-1`}>Projected RWA Value at Maturity</p>
                  <p className={`text-2xl font-semibold ${textColor}`}>
                    {poolData.interest}
                  </p>
                </div>
                
                {/* Top Right */}
                <div className="pb-8 pl-8">
                  <p className={`text-sm ${subTextColor} mb-1`}>Maturity Date</p>
                  <p className={`text-2xl font-semibold ${textColor}`}>
                    {poolData.date}
                  </p>
                </div>
                
                {/* Bottom Left */}
                <div className="pt-8 pr-8">
                  <p className={`text-sm ${subTextColor} mb-1`}>Payout Frequency</p>
                  <p className={`text-2xl font-semibold text-[#2dbdc5]`}>
                    {poolData.status}
                  </p>
                </div>
                
                {/* Bottom Right */}
                <div className="pt-8 pl-8">
                  <p className={`text-sm ${subTextColor} mb-1`}>Payout Yield (APR)</p>
                  <p className={`text-2xl font-semibold ${textColor}`}>
                    {poolData.apr}
                  </p>
                </div>

                {/* Solo la croce centrale */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/30"></div>
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30"></div>
                </div>
              </div>
            </DashboardBox>

            {/* Box 3: Company Info */}
            <DashboardBox className="p-6">
              <h2 className={`text-xl font-conthrax mb-6 ${textColor}`}>
                Company
              </h2>
              <div className="flex items-center gap-4 mb-4">
                <img src={logoBono} alt={poolData.companyName} className="w-8 h-8 object-contain" />
                <h3 className={`text-xl font-conthrax ${textColor}`}>{poolData.companyName}</h3>
              </div>
              <p className={`${subTextColor} text-sm`}>
                {poolData.companyDescription || poolData.description}
              </p>
              <div className="flex justify-between items-center mt-4">
                <button className="px-4 py-1 rounded-full text-sm bg-orange-500/20 text-orange-500">
                  Verified
                </button>
                <a href={poolData.website} target="_blank" rel="noopener noreferrer" className="px-4 py-1.5 rounded-lg text-sm border border-[#2dbdc5] text-[#2dbdc5] hover:bg-[#2dbdc5] hover:text-white transition-colors">
                  Website
                </a>
              </div>
            </DashboardBox>

            {/* Box 4: Analysis */}
            <DashboardBox className="p-6">
              <h2 className={`text-xl font-conthrax mb-6 ${textColor}`}>
                Analysis
              </h2>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img src={logoBono} alt={poolData.companyName} className="w-8 h-8 object-contain" />
                  <div>
                    <h3 className={`font-semibold ${textColor}`}>{poolData.analysis.author}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${subTextColor}`}>Rating:</span>
                  <span className={textColor}>{poolData.rating}</span>
                </div>
              </div>
              <p className={`${subTextColor} text-sm mb-4`} style={{ whiteSpace: 'pre-wrap' }}>
                {poolData.analysis?.overview || poolData.description}
              </p>
              <div className="mt-4 space-y-3">
                <div>
                  <p className={`text-sm font-semibold ${textColor} mb-1`}>Strengths</p>
                  <p className={`text-sm ${subTextColor}`}>{poolData.analysis?.strengths || "No data available"}</p>
                </div>
                <div>
                  <p className={`text-sm font-semibold ${textColor} mb-1`}>Risks</p>
                  <p className={`text-sm ${subTextColor}`}>{poolData.analysis?.risks || "No data available"}</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-8">
                <button className="px-4 py-1 rounded-full text-sm bg-orange-500/20 text-orange-500">
                  Feedback
                </button>
                <button className="px-4 py-1.5 rounded-lg text-sm border border-[#2dbdc5] text-[#2dbdc5] hover:bg-[#2dbdc5] hover:text-white transition-colors">
                  Executive
                </button>
              </div>
            </DashboardBox>

            {/* Box 5: Investment Structure */}
            <DashboardBox className="p-6">
              <h2 className={`text-xl font-conthrax mb-6 ${textColor}`}>
                Investment Structure
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-8">
                  <p className={`w-1/3 ${subTextColor}`}>Deal Type + Asset Scope</p>
                  <p className={`w-2/3 ${textColor}`}>
                    {poolData.investment?.dealType || "On-chain capital for this pool is being raised into a single tranche"}
                  </p>
                </div>
                <div className="flex items-start gap-8">
                  <p className={`w-1/3 ${subTextColor}`}>Revenue Streams</p>
                  <p className={`w-2/3 ${textColor}`} style={{ whiteSpace: 'pre-wrap' }}>
                    {poolData.investment?.revenueStreams || "Senior The capital invested in this pool will be repaid pari passu with other senior debt, if any, raised by the company"}
                  </p>
                </div>
                <div className="flex items-start gap-8">
                  <p className={`w-1/3 ${subTextColor}`}>Projections</p>
                  <p className={`w-2/3 ${textColor}`} style={{ whiteSpace: 'pre-wrap' }}>{poolData.investment?.projections || "Yes"}</p>
                </div>
                <div className="flex items-start gap-8">
                  <p className={`w-1/3 ${subTextColor}`}>About</p>
                  <p className={`w-2/3 ${textColor}`}>
                    Investors can access borrower-related updates via the investment gated Discord Channel
                  </p>
                </div>

                {/* Attachments section */}
                <div className="flex items-start gap-8">
                  <p className={`w-1/3 ${subTextColor}`}>Attachments</p>
                  <div className="w-2/3 space-y-3">
                    {poolData.attachments && poolData.attachments.length > 0 ? (
                      poolData.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#2dbdc5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <span className={textColor}>{file.name}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`text-sm ${subTextColor}`}>{file.size}</span>
                            <a 
                              href={file.file} 
                              download={file.name} 
                              className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#2dbdc5] hover:text-white transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className={`${subTextColor}`}>No attachments available</p>
                    )}
                  </div>
                </div>
              </div>
            </DashboardBox>

            {/* Box 6: Transactions */}
            <DashboardBox className="p-6">
              <h2 className={`text-xl font-conthrax mb-4 ${textColor}`}>Transactions</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${subTextColor} text-sm text-left`}>
                      <th className="pb-4 font-medium">Hash</th>
                      <th className="pb-4 font-medium">Type</th>
                      <th className="pb-4 font-medium">Amount</th>
                      <th className="pb-4 font-medium">Date</th>
                      <th className="pb-4 font-medium">Tx</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/20">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className={textColor}>
                        <td className="py-4">{tx.hash}</td>
                        <td className="py-4">{tx.type}</td>
                        <td className="py-4">{tx.amount}</td>
                        <td className="py-4">{tx.date}</td>
                        <td className="py-4">
                          <a href="#" className="text-[#2dbdc5] hover:underline">{tx.tx}</a>
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
        onClose={() => setIsKYCModalOpen(false)}
        onCompleted={() => {
          setIsKYCModalOpen(false);
          setHasCompletedKYC(true);
          setIsBuyModalOpen(true);
        }}
      />
      
      {/* Finestra modale per l'acquisto */}
      <BuyModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
      />
    </>
  );
};

export default Pool;
