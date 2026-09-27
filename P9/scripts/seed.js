require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Task = require('../models/Task');

const sampleTasks = [
  { title: 'Implement JWT Authentication', description: 'Configure access tokens and refresh tokens with expiration', priority: 'high', completed: true },
  { title: 'Configure node-cache In-Memory Layer', description: 'Set up stdTTL: 60s and invalidation logic for Practical 9', priority: 'high', completed: true },
  { title: 'Design MongoDB Indexing Scheme', description: 'Create compound indexes on createdAt and userId for query optimization', priority: 'medium', completed: false },
  { title: 'Benchmark API Response Times', description: 'Capture at least 3 uncached vs cached readings with Postman', priority: 'high', completed: false },
  { title: 'Refactor Task Controller to Cache-Aside', description: 'Check cache on GET, query database on miss, invalidate on write', priority: 'high', completed: true },
  { title: 'Add Cache Debug Endpoint', description: 'Expose hit and miss counters via GET /cache/stats', priority: 'medium', completed: true },
  { title: 'Write Automated Test Suite', description: 'Verify cache hit, miss, and invalidation cycles programmatically', priority: 'medium', completed: false },
  { title: 'Conduct TTL Staleness Experiments', description: 'Measure data staleness trade-off across 5s, 60s, and 300s TTLs', priority: 'low', completed: false },
  { title: 'Setup Cross-Origin Resource Sharing', description: 'Configure CORS headers for React frontend integration', priority: 'medium', completed: true },
  { title: 'Optimize Mongoose Lean Queries', description: 'Use .lean() for read-only queries to bypass Mongoose document hydration', priority: 'high', completed: true }
];

// Generate 50 realistic tasks to create a realistic database workload
for (let i = 11; i <= 50; i++) {
  sampleTasks.push({
    title: `Task #${i}: System Maintenance & Performance Audit`,
    description: `Automated background health check and metric aggregation cycle #${i}`,
    priority: i % 3 === 0 ? 'high' : i % 2 === 0 ? 'medium' : 'low',
    completed: i % 4 === 0
  });
}

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskmanager_p9';
    await mongoose.connect(mongoUri);
    console.log(`[Seed] Connected to MongoDB: ${mongoUri}`);

    await Task.deleteMany({});
    console.log('[Seed] Cleared existing tasks collection.');

    const created = await Task.insertMany(sampleTasks);
    console.log(`[Seed] Successfully inserted ${created.length} sample tasks.`);

    console.log('[Seed] Database seeding completed successfully.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Failed to seed database:', error);
    process.exit(1);
  }
};

seedDatabase();
