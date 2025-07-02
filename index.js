const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp';

// MongoDB Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// User model
const User = require('./models/User');
const Task = require('./models/Task');

// Set up nodemailer transporter (use your email credentials from .env)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Run every minute to check for due tasks
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const soon = new Date(now.getTime() + 60 * 1000); // next minute
  const dueTasks = await Task.find({ dueDate: { $gte: now, $lt: soon }, reminded: { $ne: true } });

  // Send all emails in parallel
  await Promise.all(dueTasks.map(async (task) => {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: task.userEmail,
        subject: 'Task Reminder',
        text: `Reminder: Your task "${task.title}" is due now!`
      });
      // Mark as reminded
      task.reminded = true;
      await task.save();
    } catch (err) {
      console.error(`Failed to send reminder for task ${task._id}:`, err);
    }
  }));
});

// Serve static files from the React frontend build
app.use(express.static(path.join(__dirname, '../project/dist')));

// Catch-all route to serve index.html for React Router
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../project/dist', 'index.html'));
});

// Routes
app.get('/', (req, res) => {
  res.send('✅ Backend server is running!');
});

// Sign Up Route
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      avatar,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Signup failed' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Get user streak data
app.get('/api/user/:email/streak', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      lastActiveDate: user.lastActiveDate,
      weeklyProgress: user.weeklyProgress
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user streak data
app.post('/api/user/:email/streak', async (req, res) => {
  try {
    const { currentStreak, longestStreak, lastActiveDate, weeklyProgress } = req.body;
    const user = await User.findOneAndUpdate(
      { email: req.params.email },
      { currentStreak, longestStreak, lastActiveDate, weeklyProgress },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Task CRUD Endpoints ---
// Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const { userEmail } = req.query;
    const query = userEmail ? { userEmail } : {};
    const tasks = await Task.find(query);
    const mappedTasks = tasks.map(task => ({
      ...task.toObject(),
      id: task._id.toString(),
    }));
    res.json(mappedTasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create a new task
app.post('/api/tasks', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    const taskObj = newTask.toObject();
    taskObj.id = taskObj._id.toString();
    res.status(201).json(taskObj);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update a task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
    const taskObj = updatedTask.toObject();
    taskObj.id = taskObj._id.toString();
    res.json(taskObj);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ error: 'Task not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
