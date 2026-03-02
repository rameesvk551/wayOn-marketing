const { generateHash } = require('../utils/hash.util');

const deduplicateLeads = (leads) => {
  const seen = new Set();
  return leads.reduce((acc, lead) => {
    const hash = generateHash(lead);
    if (!seen.has(hash)) {
      seen.add(hash);
      acc.push({ ...lead, hash });
    }
    return acc;
  }, []);
};

module.exports = { deduplicateLeads };
