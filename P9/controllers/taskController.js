const Task = require('../models/Task');
const cache = require('../config/cache');

// Helper to determine the cache key
const getListCacheKey = (req) => {
  return req.user && req.user.userId ? `tasks_${req.user.userId}` : 'all_tasks';
};

// Helper to invalidate all related cache keys on write operations
const invalidateTaskCache = (taskId, req) => {
  const keysToDel = ['all_tasks'];
  if (taskId) {
    keysToDel.push(`task_${taskId}`);
  }
  if (req && req.user && req.user.userId) {
    keysToDel.push(`tasks_${req.user.userId}`);
  }
  cache.del(keysToDel);
  console.log(`[Cache Invalidation] Flushed keys: ${keysToDel.join(', ')}`);
};

/**
 * GET /tasks
 * Retrieves all tasks using Cache-Aside (Lazy Loading) pattern
 * Cache Key: 'all_tasks' (or 'tasks_<userId>' if authenticated)
 * TTL: 60s
 */
exports.getTasks = async (req, res, next) => {
  const start = process.hrtime();
  const bypassCache = req.query.noCache === 'true' || req.headers['cache-control'] === 'no-cache';
  const cacheKey = getListCacheKey(req);

  try {
    // 1. Cache Check
    if (!bypassCache) {
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        cache.recordHit();
        const diff = process.hrtime(start);
        const timeMs = (diff[0] * 1000 + diff[1] / 1e6).toFixed(2);

        res.setHeader('X-Cache', 'HIT');
        res.setHeader('X-Response-Time', `${timeMs}ms`);
        return res.json({
          source: 'cache',
          cacheKey,
          responseTimeMs: parseFloat(timeMs),
          count: cachedData.length,
          data: cachedData
        });
      }
    }

    // 2. Cache Miss - Query MongoDB
    cache.recordMiss();
    const filter = req.user && req.user.userId ? { userId: req.user.userId } : {};
    const tasks = await Task.find(filter).sort({ createdAt: -1 }).lean();

    // 3. Store in Cache for subsequent requests
    if (!bypassCache) {
      cache.set(cacheKey, tasks);
    }

    const diff = process.hrtime(start);
    const timeMs = (diff[0] * 1000 + diff[1] / 1e6).toFixed(2);

    res.setHeader('X-Cache', bypassCache ? 'BYPASS' : 'MISS');
    res.setHeader('X-Response-Time', `${timeMs}ms`);
    return res.json({
      source: bypassCache ? 'database-bypassed' : 'database',
      cacheKey,
      responseTimeMs: parseFloat(timeMs),
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /tasks/:id
 * Retrieves single task with dedicated cache key
 * Supplementary Problem 1: Cache single-task endpoint separately
 * Cache Key: 'task_<id>'
 * TTL: 60s
 */
exports.getTaskById = async (req, res, next) => {
  const start = process.hrtime();
  const taskId = req.params.id;
  const singleKey = `task_${taskId}`;
  const bypassCache = req.query.noCache === 'true' || req.headers['cache-control'] === 'no-cache';

  try {
    // 1. Check cache for single task
    if (!bypassCache) {
      const cachedTask = cache.get(singleKey);
      if (cachedTask) {
        cache.recordHit();
        const diff = process.hrtime(start);
        const timeMs = (diff[0] * 1000 + diff[1] / 1e6).toFixed(2);

        res.setHeader('X-Cache', 'HIT');
        res.setHeader('X-Response-Time', `${timeMs}ms`);
        return res.json({
          source: 'cache',
          cacheKey: singleKey,
          responseTimeMs: parseFloat(timeMs),
          data: cachedTask
        });
      }
    }

    // 2. Cache Miss - Query MongoDB
    cache.recordMiss();
    const task = await Task.findById(taskId).lean();
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // 3. Store in single-task cache
    if (!bypassCache) {
      cache.set(singleKey, task);
    }

    const diff = process.hrtime(start);
    const timeMs = (diff[0] * 1000 + diff[1] / 1e6).toFixed(2);

    res.setHeader('X-Cache', bypassCache ? 'BYPASS' : 'MISS');
    res.setHeader('X-Response-Time', `${timeMs}ms`);
    return res.json({
      source: bypassCache ? 'database-bypassed' : 'database',
      cacheKey: singleKey,
      responseTimeMs: parseFloat(timeMs),
      data: task
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /tasks
 * Creates a new task and INVALIDATES 'all_tasks' cache key
 */
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, priority, completed } = req.body;
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description || '',
      priority: priority || 'medium',
      completed: completed || false,
      userId: req.user ? req.user.userId : null
    });

    // Invalidate cache immediately on write
    invalidateTaskCache(null, req);

    res.status(201).json({
      message: 'Task created successfully and cache invalidated',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /tasks/:id
 * Updates task and INVALIDATES both 'all_tasks' and 'task_<id>' cache keys
 */
exports.updateTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findByIdAndUpdate(taskId, req.body, {
      new: true,
      runValidators: true
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Invalidate both collection and single item cache
    invalidateTaskCache(taskId, req);

    res.json({
      message: 'Task updated successfully and cache invalidated',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /tasks/:id
 * Deletes task and INVALIDATES both 'all_tasks' and 'task_<id>' cache keys
 */
exports.deleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Invalidate both collection and single item cache
    invalidateTaskCache(taskId, req);

    res.json({
      message: 'Task deleted successfully and cache invalidated',
      deletedId: taskId
    });
  } catch (error) {
    next(error);
  }
};
