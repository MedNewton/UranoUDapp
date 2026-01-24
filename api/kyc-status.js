export default async function handler(req, res) {
  const { address } = req.query || {};

  if (!address) {
    res.status(400).json({ verified: false, error: "bad_address" });
    return;
  }

  const upstream = `https://www.presale.uranoecosystem.com/api/kyc-status?address=${encodeURIComponent(address)}`;

  try {
    const response = await fetch(upstream, {
      headers: { accept: "application/json" },
    });

    const text = await response.text();
    res.status(response.status).send(text);
  } catch {
    res.status(502).json({ verified: false, error: "upstream_unavailable" });
  }
}
