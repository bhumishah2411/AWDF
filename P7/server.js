const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const JWT_SECRET = 'supersecretkey123'; // In production, use environment variables

// --- MongoDB Connection ---
// Replace with your MongoDB URI if using Atlas
mongoose.connect('mongodb://localhost:27017/taskmanager_auth')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// --- Models ---
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const Task = mongoose.model('Task', TaskSchema);

// --- Middlewares ---

// 1. Validation Middleware (rejects missing title for tasks)
const validateTask = (req, res, next) => {
  if (!req.body.title || req.body.title.trim() === '') {
    return res.status(400).json({ error: 'Title is required for a task' });
  }
  next();
};

// 2. Authentication Middleware (verifies JWT)
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token expired or invalid' });
  }
};

// --- Routes ---

// Register
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(400).json({ error: 'User not found' });

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    // Sign JWT (expires in 1 hour)
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Get Current Logged-in User
app.get('/me', authenticate, async (req, res) => {
  // Return the decoded user info directly
  res.json({ user: req.user });
});

// Get all tasks (Protected)
app.get('/tasks', authenticate, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.userId });
  res.json(tasks);
});

// Create a task (Protected + Validated)
app.post('/tasks', authenticate, validateTask, async (req, res) => {
  const task = new Task({
    title: req.body.title,
    userId: req.user.userId
  });
  await task.save();
  res.status(201).json(task);
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
