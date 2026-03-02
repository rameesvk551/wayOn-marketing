const normalizePhone = (phone) => {
  if (!phone) return null;
  const cleaned = phone.replace(/[^\d+]/g, '').replace(/^00/, '+');
  return cleaned.length > 0 ? cleaned : null;
};

const normalizeEmail = (email) => {
  if (!email) return null;
  const e = email.toLowerCase().trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ? e : null;
};

const normalizeWebsite = (url) => {
  if (!url) return null;
  const u = url.trim();
  if (!u.startsWith('http')) return `https://${u}`;
  return u;
};

const normalizeLead = (raw, source, keyword, location, jobId) => ({
  name: (raw.name || '').trim() || null,
  phones: (raw.phones || []).map(normalizePhone).filter(Boolean),
  emails: (raw.emails || []).map(normalizeEmail).filter(Boolean),
  website: normalizeWebsite(raw.website),
  address: (raw.address || '').trim() || null,
  source,
  keyword,
  location,
  jobId,
});

module.exports = { normalizeLead, normalizePhone, normalizeEmail, normalizeWebsite };
