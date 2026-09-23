const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/task-manager', { useNewUrlParser: true, useUnifiedTopology: true });

// Define Task schema and model
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean
});
const Task = mongoose.model('Task', taskSchema);

// Define User schema and model
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  token: String
});
const User = mongoose.model('User', userSchema);

// Middleware for parsing JSON bodies
app.use(express.json());

// Routes
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.status(201).json(task);
});

app.put('/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!task) return res.status(404).send('Task not found');
  res.json(task);
});

app.delete('/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).send('Task not found');
  res.json(task);
});

app.post('/users', async (req, res) => {
  const user = new User(req.body);
  user.password = user.generateHash(user.password);
  await user.save();
  res.json(user);
});

app.post('/users/authenticate', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(401).send('Invalid credentials');
  const validPassword = user.compareHash(req.body.password);
  if (!validPassword) return res.status(401).send('Invalid credentials');
  user.token = jwt.sign({ _id: user._id }, 'JWT_SECRET', { expiresIn: '1h' });
  res.json(user);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});