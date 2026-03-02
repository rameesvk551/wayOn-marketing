const axios = require('axios');
const cheerio = require('cheerio');
const { retry } = require('../helpers/retry.helper');
const { normalizeLead } = require('../helpers/normalize.helper');
const { extractEmails, extractPhones } = require('../helpers/emailExtractor.helper');
const { getNextProxy, buildProxyUrl } = require('../utils/proxyManager.util');
const { DEFAULT_USER_AGENT } = require('../utils/constants.util');

const scrapeGoogleMaps = async ({ keyword, location, jobId }) => {
  const searchQuery = encodeURIComponent(`${keyword} in ${location}`);
  const url = `https://www.google.com/maps/search/${searchQuery}`;

  const proxy = getNextProxy();
  const axiosConfig = {
    headers: {
      'User-Agent': DEFAULT_USER_AGENT,
    },
    timeout: 15000,
  };

  if (proxy) {
    const { HttpsProxyAgent } = require('https-proxy-agent');
    axiosConfig.httpsAgent = new HttpsProxyAgent(buildProxyUrl(proxy));
  }

  const fetchResults = async () => {
    const response = await axios.get(url, axiosConfig);
    return response.data;
  };

  const html = await retry(fetchResults, 3, 1000);
  return parseGoogleMapsResults(html, keyword, location, jobId);
};

const isGoogleUrl = (url) => {
  try {
    const { hostname } = new URL(url);
    return hostname === 'google.com' || hostname.endsWith('.google.com');
  } catch {
    return false;
  }
};

const parseGoogleMapsResults = (html, keyword, location, jobId) => {
  const $ = cheerio.load(html);
  const leads = [];

  // Parse structured data / listings from page
  $('[data-result-index]').each((_, el) => {
    const name = $(el).find('h3, .fontHeadlineSmall').first().text().trim();
    const address = $(el).find('[data-tooltip="Copy address"]').text().trim();
    const phone = $(el).find('[data-tooltip="Copy phone number"]').text().trim();
    const website = $(el).find('a[href*="http"]').attr('href') || '';

    if (name) {
      const raw = {
        name,
        phones: phone ? [phone] : [],
        emails: [],
        website: website && !isGoogleUrl(website) ? website : null,
        address,
      };
      leads.push(normalizeLead(raw, 'google_maps', keyword, location, jobId));
    }
  });

  return leads;
};

module.exports = { scrapeGoogleMaps };
