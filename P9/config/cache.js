const NodeCache = require('node-cache');

// Standard TTL (Time-To-Live) in seconds, default: 60 seconds
const stdTTL = parseInt(process.env.CACHE_TTL, 10) || 60;
const checkperiod = parseInt(process.env.CACHE_CHECK_PERIOD, 10) || 120;

// Initialize node-cache instance
// stdTTL: default lifetime in seconds for each key-value pair
// checkperiod: period in seconds for automatic delete check of expired keys
const cache = new NodeCache({
  stdTTL,
  checkperiod,
  useClones: false // increases performance by returning references
});

// Custom hit/miss counters for Supplementary Problem 2
const statsTracker = {
  hits: 0,
  misses: 0,
  invalidations: 0,
  startTime: new Date()
};

// Track cache event listeners
cache.on('del', (key) => {
  statsTracker.invalidations++;
});

// Helper tracking methods
cache.recordHit = () => {
  statsTracker.hits++;
};

cache.recordMiss = () => {
  statsTracker.misses++;
};

// Expose formatted metrics for debug endpoint GET /cache/stats
cache.getMetrics = () => {
  const total = statsTracker.hits + statsTracker.misses;
  const hitRatio = total > 0 ? ((statsTracker.hits / total) * 100).toFixed(2) + '%' : '0.00%';
  const keys = cache.keys();

  return {
    hits: statsTracker.hits,
    misses: statsTracker.misses,
    totalRequests: total,
    hitRatio,
    invalidations: statsTracker.invalidations,
    cachedKeysCount: keys.length,
    cachedKeys: keys,
    stdTTL,
    uptimeSeconds: Math.floor((new Date() - statsTracker.startTime) / 1000),
    nodeCacheInternalStats: cache.getStats()
  };
};

// Reset metrics and flush cache
cache.resetMetrics = () => {
  statsTracker.hits = 0;
  statsTracker.misses = 0;
  statsTracker.invalidations = 0;
  cache.flushAll();
};

module.exports = cache;
