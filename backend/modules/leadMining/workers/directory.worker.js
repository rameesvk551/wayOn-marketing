require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });
const Bull = require('bull');
const { scrapeDirectory } = require('../services/directory.service');
const { aggregateAndStore } = require('../services/aggregation.service');
const mongoose = require('mongoose');

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const directoryQueue = new Bull('directory-jobs', REDIS_URL);

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wayon_leads');
};

const processDirectoryJob = async (job) => {
  const { jobId, keyword, location } = job.data;
  try {
    const leads = await scrapeDirectory({ keyword, location, jobId });
    await aggregateAndStore(leads, jobId);
    return { leads: leads.length };
  } catch (err) {
    console.error(`[DirectoryWorker] Error:`, err.message);
    throw err;
  }
};

const startDirectoryWorker = async () => {
  await connectDB();
  directoryQueue.process(processDirectoryJob);
  console.log('[DirectoryWorker] Started');
};

module.exports = { directoryQueue, startDirectoryWorker };
