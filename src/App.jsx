import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThirdwebProvider } from "thirdweb/react";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DashboardBox from '@/components/ui/DashboardBox';
import StarryBackground from '@/components/ui/StarryBackground';
import sfondoLight from '@/assets/img/bglight.webp';
import Pool from '@/components/pages/Pool/Pool';
import { useTheme } from '@/context/ThemeContext';
import { WalletProvider } from '@/context/WalletContext';
import { PortfolioProvider } from '@/context/PortfolioContext';
import { Link } from 'react-router-dom';
import logoUrano from '@/assets/img/pool_logo.webp';
import logoBono from '@/assets/img/bono_logo.webp';
import astronautaImg from '@/assets/img/astronauta.webp';
import Stake from '@/components/pages/Stake/Stake';
import Portfolio from '@/components/pages/Portfolio/Portfolio';
import Governance from '@/components/pages/Governance/Governance';
import GovernanceDetail from '@/components/pages/Governance/GovernanceDetail';
import CreateProposal from '@/components/pages/Governance/CreateProposal';
import UStation from '@/components/pages/UStation/UStation';

function App() {
  const { isDark } = useTheme();

  // Modifichiamo il colore di sfondo per essere più scuro
  const bgColor = isDark ? 'bg-black' : 'bg-gray-50';
  const textColor = isDark ? 'text-gray-200' : 'text-gray-900';
  const subTextColor = isDark ? 'text-white' : 'text-gray-600';

  // Dati di esempio - puoi sostituirli con i tuoi dati reali
  const poolData = [
    {
      id: 1,
      companyName: "Bono Ingegneria S.r.l.",
      operationName: "Palazzo Carafa",
      assetsClass: "Real Estate",
      valueLocked: "$4,600,000.00",
      indicativeReturn: "7.25%",
      uNFTSupply: "2,071/460,000",
      uNFTPrice: "$10",
      status: "Open",
      timeLeft: "14d 6h",
      logo: logoBono
    },
    {
      id: 2,
      companyName: "Lombardi Group",
      operationName: "Eco Vitae Resort",
      assetsClass: "Commercial Real Estate",
      valueLocked: "$2,850,000.00",
      indicativeReturn: "6.95%",
      uNFTSupply: "780/1000",
      uNFTPrice: "$50",
      status: "Funding",
      timeLeft: "7d 12h",
      logo: logoUrano
    },
    {
      id: 3,
      companyName: "Artec Innovations",
      operationName: "Maritime Logistics Hub",
      assetsClass: "Infrastructure",
      valueLocked: "$3,250,000.00",
      indicativeReturn: "7.00%",
      uNFTSupply: "425/1000",
      uNFTPrice: "$75",
      status: "Coming Soon",
      timeLeft: "--",
      logo: logoUrano
    }
  ];

  const HomePage = () => (
    <main className="pt-24 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Top Stats Boxes - Full Width */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {/* TTV Box */}
          <DashboardBox variant="card" className="p-6">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <h2 className={`text-2xl font-conthrax ${subTextColor}`}>
                    TTV
                  </h2>
                  <div className="relative inline-block">
                    <div className={`w-5 h-5 rounded-full border ${isDark ? 'border-gray-600' : 'border-gray-400'} flex items-center justify-center cursor-help hover:border-[#2dbdc5] transition-colors`}
                      onMouseEnter={(e) => {
                        const tooltip = e.currentTarget.nextElementSibling;
                        if (tooltip) tooltip.classList.remove('opacity-0');
                      }}
                      onMouseLeave={(e) => {
                        const tooltip = e.currentTarget.nextElementSibling;
                        if (tooltip) tooltip.classList.add('opacity-0');
                      }}>
                      <span className={`text-xs font-semibold ${subTextColor}`}>i</span>
                    </div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 bg-[#1a1a2e] text-white text-xs rounded-lg py-2 px-3 opacity-0 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10 border border-[#2a2a4e]">
                      Total Tokenized Value
                    </div>
                  </div>
                </div>
                <span className="text-[#14EFC0] font-conthrax text-lg">
                  +4.75%
                </span>
              </div>
              <div className="mt-auto">
                <p className={`text-4xl font-bold ${textColor}`}>
                  $89,002,751.00
                </p>
              </div>
            </div>
          </DashboardBox>

          {/* Portfolio Box */}
          <Link to="/portfolio" className="block">
            <DashboardBox variant="card" className="p-6 h-full cursor-pointer overflow-hidden">
              <div className="flex items-center justify-between h-full min-h-[100px] relative">
                <h2 className={`text-2xl font-conthrax ${subTextColor} group-hover:text-[#2dbdc5] transition-colors`}>
                  My Portfolio
                </h2>
                <img
                  src={astronautaImg}
                  alt="Astronauta"
                  className="w-auto absolute right-0 top-2"
                  style={{
                    height: '140%',
                    objectFit: 'cover',
                    objectPosition: 'top right',
                    maxWidth: '40%',
                    clipPath: 'inset(0 0 20% 0)',
                    scale: "1.35"
                  }}
                />
              </div>
            </DashboardBox>
          </Link>
        </div>

        {/* Pools Table Section */}
        <div className="w-full">
          {/* Table Header */}
          <div className={`grid grid-cols-12 gap-4 px-6 py-3 mb-2 ${subTextColor}`}>
            <div className="col-span-2">
              <span className="text-xs font-conthrax uppercase tracking-wider leading-tight block">Company<br />Name</span>
            </div>
            <div className="col-span-2 text-center">
              <span className="text-xs font-conthrax uppercase tracking-wider leading-tight block">Asset<br />Class</span>
            </div>
            <div className="col-span-1 text-center">
              <span className="text-xs font-conthrax uppercase tracking-wider leading-tight block">RWA<br />Value</span>
            </div>
            <div className="col-span-1 text-center">
              <span className="text-xs font-conthrax uppercase tracking-wider leading-tight block">Indicative<br />Return Rate</span>
            </div>
            <div className="col-span-1 text-center">
              <span className="text-xs font-conthrax uppercase tracking-wider leading-tight block">uShare<br />Supply</span>
            </div>
            <div className="col-span-1 text-center">
              <span className="text-xs font-conthrax uppercase tracking-wider leading-tight block">uShare<br />Price</span>
            </div>
            <div className="col-span-2 text-center">
              <span className="text-xs font-conthrax uppercase tracking-wider leading-tight block">Time<br />Left</span>
            </div>
            <div className="col-span-2 text-left">
              <span className="text-xs font-conthrax uppercase tracking-wider leading-tight block">Pool<br />Status</span>
            </div>
          </div>

          {/* Table Rows */}
          <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1" style={{
            scrollbarWidth: 'thin',
            scrollbarColor: isDark ? '#2dbdc5 #0a0a0f' : '#2dbdc5 #e5e7eb'
          }}>
            {poolData.map((pool) => (
              <Link to={`/pool/${pool.id}`} key={pool.id} className="block">
                <DashboardBox variant="row" className="px-6 py-4">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Company with Logo */}
                    <div className="col-span-2 flex items-center gap-3">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-[#1a1a2e]/50 flex items-center justify-center">
                        <img
                          src={pool.logo}
                          alt="Company Logo"
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <div className="flex flex-col">
                        <p className={`text-sm font-conthrax ${textColor} whitespace-nowrap`}>
                          {pool.companyName}
                        </p>
                        <p className={`text-xs ${subTextColor} whitespace-nowrap`}>
                          {pool.operationName}
                        </p>
                      </div>
                    </div>

                    {/* Asset Class */}
                    <div className="col-span-2 text-center">
                      <p className={`text-sm ${textColor}`}>{pool.assetsClass}</p>
                    </div>

                    {/* RWA Value */}
                    <div className="col-span-1 text-center">
                      <p className={`text-sm font-medium ${textColor}`}>{pool.valueLocked}</p>
                    </div>

                    {/* Indicative Return Rate */}
                    <div className="col-span-1 text-center">
                      <p className="text-sm font-semibold text-[#14EFC0]">{pool.indicativeReturn}</p>
                    </div>

                    {/* uShare Supply */}
                    <div className="col-span-1 text-center">
                      <p className="text-sm font-medium text-[#2dbdc5]">{pool.uNFTSupply}</p>
                    </div>

                    {/* uShare Price */}
                    <div className="col-span-1 text-center">
                      <p className="text-sm font-medium text-[#2dbdc5]">{pool.uNFTPrice}</p>
                    </div>

                    {/* Time Left */}
                    <div className="col-span-2 text-center">
                      <p className={`text-sm font-medium ${pool.timeLeft === '--' ? subTextColor : 'text-amber-400'}`}>
                        {pool.timeLeft}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="col-span-2 text-left">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        pool.status === 'Open'
                          ? 'bg-[#14EFC0]/20 text-[#14EFC0] border border-[#14EFC0]/30'
                          : pool.status === 'Funding'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {pool.status}
                      </span>
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

  return (
    <ThirdwebProvider>
      <WalletProvider>
        <PortfolioProvider>
          <Router>
            <div className={`min-h-screen ${bgColor} relative`}>
              {isDark ? <StarryBackground /> : (
                <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
                  <img src={sfondoLight} alt="Light background" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="relative z-10">
                <Header />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/pool/:poolId" element={<Pool />} />
                  <Route path="/stake" element={<Stake />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/governance" element={<Governance />} />
                  <Route path="/governance/create" element={<CreateProposal />} />
                  <Route path="/governance/:proposalId" element={<GovernanceDetail />} />
                  <Route path="/ustation" element={<UStation />} />
                </Routes>
                <Footer />
              </div>
            </div>
          </Router>
        </PortfolioProvider>
      </WalletProvider>
    </ThirdwebProvider>
  );
}

export default App;
