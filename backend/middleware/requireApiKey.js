function requireApiKey(req, res, next) {
  const key = req.headers["x-api-key"];
  const expected = process.env.MENTOR_API_KEY;

  if (!expected) {
    return res.status(500).json({ error: "MENTOR_API_KEY not configured on server" });
  }

  if (!key || key !== expected) {
    return res.status(401).json({ error: "Invalid or missing API key" });
  }

  next();
}

module.exports = requireApiKey;
