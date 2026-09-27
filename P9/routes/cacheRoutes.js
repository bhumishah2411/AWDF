const express = require('express');
const router = express.Router();
const cacheController = require('../controllers/cacheController');

// Supplementary Problem 2: Cache hit/miss debug counter endpoint
router.get('/stats', cacheController.getCacheStats);

// Debug endpoint to clear cache and reset counters
router.post('/clear', cacheController.clearCache);

// Supplementary Problem 3: Experiment with TTL
router.get('/experiment-ttl', cacheController.experimentTTL);

module.exports = router;
