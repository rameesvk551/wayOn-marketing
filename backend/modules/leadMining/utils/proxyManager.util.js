const getProxies = () => {
  const raw = process.env.PROXY_LIST || '';
  if (!raw) return [];
  return raw.split(',').map((entry) => {
    const [host, port, user, pass] = entry.split(':');
    return { host, port: parseInt(port, 10), auth: user && pass ? `${user}:${pass}` : null };
  });
};

let currentIndex = 0;
const proxies = getProxies();

const getNextProxy = () => {
  if (!proxies.length) return null;
  const proxy = proxies[currentIndex % proxies.length];
  currentIndex++;
  return proxy;
};

const buildProxyUrl = (proxy) => {
  if (!proxy) return null;
  const auth = proxy.auth ? `${proxy.auth}@` : '';
  return `http://${auth}${proxy.host}:${proxy.port}`;
};

module.exports = { getNextProxy, buildProxyUrl, getProxies };
