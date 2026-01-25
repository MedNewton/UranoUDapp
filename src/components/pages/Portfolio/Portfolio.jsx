import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardBox from '@/components/ui/DashboardBox';
import { useTheme } from '@/context/ThemeContext';
import { usePortfolio } from '@/context/PortfolioContext';
import { useToast } from '@/context/ToastContext';
import { useWallet } from '@/context/WalletContext';
import { useStaking } from '@/hooks/useStaking';
import { handleTransaction } from '@/utils/transactions';
import { formatTokenAmount } from '@/utils/format';
import { formatUnits } from 'viem';
import logoUrano from '@/assets/img/pool_logo.webp';

// Importazione delle immagini
import logoPlaceholder from '@/assets/img/logo_urano.webp';
import logoBono from '@/assets/img/bono_logo.webp';
import uranoTorquoiseVertical from '@/assets/img/urano-turqoise vetical.webp';
import uranoBlackVertical from '@/assets/img/urano-black vetical.webp';

const Portfolio = () => {
  const { isDark } = useTheme();
  const { activeProjects } = usePortfolio();
  const { addToast } = useToast();
  const { isConnected, walletAddress, balance } = useWallet();
  const { stakedAmount, userInfo, claimRewards } = useStaking(walletAddress);
  const textColor = isDark ? 'text-gray-200' : 'text-gray-900';
  const subTextColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const [hideBalances, setHideBalances] = useState(false);

  const uranoPriceUsd = 0.17;
  const holdingsRaw = balance.rawUrano ?? 0n;
  const stakedRaw = stakedAmount ?? 0n;
  const rewardsRaw = userInfo?.rewardEarned ?? 0n;

  const holdingsDisplay = formatTokenAmount(holdingsRaw, 18);
  const stakedDisplay = formatTokenAmount(stakedRaw, 18);
  const rewardsDisplay = formatTokenAmount(rewardsRaw, 18);

  const netWorthDisplay = useMemo(() => {
    if (!isConnected) return '0.00';
    const total = holdingsRaw + stakedRaw + rewardsRaw;
    const totalTokens = Number(formatUnits(total, 18));
    const usd = totalTokens * uranoPriceUsd;
    return usd.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [holdingsRaw, isConnected, rewardsRaw, stakedRaw]);

  const masked = (value) => (hideBalances ? '****' : value);

  const handleClaimRewards = async () => {
    if (!isConnected || rewardsRaw <= 0n) return;
    await handleTransaction(claimRewards(), () => {
      addToast({
        type: 'success',
        title: 'Rewards claimed',
        message: `Claimed ${rewardsDisplay} URANO`,
      });
    }, (error) => {
      addToast({ type: 'error', title: 'Claim failed', message: error.message });
    });
  };

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
    <main className="pt-24 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className={`text-3xl font-conthrax mb-8 ${textColor}`}>Portfolio</h1>

        {isConnected && (
          <DashboardBox variant="card" className="mb-10 p-6 lg:p-8">
            <div className="relative">
              {/* Eye toggle button */}
              <div className="absolute top-0 right-0">
                <button
                  onClick={() => setHideBalances((prev) => !prev)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                  isDark
                    ? 'bg-[#1a1a2e] border border-[#2a2a4e] hover:border-[#14EFC0]/50 text-gray-400 hover:text-[#14EFC0]'
                    : 'bg-gray-100 border border-gray-200 hover:border-teal-300 text-gray-500 hover:text-teal-600'
                }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>

              <div className="w-full">
                {/* Net Worth Section */}
                <div className="mb-8">
                  <h2 className={`text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-2`}>Net Worth</h2>
                  <p className={`text-4xl font-bold ${textColor} break-words leading-tight`}>
                    {masked(`$${netWorthDisplay}`)}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* URANO Holdings */}
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-[#1a1a2e]/50' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <img src={logoUrano} alt="Urano Logo" className="w-5 h-auto object-contain" />
                      <span className={`text-xs font-conthrax uppercase tracking-wider ${subTextColor}`}>URANO Holdings</span>
                    </div>
                    <p className={`text-2xl font-bold ${textColor} mb-4 break-words`}>
                      {masked(holdingsDisplay)}
                    </p>

                    <button className={`w-full px-4 py-2.5 rounded-lg flex items-center gap-2 justify-center text-sm font-conthrax transition-colors ${
                      isDark
                        ? 'bg-[#2a2a4e] text-gray-300 hover:bg-[#3a3a5e]'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 3l4 4-4 4" />
                        <path d="M20 7H4" />
                        <path d="M8 21l-4-4 4-4" />
                        <path d="M4 17h16" />
                      </svg>
                      Buy
                    </button>
                  </div>

                  {/* URANO Staked */}
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-[#1a1a2e]/50' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <img src={logoUrano} alt="Urano Logo" className="w-5 h-auto object-contain" />
                      <span className={`text-xs font-conthrax uppercase tracking-wider ${subTextColor}`}>URANO Staked</span>
                    </div>
                    <p className={`text-2xl font-bold ${textColor} mb-4 break-words`}>
                      {masked(stakedDisplay)}
                    </p>

                    <Link to="/stake" className={`w-full px-4 py-2.5 rounded-lg flex items-center gap-2 justify-center text-sm font-conthrax transition-colors ${
                      isDark
                        ? 'bg-[#14EFC0]/20 text-[#14EFC0] border border-[#14EFC0]/30 hover:bg-[#14EFC0]/30'
                        : 'bg-teal-100 text-teal-700 border border-teal-300 hover:bg-teal-200'
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <ellipse cx="12" cy="5" rx="9" ry="3" />
                        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                      </svg>
                      Stake
                    </Link>
                  </div>

                  {/* URANO Vested & Claimable */}
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-[#1a1a2e]/50' : 'bg-gray-50'}`}>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <img src={logoUrano} alt="Urano Logo" className="w-4 h-auto object-contain" />
                          <span className={`text-xs font-conthrax uppercase tracking-wider ${subTextColor}`}>Rewards</span>
                        </div>
                        <p className={`text-xl font-bold ${textColor}`}>
                          {masked(rewardsDisplay)}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <img src={logoUrano} alt="Urano Logo" className="w-4 h-auto object-contain" />
                          <span className={`text-xs font-conthrax uppercase tracking-wider ${subTextColor}`}>Claimable</span>
                        </div>
                        <p className="text-xl font-bold text-[#14EFC0]">
                          {masked(rewardsDisplay)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleClaimRewards}
                      disabled={!isConnected || rewardsRaw <= 0n}
                      className={`w-full px-4 py-2.5 rounded-lg flex items-center gap-2 justify-center text-sm font-conthrax transition-colors ${
                        !isConnected || rewardsRaw <= 0n
                          ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                          : isDark
                            ? 'bg-[#2a2a4e] text-gray-300 hover:bg-[#3a3a5e]'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
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
          </DashboardBox>
        )}

        {!isConnected && (
          <DashboardBox variant="card" className="p-12 text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={subTextColor}>
                <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
                <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>
                <path d="M18 12a2 2 0 0 0 0 4h4v-4z"></path>
              </svg>
            </div>
            <p className={`${textColor} text-lg mb-2`}>Connect your wallet</p>
            <p className={`${subTextColor} text-sm`}>to view your portfolio</p>
          </DashboardBox>
        )}

        {/* Grid di box per i progetti */}
        {isConnected && activeProjects.length > 0 && (
          <div className="mt-8">
            <h2 className={`text-lg font-conthrax uppercase tracking-wider ${subTextColor} mb-6`}>Your Investments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeProjects.map((item) => (
                <DashboardBox
                  key={item.id}
                  variant="card"
                  className="overflow-hidden flex flex-col"
                >
                  {/* Immagine principale */}
                  <div className={`relative w-full h-36 overflow-hidden flex items-center justify-center ${projectData[item.name]?.backgroundColor}`}>
                    <img
                      src={projectData[item.name]?.image}
                      alt={item.name}
                      className="h-28 w-auto object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Intestazione con logo e nome */}
                  <div className={`p-4 flex justify-between items-center ${isDark ? 'bg-[#0d0d14] border-t border-[#1a1a2e]' : 'bg-gray-50 border-t border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center ${isDark ? 'bg-[#1a1a2e]' : 'bg-white'} p-1.5`}>
                        <img
                          src={projectData[item.name]?.logo || logoUrano}
                          alt={`${item.name} logo`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <h3 className={`text-sm font-conthrax ${textColor}`}>
                        {projectData[item.name].title}
                      </h3>
                    </div>
                    <Link
                      to={projectData[item.name]?.website || '#'}
                      className="text-[#14EFC0] hover:text-[#12d4ad] transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                  </div>

                  {/* Statistiche principali */}
                  <div className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-conthrax uppercase tracking-wider ${subTextColor}`}>Your uShares</span>
                      <div className="text-right">
                        <p className={`text-lg font-semibold ${textColor}`}>370</p>
                        <p className="text-xs text-[#14EFC0]">$10,280</p>
                      </div>
                    </div>

                    <div className={`border-t ${isDark ? 'border-[#1a1a2e]' : 'border-gray-200'}`}></div>

                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-conthrax uppercase tracking-wider ${subTextColor}`}>Indicative Return Rate</span>
                      <p className="text-lg font-semibold text-[#14EFC0]">37.85%</p>
                    </div>
                  </div>
                </DashboardBox>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Portfolio;
