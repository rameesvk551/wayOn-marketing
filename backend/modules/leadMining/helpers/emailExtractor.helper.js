const extractEmails = (text) => {
  if (!text) return [];
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = text.match(emailRegex) || [];
  return [...new Set(matches.map((e) => e.toLowerCase()))];
};

const extractPhones = (text) => {
  if (!text) return [];
  const phoneRegex = /(?:\+?[\d\s\-().]{7,20})/g;
  const matches = text.match(phoneRegex) || [];
  return [...new Set(matches.map((p) => p.trim()).filter((p) => p.replace(/\D/g, '').length >= 7))];
};

module.exports = { extractEmails, extractPhones };
