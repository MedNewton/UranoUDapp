import { formatUnits, parseUnits } from "viem";

export function formatTokenAmount(amount, decimals = 18, displayDecimals = 4) {
  const formatted = formatUnits(amount ?? 0n, decimals);
  const num = Number(formatted);

  if (!Number.isFinite(num)) {
    return "0";
  }

  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: displayDecimals,
  });
}

export function parseTokenAmount(amount, decimals = 18) {
  const value = amount?.trim();
  if (!value) return 0n;
  return parseUnits(value, decimals);
}

export function formatUSD(amount, decimals = 6) {
  const num = Number(formatUnits(amount ?? 0n, decimals));
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number.isFinite(num) ? num : 0);
}

export function formatDate(timestamp) {
  if (!timestamp) return "-";
  return new Date(Number(timestamp) * 1000).toLocaleDateString();
}

export function formatDuration(seconds) {
  const total = Math.max(0, Math.floor(seconds ?? 0));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function truncateAddress(address) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
