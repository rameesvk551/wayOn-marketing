const MiningJob = require('../models/miningJob.model');

const createJob = async (data) => MiningJob.create(data);

const findJobById = async (id) => MiningJob.findById(id).lean();

const findAllJobs = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [jobs, total] = await Promise.all([
    MiningJob.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    MiningJob.countDocuments(),
  ]);
  return { data: jobs, total, page, limit, pages: Math.ceil(total / limit) };
};

const updateJob = async (id, update) =>
  MiningJob.findByIdAndUpdate(id, update, { new: true }).lean();

const updateJobProgress = async (id, completedTasks, totalTasks) => {
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  return MiningJob.findByIdAndUpdate(
    id,
    { completedTasks, progress, $set: { status: 'running' } },
    { new: true }
  ).lean();
};

const markJobCompleted = async (id, leadsCount) =>
  MiningJob.findByIdAndUpdate(
    id,
    { status: 'completed', progress: 100, finishedAt: new Date(), leadsCount },
    { new: true }
  ).lean();

const markJobFailed = async (id, errorMessage) =>
  MiningJob.findByIdAndUpdate(
    id,
    { status: 'failed', finishedAt: new Date(), errorMessage },
    { new: true }
  ).lean();

module.exports = {
  createJob,
  findJobById,
  findAllJobs,
  updateJob,
  updateJobProgress,
  markJobCompleted,
  markJobFailed,
};
