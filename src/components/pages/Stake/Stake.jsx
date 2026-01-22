import React, { useState, useEffect } from 'react';
import DashboardBox from '@/components/ui/DashboardBox';
import { useTheme } from '@/context/ThemeContext';
import poolLogo from '@/assets/img/pool_logo.png';

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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Titolo Stake */}
        <div className="flex items-center gap-1 mb-8">
          <h1 className={`text-3xl font-conthrax ${textColor}`}>Stake</h1>
          <div className="w-10 h-10">
            <img src={poolLogo} alt="Urano Logo" className="w-full h-full object-contain" />
          </div>
        </div>
        
        {/* Box con KPI */}
        <DashboardBox className="mb-8">
          <div className="grid grid-cols-3">
            {/* Staking APY */}
            <div className="p-6 border-r border-gray-800/50">
              <h2 className={`text-lg font-conthrax ${textColor} mb-4`}>Staking APY</h2>
              <p className={`text-2xl font-bold ${textColor}`}>28%</p>
            </div>
            
            {/* $URANO Price */}
            <div className="p-6 border-r border-gray-800/50">
              <h2 className={`text-lg font-conthrax ${textColor} mb-4`}>$URANO Price</h2>
              <p className={`text-2xl font-bold ${textColor}`}>$0.17</p>
            </div>
            
            {/* Total Staked $URANO */}
            <div className="p-6">
              <h2 className={`text-lg font-conthrax ${textColor} mb-4`}>Total Staked $URANO</h2>
              <p className={`text-2xl font-bold ${textColor}`}>21791758.84</p>
            </div>
          </div>
        </DashboardBox>
        
        {/* Box Container con le due card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Left Box - STAKING BALANCE */}
          <DashboardBox className="p-8">
            <div className="flex flex-col h-full">
              <h2 className={`text-xl font-conthrax ${textColor} mb-4`}>STAKING BALANCE</h2>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <p className={`text-3xl font-bold ${textColor}`}>{stakedAmount}</p>
                  <span className={`text-xl ${subTextColor}`}>URANO</span>
                </div>
                <p className={`${subTextColor}`}>${dollarValue}</p>
              </div>
              
              <div className="flex items-center gap-2 mb-6">
                <div className="text-[#2dbdc5]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
                    <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>
                    <path d="M18 12a2 2 0 0 0 0 4h4v-4z"></path>
                  </svg>
                </div>
                <p className={`${textColor}`}>Balance: {userBalance}</p>
              </div>
              
              <div className="mt-auto space-y-4">
                <div className="relative">
                  <input 
                    type="text" 
                    value={stakeInput}
                    onChange={(e) => setStakeInput(e.target.value.replace(/[^0-9.]/g, ''))}
                    placeholder="Enter Amount"
                    className="w-full py-3 px-4 bg-[#2dbdc5]/10 border border-[#2dbdc5]/50 rounded font-conthrax text-[#2dbdc5] focus:outline-none focus:border-[#2dbdc5] transition-colors"
                  />
                  <button 
                    onClick={handleStake}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#2dbdc5] text-black px-4 py-1.5 rounded font-conthrax text-sm hover:bg-[#25a4ab] transition-colors"
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
                    className="w-full py-3 px-4 bg-transparent border border-gray-700 rounded font-conthrax text-gray-400 focus:outline-none focus:border-gray-500 transition-colors"
                  />
                  <button 
                    onClick={handleUnstake}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-gray-300 px-4 py-1.5 rounded font-conthrax text-sm hover:bg-gray-600 transition-colors"
                  >
                    UNSTAKE
                  </button>
                </div>
              </div>
            </div>
          </DashboardBox>

          {/* Right Box - CLAIMABLE REWARDS */}
          <DashboardBox className="p-8">
            <div className="flex flex-col h-full">
              <h2 className={`text-xl font-conthrax ${textColor} mb-4`}>CLAIMABLE REWARDS</h2>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <p className={`text-3xl font-bold ${textColor}`}>{claimableRewards}</p>
                  <span className={`text-xl ${subTextColor}`}>URANO</span>
                </div>
                <p className={`${subTextColor}`}>${rewardsDollarValue}</p>
              </div>
              
              <div className="mt-auto space-y-4">
                <div className="relative">
                  <input 
                    type="text" 
                    value={claimInput}
                    onChange={(e) => setClaimInput(e.target.value.replace(/[^0-9.]/g, ''))}
                    placeholder="Enter Amount"
                    className="w-full py-3 px-4 bg-transparent border border-gray-700 rounded font-conthrax text-gray-400 focus:outline-none focus:border-gray-500 transition-colors"
                  />
                  <button 
                    onClick={handleClaim}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-gray-300 px-4 py-1.5 rounded font-conthrax text-sm hover:bg-gray-600 transition-colors"
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