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

const sanitizePathSegment = (value) =>
  value
    ?.replace(/[^a-zA-Z0-9/_-]/g, "")
    .replace(/(\.\.\/?)/g, "")
    .replace(/^\/+/, "")
    .trim();

const sanitizeFileName = (value) =>
  value?.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/_+/g, "_");

const parseBase64 = (dataBase64, contentType) => {
  if (dataBase64.startsWith("data:")) {
    const match = dataBase64.match(/^data:(.*?);base64,(.*)$/);
    if (match) {
      return { buffer: Buffer.from(match[2], "base64"), contentType: match[1] };
    }
  }
  return {
    buffer: Buffer.from(dataBase64, "base64"),
    contentType: contentType || "application/octet-stream",
  };
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

  const { message, signature, fileName, contentType, dataBase64, folder } = body;
  if (!message || !signature || !fileName || !dataBase64) {
    res.status(400).json({ error: "missing_fields" });
    return;
  }

  let payload;
  try {
    payload = JSON.parse(message);
  } catch {
    res.status(400).json({ error: "invalid_message" });
    return;
  }

  const { action, address, timestamp } = payload || {};
  if (action !== "ushare-upload") {
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

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket =
    process.env.SUPABASE_STORAGE_BUCKET ||
    process.env.VITE_SUPABASE_STORAGE_BUCKET ||
    "ushare-media";

  if (!supabaseUrl || !serviceRoleKey) {
    res.status(500).json({ error: "supabase_env_missing" });
    return;
  }

  const safeFolder = sanitizePathSegment(folder) || "uploads";
  const safeName = sanitizeFileName(fileName) || `file-${Date.now()}`;
  const uniqueId =
    typeof crypto?.randomUUID === "function"
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  const objectPath = `${safeFolder}/${Date.now()}-${uniqueId}-${safeName}`;

  const parsed = parseBase64(dataBase64, contentType);

  try {
    const response = await fetch(
      `${supabaseUrl}/storage/v1/object/${bucket}/${objectPath}`,
      {
        method: "POST",
        headers: {
          "content-type": parsed.contentType,
          apikey: serviceRoleKey,
          authorization: `Bearer ${serviceRoleKey}`,
          "x-upsert": "true",
        },
        body: parsed.buffer,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      res.status(response.status).send(errorText || "supabase_upload_failed");
      return;
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${encodeURI(
      objectPath
    )}`;

    res.status(200).json({
      ok: true,
      bucket,
      path: objectPath,
      publicUrl,
    });
  } catch (error) {
    res.status(500).json({ error: "supabase_upload_error" });
  }
}
