import React, { useState, useEffect } from 'react';
import DashboardBox from '@/components/ui/DashboardBox';
import { useTheme } from '@/context/ThemeContext';
import poolLogo from '@/assets/img/pool_logo.webp';

const Stake = () => {
  const { isDark } = useTheme();
  const textColor = isDark ? 'text-gray-200' : 'text-gray-900';
  const subTextColor = isDark ? 'text-gray-400' : 'text-gray-600';

  // Stato per gestire gli input e i valori visualizzati
  const [stakeInput, setStakeInput] = useState('');
  const [unstakeInput, setUnstakeInput] = useState('');
  const [claimInput, setClaimInput] = useState('');
  const [stakedAmount, setStakedAmount] = useState('0.00');
  const [dollarValue, setDollarValue] = useState('0.00');
  const [userBalance, setUserBalance] = useState('185.77');
  const [claimableRewards, setClaimableRewards] = useState('12.45');
  const [rewardsDollarValue, setRewardsDollarValue] = useState('0.00');
  
  // Costante per la conversione URANO -> USD (valore ipotetico)
  const uranoToUsd = 0.17;
  
  // Funzione per aggiornare il valore in dollari quando cambia lo stakedAmount o claimableRewards
  useEffect(() => {
    const amount = parseFloat(stakedAmount) || 0;
    const rewardsAmount = parseFloat(claimableRewards) || 0;
    setDollarValue((amount * uranoToUsd).toFixed(2));
    setRewardsDollarValue((rewardsAmount * uranoToUsd).toFixed(2));
  }, [stakedAmount, claimableRewards]);
  
  // Funzione per gestire lo stake
  const handleStake = () => {
    if (stakeInput && !isNaN(parseFloat(stakeInput))) {
      const inputValue = parseFloat(stakeInput);
      const balance = parseFloat(userBalance);
      
      // Controllo che l'utente abbia abbastanza balance
      if (inputValue <= balance) {
        // Aggiorna lo staked amount
        const currentStaked = parseFloat(stakedAmount) || 0;
        setStakedAmount((currentStaked + inputValue).toFixed(2));
        
        // Aggiorna il balance dell'utente
        setUserBalance((balance - inputValue).toFixed(2));
        
        // Resetta il campo di input
        setStakeInput('');
      }
    }
  };
  
  // Funzione per gestire l'unstake
  const handleUnstake = () => {
    if (unstakeInput && !isNaN(parseFloat(unstakeInput))) {
      const inputValue = parseFloat(unstakeInput);
      const currentStaked = parseFloat(stakedAmount) || 0;
      
      // Controllo che l'utente abbia abbastanza staked
      if (inputValue <= currentStaked) {
        // Aggiorna lo staked amount
        setStakedAmount((currentStaked - inputValue).toFixed(2));
        
        // Aggiorna il balance dell'utente
        const balance = parseFloat(userBalance);
        setUserBalance((balance + inputValue).toFixed(2));
        
        // Resetta il campo di input
        setUnstakeInput('');
      }
    }
  };
  
  // Funzione per gestire il claim delle rewards
  const handleClaim = () => {
    if (claimInput && !isNaN(parseFloat(claimInput))) {
      const inputValue = parseFloat(claimInput);
      const currentRewards = parseFloat(claimableRewards) || 0;
      
      // Controllo che l'utente abbia abbastanza rewards da riscattare
      if (inputValue <= currentRewards) {
        // Aggiorna le rewards disponibili
        setClaimableRewards((currentRewards - inputValue).toFixed(2));
        
        // Aggiorna il balance dell'utente
        const balance = parseFloat(userBalance);
        setUserBalance((balance + inputValue).toFixed(2));
        
        // Resetta il campo di input
        setClaimInput('');
      }
    }
  };

  return (
    <main className="pt-24 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Titolo Stake */}
        <div className="flex items-center gap-2 mb-8">
          <h1 className={`text-3xl font-conthrax ${textColor}`}>Stake</h1>
          <div className="w-10 h-10">
            <img src={poolLogo} alt="Urano Logo" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Box con KPI */}
        <DashboardBox variant="card" className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#1a1a2e]">
            {/* Staking APY */}
            <div className="p-6">
              <h2 className={`text-sm font-conthrax uppercase tracking-wider ${subTextColor} mb-3`}>Staking APY</h2>
              <p className="text-3xl font-bold text-[#14EFC0]">28%</p>
            </div>

            {/* $URANO Price */}
            <div className="p-6">
              <h2 className={`text-sm font-conthrax uppercase tracking-wider ${subTextColor} mb-3`}>$URANO Price</h2>
              <p className={`text-3xl font-bold ${textColor}`}>$0.17</p>
            </div>

            {/* Total Staked $URANO */}
            <div className="p-6">
              <h2 className={`text-sm font-conthrax uppercase tracking-wider ${subTextColor} mb-3`}>Total Staked $URANO</h2>
              <p className={`text-3xl font-bold ${textColor}`}>21,791,758.84</p>
            </div>
          </div>
        </DashboardBox>

        {/* Box Container con le due card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Box - STAKING BALANCE */}
          <DashboardBox variant="card" className="p-6 lg:p-8">
            <div className="flex flex-col h-full min-h-[320px]">
              <h2 className={`text-lg font-conthrax uppercase tracking-wider ${subTextColor} mb-6`}>Staking Balance</h2>

              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <p className={`text-4xl font-bold ${textColor}`}>{stakedAmount}</p>
                  <span className={`text-lg ${subTextColor}`}>URANO</span>
                </div>
                <p className={`text-sm ${subTextColor}`}>${dollarValue}</p>
              </div>

              <div className={`flex items-center gap-2 mb-6 px-3 py-2 rounded-lg ${isDark ? 'bg-[#1a1a2e]/50' : 'bg-gray-100'}`}>
                <div className="text-[#2dbdc5]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
                    <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>
                    <path d="M18 12a2 2 0 0 0 0 4h4v-4z"></path>
                  </svg>
                </div>
                <p className={`text-sm ${textColor}`}>Wallet Balance: <span className="text-[#2dbdc5] font-medium">{userBalance} URANO</span></p>
              </div>

              <div className="mt-auto space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={stakeInput}
                    onChange={(e) => setStakeInput(e.target.value.replace(/[^0-9.]/g, ''))}
                    placeholder="Enter Amount"
                    className={`w-full py-3 px-4 pr-24 rounded-lg font-conthrax text-sm focus:outline-none transition-all ${
                      isDark
                        ? 'bg-[#14EFC0]/10 border border-[#14EFC0]/30 text-[#14EFC0] placeholder-[#14EFC0]/50 focus:border-[#14EFC0]/60'
                        : 'bg-teal-50 border border-teal-300 text-teal-700 placeholder-teal-400 focus:border-teal-500'
                    }`}
                  />
                  <button
                    onClick={handleStake}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#14EFC0] text-black px-4 py-1.5 rounded-md font-conthrax text-xs hover:bg-[#12d4ad] transition-colors"
                  >
                    STAKE
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={unstakeInput}
                    onChange={(e) => setUnstakeInput(e.target.value.replace(/[^0-9.]/g, ''))}
                    placeholder="Enter Amount"
                    className={`w-full py-3 px-4 pr-28 rounded-lg font-conthrax text-sm focus:outline-none transition-all ${
                      isDark
                        ? 'bg-[#1a1a2e]/50 border border-[#2a2a4e] text-gray-300 placeholder-gray-500 focus:border-[#3a3a5e]'
                        : 'bg-gray-50 border border-gray-300 text-gray-700 placeholder-gray-400 focus:border-gray-400'
                    }`}
                  />
                  <button
                    onClick={handleUnstake}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 rounded-md font-conthrax text-xs transition-colors ${
                      isDark
                        ? 'bg-[#2a2a4e] text-gray-300 hover:bg-[#3a3a5e]'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    UNSTAKE
                  </button>
                </div>
              </div>
            </div>
          </DashboardBox>

          {/* Right Box - CLAIMABLE REWARDS */}
          <DashboardBox variant="card" className="p-6 lg:p-8">
            <div className="flex flex-col h-full min-h-[320px]">
              <h2 className={`text-lg font-conthrax uppercase tracking-wider ${subTextColor} mb-6`}>Claimable Rewards</h2>

              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <p className="text-4xl font-bold text-[#14EFC0]">{claimableRewards}</p>
                  <span className={`text-lg ${subTextColor}`}>URANO</span>
                </div>
                <p className={`text-sm ${subTextColor}`}>${rewardsDollarValue}</p>
              </div>

              <div className={`flex-1 flex items-center justify-center mb-6 rounded-lg ${isDark ? 'bg-[#1a1a2e]/30' : 'bg-gray-50'}`}>
                <p className={`text-sm ${subTextColor}`}>Rewards accrue automatically</p>
              </div>

              <div className="mt-auto">
                <div className="relative">
                  <input
                    type="text"
                    value={claimInput}
                    onChange={(e) => setClaimInput(e.target.value.replace(/[^0-9.]/g, ''))}
                    placeholder="Enter Amount"
                    className={`w-full py-3 px-4 pr-24 rounded-lg font-conthrax text-sm focus:outline-none transition-all ${
                      isDark
                        ? 'bg-[#1a1a2e]/50 border border-[#2a2a4e] text-gray-300 placeholder-gray-500 focus:border-[#3a3a5e]'
                        : 'bg-gray-50 border border-gray-300 text-gray-700 placeholder-gray-400 focus:border-gray-400'
                    }`}
                  />
                  <button
                    onClick={handleClaim}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 rounded-md font-conthrax text-xs transition-colors ${
                      isDark
                        ? 'bg-[#2a2a4e] text-gray-300 hover:bg-[#3a3a5e]'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    CLAIM
                  </button>
                </div>
              </div>
            </div>
          </DashboardBox>
        </div>
      </div>
    </main>
  );
};

export default Stake; 