require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const cacheRoutes = require('./routes/cacheRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Request logger for inspection during practical evaluation
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const cacheHeader = res.getHeader('X-Cache') || '-';
    console.log(`[${req.method}] ${req.originalUrl} | Status: ${res.statusCode} | Cache: ${cacheHeader} | ${duration}ms`);
  });
  next();
});

// Connect to MongoDB
connectDB();

// API Routes
app.use('/tasks', taskRoutes);
app.use('/cache', cacheRoutes);
app.use('/auth', authRoutes);

// Root informational endpoint
app.get('/', (req, res) => {
  res.json({
    practical: 'Practical 9: In-Memory Caching and Query Optimization',
    studentId: '24IT089',
    course: 'AWDF - Sem 5',
    status: 'Running',
    endpoints: {
      getAllTasks: 'GET /tasks (Cached with node-cache stdTTL: 60s)',
      getSingleTask: 'GET /tasks/:id (Cached separately with key task_<id>)',
      createTask: 'POST /tasks (Invalidates all_tasks cache)',
      updateTask: 'PUT /tasks/:id (Invalidates all_tasks & task_<id> cache)',
      deleteTask: 'DELETE /tasks/:id (Invalidates all_tasks & task_<id> cache)',
      cacheStats: 'GET /cache/stats (Debug endpoint with hit/miss counters)',
      clearCache: 'POST /cache/clear (Flushes all cache entries)',
      experimentTtl: 'GET /cache/experiment-ttl?ttl=15&key=test (TTL experiment)',
      authRegister: 'POST /auth/register',
      authLogin: 'POST /auth/login'
    },
    cachingStrategy: {
      pattern: 'Cache-Aside (Lazy Loading)',
      store: 'node-cache (In-Memory Process-Local)',
      ttlSeconds: parseInt(process.env.CACHE_TTL, 10) || 60,
      invalidation: 'Write-Invalidate on POST, PUT, DELETE'
    }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Application Error]', err.stack || err.message);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message, details: err.errors });
  }
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` Practical 9 Server Running on http://localhost:${PORT}`);
    console.log(` In-Memory Caching with node-cache active (TTL: ${process.env.CACHE_TTL || 60}s)`);
    console.log(` Debug Cache Stats: http://localhost:${PORT}/cache/stats`);
    console.log(`====================================================`);
  });
}

module.exports = app;
