import { useState, useRef } from 'react';
import { prepareContractCall, readContract, waitForReceipt } from 'thirdweb';
import { signMessage } from 'thirdweb/utils';
import { useActiveAccount, useActiveWalletConnectionStatus, useSendTransaction } from 'thirdweb/react';
import { decodeEventLog } from 'viem';
import { useTheme } from '../../../../../context/ThemeContext';
import { useToast } from '@/context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { uShareFactory, uShareMarket } from '@/config/contracts';
import { parseTokenAmount } from '@/utils/format';
import UShareFactoryABI from '@/abi/uShareFactory.json';
import { FiUpload, FiX, FiPlus, FiFile, FiTrash2, FiCheck, FiLoader } from 'react-icons/fi';
import { isAdminWallet } from '@/utils/adminAllowlist';

// Initial form state
const initialFormData = {
  // Step 1 - On-Chain Config
  tokenName: '',
  tokenSymbol: '',
  totalSupply: '',
  priceUsdc: '',
  saleDuration: '',
  minUranoPresale: '',
  hasCashflow: true,
  snapshotBlock: 0,

  // Step 2 - Company & Basic RWA Info
  companyName: '',
  companyWebsite: '',
  companyLogo: null,
  assetClass: '',
  jurisdiction: '',
  isVerifiedIssuer: true,

  // Step 3 - Economic Data
  rwaValue: '',
  projectedValueAtMaturity: '',
  projectedYieldIrr: '',
  maturityDate: '',
  payoutFrequency: '',
  currency: '',
  minTicket: '',

  // Step 4 - Investment Structure
  instrumentType: '',
  seniority: '',
  lockUpRedemptionNotes: '',
  entryFee: '',
  performanceFee: '',
  revenueSources: '',
  investmentSummary: '',

  // Step 5 - Cashflow
  requiresStaking: true,
  cashflowYield: '',
  cashflowFrequency: '',
  cashflowDescription: '',

  // Step 6 - Risk & Compliance
  riskFactors: '',
  investorEligibility: '',
  legalDisclaimer: '',
  riskDisclosureDoc: null,

  // Step 7 - Media & Documents
  heroImage: null,
  galleryImages: [],
  termSheet: null,
  businessPlan: null,
  financialStatements: null,
  valuationReport: null,
  loanContract: null,

  // Step 8 - Analyst Attribution
  analysts: [{ name: '', rating: '' }],
  internalNotes: '',
  investorEligibilityFinal: '',
  projectionsJson: '',
};

const STEPS = [
  { number: 1, title: 'ON-CHAIN CONFIG' },
  { number: 2, title: 'Company & Basic RWA Info' },
  { number: 3, title: 'Economic Data' },
  { number: 4, title: 'Investment Structure' },
  { number: 5, title: 'Cashflow' },
  { number: 6, title: 'Risk & Compliance' },
  { number: 7, title: 'Media & Documents' },
  { number: 8, title: 'Risk & Compliance' },
];

const USHARE_FACTORY_ABI = UShareFactoryABI.abi ?? UShareFactoryABI;
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const ASSET_CLASS_OPTIONS = [
  { value: 'Real Estate', label: 'Real Estate' },
  { value: 'Hospitality', label: 'Hospitality' },
  { value: 'Infrastructure', label: 'Infrastructure' },
];

const normalizeAddress = (value) => value?.trim().toLowerCase();

const toNullableText = (value) => {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text.length > 0 ? text : null;
};

const toNullableNumber = (value) => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const text = String(value).trim();
  if (!text) return null;
  const num = Number(text);
  return Number.isFinite(num) ? num : null;
};

const buildSupabasePayload = (formData, fileUrls, onchainData) => {
  const projectionsRaw = toNullableText(formData.projectionsJson);
  let projections = null;

  if (projectionsRaw) {
    try {
      projections = JSON.parse(projectionsRaw);
    } catch {
      throw new Error('Projections JSON is invalid.');
    }
  }

  return {
    status: 'draft',
    chain_id: Number(import.meta.env.VITE_CHAIN_ID ?? 11155111),
    u_share_id: onchainData?.uShareId ?? null,
    u_share_token: onchainData?.uShareToken ?? null,
    u_staking: onchainData?.uStaking ?? null,

    token_name: toNullableText(formData.tokenName),
    token_symbol: toNullableText(formData.tokenSymbol),
    total_supply: toNullableText(formData.totalSupply),
    sale_supply: toNullableText(formData.totalSupply),
    price_usdc: toNullableText(formData.priceUsdc),
    sale_duration_days: toNullableNumber(formData.saleDuration),
    min_urano_presale: toNullableText(formData.minUranoPresale),
    has_cashflow: Boolean(formData.hasCashflow),
    snapshot_block: toNullableNumber(formData.snapshotBlock),
    requires_staking: Boolean(formData.requiresStaking),

    company_name: toNullableText(formData.companyName),
    company_website: toNullableText(formData.companyWebsite),
    company_logo_url: fileUrls?.companyLogoUrl ?? null,
    asset_class: toNullableText(formData.assetClass),
    jurisdiction: toNullableText(formData.jurisdiction),
    is_verified_issuer: Boolean(formData.isVerifiedIssuer),

    rwa_value: toNullableText(formData.rwaValue),
    projected_value_at_maturity: toNullableText(formData.projectedValueAtMaturity),
    projected_yield_irr: toNullableText(formData.projectedYieldIrr),
    estimated_roi: null,
    maturity_date: toNullableText(formData.maturityDate),
    payout_frequency: toNullableText(formData.payoutFrequency),
    currency: toNullableText(formData.currency),
    min_ticket: toNullableText(formData.minTicket),

    instrument_type: toNullableText(formData.instrumentType),
    seniority: toNullableText(formData.seniority),
    lock_up_redemption_notes: toNullableText(formData.lockUpRedemptionNotes),
    entry_fee: toNullableText(formData.entryFee),
    performance_fee: toNullableText(formData.performanceFee),
    revenue_sources: toNullableText(formData.revenueSources),
    investment_summary: toNullableText(formData.investmentSummary),

    cashflow_yield: toNullableText(formData.cashflowYield),
    cashflow_frequency: toNullableText(formData.cashflowFrequency),
    cashflow_description: toNullableText(formData.cashflowDescription),

    risk_factors: toNullableText(formData.riskFactors),
    investor_eligibility: toNullableText(formData.investorEligibility),
    legal_disclaimer: toNullableText(formData.legalDisclaimer),
    risk_disclosure_url: fileUrls?.riskDisclosureUrl ?? null,

    hero_image_url: fileUrls?.heroImageUrl ?? null,
    gallery_image_urls: fileUrls?.galleryImageUrls ?? [],
    term_sheet_url: fileUrls?.termSheetUrl ?? null,
    business_plan_url: fileUrls?.businessPlanUrl ?? null,
    financial_statements_url: fileUrls?.financialStatementsUrl ?? null,
    valuation_report_url: fileUrls?.valuationReportUrl ?? null,
    loan_contract_url: fileUrls?.loanContractUrl ?? null,

    analysts: Array.isArray(formData.analysts) ? formData.analysts : [],
    internal_notes: toNullableText(formData.internalNotes),
    investor_eligibility_final: toNullableText(formData.investorEligibilityFinal),
    projections,
  };
};

const readFileAsBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result?.toString() ?? '');
  reader.onerror = () => reject(new Error('Failed to read file.'));
  reader.readAsDataURL(file);
});

const buildUploadMessage = (address) =>
  JSON.stringify({
    action: 'ushare-upload',
    address,
    timestamp: Date.now(),
  });

const hasUploads = (formData) => Boolean(
  formData.companyLogo ||
  formData.riskDisclosureDoc ||
  formData.heroImage ||
  (formData.galleryImages?.length ?? 0) > 0 ||
  formData.termSheet ||
  formData.businessPlan ||
  formData.financialStatements ||
  formData.valuationReport ||
  formData.loanContract
);

const buildOnchainParams = (formData) => {
  const tokenName = toNullableText(formData.tokenName);
  const tokenSymbol = toNullableText(formData.tokenSymbol);

  if (!tokenName || !tokenSymbol) {
    throw new Error('Token name and symbol are required.');
  }

  const totalSupply = parseTokenAmount(formData.totalSupply, 18);
  if (!totalSupply || totalSupply <= 0n) {
    throw new Error('Total supply must be greater than zero.');
  }

  const priceUsdc = parseTokenAmount(formData.priceUsdc, 6);
  if (!priceUsdc || priceUsdc <= 0n) {
    throw new Error('uShare price must be greater than zero.');
  }

  const saleDurationDays = Number(formData.saleDuration ?? 0);
  if (!Number.isFinite(saleDurationDays) || saleDurationDays <= 0) {
    throw new Error('Sale duration (days) must be greater than zero.');
  }

  const saleDurationSeconds = BigInt(Math.floor(saleDurationDays * 86400));
  const minUranoPresale = parseTokenAmount(formData.minUranoPresale, 18);
  const snapshotBlock = BigInt(Math.max(0, Number(formData.snapshotBlock ?? 0)));

  return {
    tokenName,
    tokenSymbol,
    totalSupply,
    uShareInfoParams: [
      totalSupply,
      priceUsdc,
      minUranoPresale,
      snapshotBlock,
      saleDurationSeconds,
      Boolean(formData.hasCashflow),
    ],
  };
};

// Reusable Input Component
const FormInput = ({ label, placeholder, value, onChange, type = 'text', isDark }) => (
  <div className="flex-1">
    <div className={`relative border transition-colors ${isDark ? 'border-gray-600 hover:border-white bg-[#1a1a1a]' : 'border-gray-300 hover:border-gray-900 bg-white'} rounded-lg`}>
      <label className={`absolute -top-2.5 left-3 px-1 text-xs ${isDark ? 'bg-[#1a1a1a] text-[#2dbdc5]' : 'bg-white text-[#2dbdc5]'}`}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-transparent rounded-lg outline-none ${isDark ? 'text-gray-300 placeholder-gray-500' : 'text-gray-700 placeholder-gray-400'}`}
      />
    </div>
  </div>
);

// Reusable Textarea Component
const FormTextarea = ({ label, placeholder, value, onChange, isDark, rows = 3 }) => (
  <div className="flex-1">
    <div className={`relative border transition-colors ${isDark ? 'border-gray-600 hover:border-white bg-[#1a1a1a]' : 'border-gray-300 hover:border-gray-900 bg-white'} rounded-lg`}>
      <label className={`absolute -top-2.5 left-3 px-1 text-xs ${isDark ? 'bg-[#1a1a1a] text-[#2dbdc5]' : 'bg-white text-[#2dbdc5]'}`}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 bg-transparent rounded-lg outline-none resize-none ${isDark ? 'text-gray-300 placeholder-gray-500' : 'text-gray-700 placeholder-gray-400'}`}
      />
    </div>
  </div>
);

