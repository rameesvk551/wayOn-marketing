const axios = require('axios');
const cheerio = require('cheerio');
const { retry } = require('../helpers/retry.helper');
const { normalizeLead } = require('../helpers/normalize.helper');
const { extractEmails, extractPhones } = require('../helpers/emailExtractor.helper');
const { getNextProxy, buildProxyUrl } = require('../utils/proxyManager.util');
const { DEFAULT_USER_AGENT } = require('../utils/constants.util');

const scrapeDirectory = async ({ keyword, location, jobId }) => {
  const searchQuery = encodeURIComponent(`${keyword} ${location}`);
  const url = `https://www.yellowpages.com/search?search_terms=${searchQuery}&geo_location_terms=${encodeURIComponent(location)}`;

  const proxy = getNextProxy();
  const axiosConfig = {
    headers: {
      'User-Agent': DEFAULT_USER_AGENT,
      'Accept-Language': 'en-US,en;q=0.9',
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
  return parseDirectoryResults(html, keyword, location, jobId);
};

const parseDirectoryResults = (html, keyword, location, jobId) => {
  const $ = cheerio.load(html);
  const leads = [];

  $('.result').each((_, el) => {
    const name = $(el).find('.business-name span').text().trim();
    const address = $(el).find('.street-address').text().trim();
    const city = $(el).find('.locality').text().trim();
    const phone = $(el).find('.phones').text().trim();
    const website = $(el).find('a.track-visit-website').attr('href') || '';
    const emailText = $(el).text();
    const emails = extractEmails(emailText);

    if (name) {
      const raw = {
        name,
        phones: phone ? [phone] : [],
        emails,
        website: website || null,
        address: [address, city].filter(Boolean).join(', '),
      };
      leads.push(normalizeLead(raw, 'directory', keyword, location, jobId));
    }
  });

  return leads;
};

module.exports = { scrapeDirectory };
