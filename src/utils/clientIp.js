const clientIp = (req) => {
  const ip = req.ip || req.connection?.remoteAddress || '';
  if (ip.startsWith('::ffff:')) {
    return ip.substring(7);
  }
  return ip;
};

module.exports = clientIp;
