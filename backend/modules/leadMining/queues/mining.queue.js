const Bull = require('bull');

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const miningQueue = new Bull('mining-jobs', REDIS_URL, {
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: 50,
    removeOnFail: 20,
  },
});

const addJobToQueue = async (jobData) => {
  const job = await miningQueue.add(jobData, { jobId: jobData.jobId });
  return job;
};

const getQueue = () => miningQueue;

miningQueue.on('error', (err) => console.error('[Queue] Error:', err.message));
miningQueue.on('failed', (job, err) => console.error(`[Queue] Job ${job.id} failed:`, err.message));
miningQueue.on('completed', (job) => console.log(`[Queue] Job ${job.id} completed`));

module.exports = { addJobToQueue, getQueue };