// Reusable Select Component
const FormSelect = ({ label, placeholder, value, onChange, options, isDark }) => (
  <div className="flex-1">
    <div className={`relative border transition-colors ${isDark ? 'border-gray-600 hover:border-white bg-[#1a1a1a]' : 'border-gray-300 hover:border-gray-900 bg-white'} rounded-lg`}>
      <label className={`absolute -top-2.5 left-3 px-1 text-xs ${isDark ? 'bg-[#1a1a1a] text-[#2dbdc5]' : 'bg-white text-[#2dbdc5]'}`}>
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 bg-transparent rounded-lg outline-none appearance-none cursor-pointer ${isDark ? 'text-gray-300' : 'text-gray-700'} ${!value ? (isDark ? 'text-gray-500' : 'text-gray-400') : ''}`}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className={isDark ? 'bg-[#1a1a1a]' : 'bg-white'}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);

// Reusable Toggle Component - Matches Figma design
const FormToggle = ({ label, subtitle, value, onChange, yesLabel = 'Yes', noLabel = 'No', isDark }) => (
  <div className={`flex items-center justify-between p-4 rounded-lg ${isDark ? 'bg-[#1f1f1f]' : 'bg-gray-100'}`}>
    <div>
      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{label}</p>
      {subtitle && <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{subtitle}</p>}
    </div>
    <div className={`flex rounded-full p-1 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'}`}>
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`px-4 py-1.5 text-sm rounded-full transition-all ${
          value
            ? 'border border-[#2dbdc5] text-[#2dbdc5]'
            : 'border border-transparent text-gray-400'
        }`}
      >
        {yesLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`px-4 py-1.5 text-sm rounded-full transition-all ${
          !value
            ? 'border border-[#2dbdc5] text-[#2dbdc5]'
            : 'border border-transparent text-gray-400'
        }`}
      >
        {noLabel}
      </button>
    </div>
  </div>
);

