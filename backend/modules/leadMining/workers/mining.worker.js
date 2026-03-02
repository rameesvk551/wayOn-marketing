require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });
const { getQueue } = require('../queues/mining.queue');
const { scrapeGoogleMaps } = require('../services/googleMaps.service');
const { scrapeDirectory } = require('../services/directory.service');
const { aggregateAndStore, finalizeJob } = require('../services/aggregation.service');
const miningJobRepository = require('../repository/miningJob.repository');
const mongoose = require('mongoose');

const SOURCE_HANDLERS = {
  google_maps: scrapeGoogleMaps,
  directory: scrapeDirectory,
};

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wayon_leads');
  console.log('[Worker] MongoDB connected');
};

const processJob = async (job) => {
  const { jobId, keyword, location, sources } = job.data;
  console.log(`[Worker] Processing job ${jobId}`);

  await miningJobRepository.updateJob(jobId, { status: 'running' });

  let completedTasks = 0;
  const allLeads = [];

  for (const source of sources) {
    const handler = SOURCE_HANDLERS[source];
    if (!handler) {
      console.warn(`[Worker] No handler for source: ${source}`);
      completedTasks++;
      continue;
    }

    try {
      console.log(`[Worker] Scraping ${source} for "${keyword}" in "${location}"`);
      const leads = await handler({ keyword, location, jobId });
      allLeads.push(...leads);
      completedTasks++;
      await miningJobRepository.updateJobProgress(jobId, completedTasks, sources.length);
      console.log(`[Worker] ${source} returned ${leads.length} leads`);
    } catch (err) {
      console.error(`[Worker] Error scraping ${source}:`, err.message);
      completedTasks++;
      await miningJobRepository.updateJobProgress(jobId, completedTasks, sources.length);
    }
  }

  await aggregateAndStore(allLeads, jobId);
  const totalStored = await finalizeJob(jobId);
  console.log(`[Worker] Job ${jobId} done. Stored ${totalStored} leads.`);
};

const startWorker = async () => {
  await connectDB();
  const queue = getQueue();
  queue.process(async (job) => {
    try {
      await processJob(job);
    } catch (err) {
      console.error(`[Worker] Fatal error for job ${job.data.jobId}:`, err.message);
      await miningJobRepository.markJobFailed(job.data.jobId, err.message);
      throw err;
    }
  });
  console.log('[Worker] Mining worker started, waiting for jobs...');
};

startWorker().catch((err) => {
  console.error('[Worker] Startup error:', err.message);
  process.exit(1);
});
