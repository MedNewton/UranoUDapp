import { useState, useRef, useEffect, useMemo } from 'react';
import { useActiveAccount, useActiveWalletConnectionStatus } from 'thirdweb/react';
import { useTheme } from '../../../../../context/ThemeContext';
import { useToast } from '@/context/ToastContext';
import { Link } from 'react-router-dom';
import { FiPlus, FiChevronDown, FiCheck } from 'react-icons/fi';
import { formatDuration } from '@/utils/format';
import { getCachedAdminSignature } from '@/utils/adminSignature';
import { isAdminWallet } from '@/utils/adminAllowlist';

const normalizeFilterValue = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');

const buildFilterOptions = (rows, keyField, labelField) => {
  const map = new Map();
  rows.forEach((row) => {
    const key = row[keyField];
    const label = row[labelField];
    if (!key || !label || map.has(key)) return;
    map.set(key, label);
  });
  return [
    { value: 'all', label: 'All' },
    ...Array.from(map.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([value, label]) => ({ value, label })),
  ];
};

const DEFAULT_ASSET_CLASSES = ['Real Estate', 'Hospitality', 'Infrastructure'].map((label) => ({
  value: normalizeFilterValue(label),
  label,
}));

const mergeFilterOptions = (options, defaults) => {
  const map = new Map();
  options
    .filter((opt) => opt.value !== 'all')
    .forEach((opt) => map.set(opt.value, opt.label));
  defaults.forEach((opt) => {
    if (!map.has(opt.value)) {
      map.set(opt.value, opt.label);
    }
  });
  const merged = Array.from(map.entries())
    .sort((a, b) => a[1].localeCompare(b[1]))
    .map(([value, label]) => ({ value, label }));
  return [{ value: 'all', label: 'All' }, ...merged];
};

