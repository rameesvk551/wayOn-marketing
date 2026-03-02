require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });
const Bull = require('bull');
const { scrapeGoogleMaps } = require('../services/googleMaps.service');
const { aggregateAndStore } = require('../services/aggregation.service');
const mongoose = require('mongoose');

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const googleMapsQueue = new Bull('google-maps-jobs', REDIS_URL);

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wayon_leads');
};

const processGoogleMapsJob = async (job) => {
  const { jobId, keyword, location } = job.data;
  try {
    const leads = await scrapeGoogleMaps({ keyword, location, jobId });
    await aggregateAndStore(leads, jobId);
    return { leads: leads.length };
  } catch (err) {
    console.error(`[GoogleMapsWorker] Error:`, err.message);
    throw err;
  }
};

const startGoogleMapsWorker = async () => {
  await connectDB();
  googleMapsQueue.process(processGoogleMapsJob);
  console.log('[GoogleMapsWorker] Started');
};

module.exports = { googleMapsQueue, startGoogleMapsWorker };
