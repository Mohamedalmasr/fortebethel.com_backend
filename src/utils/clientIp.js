const normalizeIp = (ip) => {
  if (!ip) return null;

  const value = String(ip).trim();
  if (!value) return null;

  if (value === '::1') return '127.0.0.1';
  if (value.startsWith('::ffff:')) return value.slice(7);

  return value;
};

const getClientIp = (req) => normalizeIp(req.ip || req.socket?.remoteAddress);

module.exports = { getClientIp, normalizeIp };
