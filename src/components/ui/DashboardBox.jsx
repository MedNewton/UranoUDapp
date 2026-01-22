import { useTheme } from '../../context/ThemeContext';

const DashboardBox = ({ children, className = '' }) => {
  const { isDark } = useTheme();

  return (
    <div className={`
      relative
      backdrop-blur-md
      border-2
      rounded-2xl
      transition-all duration-300
      group
      ${isDark 
        ? 'bg-black/50 border-gray-800 hover:border-[#14EFC0]/50' 
        : 'bg-gradient-to-t from-gray-200/50 to-gray-100/50 border-gray-300 hover:border-[#14EFC0]/30'
      }
      ${className}
    `}>
      {/* Overlay di sfumatura in hover */}
      <div className={`
        absolute 
        inset-0 
        rounded-2xl
        opacity-0
        group-hover:opacity-100
        transition-opacity
        duration-300
        pointer-events-none
        ${isDark 
          ? 'bg-gradient-to-tr from-[#14EFC0]/10 via-transparent to-transparent'
          : 'bg-gradient-to-tr from-[#14EFC0]/5 via-transparent to-transparent'
        }
      `} />
      
      {/* Contenuto */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default DashboardBox; 