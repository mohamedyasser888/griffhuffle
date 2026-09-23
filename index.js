const password = process.env.DB_PASSWORD;

import fs from 'fs';

const db = {
  query: (sql, params) => {
    // Simulate a query
    return new Promise((resolve, reject) => {
      const result = { rows: [{ id: 1, username: 'user1' }] };
      resolve(result);
    });
  }
};

const userId = 1;

const user = db.query('SELECT * FROM users WHERE id = ?', [userId]);

try {
  // Your code here
  process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at:', p, 'reason:', reason);
  });
} catch (error) {
  console.error('Caught an error:', error);
}

fs.readFile('file.txt', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
  } else {
    console.log('File data:', data);
  }
});

const password = process.env.DB_PASSWORD;
