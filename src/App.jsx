import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import DashboardBox from './components/ui/DashboardBox';
import StarryBackground from './components/ui/StarryBackground';
import sfondoLight from './assets/img/bglight.png';
import Pool from './components/pages/Pool/Pool';
import { useTheme } from './context/ThemeContext';
import { WalletProvider } from './context/WalletContext';
import { PortfolioProvider } from './context/PortfolioContext';
import { Link } from 'react-router-dom';
import logoUrano from './assets/img/pool_logo.png';
import logoBono from './assets/img/bono_logo.png';
import astronautaImg from './assets/img/astronauta.png';
import Stake from './components/pages/Stake/Stake';
import Portfolio from './components/pages/Portfolio/Portfolio';
import Governance from './components/pages/Governance/Governance';
import GovernanceDetail from './components/pages/Governance/GovernanceDetail';
import CreateProposal from './components/pages/Governance/CreateProposal';
import UStation from './components/pages/UStation/UStation';

function App() {
  const { isDark } = useTheme();

  // Modifichiamo il colore di sfondo per essere più scuro
  const bgColor = isDark ? 'bg-black' : 'bg-gray-50';
  const textColor = isDark ? 'text-gray-200' : 'text-gray-900';
  const subTextColor = isDark ? 'text-gray-400' : 'text-gray-600';

  // Dati di esempio - puoi sostituirli con i tuoi dati reali
  const poolData = [
    {
      id: 1,
      companyName: "Bono Ingegneria S.r.l.",
      operationName: "Palazzo Carafa",
      assetsClass: "Real Estate",
      valueLocked: "$4,600,000.00",
      apr: "37.85%",
      estimatedROI: "7.25%",
      uNFTSupply: "2,071/460,000",
      uNFTPrice: "$10",
      status: "Open",
      logo: logoBono
    },
    {
      id: 2,
      companyName: "Lombardi Group",
      operationName: "Eco Vitae Resort",
      assetsClass: "Commercial Real Estate",
      valueLocked: "$2,850,000.00",
      apr: "5.45%",
      estimatedROI: "6.95%",
      uNFTSupply: "780/1000",
      uNFTPrice: "$50",
      status: "Funding",
      logo: logoUrano
    },
    {
      id: 3,
      companyName: "Artec Innovations",
      operationName: "Maritime Logistics Hub",
      assetsClass: "Infrastructure",
      valueLocked: "$3,250,000.00",
      apr: "4.90%",
      estimatedROI: "7.00%",
      uNFTSupply: "425/1000",
      uNFTPrice: "$75",
      status: "Coming Soon",
      logo: logoUrano
    }
  ];

  const HomePage = () => (
    <main className="pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Box originali */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-12">
          {[0, 1].map((index) => (
            <div key={`home-box-${index}`}>
              <DashboardBox className="p-6">
                {index === 0 ? (
                  // Box sinistro con nuovo layout
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <h2 className={`text-2xl font-conthrax ${subTextColor}`}>
                          TTV
                        </h2>
                        <div className="relative inline-block">
                          <div className={`w-5 h-5 rounded-full border ${isDark ? 'border-gray-500' : 'border-gray-400'} flex items-center justify-center cursor-help hover:border-[#2dbdc5] transition-colors`} 
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
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                            Total Tokenized Value
                          </div>
                        </div>
                      </div>
                      <span className="text-[#14EFC0] font-conthrax">
                        +4.75%
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className={`text-3xl font-bold ${textColor}`}>
                        $89,002,751.00
                      </p>
                    </div>
                  </div>
                ) : (
                  // Box destro con My position - ora cliccabile
                  <Link to="/portfolio" className="w-full">
                    <div className="flex items-center justify-between h-24 hover:text-[#2dbdc5] transition-colors overflow-visible relative">
                      <h2 className={`text-2xl font-conthrax ${subTextColor}`}>
                      My Portfolio
                      </h2>
                      <img 
                        src={astronautaImg} 
                        alt="Astronauta" 
                        className="w-auto absolute right-4 top-1" 
                        style={{ 
                          height: '160%',
                          objectFit: 'cover',
                          objectPosition: 'top right',
                          maxWidth: '45%',
                          clipPath: 'inset(0 0 25% 0)'
                        }}
                      />
                    </div>
                  </Link>
                )}
              </DashboardBox>
            </div>
          ))}
        </div>

        {/* Nuovi box delle pool con scrollbar */}
        <div className="mx-auto space-y-6 max-h-[60vh] overflow-y-auto pr-2" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#2dbdc5 transparent'
        }}>
          {poolData.map((pool) => (
            <Link to={`/pool/${pool.id}`} key={pool.id}>
              <DashboardBox 
                className="p-6 hover:border-[#2dbdc5] transition-colors duration-200 mt-6"
              >
                <div className="flex items-center gap-8">
                  {/* Sezione Company e Logo - riorganizzata */}
                  <div className="min-w-[200px]">
                    <h3 className={`text-sm ${subTextColor} mb-4 font-conthrax`}>Company</h3>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <img 
                          src={pool.logo} 
                          alt="Company Logo" 
                          className="h-16 w-auto"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className={`text-lg font-conthrax ${textColor}`}>
                          {pool.companyName}
                        </p>
                        <p className={`text-base font-conthrax ${textColor}`}>
                          {pool.operationName}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Grid delle informazioni */}
                  <div className="grid grid-cols-6 gap-4 flex-1">
                    <div>
                      <p className={`text-sm font-conthrax ${subTextColor} mb-1`}>Assets class</p>
                      <p className={`font-semibold ${textColor}`}>{pool.assetsClass}</p>
                    </div>
                    <div>
                      <p className={`text-sm font-conthrax ${subTextColor} mb-1`}>RWA Value</p>
                      <p className={`font-semibold ${textColor}`}>{pool.valueLocked}</p>
                    </div>
                    <div>
                      <p className={`text-sm font-conthrax ${subTextColor} mb-1`}>Estimated ROI</p>
                      <p className={`font-semibold ${textColor}`}>{pool.apr}</p>
                    </div>
                    <div>
                      <p className={`text-sm font-conthrax ${subTextColor} mb-1 whitespace-nowrap`}>uShare Supply</p>
                      <p className="font-semibold text-[#2dbdc5]">{pool.uNFTSupply}</p>
                    </div>
                    <div>
                      <p className={`text-sm font-conthrax ${subTextColor} mb-1`}>uShare Price</p>
                      <p className="font-semibold text-[#2dbdc5]">{pool.uNFTPrice}</p>
                    </div>
                    <div>
                      <p className={`text-sm font-conthrax ${subTextColor} mb-1`}>Status</p>
                      <p className="font-semibold text-[#2dbdc5]">{pool.status}</p>
                    </div>
                  </div>
                </div>
              </DashboardBox>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );

  return (
    <WalletProvider>
      <PortfolioProvider>
        <Router>
          <div className={`min-h-screen ${bgColor} relative`}>
          {isDark ? <StarryBackground /> : (
            <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
              <img src={sfondoLight} alt="Light background" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="relative z-10"> {/* Wrapper per il contenuto */}
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
        </div>
        </div>
        </Router>
      </PortfolioProvider>
    </WalletProvider>
  );
}

export default App;
