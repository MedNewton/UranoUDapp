import { verifyMessage } from "viem";

const FIVE_MINUTES_MS = 5 * 60 * 1000;

const normalize = (value) => value?.trim().toLowerCase();

const loadAdminAllowlist = () => {
  const values = [
    process.env.ADMIN_ADDRESS,
    process.env.OWNER,
    process.env.ADMIN_ADDRESSES,
  ]
    .filter(Boolean)
    .flatMap((entry) => entry.split(","))
    .map((entry) => normalize(entry))
    .filter(Boolean);

  return new Set(values);
};

const parseBody = (req) => {
  if (!req.body) return null;
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }
  return req.body;
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const body = parseBody(req);
  if (!body) {
    res.status(400).json({ error: "invalid_body" });
    return;
  }

  const { message, signature } = body;
  if (!message || !signature) {
    res.status(400).json({ error: "missing_signature" });
    return;
  }

  let payload;
  try {
    payload = JSON.parse(message);
  } catch {
    res.status(400).json({ error: "invalid_message" });
    return;
  }

  const { action, address, timestamp, data } = payload || {};
  if (action !== "ushare-create") {
    res.status(400).json({ error: "invalid_action" });
    return;
  }

  const adminAllowlist = loadAdminAllowlist();
  const normalizedAddress = normalize(address);
  if (!normalizedAddress || !adminAllowlist.has(normalizedAddress)) {
    res.status(403).json({ error: "not_allowed" });
    return;
  }

  if (!timestamp || Math.abs(Date.now() - Number(timestamp)) > FIVE_MINUTES_MS) {
    res.status(401).json({ error: "signature_expired" });
    return;
  }

  const isValid = await verifyMessage({
    address,
    message,
    signature,
  });

  if (!isValid) {
    res.status(401).json({ error: "invalid_signature" });
    return;
  }

  if (!data || typeof data !== "object") {
    res.status(400).json({ error: "missing_data" });
    return;
  }

  data.created_by = normalizedAddress;

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    res.status(500).json({ error: "supabase_env_missing" });
    return;
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/ushare_offerings`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: serviceRoleKey,
        authorization: `Bearer ${serviceRoleKey}`,
        prefer: "return=representation",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      res.status(response.status).send(errorText || "supabase_error");
      return;
    }

    const inserted = await response.json();
    res.status(200).json({ ok: true, data: inserted?.[0] ?? null });
  } catch (error) {
    res.status(500).json({ error: "supabase_request_failed" });
  }
}
