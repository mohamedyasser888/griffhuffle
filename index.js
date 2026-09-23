const express = require('express');
const app = express();
const port = 3000;

// Middleware for parsing JSON bodies
app.use(express.json());

// Sample route to handle GET requests
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Sample route to handle POST requests
app.post('/data', (req, res) => {
  const data = req.body;
  if (!data || !data.name) {
    return res.status(400).send({ error: 'Name is required' });
  }
  res.send({ message: `Hello, ${data.name}!` });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});