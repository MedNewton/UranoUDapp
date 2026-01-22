import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ConnectButton } from "thirdweb/react";
import { useTheme } from '@/context/ThemeContext';
import { useWallet } from '@/context/WalletContext';
import { client, chain } from '@/lib/thirdweb';
import logoUrano from '@/assets/img/logo_urano.png';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { isConnected, displayAddress } = useWallet();

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Stake', path: '/stake' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Governance', path: '/governance' },
    { name: 'uStation', path: '/ustation' },
    { name: 'Docs', path: 'https://docs.uranoecosystem.com', external: true },
  ];

  // Custom theme for ConnectButton
  const connectButtonTheme = isDark ? "dark" : "light";

  return (
    <header className={`
      fixed w-full top-0 z-50
      ${isDark
        ? 'bg-black/50 border-gray-800'
        : 'bg-white/80 border-gray-200/50'
      }
      backdrop-blur-md border-b
      transition-colors duration-200
    `}>
      <div className="w-full px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                className="h-24 w-auto"
                src={logoUrano}
                alt="Logo"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex ml-12 space-x-6">
            {menuItems.map((item) => (
              item.external ? (
                <a
                  key={item.name}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    px-4 py-2 rounded-lg
                    text-base font-conthrax
                    transition-colors duration-200
                    hover:bg-[#2dbdc5] hover:text-white
                    ${isDark ? 'text-gray-200' : 'text-gray-700'}
                  `}
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    px-4 py-2 rounded-lg
                    text-base font-conthrax
                    transition-colors duration-200
                    hover:bg-[#2dbdc5] hover:text-white
                    ${isDark ? 'text-gray-200' : 'text-gray-700'}
                  `}
                >
                  {item.name}
                </Link>
              )
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center ml-auto space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {isDark ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Wallet Connect Button */}
            <ConnectButton
              client={client}
              chain={chain}
              theme={connectButtonTheme}
              connectButton={{
                label: "Connect Wallet",
                className: "!px-4 !py-2 !rounded-lg !text-base !font-conthrax !transition-colors !bg-[#2dbdc5] !text-white hover:!bg-[#25a4ab]",
              }}
              detailsButton={{
                className: "!px-4 !py-2 !rounded-lg !text-base !font-conthrax !transition-colors !bg-gray-800 !text-[#2dbdc5] hover:!bg-gray-700",
              }}
              connectModal={{
                size: "compact",
                title: "Connect to Urano",
                showThirdwebBranding: false,
              }}
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden ml-auto flex items-center space-x-4">
            {/* Theme Toggle Button - Mobile */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-200' : 'text-gray-700'}`}
            >
              {isDark ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none ${isDark ? 'text-gray-200' : 'text-gray-700'}`}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className={`
          px-2 pt-2 pb-3 space-y-1
          ${isDark
            ? 'bg-black/80'
            : 'bg-white/80'
          }
          backdrop-blur-md border-b border-gray-200/50
        `}>
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`
                block px-4 py-2 rounded-lg
                text-lg font-conthrax
                transition-colors duration-200
                hover:bg-[#2dbdc5] hover:text-white
                ${isDark ? 'text-gray-200' : 'text-gray-700'}
              `}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          {/* Wallet Button - Mobile */}
          <div className="px-2 pt-2">
            <ConnectButton
              client={client}
              chain={chain}
              theme={connectButtonTheme}
              connectButton={{
                label: "Connect Wallet",
                className: "!w-full !px-4 !py-2 !rounded-lg !text-lg !font-conthrax !transition-colors !bg-[#2dbdc5] !text-white hover:!bg-[#25a4ab]",
              }}
              detailsButton={{
                className: "!w-full !px-4 !py-2 !rounded-lg !text-lg !font-conthrax !transition-colors !bg-gray-800 !text-[#2dbdc5] hover:!bg-gray-700",
              }}
              connectModal={{
                size: "compact",
                title: "Connect to Urano",
                showThirdwebBranding: false,
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
