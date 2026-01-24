export async function fetchKycInfo(address) {
  const res = await fetch(`/api/kyc-status?address=${encodeURIComponent(address)}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    let detail = "";
    try {
      detail = await res.text();
    } catch {
      // noop
    }
    console.warn("KYC status request failed", {
      status: res.status,
      statusText: res.statusText,
      detail,
    });
    return { verified: false, crypto_wallet_address: null, error: "http" };
  }
  const data = await res.json();
  return {
    verified: Boolean(data.verified),
    crypto_wallet_address: data.crypto_wallet_address ?? null,
    error: data.error,
  };
}

export async function fetchKycStatus(address) {
  const { verified } = await fetchKycInfo(address);
  return verified;
}

export async function fetchKycAndCheckMismatch(connected) {
  const info = await fetchKycInfo(connected);
  const persona = info.crypto_wallet_address;
  const mismatch = !!persona && persona.toLowerCase() !== connected.toLowerCase();
  return { verified: info.verified, personaWallet: persona, mismatch };
}

export async function waitForKycStatus(address, opts = {}) {
  const tries = opts.tries ?? 12;
  const delayMs = opts.delayMs ?? 2500;

  for (let i = 0; i < tries; i += 1) {
    try {
      const { verified } = await fetchKycInfo(address);
      if (verified) return true;
    } catch {
      // Ignore and keep polling.
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  return false;
}
