import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useActiveAccount, useActiveWalletConnectionStatus } from 'thirdweb/react';
import { useTheme } from '../../../../../context/ThemeContext';
import { useToast } from '@/context/ToastContext';
import { FiArrowLeft, FiDownload, FiExternalLink, FiStar, FiRepeat } from 'react-icons/fi';
import { getCachedAdminSignature } from '@/utils/adminSignature';
import { isAdminWallet } from '@/utils/adminAllowlist';

// Placeholder images - replace with actual images
const placeholderImages = [
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
];

const formatCurrency = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num);
};

const formatPercent = (value) => {
  if (value === null || value === undefined || value === '') return '--';
  const num = Number(value);
  if (!Number.isFinite(num)) return String(value);
  return `${num}%`;
};

const toArrayFromText = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return String(value)
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const buildAttachments = (row) => {
  const attachments = [
    { key: 'risk_disclosure_url', label: 'Risk Disclosure' },
    { key: 'term_sheet_url', label: 'Term Sheet' },
    { key: 'business_plan_url', label: 'Business Plan' },
    { key: 'financial_statements_url', label: 'Financial Statements' },
    { key: 'valuation_report_url', label: 'Valuation Report' },
    { key: 'loan_contract_url', label: 'Loan / Contract' },
  ];

  return attachments
    .filter((item) => row[item.key])
    .map((item) => ({
      name: item.label,
      size: '--',
      url: row[item.key],
    }));
};

const mapRowToUshare = (row) => {
  if (!row) return null;

  const images = row.hero_image_url
    ? [row.hero_image_url, ...(row.gallery_image_urls ?? [])]
    : placeholderImages;

  const analysts = Array.isArray(row.analysts) ? row.analysts : [];
  const analyst = analysts[0] ?? { name: 'Analyst', rating: '--' };

  const revenueStreams = toArrayFromText(row.revenue_sources);
  const projections = Array.isArray(row.projections)
    ? row.projections
    : row.projections && typeof row.projections === 'object'
      ? Object.values(row.projections).map((entry) => String(entry))
      : toArrayFromText(row.projections);

  const attachments = buildAttachments(row);

  return {
    id: row.id,
    tokenName: row.token_name,
    tokenSymbol: row.token_symbol,
    assetClass: row.asset_class,
    priceUsdc: row.price_usdc ?? 0,
    images,
    description: row.investment_summary || row.cashflow_description || row.risk_factors || '',
    rwaValue: formatCurrency(row.rwa_value),
    projectedValue: row.projected_value_at_maturity
      ? formatCurrency(row.projected_value_at_maturity)
      : '--',
    payoutFrequency: row.payout_frequency || '--',
    maturityDate: row.maturity_date || '--',
    estimatedRoi: row.estimated_roi ?? row.projected_yield_irr ?? '--',
    payoutYield: row.cashflow_yield ?? '--',
    company: {
      name: row.company_name || '--',
      logo: row.company_logo_url || null,
      description: row.company_website || row.jurisdiction || '--',
      isVerified: Boolean(row.is_verified_issuer),
    },
    analyst: {
      name: analyst.name || 'Analyst',
      role: 'Analyst',
      avatar: null,
      rating: analyst.rating ?? '--',
      analysis: row.internal_notes || row.risk_factors || 'No analyst notes provided.',
    },
    investmentStructure: {
      dealType: row.investment_summary || '--',
      revenueStreams,
      projections,
      about: row.investor_eligibility_final || row.investor_eligibility || '--',
    },
    attachments,
    transactions: [],
    userUsdcBalance: 0,
    userUshareBalance: 0,
  };
};

const cardShell = (isDark, extra = '') =>
  `${isDark ? 'bg-[#111] border border-[#1f1f1f]' : 'bg-white border border-gray-200'} rounded-2xl ${extra}`;

