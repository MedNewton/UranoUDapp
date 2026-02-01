const normalizeAddress = (value) => value?.trim().toLowerCase();

const parseEnvList = (value) => {
  if (!value) return [];
  return String(value)
    .split(',')
    .map((entry) => normalizeAddress(entry))
    .filter(Boolean);
};

const adminAllowlist = [
  ...parseEnvList(import.meta.env.VITE_ADMIN_ADDRESS),
  ...parseEnvList(import.meta.env.VITE_OWNER),
  ...parseEnvList(import.meta.env.VITE_ADMIN_ADDRESSES),
];

export const isAdminWallet = (address) => {
  if (!address) return false;
  if (adminAllowlist.length === 0) return true;
  return adminAllowlist.includes(normalizeAddress(address));
};

export const getAdminAllowlist = () => [...adminAllowlist];
