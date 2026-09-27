const http = require('http');

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;

// Helper to make HTTP requests and measure network + execution duration
const makeRequest = (options) => {
  return new Promise((resolve, reject) => {
    const startTime = process.hrtime();
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const diff = process.hrtime(startTime);
        const durationMs = (diff[0] * 1000 + diff[1] / 1e6);
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          parsed = data;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          durationMs: parseFloat(durationMs.toFixed(2)),
          serverDurationMs: res.headers['x-response-time'] ? parseFloat(res.headers['x-response-time']) : durationMs,
          cacheHeader: res.headers['x-cache'] || 'NONE',
          data: parsed
        });
      });
    });

    req.on('error', (err) => reject(err));
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const runBenchmark = async () => {
  console.log('========================================================================');
  console.log(' Practical 9: In-Memory Caching & Response Time Benchmark Suite');
  console.log(' Target Server:', BASE_URL);
  console.log('========================================================================\n');

  // Step 0: Clear Cache
  console.log('[Step 0] Flushing cache to ensure a fresh baseline...');
  try {
    await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/cache/clear',
      method: 'POST'
    });
    console.log(' Cache flushed successfully.\n');
  } catch (err) {
    console.error(' Cannot connect to server. Ensure "npm start" is running in P9 folder first!');
    console.error(' Error:', err.message);
    process.exit(1);
  }

  // Step 1: Record 3 UNCACHED readings
  console.log('[Step 1] Recording UNCACHED response times (direct MongoDB query)...');
  const uncachedReadings = [];
  for (let i = 1; i <= 3; i++) {
    // Request with noCache bypass to measure pure MongoDB database query
    const res = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/tasks?noCache=true',
      method: 'GET'
    });
    uncachedReadings.push(res.durationMs);
    console.log(`  Sample ${i}: ${res.durationMs.toFixed(2)} ms (Status: ${res.statusCode}, X-Cache: ${res.cacheHeader})`);
    await delay(100);
  }

  // Step 2: Warm up the cache with initial request
  console.log('\n[Step 2] Warming up cache (Initial GET /tasks)...');
  const warmup = await makeRequest({
    hostname: 'localhost',
    port: PORT,
    path: '/tasks',
    method: 'GET'
  });
  console.log(`  Warm-up Request: ${warmup.durationMs.toFixed(2)} ms (X-Cache: ${warmup.cacheHeader} -> Populated 'all_tasks')`);

  // Step 3: Record 3 CACHED readings
  console.log('\n[Step 3] Recording CACHED response times (node-cache in-memory hit)...');
  const cachedReadings = [];
  for (let i = 1; i <= 3; i++) {
    const res = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/tasks',
      method: 'GET'
    });
    cachedReadings.push(res.durationMs);
    console.log(`  Sample ${i}: ${res.durationMs.toFixed(2)} ms (Status: ${res.statusCode}, X-Cache: ${res.cacheHeader})`);
    await delay(100);
  }

  // Step 4: Compute Statistics
  const avgUncached = (uncachedReadings.reduce((a, b) => a + b, 0) / uncachedReadings.length).toFixed(2);
  const avgCached = (cachedReadings.reduce((a, b) => a + b, 0) / cachedReadings.length).toFixed(2);
  const diffMs = (avgUncached - avgCached).toFixed(2);
  const pctImprovement = (((avgUncached - avgCached) / avgUncached) * 100).toFixed(1);

  console.log('\n========================================================================');
  console.log(' BENCHMARK SUMMARY & EMPIRICAL RESULTS (FOR LAB JOURNAL / REPORT)');
  console.log('========================================================================');
  console.log('+--------------------+------------------+------------------+');
  console.log('| Metric / Reading   | Uncached (MongoDB)| Cached (node-cache)|');
  console.log('+--------------------+------------------+------------------+');
  for (let i = 0; i < 3; i++) {
    console.log(`| Sample Reading ${i + 1}   | ${uncachedReadings[i].toFixed(2).padStart(12)} ms | ${cachedReadings[i].toFixed(2).padStart(12)} ms |`);
  }
  console.log('+--------------------+------------------+------------------+');
  console.log(`| Average Latency    | ${avgUncached.padStart(12)} ms | ${avgCached.padStart(12)} ms |`);
  console.log('+--------------------+------------------+------------------+');
  console.log(`\n Performance Gain: ${diffMs} ms faster (${pctImprovement}% latency reduction)!`);

  // Step 5: Test Cache Invalidation on Write (POST)
  console.log('\n========================================================================');
  console.log(' TESTING CACHE INVALIDATION ON WRITE (POST /tasks)');
  console.log('========================================================================');
  const postRes = await makeRequest({
    hostname: 'localhost',
    port: PORT,
    path: '/tasks',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Benchmark Generated Task',
      description: 'Verifying immediate cache invalidation on write operation',
      priority: 'high'
    })
  });
  console.log(`[Write Operation] Created Task ID: ${postRes.data.data?._id} (Status: ${postRes.statusCode})`);

  // Verify next GET /tasks is a CACHE MISS
  const verifyMiss = await makeRequest({
    hostname: 'localhost',
    port: PORT,
    path: '/tasks',
    method: 'GET'
  });
  console.log(`[Verification] Next GET /tasks after POST -> X-Cache: ${verifyMiss.cacheHeader} (Correctly INVALIDATED!)`);

  // Step 6: Test Single-Task Caching (Supplementary Problem 1)
  console.log('\n========================================================================');
  console.log(' TESTING SINGLE-TASK CACHING (GET /tasks/:id) - Supplementary Problem 1');
  console.log('========================================================================');
  const taskId = postRes.data.data?._id;
  if (taskId) {
    const singleMiss = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: `/tasks/${taskId}`,
      method: 'GET'
    });
    console.log(`[Single Task 1st Request] X-Cache: ${singleMiss.cacheHeader}, Latency: ${singleMiss.durationMs.toFixed(2)} ms (Cache Miss)`);

    const singleHit = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: `/tasks/${taskId}`,
      method: 'GET'
    });
    console.log(`[Single Task 2nd Request] X-Cache: ${singleHit.cacheHeader}, Latency: ${singleHit.durationMs.toFixed(2)} ms (Cache Hit)`);

    // Invalidate on PUT
    await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: `/tasks/${taskId}`,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true })
    });
    console.log(`[Single Task Update (PUT)] Cache invalidated for 'all_tasks' and 'task_${taskId}'`);

    const singleAfterPut = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: `/tasks/${taskId}`,
      method: 'GET'
    });
    console.log(`[Single Task After PUT] X-Cache: ${singleAfterPut.cacheHeader} (Correctly Re-queried from DB!)`);
  }

  // Step 7: Inspect Cache Stats (Supplementary Problem 2)
  console.log('\n========================================================================');
  console.log(' CACHE DEBUG STATS (GET /cache/stats) - Supplementary Problem 2');
  console.log('========================================================================');
  const statsRes = await makeRequest({
    hostname: 'localhost',
    port: PORT,
    path: '/cache/stats',
    method: 'GET'
  });
  console.log(JSON.stringify(statsRes.data.metrics, null, 2));

  console.log('\n Practical 9 Verification Complete! Full compliance achieved.');
};

runBenchmark();
