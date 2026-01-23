import { useTheme } from '@/context/ThemeContext';

const DashboardBox = ({ children, className = '', variant = 'default' }) => {
  const { isDark } = useTheme();

  const baseStyles = `
    relative
    backdrop-blur-xl
    border
    transition-all duration-300
    group
  `;

  const variantStyles = {
    default: isDark
      ? 'bg-[#0a0a0f]/80 border-[#1a1a2e] hover:border-[#14EFC0]/40 rounded-xl shadow-lg shadow-black/20'
      : 'bg-gradient-to-t from-gray-200/50 to-gray-100/50 border-gray-300 hover:border-[#14EFC0]/30 rounded-xl',
    card: isDark
      ? 'bg-[#0d0d14]/90 border-[#1f1f35]/60 hover:border-[#14EFC0]/30 rounded-2xl shadow-2xl shadow-black/40'
      : 'bg-gradient-to-t from-gray-200/50 to-gray-100/50 border-gray-300 hover:border-[#14EFC0]/30 rounded-2xl',
    row: isDark
      ? 'bg-[#0a0a0f]/70 border-[#1a1a2e]/80 hover:border-[#14EFC0]/40 hover:bg-[#0d0d14]/90 rounded-lg'
      : 'bg-white/60 border-gray-200 hover:border-[#14EFC0]/30 rounded-lg'
  };

  return (
    <div className={`
      ${baseStyles}
      ${variantStyles[variant]}
      ${className}
    `}>
      {/* Subtle gradient overlay on hover */}
      <div className={`
        absolute
        inset-0
        rounded-xl
        opacity-0
        group-hover:opacity-100
        transition-opacity
        duration-500
        pointer-events-none
        ${isDark
          ? 'bg-gradient-to-br from-[#14EFC0]/5 via-transparent to-[#2dbdc5]/5'
          : 'bg-gradient-to-tr from-[#14EFC0]/5 via-transparent to-transparent'
        }
      `} />

      {/* Inner glow effect for dark mode */}
      {isDark && (
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)'
          }}
        />
      )}

      {/* Contenuto */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default DashboardBox; 