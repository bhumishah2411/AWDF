const cache = require('../config/cache');

/**
 * GET /cache/stats
 * Supplementary Problem 2: Cache-hit/cache-miss counter exposed via debug endpoint
 */
exports.getCacheStats = (req, res) => {
  const metrics = cache.getMetrics();
  res.json({
    status: 'success',
    description: 'In-Memory Cache Metrics (node-cache)',
    metrics
  });
};

/**
 * POST /cache/clear
 * Flushes all cached data and resets hit/miss counters
 */
exports.clearCache = (req, res) => {
  cache.resetMetrics();
  res.json({
    status: 'success',
    message: 'Cache successfully flushed and metrics reset to 0',
    keysRemaining: cache.keys().length
  });
};

/**
 * GET /cache/experiment-ttl
 * Supplementary Problem 3: Experiment with different TTL values
 * Query params: ?key=sample&ttl=10
 */
exports.experimentTTL = (req, res) => {
  const ttl = parseInt(req.query.ttl, 10) || 10;
  const key = req.query.key || `test_ttl_${Date.now()}`;
  const value = {
    message: `Cached with custom TTL of ${ttl} seconds`,
    timestamp: new Date().toISOString()
  };

  cache.set(key, value, ttl);
  const ttlRemaining = cache.getTtl(key);

  res.json({
    status: 'success',
    key,
    value,
    configuredTtlSeconds: ttl,
    expiresAt: new Date(ttlRemaining).toISOString()
  });
};
