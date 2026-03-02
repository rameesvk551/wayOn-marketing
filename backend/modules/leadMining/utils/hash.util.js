const crypto = require('crypto');

const generateHash = (lead) => {
  const key = [
    (lead.name || '').toLowerCase().trim(),
    (lead.address || '').toLowerCase().trim(),
    (lead.website || '').toLowerCase().trim(),
    ...(lead.phones || []).sort(),
  ].join('|');
  return crypto.createHash('md5').update(key).digest('hex');
};

module.exports = { generateHash };
