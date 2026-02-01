import { signMessage } from "thirdweb/utils";

const DEFAULT_TTL_MS = 4 * 60 * 1000;

const buildCacheKey = (action, address, extraKey = "base") =>
  `admin-signature:${action}:${address}:${extraKey}`;

const readCache = (key) => {
  if (typeof sessionStorage === "undefined") return null;
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed?.message || !parsed?.signature || !parsed?.expiresAt) return null;
    if (Date.now() >= parsed.expiresAt) return null;
    return parsed;
  } catch {
    return null;
  }
};

const writeCache = (key, payload) => {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(key, JSON.stringify(payload));
};

export const getCachedAdminSignature = async ({
  action,
  address,
  account,
  ttlMs = DEFAULT_TTL_MS,
  extra = {},
}) => {
  if (!action || !address || !account) {
    throw new Error("Missing signature parameters.");
  }

  const extraKey = extra?.id ? `id:${extra.id}` : "base";
  const cacheKey = buildCacheKey(action, address, extraKey);
  const cached = readCache(cacheKey);
  if (cached) {
    return { message: cached.message, signature: cached.signature };
  }

  const message = JSON.stringify({
    action,
    address,
    timestamp: Date.now(),
    ...extra,
  });
  const signature = await signMessage({ message, account });
  writeCache(cacheKey, {
    message,
    signature,
    expiresAt: Date.now() + ttlMs,
  });
  return { message, signature };
};
