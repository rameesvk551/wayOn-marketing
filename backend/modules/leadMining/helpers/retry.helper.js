const MAX_DELAY = 30000;

const retry = async (fn, retries = 3, delay = 1000) => {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < retries - 1) {
        const wait = Math.min(delay * Math.pow(2, i), MAX_DELAY);
        await new Promise((resolve) => setTimeout(resolve, wait));
      }
    }
  }
  throw lastError;
};

module.exports = { retry };
