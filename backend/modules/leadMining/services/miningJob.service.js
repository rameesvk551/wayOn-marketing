const miningJobRepository = require('../repository/miningJob.repository');
const { addJobToQueue } = require('../queues/mining.queue');

const createAndQueueJob = async ({ keyword, location, sources }) => {
  const totalTasks = sources.length;
  const job = await miningJobRepository.createJob({ keyword, location, sources, totalTasks });
  await addJobToQueue({ jobId: job._id.toString(), keyword, location, sources });
  return job;
};

const getAllJobs = async (page, limit) => miningJobRepository.findAllJobs(page, limit);

const getJobById = async (jobId) => {
  const job = await miningJobRepository.findJobById(jobId);
  if (!job) throw new Error('Job not found');
  return job;
};

const getJobProgress = async (jobId) => {
  const job = await miningJobRepository.findJobById(jobId);
  if (!job) throw new Error('Job not found');
  return {
    jobId: job._id,
    status: job.status,
    progress: job.progress,
    completedTasks: job.completedTasks,
    totalTasks: job.totalTasks,
    leadsCount: job.leadsCount,
    finishedAt: job.finishedAt,
  };
};

module.exports = { createAndQueueJob, getAllJobs, getJobById, getJobProgress };
