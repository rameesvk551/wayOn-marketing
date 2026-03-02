const { deduplicateLeads } = require('../helpers/deduplicate.helper');
const leadRepository = require('../repository/lead.repository');
const miningJobRepository = require('../repository/miningJob.repository');

const aggregateAndStore = async (leads, jobId) => {
  if (!leads.length) return 0;

  const deduplicated = deduplicateLeads(leads);
  const stored = await leadRepository.createManyLeads(deduplicated);
  const count = await leadRepository.countLeadsByJobId(jobId);
  return count;
};

const finalizeJob = async (jobId) => {
  const count = await leadRepository.countLeadsByJobId(jobId);
  await miningJobRepository.markJobCompleted(jobId, count);
  return count;
};

module.exports = { aggregateAndStore, finalizeJob };