// Filter Dropdown Component
const FilterDropdown = ({ label, options, selected, onChange, isDark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCount = selected.filter(s => s !== 'all').length;
  const hasSelection = selectedCount > 0;

  const toggleOption = (value) => {
    if (value === 'all') {
      onChange(['all']);
    } else {
      let newSelected = selected.filter(s => s !== 'all');
      if (newSelected.includes(value)) {
        newSelected = newSelected.filter(s => s !== value);
      } else {
        newSelected.push(value);
      }
      if (newSelected.length === 0) {
        onChange(['all']);
      } else {
        onChange(newSelected);
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs transition-all ${
          hasSelection
            ? 'bg-[#1f1f1f] border border-[#2dbdc5]'
            : 'bg-[#1f1f1f] border border-[#2a2a2a] hover:border-[#2dbdc5]'
        }`}
      >
        <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{label}</span>
        {hasSelection && (
          <span className="flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-[#2dbdc5] text-black text-[10px] font-medium">
            {selectedCount}
          </span>
        )}
        <FiChevronDown className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute top-full left-0 mt-2 min-w-[200px] rounded-xl overflow-hidden shadow-xl z-50 ${
          isDark ? 'bg-[#1a1a1a] border border-gray-800' : 'bg-white border border-gray-200'
        }`}>
          {options.map((option) => {
            const isSelected = option.value === 'all'
              ? selected.includes('all') || selected.length === 0
              : selected.includes(option.value);

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleOption(option.value)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                  isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-50'
                }`}
              >
                <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {option.label}
                </span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected
                    ? 'border-[#2dbdc5] bg-[#2dbdc5]'
                    : isDark ? 'border-gray-600' : 'border-gray-300'
                }`}>
                  {isSelected && <FiCheck className="text-black" size={12} />}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Table Row Component
const UShareRow = ({ ushare, isDark }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={`/admin/ushares/${ushare.id}`}
      state={{ ushare: ushare.raw }}
      className="block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Desktop Row */}
      <div
        className={`hidden md:flex items-center gap-4 px-4 py-4 rounded-xl transition-all ${
          isHovered
            ? 'border-2 border-dashed border-gray-600'
            : 'border-2 border-transparent'
        } ${isDark ? 'bg-[#111]' : 'bg-white'}`}
      >
        {/* Logo + Name */}
        <div className="flex items-center gap-3 w-[220px] min-w-[220px]">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#1a1a2e] flex items-center justify-center flex-shrink-0">
            {ushare.logo ? (
              <img src={ushare.logo} alt={ushare.companyName} className="w-8 h-8 object-contain" />
            ) : (
              <span className="text-[#2dbdc5] font-bold text-sm">{ushare.tokenSymbol?.slice(0, 2)}</span>
            )}
          </div>
          <span className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {ushare.tokenName}
          </span>
        </div>

        {/* Asset Class */}
        <div className="w-[120px] min-w-[120px]">
          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {ushare.assetClass}
          </span>
        </div>

        {/* RWA Value */}
        <div className="w-[120px] min-w-[120px]">
          <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
            ${parseInt(ushare.rwaValue || 0).toLocaleString()}
          </span>
        </div>

        {/* ROI */}
        <div className="w-[80px] min-w-[80px]">
          <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {ushare.estimatedRoi || '0'}%
          </span>
        </div>

        {/* Supply */}
        <div className="w-[100px] min-w-[100px]">
          <span className="text-sm text-[#2dbdc5]">
            {ushare.soldSupply || 0}/{parseInt(ushare.totalSupply || 0).toLocaleString()}
          </span>
        </div>

        {/* Price */}
        <div className="w-[80px] min-w-[80px]">
          <span className="text-sm text-[#2dbdc5]">
            ${ushare.priceUsdc}
          </span>
        </div>

        {/* Status */}
        <div className="w-[80px] min-w-[80px]">
          <span className={`text-sm font-medium ${
            ushare.status === 'Open'
              ? 'text-[#14EFC0]'
              : ushare.status === 'Draft' || ushare.status === 'Funding'
                ? 'text-amber-400'
                : 'text-gray-400'
          }`}>
            {ushare.status}
          </span>
        </div>

        {/* Time Left */}
        <div className="flex-1 text-right">
          <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {ushare.timeLeft || '--'}
          </span>
        </div>
      </div>

      {/* Mobile Row */}
      <div
        className={`md:hidden p-4 rounded-xl transition-all ${
          isHovered
            ? 'border-2 border-dashed border-gray-600'
            : 'border-2 border-transparent'
        } ${isDark ? 'bg-[#111]' : 'bg-white'}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#1a1a2e] flex items-center justify-center">
              {ushare.logo ? (
                <img src={ushare.logo} alt={ushare.companyName} className="w-8 h-8 object-contain" />
              ) : (
                <span className="text-[#2dbdc5] font-bold text-sm">{ushare.tokenSymbol?.slice(0, 2)}</span>
              )}
            </div>
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {ushare.tokenName}
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {ushare.assetClass}
              </p>
            </div>
          </div>
          <span className={`text-sm font-medium ${
            ushare.status === 'Open'
              ? 'text-[#14EFC0]'
              : ushare.status === 'Draft' || ushare.status === 'Funding'
                ? 'text-amber-400'
                : 'text-gray-400'
          }`}>
            {ushare.status}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>RWA Value</p>
            <p className={isDark ? 'text-white' : 'text-gray-900'}>
              ${parseInt(ushare.rwaValue || 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>ROI</p>
            <p className={isDark ? 'text-white' : 'text-gray-900'}>{ushare.estimatedRoi || '0'}%</p>
          </div>
          <div>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Price</p>
            <p className="text-[#2dbdc5]">${ushare.priceUsdc}</p>
          </div>
          <div>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Supply</p>
            <p className="text-[#2dbdc5]">{ushare.soldSupply || 0}/{ushare.totalSupply}</p>
          </div>
          <div>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Time Left</p>
            <p className={isDark ? 'text-white' : 'text-gray-900'}>{ushare.timeLeft || '--'}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function ListUshares() {
  const { isDark } = useTheme();
  const { addToast } = useToast();
  const activeAccount = useActiveAccount();
  const connectionStatus = useActiveWalletConnectionStatus();
  const isAdmin = isAdminWallet(activeAccount?.address);
  const [selectedAssetClasses, setSelectedAssetClasses] = useState(['all']);
  const [selectedStatuses, setSelectedStatuses] = useState(['all']);
  const [selectedJurisdictions, setSelectedJurisdictions] = useState(['all']);
  const [ushareRows, setUshareRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const lastFetchAddressRef = useRef('');

  const formatTimeLeft = (createdAt, saleDurationDays) => {
    if (!createdAt || !saleDurationDays) return '--';
    const endTime = new Date(createdAt).getTime() + Number(saleDurationDays) * 86400 * 1000;
    const diffSeconds = Math.floor((endTime - Date.now()) / 1000);
    if (!Number.isFinite(diffSeconds) || diffSeconds <= 0) return '--';
    return formatDuration(diffSeconds);
  };

  const mapUshareRow = (row) => {
    const statusRaw = row.status ?? 'draft';
    const statusLabel = statusRaw === 'published'
      ? 'Open'
      : statusRaw === 'draft'
        ? 'Draft'
        : statusRaw === 'archived'
          ? 'Archived'
          : statusRaw;

    return {
      id: row.id,
      tokenName: row.token_name,
      tokenSymbol: row.token_symbol,
      companyName: row.company_name,
      assetClass: row.asset_class ?? '',
      assetClassKey: normalizeFilterValue(row.asset_class ?? ''),
      rwaValue: row.rwa_value ?? 0,
      estimatedRoi: row.estimated_roi ?? row.projected_yield_irr ?? '',
      totalSupply: row.total_supply ?? 0,
      soldSupply: row.sold_supply ?? 0,
      priceUsdc: row.price_usdc ?? 0,
      status: statusLabel,
      statusKey: normalizeFilterValue(statusRaw),
      jurisdiction: row.jurisdiction ?? '',
      jurisdictionKey: normalizeFilterValue(row.jurisdiction ?? ''),
      timeLeft: formatTimeLeft(row.created_at, row.sale_duration_days),
      logo: row.company_logo_url || row.hero_image_url || null,
      raw: row,
    };
  };

  useEffect(() => {
    if (connectionStatus !== 'connected') {
      setIsLoading(false);
      return;
    }
    const address = activeAccount?.address;
    if (!address) {
      setUshareRows([]);
      setLoadError('');
      lastFetchAddressRef.current = '';
      return;
    }
    if (!isAdmin) {
      setIsLoading(false);
      setLoadError('');
      lastFetchAddressRef.current = '';
      return;
    }

    if (lastFetchAddressRef.current === address) {
      return;
    }
    lastFetchAddressRef.current = address;

    let isMounted = true;

    const loadUshares = async () => {
      setIsLoading(true);
      setLoadError('');
      try {
        const { message, signature } = await getCachedAdminSignature({
          action: 'ushare-list',
          address,
          account: activeAccount,
        });

        const response = await fetch('/api/ushare-list', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, signature }),
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || 'Failed to load uShares.');
        }

        const data = await response.json();
        if (!isMounted) return;
        setUshareRows(Array.isArray(data) ? data.map(mapUshareRow) : []);
      } catch (error) {
        if (!isMounted) return;
        const message = error.message ?? 'Failed to load uShares.';
        setLoadError(message);
        addToast({ type: 'error', title: 'Load failed', message });
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadUshares();

    return () => {
      isMounted = false;
    };
  }, [activeAccount?.address, activeAccount, addToast, connectionStatus, isAdmin]);

  const assetClassOptions = useMemo(
    () => mergeFilterOptions(buildFilterOptions(ushareRows, 'assetClassKey', 'assetClass'), DEFAULT_ASSET_CLASSES),
    [ushareRows]
  );
  const statusOptions = useMemo(
    () => buildFilterOptions(ushareRows, 'statusKey', 'status'),
    [ushareRows]
  );
  const jurisdictionOptions = useMemo(
    () => buildFilterOptions(ushareRows, 'jurisdictionKey', 'jurisdiction'),
    [ushareRows]
  );

  // Filter ushares by selected asset classes, status, jurisdiction
  const filteredUshares = ushareRows.filter((u) => {
    const assetOk = selectedAssetClasses.includes('all') || selectedAssetClasses.includes(u.assetClassKey);
    const statusOk = selectedStatuses.includes('all') || selectedStatuses.includes(u.statusKey);
    const jurisdictionOk = selectedJurisdictions.includes('all') || selectedJurisdictions.includes(u.jurisdictionKey);
    return assetOk && statusOk && jurisdictionOk;
  });

  if (connectionStatus === 'connecting') {
    return (
      <div className={`min-h-screen pt-24 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 py-10">
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
        <div className="max-w-7xl mx-auto px-4 py-10">
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
        <div className="max-w-7xl mx-auto px-4 py-10">
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

  return (
    <div className={`min-h-screen pt-24 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-conthrax text-[#2dbdc5]">
            uSHAREs
          </h1>
          <Link
            to="/admin/ushares/create"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2dbdc5] text-black font-medium rounded-lg hover:bg-[#25a5ac] transition-colors"
          >
            <FiPlus /> Create New uShare
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Sort by:</span>
          <div className="flex flex-wrap items-center gap-3">
            <FilterDropdown
              label="Asset Class"
              options={assetClassOptions}
              selected={selectedAssetClasses}
              onChange={setSelectedAssetClasses}
              isDark={isDark}
            />
            <FilterDropdown
              label="Status"
              options={statusOptions}
              selected={selectedStatuses}
              onChange={setSelectedStatuses}
              isDark={isDark}
            />
            <FilterDropdown
              label="Jurisdiction"
              options={jurisdictionOptions}
              selected={selectedJurisdictions}
              onChange={setSelectedJurisdictions}
              isDark={isDark}
            />
          </div>
        </div>

        {/* Table Header */}
        <div className={`hidden md:flex items-center gap-4 px-4 py-3 mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          <div className="w-[220px] min-w-[220px] text-xs font-conthrax uppercase">Name</div>
          <div className="w-[120px] min-w-[120px] text-xs font-conthrax uppercase">Asset Class</div>
          <div className="w-[120px] min-w-[120px] text-xs font-conthrax uppercase">RWA Value</div>
          <div className="w-[80px] min-w-[80px] text-xs font-conthrax uppercase">ROI</div>
          <div className="w-[100px] min-w-[100px] text-xs font-conthrax uppercase">Supply</div>
          <div className="w-[80px] min-w-[80px] text-xs font-conthrax uppercase">Price</div>
          <div className="w-[80px] min-w-[80px] text-xs font-conthrax uppercase">Status</div>
          <div className="flex-1 text-right text-xs font-conthrax uppercase">Time Left</div>
        </div>

        {/* Table Rows */}
        <div className="space-y-2">
          {isLoading && (
            <div className={`rounded-2xl border p-10 text-center ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-2 border-[#2dbdc5]/40 border-t-[#2dbdc5] animate-spin" />
              </div>
            </div>
          )}
          {!isLoading && loadError && (
            <div className="text-sm text-red-400">{loadError}</div>
          )}
          {!isLoading && !loadError && filteredUshares.map((ushare) => (
            <UShareRow key={ushare.id} ushare={ushare} isDark={isDark} />
          ))}
        </div>

        {/* Empty State */}
        {!isLoading && !loadError && filteredUshares.length === 0 && (
          <div className={`text-center py-12 rounded-xl ${isDark ? 'bg-[#111]' : 'bg-white'}`}>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              No uShares found matching your filters.
            </p>
            <button
              onClick={() => setSelectedAssetClasses(['all'])}
              className="mt-4 text-[#2dbdc5] hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
