const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password') {
    res.send('Login successful');
  } else {
    res.status(401).send('Login failed');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});