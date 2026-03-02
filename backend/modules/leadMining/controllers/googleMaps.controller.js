const { scrapeGoogleMaps } = require('../services/googleMaps.service');

const triggerGoogleMapsScrape = async (req, res) => {
  try {
    const { keyword, location, jobId } = req.body;
    const leads = await scrapeGoogleMaps({ keyword, location, jobId });
    res.json({ success: true, data: { count: leads.length, leads } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { triggerGoogleMapsScrape };
