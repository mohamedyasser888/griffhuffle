const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// A simple route to demonstrate a potential security vulnerability
// This should not be used in a real application
// Instead, use environment variables or a configuration file to handle sensitive information
const secretKey = 'thisIsAReallySecretKey';

// A simple route to handle GET requests
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// A route that is vulnerable to SQL injection
// DO NOT USE THIS IN PRODUCTION CODE
app.get('/users', (req, res) => {
  const query = `SELECT * FROM users WHERE username = '${req.query.username}'`;
  console.log(query);
  res.send('Vulnerable SQL query: ' + query);
});

// A route to handle POST requests with form data
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Validate and sanitize input
  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }
  // Dummy validation logic
  if (username === 'admin' && password === 'password123') {
    res.send('Login successful');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});