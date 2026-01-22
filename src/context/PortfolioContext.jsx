import React, { createContext, useContext, useState, useEffect } from 'react';

// Creazione del contesto
const PortfolioContext = createContext();

// Custom hook per usare il contesto
export const usePortfolio = () => useContext(PortfolioContext);

// Provider del contesto
export const PortfolioProvider = ({ children }) => {
  // Array che tiene traccia dei progetti attivi nel portfolio dell'utente
  const [activeProjects, setActiveProjects] = useState([]);
  
  // Indice della prossima operazione da aggiungere
  const [nextProjectIndex, setNextProjectIndex] = useState(0);
  
  // Dati di esempio per i progetti in portfolio
  const availableProjects = [
    {
      id: 1,
      name: 'Aave Protocol',
      featured: 'Featured Project',
      ezPoints: '1,250',
      tvl: '$2.5M',
    },
    {
      id: 2,
      name: 'Gearbox Protocol',
      featured: 'New Launch',
      ezPoints: '850',
      tvl: '$1.2M',
    },
    {
      id: 3,
      name: 'Uniswap',
      featured: 'High Yield',
      ezPoints: '2,100',
      tvl: '$3.7M',
    },
  ];

  // Carica lo stato salvato dal localStorage all'avvio
  useEffect(() => {
    const savedProjects = localStorage.getItem('urano_portfolio_projects');
    const savedIndex = localStorage.getItem('urano_portfolio_next_index');
    
    if (savedProjects) {
      setActiveProjects(JSON.parse(savedProjects));
    }
    
    if (savedIndex) {
      setNextProjectIndex(parseInt(savedIndex, 10));
    }
  }, []);

  // Salva lo stato nel localStorage quando cambia
  useEffect(() => {
    localStorage.setItem('urano_portfolio_projects', JSON.stringify(activeProjects));
    localStorage.setItem('urano_portfolio_next_index', nextProjectIndex.toString());
  }, [activeProjects, nextProjectIndex]);

  // Funzione per aggiungere un nuovo progetto al portfolio
  const addProject = () => {
    if (nextProjectIndex < availableProjects.length) {
      const projectToAdd = availableProjects[nextProjectIndex];
      
      setActiveProjects(prev => [...prev, projectToAdd]);
      setNextProjectIndex(prev => prev + 1);
      
      return projectToAdd;
    }
    return null;
  };

  // Funzione per resettare il portfolio
  const resetPortfolio = () => {
    setActiveProjects([]);
    setNextProjectIndex(0);
  };

  // Valori esposti dal contesto
  const value = {
    activeProjects,
    availableProjects,
    addProject,
    resetPortfolio
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};