// File Item Component - shows individual uploaded file with status
const FileItem = ({ file, onRemove, isDark, isImage = false }) => {
  const [status, setStatus] = useState('complete'); // 'loading' | 'complete' | 'error'
  const fileSize = file.size ? `${Math.round(file.size / 1024)}kb` : '100kb';
  const isError = status === 'error';
  const isLoading = status === 'loading';

  // For image files, create a preview URL
  const [preview, setPreview] = useState(null);
  useState(() => {
    if (isImage && file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file, isImage]);

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${
      isError
        ? 'border-red-500/50 bg-red-500/10'
        : isDark ? 'border-gray-700 bg-[#1a1a1a]' : 'border-gray-200 bg-gray-50'
    }`}>
      {/* File Icon or Image Preview */}
      {isImage && preview ? (
        <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
          <img src={preview} alt={file.name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <FiFile className={`text-xl flex-shrink-0 ${isError ? 'text-red-500' : 'text-[#2dbdc5]'}`} />
      )}

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm truncate ${isError ? 'text-red-500' : isDark ? 'text-white' : 'text-gray-900'}`}>
          {isError ? 'Upload failed.' : file.name}
        </p>
        <p className={`text-xs ${isError ? 'text-red-400' : isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          {isError ? 'File too large • Failed' : `${fileSize} • ${isLoading ? 'Loading' : 'Complete'}`}
        </p>
        {/* Progress Bar */}
        {(isLoading || status === 'complete') && (
          <div className={`mt-1.5 h-0.5 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div
              className={`h-full rounded-full transition-all ${isError ? 'bg-red-500' : 'bg-[#2dbdc5]'}`}
              style={{ width: isLoading ? '60%' : '100%' }}
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={onRemove}
          className={`p-1 transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <FiTrash2 size={18} />
        </button>
        {status === 'complete' && (
          <div className="w-6 h-6 rounded-full border-2 border-[#2dbdc5] flex items-center justify-center">
            <FiCheck className="text-[#2dbdc5]" size={14} />
          </div>
        )}
        {isLoading && (
          <div className="w-6 h-6">
            <FiLoader className="text-[#2dbdc5] animate-spin" size={24} />
          </div>
        )}
      </div>
    </div>
  );
};

// Image Gallery Preview - for multiple images
const ImageGalleryPreview = ({ files, onRemove, isDark }) => {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${isDark ? 'border-gray-700 bg-[#1a1a1a]' : 'border-gray-200 bg-gray-50'}`}>
      <div className="flex gap-2 flex-1">
        {files.slice(0, 4).map((file, index) => (
          <div key={index} className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {files.length > 4 && (
          <div className={`w-12 h-12 rounded flex items-center justify-center text-sm ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
            +{files.length - 4}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={() => onRemove()}
          className={`p-1 transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <FiTrash2 size={18} />
        </button>
        <div className="w-6 h-6 rounded-full border-2 border-[#2dbdc5] flex items-center justify-center">
          <FiCheck className="text-[#2dbdc5]" size={14} />
        </div>
      </div>
    </div>
  );
};

// File Upload Component - Enhanced with Figma design
const FileUpload = ({ label, accept, maxSize, value, onChange, isDark, multiple = false, maxSizeBytes = 3 * 1024 * 1024 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const isImageUpload = accept?.includes('image') || accept?.includes('.png') || accept?.includes('.jpg');

  const validateFile = (file) => {
    // Check file size
    if (file.size > maxSizeBytes) {
      return 'File too large';
    }
    // Check file type
    const acceptedTypes = accept?.split(',').map(t => t.trim().toLowerCase()) || [];
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();
    const fileMime = file.type.toLowerCase();

    const isValidType = acceptedTypes.some(type =>
      type === fileExt ||
      type === fileMime ||
      (type.includes('*') && fileMime.startsWith(type.replace('*', '')))
    );

    if (acceptedTypes.length > 0 && !isValidType) {
      return 'Unsupported file';
    }
    return null;
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const processFiles = (files) => {
    setError(null);

    if (files.length === 0) return;

    // Validate files
    for (const file of files) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    if (multiple) {
      const currentFiles = value || [];
      onChange([...currentFiles, ...files]);
    } else {
      onChange(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const removeFile = (index) => {
    setError(null);
    if (multiple) {
      const newFiles = [...(value || [])];
      newFiles.splice(index, 1);
      onChange(newFiles.length > 0 ? newFiles : []);
    } else {
      onChange(null);
    }
  };

  const clearAll = () => {
    setError(null);
    onChange(multiple ? [] : null);
  };

  const hasFiles = multiple ? (value?.length > 0) : (value !== null);

  // Determine border color based on state
  const getBorderClass = () => {
    if (error) return 'border-red-500 bg-red-500/5';
    if (isDragging) return 'border-[#2dbdc5]';
    return isDark ? 'border-gray-600 hover:border-[#2dbdc5]' : 'border-gray-300 hover:border-[#2dbdc5]';
  };

  return (
    <div className="flex-1 space-y-3">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${getBorderClass()}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Upload Icon */}
        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3 ${
          error ? 'bg-red-500/20' : 'bg-[#2dbdc5]/20'
        }`}>
          <FiUpload className={`text-xl ${error ? 'text-red-500' : 'text-[#2dbdc5]'}`} />
        </div>

        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{label}</p>
        <p className={`text-xs mt-1 ${error ? 'text-red-500' : isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          {error || maxSize}
        </p>
      </div>

      {/* File List */}
      {hasFiles && (
        <div className="space-y-2">
          {multiple ? (
            isImageUpload && value?.length > 0 ? (
              <ImageGalleryPreview files={value} onRemove={clearAll} isDark={isDark} />
            ) : (
              value?.map((file, index) => (
                <FileItem
                  key={index}
                  file={file}
                  onRemove={() => removeFile(index)}
                  isDark={isDark}
                  isImage={isImageUpload}
                />
              ))
            )
          ) : (
            <FileItem
              file={value}
              onRemove={() => removeFile()}
              isDark={isDark}
              isImage={isImageUpload}
            />
          )}
        </div>
      )}
    </div>
  );
};

// Form Row Component
const FormRow = ({ label, children, isDark }) => (
  <div className="flex flex-col md:flex-row md:items-start gap-4 py-4">
    <div className={`w-full md:w-48 shrink-0 ${isDark ? 'text-[#2dbdc5]' : 'text-[#2dbdc5]'} font-medium`}>
      {label}
    </div>
    <div className="flex-1 flex flex-col md:flex-row gap-4">
      {children}
    </div>
  </div>
);

export default function CreateUShares() {
  const { isDark } = useTheme();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const activeAccount = useActiveAccount();
  const connectionStatus = useActiveWalletConnectionStatus();
  const isAdmin = isAdminWallet(activeAccount?.address);
  const { mutateAsync: sendTx } = useSendTransaction();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStage, setSubmitStage] = useState('');

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 8) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const uploadFile = async (file, folder, uploadAuth) => {
    if (!file) return null;
    if (!uploadAuth?.message || !uploadAuth?.signature) {
      throw new Error('Missing upload authorization.');
    }

    const dataBase64 = await readFileAsBase64(file);
    const response = await fetch('/api/ushare-upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: uploadAuth.message,
        signature: uploadAuth.signature,
        fileName: file.name,
        contentType: file.type,
        dataBase64,
        folder,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'File upload failed.');
    }

    const json = await response.json();
    return json?.publicUrl ?? null;
  };

  const uploadAllFiles = async (uploadAuth) => {
    if (!hasUploads(formData)) {
      return {
        companyLogoUrl: null,
        riskDisclosureUrl: null,
        heroImageUrl: null,
        galleryImageUrls: [],
        termSheetUrl: null,
        businessPlanUrl: null,
        financialStatementsUrl: null,
        valuationReportUrl: null,
        loanContractUrl: null,
      };
    }

    setSubmitStage('Uploading files...');

    const [
      companyLogoUrl,
      riskDisclosureUrl,
      heroImageUrl,
      termSheetUrl,
      businessPlanUrl,
      financialStatementsUrl,
      valuationReportUrl,
      loanContractUrl,
    ] = await Promise.all([
      uploadFile(formData.companyLogo, 'company-logos', uploadAuth),
      uploadFile(formData.riskDisclosureDoc, 'risk-disclosures', uploadAuth),
      uploadFile(formData.heroImage, 'hero-images', uploadAuth),
      uploadFile(formData.termSheet, 'term-sheets', uploadAuth),
      uploadFile(formData.businessPlan, 'business-plans', uploadAuth),
      uploadFile(formData.financialStatements, 'financial-statements', uploadAuth),
      uploadFile(formData.valuationReport, 'valuation-reports', uploadAuth),
      uploadFile(formData.loanContract, 'loan-contracts', uploadAuth),
    ]);

    const galleryImages = formData.galleryImages ?? [];
    const galleryImageUrls = await Promise.all(
      galleryImages.map((file) => uploadFile(file, 'gallery', uploadAuth))
    );

    return {
      companyLogoUrl,
      riskDisclosureUrl,
      heroImageUrl,
      galleryImageUrls: galleryImageUrls.filter(Boolean),
      termSheetUrl,
      businessPlanUrl,
      financialStatementsUrl,
      valuationReportUrl,
      loanContractUrl,
    };
  };

  const extractUShareCreated = (receipt) => {
    const factoryAddress = normalizeAddress(uShareFactory.address);
    for (const log of receipt?.logs ?? []) {
      if (normalizeAddress(log.address) !== factoryAddress) {
        continue;
      }
      try {
        const decoded = decodeEventLog({
          abi: USHARE_FACTORY_ABI,
          data: log.data,
          topics: log.topics,
        });
        if (decoded.eventName === 'uShareCreated') {
          return {
            uShareId: decoded.args.uShareId,
            uShareToken: decoded.args.uShareToken,
          };
        }
      } catch {
        // ignore unrelated logs
      }
    }
    return null;
  };

  const createOnChain = async () => {
    setSubmitStage('Creating on-chain uShare...');
    const { tokenName, tokenSymbol, totalSupply, uShareInfoParams } = buildOnchainParams(formData);
    const tx = prepareContractCall({
      contract: uShareFactory,
      method: 'createuShare',
      params: [tokenName, tokenSymbol, totalSupply, uShareInfoParams],
    });

    const txResult = await sendTx(tx);
    const receipt = await waitForReceipt(txResult);
    const created = extractUShareCreated(receipt);
    if (!created?.uShareId || !created?.uShareToken) {
      throw new Error('Failed to read uShare creation event.');
    }

    const uShareInfo = await readContract({
      contract: uShareMarket,
      method: 'getuShareInfo',
      params: [created.uShareId],
    });

    const uStaking = uShareInfo?.uStaking ?? ZERO_ADDRESS;

    return {
      uShareId: created.uShareId,
      uShareToken: created.uShareToken,
      uStaking: uStaking === ZERO_ADDRESS ? null : uStaking,
    };
  };

  const handleFinish = async () => {
    if (!activeAccount?.address) {
      addToast({
        type: 'error',
        title: 'Wallet not connected',
        message: 'Connect an admin wallet to save this uShare.',
      });
      return;
    }
    if (!isAdmin) {
      addToast({
        type: 'error',
        title: 'Not authorized',
        message: 'The connected wallet is not authorized to create uShares.',
      });
      return;
    }

    try {
      buildOnchainParams(formData);
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Invalid form data',
        message: error.message ?? 'Please check your inputs.',
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStage('');
    try {
      let uploadAuth = null;
      if (hasUploads(formData)) {
        const uploadMessage = buildUploadMessage(activeAccount.address);
        const uploadSignature = await signMessage({ message: uploadMessage, account: activeAccount });
        uploadAuth = { message: uploadMessage, signature: uploadSignature };
      }

      const fileUrls = await uploadAllFiles(uploadAuth);
      const onchainData = await createOnChain();
      const payload = buildSupabasePayload(formData, fileUrls, onchainData);

      setSubmitStage('Saving to Supabase...');
      const message = JSON.stringify({
        action: 'ushare-create',
        address: activeAccount.address,
        timestamp: Date.now(),
        data: payload,
      });

      const signature = await signMessage({ message, account: activeAccount });

      const response = await fetch('/api/ushare-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, signature }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to save uShare.');
      }

      addToast({
        type: 'success',
        title: 'uShare saved',
        message: 'Draft saved to Supabase.',
      });
      navigate('/admin/ushares/list');
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Save failed',
        message: error.message ?? 'Please try again.',
      });
    } finally {
      setIsSubmitting(false);
      setSubmitStage('');
    }
  };

  const addAnalyst = () => {
    setFormData((prev) => ({
      ...prev,
      analysts: [...prev.analysts, { name: '', rating: '' }],
    }));
  };

  const updateAnalyst = (index, field, value) => {
    setFormData((prev) => {
      const newAnalysts = [...prev.analysts];
      newAnalysts[index] = { ...newAnalysts[index], [field]: value };
      return { ...prev, analysts: newAnalysts };
    });
  };

  const removeAnalyst = (index) => {
    setFormData((prev) => ({
      ...prev,
      analysts: prev.analysts.filter((_, i) => i !== index),
    }));
  };

  // Step Components
  const renderStep1 = () => (
    <>
      <FormRow label="Token Identity" isDark={isDark}>
        <FormInput
          label="Token Name"
          placeholder="Name of the ERC20 uShare"
          value={formData.tokenName}
          onChange={(e) => updateField('tokenName', e.target.value)}
          isDark={isDark}
        />
        <FormInput
          label="Token Symbol"
          placeholder="Enter token symbol"
          value={formData.tokenSymbol}
          onChange={(e) => updateField('tokenSymbol', e.target.value)}
          isDark={isDark}
        />
      </FormRow>

      <FormRow label="Supply & Pricing" isDark={isDark}>
        <FormInput
          label="Total uShare Supply"
          placeholder="Enter total supply minted"
          value={formData.totalSupply}
          onChange={(e) => updateField('totalSupply', e.target.value)}
          type="number"
          isDark={isDark}
        />
        <FormInput
          label="uShare Price (USDC)"
          placeholder="Price per uShare"
          value={formData.priceUsdc}
          onChange={(e) => updateField('priceUsdc', e.target.value)}
          type="number"
          isDark={isDark}
        />
      </FormRow>

      <FormRow label="Sale & Eligibility" isDark={isDark}>
        <FormInput
          label="Sale Duration (days)"
          placeholder="Enter the number of days"
          value={formData.saleDuration}
          onChange={(e) => updateField('saleDuration', e.target.value)}
          type="number"
          isDark={isDark}
        />
        <FormInput
          label="Min URANO for Pre-Sale"
          placeholder="Enter the minimum amount"
          value={formData.minUranoPresale}
          onChange={(e) => updateField('minUranoPresale', e.target.value)}
          type="number"
          isDark={isDark}
        />
      </FormRow>

      <FormToggle
        label="Has Cashflow"
        subtitle="Whether the RWA uses cashflow"
        value={formData.hasCashflow}
        onChange={(val) => updateField('hasCashflow', val)}
        isDark={isDark}
      />

      <div className={`flex items-center justify-between p-4 mt-4 rounded-lg ${isDark ? 'bg-[#1f1f1f]' : 'bg-gray-100'}`}>
        <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Snapshot Block</p>
        <div className={`px-4 py-1.5 rounded-full border ${isDark ? 'border-gray-600 text-white' : 'border-gray-300 text-gray-900'}`}>
          {formData.snapshotBlock}
        </div>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <FormRow label="Company Identity" isDark={isDark}>
        <FormInput
          label="Company Name"
          placeholder="Enter the legal company name"
          value={formData.companyName}
          onChange={(e) => updateField('companyName', e.target.value)}
          isDark={isDark}
        />
        <FormInput
          label="Company Website"
          placeholder="https://company-website.com"
          value={formData.companyWebsite}
          onChange={(e) => updateField('companyWebsite', e.target.value)}
          isDark={isDark}
        />
      </FormRow>

      <FormRow label="Company Logo" isDark={isDark}>
        <FileUpload
          label="Upload or drag and drop company logo"
          accept=".png,.jpg,.jpeg"
          maxSize="PNG, JPG (max. 3MB)"
          value={formData.companyLogo}
          onChange={(file) => updateField('companyLogo', file)}
          isDark={isDark}
        />
      </FormRow>

      <FormRow label="Asset Classification" isDark={isDark}>
        <FormSelect
          label="Asset Class"
          placeholder="Select asset class"
          value={formData.assetClass}
          onChange={(e) => updateField('assetClass', e.target.value)}
          options={ASSET_CLASS_OPTIONS}
          isDark={isDark}
        />
        <FormInput
          label="Jurisdiction"
          placeholder="Legal or SPV jurisdiction of the asset"
          value={formData.jurisdiction}
          onChange={(e) => updateField('jurisdiction', e.target.value)}
          isDark={isDark}
        />
      </FormRow>

      <FormToggle
        label="Verified Issuer"
        subtitle="Is this issuer verified?"
        value={formData.isVerifiedIssuer}
        onChange={(val) => updateField('isVerifiedIssuer', val)}
        yesLabel="Verified"
        noLabel="Not verified"
        isDark={isDark}
      />
    </>
  );

  const renderStep3 = () => (
    <>
      <FormRow label="Asset Valuation" isDark={isDark}>
        <FormInput
          label="RWA Value"
          placeholder="Enter current asset valuation"
          value={formData.rwaValue}
          onChange={(e) => updateField('rwaValue', e.target.value)}
          type="number"
          isDark={isDark}
        />
        <FormInput
          label="Projected Value at Maturity"
          placeholder="Enter projected value at maturity"
          value={formData.projectedValueAtMaturity}
          onChange={(e) => updateField('projectedValueAtMaturity', e.target.value)}
          type="number"
          isDark={isDark}
        />
      </FormRow>

      <FormRow label="Returns" isDark={isDark}>
        <FormInput
          label="Projected Yield / IRR"
          placeholder="Enter indicative yield or IRR"
          value={formData.projectedYieldIrr}
          onChange={(e) => updateField('projectedYieldIrr', e.target.value)}
          isDark={isDark}
        />
      </FormRow>

      <FormRow label="Timing" isDark={isDark}>
        <FormInput
          label="Maturity Date"
          placeholder="Select maturity date"
          value={formData.maturityDate}
          onChange={(e) => updateField('maturityDate', e.target.value)}
          type="date"
          isDark={isDark}
        />
        <FormSelect
          label="Payout Frequency"
          placeholder="Select Frequency"
          value={formData.payoutFrequency}
          onChange={(e) => updateField('payoutFrequency', e.target.value)}
          options={[
            { value: 'monthly', label: 'Monthly' },
            { value: 'quarterly', label: 'Quarterly' },
            { value: 'semi-annually', label: 'Semi-Annually' },
            { value: 'annually', label: 'Annually' },
            { value: 'at-maturity', label: 'At Maturity' },
          ]}
          isDark={isDark}
        />
      </FormRow>

      <FormRow label="Investment Constraints" isDark={isDark}>
        <FormSelect
          label="Currency"
          placeholder="Select currency"
          value={formData.currency}
          onChange={(e) => updateField('currency', e.target.value)}
          options={[
            { value: 'USDC', label: 'USDC' },
            { value: 'USDT', label: 'USDT' },
            { value: 'USD', label: 'USD' },
            { value: 'EUR', label: 'EUR' },
          ]}
          isDark={isDark}
        />
        <FormInput
          label="Min Ticket"
          placeholder="Enter minimum investment amount"
          value={formData.minTicket}
          onChange={(e) => updateField('minTicket', e.target.value)}
          type="number"
          isDark={isDark}
        />
      </FormRow>
    </>
  );

  const renderStep4 = () => (
    <>
      <FormRow label="Instrument & Capital Position" isDark={isDark}>
        <FormInput
          label="Instrument Type"
          placeholder="Enter investment instrument type"
          value={formData.instrumentType}
          onChange={(e) => updateField('instrumentType', e.target.value)}
          isDark={isDark}
        />
        <FormSelect
          label="Seniority"
          placeholder="Select capital stack position"
          value={formData.seniority}
          onChange={(e) => updateField('seniority', e.target.value)}
          options={[
            { value: 'senior', label: 'Senior' },
            { value: 'mezzanine', label: 'Mezzanine' },
            { value: 'junior', label: 'Junior' },
            { value: 'equity', label: 'Equity' },
          ]}
          isDark={isDark}
        />
      </FormRow>

      <FormRow label="Redemption & Lock-Up Rules" isDark={isDark}>
        <FormTextarea
          label="Lock-Up / Redemption Notes"
          placeholder="Describe redemption and lock-up conditions"
          value={formData.lockUpRedemptionNotes}
          onChange={(e) => updateField('lockUpRedemptionNotes', e.target.value)}
          isDark={isDark}
        />
      </FormRow>

      <FormRow label="Fees & Costs" isDark={isDark}>
        <FormInput
          label="Entry Fee"
          placeholder="Enter entry fee percentage"
          value={formData.entryFee}
          onChange={(e) => updateField('entryFee', e.target.value)}
          isDark={isDark}
        />
        <FormInput
          label="Performance Fee"
          placeholder="Enter performance fee terms"
          value={formData.performanceFee}
          onChange={(e) => updateField('performanceFee', e.target.value)}
          isDark={isDark}
        />
      </FormRow>

      <FormRow label="Cashflow Sources" isDark={isDark}>
        <FormInput
          label="Revenue Streams"
          placeholder="List main revenue sources"
          value={formData.revenueSources}
          onChange={(e) => updateField('revenueSources', e.target.value)}
          isDark={isDark}
        />
      </FormRow>

      <FormRow label="Investment Summary" isDark={isDark}>
        <FormTextarea
          label="Investment Structure Description"
          placeholder="Describe how the investment works in simple terms"
          value={formData.investmentSummary}
          onChange={(e) => updateField('investmentSummary', e.target.value)}
          isDark={isDark}
          rows={4}
        />
      </FormRow>
    </>
  );

  const renderStep5 = () => (
    <>
      <FormToggle
        label="Requires Staking to Earn Cashflow"
        subtitle="Do users need to stake uShares to earn cashflow?"
        value={formData.requiresStaking}
        onChange={(val) => updateField('requiresStaking', val)}
        isDark={isDark}
      />

      <FormRow label="Yield Parameters" isDark={isDark}>
        <FormInput
          label="Cashflow Yield (Target) %"
          placeholder="Enter target cashflow yield"
          value={formData.cashflowYield}
          onChange={(e) => updateField('cashflowYield', e.target.value)}
          type="number"
          isDark={isDark}
        />
        <FormSelect
          label="Cashflow Frequency"
          placeholder="Select cashflow distribution frequency"
          value={formData.cashflowFrequency}
          onChange={(e) => updateField('cashflowFrequency', e.target.value)}
          options={[
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'quarterly', label: 'Quarterly' },
            { value: 'semi-annually', label: 'Semi-Annually' },
            { value: 'annually', label: 'Annually' },
          ]}
          isDark={isDark}
        />
      </FormRow>

      <FormRow label="Cashflow Explanation" isDark={isDark}>
        <FormTextarea
          label="Cashflow Description"
          placeholder="Explain how users earn cashflow"
          value={formData.cashflowDescription}
          onChange={(e) => updateField('cashflowDescription', e.target.value)}
          isDark={isDark}
          rows={4}
        />
      </FormRow>
    </>
  );

  const renderStep6 = () => (
    <>
      <FormRow label="Risk Factors" isDark={isDark}>
        <FormTextarea
          label="Risk Factors"
          placeholder="List the main risks associated with this investment"
          value={formData.riskFactors}
          onChange={(e) => updateField('riskFactors', e.target.value)}
          isDark={isDark}
          rows={3}
        />
      </FormRow>

      <FormRow label="Investor Eligibility" isDark={isDark}>
        <FormTextarea
          label="Investor Eligibility"
          placeholder="Describe who this investment is intended for"
          value={formData.investorEligibility}
          onChange={(e) => updateField('investorEligibility', e.target.value)}
          isDark={isDark}
          rows={3}
        />
      </FormRow>

      <FormRow label="Legal Disclaimer (MiCA-style)" isDark={isDark}>
        <FormTextarea
          label="Cashflow Description"
          placeholder="Explain how users earn cashflow"
          value={formData.legalDisclaimer}
          onChange={(e) => updateField('legalDisclaimer', e.target.value)}
          isDark={isDark}
          rows={3}
        />
      </FormRow>

      <FormRow label="Risk Disclosure Document" isDark={isDark}>
        <FileUpload
          label="Upload risk disclosure"
          accept=".pdf"
          maxSize="PDF (max. 10 MB)"
          value={formData.riskDisclosureDoc}
          onChange={(file) => updateField('riskDisclosureDoc', file)}
          isDark={isDark}
        />
      </FormRow>
    </>
  );

  const renderStep7 = () => (
    <>
      <FormRow label="Hero Image" isDark={isDark}>
        <FileUpload
          label="Upload hero image for the asset page"
          accept=".png,.jpg,.jpeg"
          maxSize="PNG, JPG (max. 3MB)"
          value={formData.heroImage}
          onChange={(file) => updateField('heroImage', file)}
          isDark={isDark}
        />
      </FormRow>

      <FormRow label="Gallery Images" isDark={isDark}>
        <FileUpload
          label="Upload additional images of the asset"
          accept=".png,.jpg,.jpeg"
          maxSize="PNG, JPG (max. 3MB)"
          value={formData.galleryImages}
          onChange={(files) => updateField('galleryImages', files)}
          isDark={isDark}
          multiple
        />
      </FormRow>

      <FormRow label="Term Sheet" isDark={isDark}>
        <FileUpload
          label="Upload term sheet document"
          accept=".pdf"
          maxSize="PDF (max. 3MB)"
          value={formData.termSheet}
          onChange={(file) => updateField('termSheet', file)}
          isDark={isDark}
        />
      </FormRow>

      <FormRow label="Business Plan" isDark={isDark}>
        <FileUpload
          label="Upload business plan document"
          accept=".pdf"
          maxSize="PDF (max. 3MB)"
          value={formData.businessPlan}
          onChange={(file) => updateField('businessPlan', file)}
          isDark={isDark}
        />
      </FormRow>

      <FormRow label="Financial Statements" isDark={isDark}>
        <FileUpload
          label="Upload financial statements"
          accept=".pdf"
          maxSize="PDF (max. 3MB)"
          value={formData.financialStatements}
          onChange={(file) => updateField('financialStatements', file)}
          isDark={isDark}
        />
      </FormRow>

      <FormRow label="Valuation Report PDF" isDark={isDark}>
        <FileUpload
          label="Upload financial statements"
          accept=".pdf"
          maxSize="PDF (max. 3MB)"
          value={formData.valuationReport}
          onChange={(file) => updateField('valuationReport', file)}
          isDark={isDark}
        />
      </FormRow>

      <FormRow label="Loan / Contract" isDark={isDark}>
        <FileUpload
          label="Upload main loan or contract document"
          accept=".pdf"
          maxSize="PDF (max. 3MB)"
          value={formData.loanContract}
          onChange={(file) => updateField('loanContract', file)}
          isDark={isDark}
        />
      </FormRow>
    </>
  );

  const renderStep8 = () => (
    <>
      <FormRow label="Analyst Attribution" isDark={isDark}>
        <div className="flex-1 space-y-4">
          {formData.analysts.map((analyst, index) => (
            <div key={index} className="flex gap-4 items-start">
              <FormInput
                label="Analyst Name"
                placeholder="Enter analyst or team name"
                value={analyst.name}
                onChange={(e) => updateAnalyst(index, 'name', e.target.value)}
                isDark={isDark}
              />
              <FormInput
                label="Analyst Rating"
                placeholder="Rate this deal from 0 to 5"
                value={analyst.rating}
                onChange={(e) => updateAnalyst(index, 'rating', e.target.value)}
                type="number"
                isDark={isDark}
              />
              {formData.analysts.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAnalyst(index)}
                  className="mt-3 text-red-500 hover:text-red-400"
                >
                  <FiX size={20} />
                </button>
              )}
            </div>
          ))}
        </div>
      </FormRow>

      <button
        type="button"
        onClick={addAnalyst}
        className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors
          ${isDark ? 'bg-[#2a2a2a] text-gray-300 hover:bg-[#333]' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
      >
        <FiPlus /> Add Analyst
      </button>

      <FormRow label="Internal Notes" isDark={isDark}>
        <FormTextarea
          label="Internal Notes"
          placeholder="Add internal notes or observations"
          value={formData.internalNotes}
          onChange={(e) => updateField('internalNotes', e.target.value)}
          isDark={isDark}
          rows={3}
        />
      </FormRow>

      <FormRow label="Investor Eligibility" isDark={isDark}>
        <FormTextarea
          label="Investor Eligibility"
          placeholder="Describe who this investment is intended for"
          value={formData.investorEligibilityFinal}
          onChange={(e) => updateField('investorEligibilityFinal', e.target.value)}
          isDark={isDark}
          rows={3}
        />
      </FormRow>

      <FormRow label="Projections (JSON)" isDark={isDark}>
        <FormTextarea
          label="Projections"
          placeholder="Enter or upload projections data (JSON format)"
          value={formData.projectionsJson}
          onChange={(e) => updateField('projectionsJson', e.target.value)}
          isDark={isDark}
          rows={4}
        />
      </FormRow>
    </>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      case 7: return renderStep7();
      case 8: return renderStep8();
      default: return null;
    }
  };

  if (connectionStatus === 'connecting' && !activeAccount?.address) {
    return (
      <div className={`min-h-screen pt-24 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-4 py-10">
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
        <div className="max-w-4xl mx-auto px-4 py-10">
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
        <div className="max-w-4xl mx-auto px-4 py-10">
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-conthrax uppercase tracking-widest text-center mb-8 bg-gradient-to-r from-[#14EFC0] to-[#2dbdc5] bg-clip-text text-transparent">
          CREATE USHARES
        </h1>

        {/* Form Card */}
        <div className={`rounded-2xl border ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-200'} p-6 md:p-8`}>
          {/* Step Header */}
          <div className="mb-6">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Step {currentStep}/8
            </span>
            <span className={`ml-3 font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {STEPS[currentStep - 1].title}
            </span>
          </div>

          {/* Step Content */}
          <div className="space-y-4">
            {renderCurrentStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors
                  ${isDark ? 'bg-[#2a2a2a] text-gray-300 hover:bg-[#333]' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Previous step
              </button>
            )}
            <button
              type="button"
              onClick={currentStep === 8 ? handleFinish : nextStep}
              disabled={isSubmitting}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors
                ${isDark ? 'bg-[#1f1f1f] text-white hover:bg-[#2a2a2a] border border-gray-700' : 'bg-gray-800 text-white hover:bg-gray-700'}
                ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {currentStep === 8 ? (
                <span className="flex items-center justify-center gap-2">
                  {isSubmitting && <FiLoader className="animate-spin" />}
                  {isSubmitting ? (submitStage || 'Saving...') : 'Finish uShare Creation'}
                </span>
              ) : 'Next step'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
