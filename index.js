const express = require('express');
const app = express();
const PORT = 3000;

const users = [
  { id: 1, username: 'user1', password: 'pass1' },
  { id: 2, username: 'user2', password: 'pass2' }
];

app.use(express.json());

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username);
  if (!user) {
    res.status(401).send('Invalid username or password');
    return;
  }
  if (user.password === password) {
    res.status(200).send('Login successful');
  } else {
    res.status(401).send('Invalid username or password');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});