// Section Header Component
const SectionHeader = ({ title, badge, isDark }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-[18px] md:text-[20px] font-conthrax tracking-wide text-white">{title}</h2>
    {badge && (
      <span className="px-3 py-1 text-[10px] uppercase tracking-wider rounded-full border border-[#2dbdc5] text-[#2dbdc5]">
        {badge}
      </span>
    )}
  </div>
);

// Info Row for Investment Structure
const InfoRow = ({ label, children, isDark }) => (
  <div className={`py-4 border-b ${isDark ? 'border-[#1f1f1f]' : 'border-gray-200'}`}>
    <div className="flex flex-col md:flex-row gap-2">
      <div className={`w-full md:w-52 shrink-0 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {label}
      </div>
      <div className={`flex-1 text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {children}
      </div>
    </div>
  </div>
);

// Attachment Item
const AttachmentItem = ({ name, size, url, isDark }) => (
  <div className={`flex items-center justify-between p-3 rounded-lg border ${isDark ? 'bg-[#141414] border-[#1f1f1f]' : 'bg-gray-50 border-gray-200'}`}>
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center">
        <span className="text-red-500 text-xs font-bold">PDF</span>
      </div>
      <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{name}</span>
    </div>
    <div className="flex items-center gap-3">
      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{size}</span>
      <button
        type="button"
        onClick={() => {
          if (url) window.open(url, '_blank', 'noopener,noreferrer');
        }}
        disabled={!url}
        className={`transition-colors ${url ? 'text-gray-400 hover:text-[#2dbdc5]' : 'text-gray-600 cursor-not-allowed'}`}
      >
        <FiDownload size={18} />
      </button>
    </div>
  </div>
);

// Transaction Row
const TransactionRow = ({ hash, type, amount, date, isDark }) => (
  <div className={`grid grid-cols-5 gap-4 py-3 border-b ${isDark ? 'border-[#1f1f1f]' : 'border-gray-200'}`}>
    <div className={`text-sm font-mono ${isDark ? 'text-white' : 'text-gray-900'}`}>{hash}</div>
    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{type}</div>
    <div className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{amount}</div>
    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{date}</div>
    <div className="text-right">
      <button className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border transition-colors ${
        isDark ? 'border-[#1f1f1f] text-gray-400 hover:text-[#2dbdc5]' : 'border-gray-200 text-gray-500 hover:text-[#2dbdc5]'
      }`}>
        <FiExternalLink size={14} />
      </button>
    </div>
  </div>
);

// Stats Box Component
const StatsBox = ({ label, value, highlight = false, isDark }) => (
  <div className={`p-4 rounded-lg border ${isDark ? 'bg-[#141414] border-[#1f1f1f]' : 'bg-gray-50 border-gray-200'}`}>
    <p className={`text-[10px] uppercase tracking-wider mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{label}</p>
    <p className={`text-sm font-medium ${highlight ? 'text-[#2dbdc5]' : isDark ? 'text-white' : 'text-gray-900'}`}>
      {value}
    </p>
  </div>
);

export default function UShareDetails() {
  const { id } = useParams();
  const location = useLocation();
  const { isDark } = useTheme();
  const { addToast } = useToast();
  const activeAccount = useActiveAccount();
  const connectionStatus = useActiveWalletConnectionStatus();
  const isAdmin = isAdminWallet(activeAccount?.address);
  useEffect(() => {
    console.log('[UShareDetails] connectionStatus:', connectionStatus, 'address:', activeAccount?.address);
  }, [connectionStatus, activeAccount?.address]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [payAmount, setPayAmount] = useState('');
  const [ushare, setUshare] = useState(() => {
    const stateRow = location.state?.ushare;
    return stateRow ? mapRowToUshare(stateRow) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const lastFetchKeyRef = useRef('');

  useEffect(() => {
    if (location.state?.ushare) {
      setUshare(mapRowToUshare(location.state.ushare));
      setSelectedImage(0);
    }
  }, [location.state]);

  useEffect(() => {
    if (connectionStatus !== 'connected') {
      setIsLoading(false);
      return;
    }
    const address = activeAccount?.address;
    if (!address || !id) {
      setUshare(null);
      setLoadError('');
      lastFetchKeyRef.current = '';
      return;
    }
    if (!isAdmin) {
      setIsLoading(false);
      setLoadError('');
      lastFetchKeyRef.current = '';
      return;
    }

    const fetchKey = `${address}-${id}`;
    if (lastFetchKeyRef.current === fetchKey) {
      return;
    }
    lastFetchKeyRef.current = fetchKey;

    let isMounted = true;

    const loadUshare = async () => {
      setIsLoading(true);
      setLoadError('');
      try {
        const { message, signature } = await getCachedAdminSignature({
          action: 'ushare-detail',
          address,
          account: activeAccount,
          extra: { id },
        });

        const response = await fetch('/api/ushare-detail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, signature }),
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || 'Failed to load uShare details.');
        }

        const row = await response.json();
        if (!isMounted) return;
        if (!row) {
          setLoadError('uShare not found.');
          setUshare(null);
          return;
        }

        setUshare(mapRowToUshare(row));
        setSelectedImage(0);
      } catch (error) {
        if (!isMounted) return;
        const message = error.message ?? 'Failed to load uShare details.';
        setLoadError(message);
        addToast({ type: 'error', title: 'Load failed', message });
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadUshare();

    return () => {
      isMounted = false;
    };
  }, [activeAccount?.address, activeAccount, id, addToast, connectionStatus, isAdmin]);

  if (connectionStatus === 'connecting') {
    return (
      <div className={`min-h-screen pt-24 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className={`rounded-2xl border p-8 text-center ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border-2 border-[#2dbdc5]/40 border-t-[#2dbdc5] animate-spin" />
            </div>
            <p className={`mt-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Connecting wallet...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!activeAccount?.address) {
    return (
      <div className={`min-h-screen pt-24 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className={`rounded-2xl border p-8 text-center ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-200'}`}>
            <p className="text-sm font-conthrax uppercase tracking-wider text-[#2dbdc5]">
              Admin Access
            </p>
            <h2 className={`mt-2 text-xl font-conthrax ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Connect your admin wallet to start
            </h2>
            <p className={`mt-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Use the wallet button in the header to connect.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className={`min-h-screen pt-24 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className={`rounded-2xl border p-8 text-center ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-200'}`}>
            <p className="text-sm font-conthrax uppercase tracking-wider text-[#2dbdc5]">
              Admin Access
            </p>
            <h2 className={`mt-2 text-xl font-conthrax ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Connected wallet is not authorized
            </h2>
            <p className={`mt-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Please connect an admin wallet to continue.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading && !ushare) {
    return (
      <div className={`min-h-screen pt-24 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className={`rounded-2xl border p-10 text-center ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border-2 border-[#2dbdc5]/40 border-t-[#2dbdc5] animate-spin" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadError && !ushare) {
    return (
      <div className={`min-h-screen pt-24 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-red-400">{loadError}</p>
          <Link
            to="/admin/ushares/list"
            className={`inline-flex items-center gap-2 mt-4 transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <FiArrowLeft /> Back to List
          </Link>
        </div>
      </div>
    );
  }

  if (!ushare) {
    return null;
  }

  return (
    <div className={`min-h-screen pt-24 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Main Content */}
          <div className="flex-1 space-y-6">
            {/* Header + Gallery */}
            <div className={cardShell(isDark, 'p-5')}>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 text-[10px] uppercase tracking-wider rounded-full border border-[#2dbdc5] text-[#2dbdc5]">
                  {ushare.assetClass}
                </span>
                <h1 className="text-[20px] md:text-[22px] font-conthrax text-white">{ushare.tokenName}</h1>
                <span className="ml-auto text-sm md:text-base font-medium text-[#2dbdc5]">
                  {ushare.priceUsdc} USDC
                </span>
              </div>

              <div className="flex gap-3">
                {/* Main Image */}
                <div className="flex-1 aspect-[16/10] rounded-xl overflow-hidden border border-[#1f1f1f]">
                  <img
                    src={ushare.images[selectedImage]}
                    alt={ushare.tokenName}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Thumbnails */}
                <div className="flex flex-col gap-3 w-28">
                  {ushare.images.slice(1, 4).map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index + 1)}
                      className={`aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index + 1 ? 'border-[#2dbdc5]' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className={cardShell(isDark, 'p-6')}>
              <SectionHeader title="Description" isDark={isDark} />
              <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {ushare.description}{' '}
                <button className="text-[#2dbdc5] hover:underline">Read more</button>
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <StatsBox label="RWA VALUE" value={ushare.rwaValue} isDark={isDark} />
                <StatsBox label="Projected RWA Value at Maturity" value={ushare.projectedValue} isDark={isDark} />
              </div>
              <div className="grid grid-cols-4 gap-3 mt-3">
                <StatsBox label="Payout Frequency" value={ushare.payoutFrequency} highlight isDark={isDark} />
                <StatsBox label="Maturity Date" value={ushare.maturityDate} isDark={isDark} />
                <StatsBox label="Estimated ROI" value={formatPercent(ushare.estimatedRoi)} isDark={isDark} />
                <StatsBox label="Payout Yield (APR)" value={formatPercent(ushare.payoutYield)} isDark={isDark} />
              </div>
            </div>

            {/* Company */}
            <div className={cardShell(isDark, 'p-6')}>
              <SectionHeader title="Company" badge={ushare.company.isVerified ? 'Verified' : null} isDark={isDark} />
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${isDark ? 'bg-[#141414] border-[#1f1f1f]' : 'bg-gray-100 border-gray-200'}`}>
                  {ushare.company.logo ? (
                    <img src={ushare.company.logo} alt="" className="w-8 h-8 object-contain" />
                  ) : (
                    <span className="text-[#2dbdc5] font-bold text-lg">E</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {ushare.company.name}
                  </h3>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {ushare.company.description}{' '}
                    <button className="text-[#2dbdc5] hover:underline">Read more</button>
                  </p>
                </div>
              </div>
            </div>

            {/* Analysis */}
            <div className={cardShell(isDark, 'p-6')}>
              <SectionHeader title="Analysis" isDark={isDark} />
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${isDark ? 'bg-[#141414] border-[#1f1f1f]' : 'bg-gray-100 border-gray-200'}`}>
                  {ushare.analyst.avatar ? (
                    <img src={ushare.analyst.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-[#2dbdc5] font-bold">P</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {ushare.analyst.name}
                      </h3>
                      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {ushare.analyst.role}
                      </p>
                    </div>
                    <span className="flex items-center gap-1 px-3 py-1 text-[11px] rounded-full border border-[#2dbdc5] text-[#2dbdc5]">
                      Rating: {ushare.analyst.rating} <FiStar size={12} className="fill-current" />
                    </span>
                  </div>
                </div>
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {ushare.analyst.analysis}{' '}
                <button className="text-[#2dbdc5] hover:underline">Read more</button>
              </p>
            </div>

            {/* Investment Structure */}
            <div className={cardShell(isDark, 'p-6')}>
              <SectionHeader title="Investment Structure" isDark={isDark} />

              <InfoRow label="Deal Type + Asset Scope" isDark={isDark}>
                {ushare.investmentStructure.dealType}
              </InfoRow>

              <InfoRow label="Revenue Streams" isDark={isDark}>
                <div>
                  <p className="mb-2">Profits will derive from:</p>
                  {ushare.investmentStructure.revenueStreams.length > 0 ? (
                    <ul className="list-none space-y-1">
                      {ushare.investmentStructure.revenueStreams.map((stream, i) => (
                        <li key={i}>• {stream}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>--</p>
                  )}
                </div>
              </InfoRow>

              <InfoRow label="Projections" isDark={isDark}>
                {ushare.investmentStructure.projections.length > 0 ? (
                  <ul className="list-none space-y-1">
                    {ushare.investmentStructure.projections.map((proj, i) => (
                      <li key={i}>• {proj}</li>
                    ))}
                  </ul>
                ) : (
                  <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>--</p>
                )}
              </InfoRow>

              <InfoRow label="About" isDark={isDark}>
                {ushare.investmentStructure.about}
              </InfoRow>

              <div className="pt-4">
                <p className={`text-sm font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Attachments
                </p>
                <div className="space-y-2">
                  {ushare.attachments.map((att, i) => (
                    <AttachmentItem key={i} name={att.name} size={att.size} url={att.url} isDark={isDark} />
                  ))}
                </div>
              </div>
            </div>

            {/* Transactions */}
            <div className={cardShell(isDark, 'p-6')}>
              <SectionHeader title="Transactions" isDark={isDark} />

              {/* Table Header */}
              <div className={`grid grid-cols-5 gap-4 py-2 text-xs font-conthrax uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                <div>Hash</div>
                <div>Type</div>
                <div>Amount</div>
                <div>Date</div>
                <div className="text-right">Tx</div>
              </div>

              {/* Table Rows */}
              {ushare.transactions.length === 0 && (
                <p className={`py-4 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  No transactions available.
                </p>
              )}
              {ushare.transactions.map((tx, i) => (
                <TransactionRow
                  key={i}
                  hash={tx.hash}
                  type={tx.type}
                  amount={tx.amount}
                  date={tx.date}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>

          {/* Right Column - Buy Panel */}
          <div className="w-full lg:w-[320px] shrink-0">
            <div className={cardShell(isDark, 'sticky top-28 p-5')}>
              {/* Pay Section */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Pay</span>
                  <span className={`text-[11px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Balance: {ushare.userUsdcBalance.toLocaleString()}
                  </span>
                </div>
                <div className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${isDark ? 'bg-[#141414] border-[#1f1f1f] hover:border-[#2dbdc5]' : 'bg-gray-50 border-gray-300 hover:border-gray-900'}`}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">$</span>
                    </div>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>USDC</span>
                  </div>
                  <input
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    placeholder="0"
                    className={`w-20 text-right bg-transparent outline-none text-lg ${isDark ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
                  />
                </div>
              </div>

              {/* Swap Icon */}
              <div className="flex justify-center my-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${isDark ? 'bg-[#141414] border-[#1f1f1f]' : 'bg-gray-100 border-gray-200'}`}>
                  <FiRepeat className={`${isDark ? 'text-gray-500' : 'text-gray-400'}`} size={14} />
                </div>
              </div>

              {/* Receive Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Receiving</span>
                  <span className={`text-[11px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Balance: {ushare.userUshareBalance}
                  </span>
                </div>
                <div className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${isDark ? 'bg-[#141414] border-[#1f1f1f] hover:border-[#2dbdc5]' : 'bg-gray-50 border-gray-300 hover:border-gray-900'}`}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#2dbdc5] flex items-center justify-center">
                      <span className="text-black text-xs font-bold">u</span>
                    </div>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>uShare</span>
                  </div>
                  <span className={`text-lg ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                    {payAmount && Number(ushare.priceUsdc) > 0
                      ? Math.floor(Number(payAmount) / Number(ushare.priceUsdc))
                      : 0}
                  </span>
                </div>
              </div>

              {/* Buy Button */}
              <button className={`w-full py-3 rounded-lg font-medium transition-colors ${
                isDark
                  ? 'bg-[#2a2a2a] text-white hover:bg-[#333] border border-[#1f1f1f]'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}>
                Buy uShare
              </button>

              {/* Conversion Rate */}
              <div className="flex items-center justify-between mt-4 text-[11px]">
                <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>Conversion rate</span>
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  {ushare.priceUsdc} USDC = 1 uSHARE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
