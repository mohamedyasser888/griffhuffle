const express = require('express');
const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Default route - serves index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Serve CSS files from the public/css directory
app.get('/css/:file', (req, res) => {
  res.sendFile(__dirname + '/public/css/' + req.params.file);
});

// Serve JS files from the public/js directory
app.get('/js/:file', (req, res) => {
  res.sendFile(__dirname + '/public/js/' + req.params.file);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});