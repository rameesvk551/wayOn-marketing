const Lead = require('../models/lead.model');

const createLead = async (data) => Lead.create(data);

const createManyLeads = async (leads) => {
  if (!leads.length) return [];
  return Lead.insertMany(leads, { ordered: false, rawResult: false }).catch((err) => {
    if (err.code === 11000) return [];
    throw err;
  });
};

const findLeadsByJobId = async (jobId, page = 1, limit = 50) => {
  const skip = (page - 1) * limit;
  const [leads, total] = await Promise.all([
    Lead.find({ jobId }).skip(skip).limit(limit).lean(),
    Lead.countDocuments({ jobId }),
  ]);
  return { data: leads, total, page, limit, pages: Math.ceil(total / limit) };
};

const findLeadsByJobIdAll = async (jobId) => Lead.find({ jobId }).lean();

const countLeadsByJobId = async (jobId) => Lead.countDocuments({ jobId });

const deleteLeadsByJobId = async (jobId) => Lead.deleteMany({ jobId });

module.exports = {
  createLead,
  createManyLeads,
  findLeadsByJobId,
  findLeadsByJobIdAll,
  countLeadsByJobId,
  deleteLeadsByJobId,
};
