const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const cacheController = require('../controllers/cacheController');
const { optionalAuth } = require('../middleware/auth');

// Apply optional JWT auth so user-specific tasks or general tasks both work
router.use(optionalAuth);

// Debug endpoint for cache stats directly under /tasks
router.get('/cache/stats', cacheController.getCacheStats);

// Task CRUD routes with In-Memory Caching and Invalidation
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
