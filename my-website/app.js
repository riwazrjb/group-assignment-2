const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('users.db');

// Serve static files from the 'public' directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Define routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.get('/signin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signin.html'));
});

app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], (err) => {
    if (err) {
      res.status(500).send("Error saving to database.");
    } else {
      res.send("Signup successful!");
    }
  });
});

app.post('/signin', (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
    if (err) {
      res.status(500).send("Error querying the database.");
    } else if (row) {
      res.send("Sign-in successful!");
    } else {
      res.status(401).send("Invalid username or password.");
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
