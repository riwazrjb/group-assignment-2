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
app.get('/email', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'email.html'));
});
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
      res.send(`
        <html>
          <body>
            <h1>Signup successful!</h1>
            <p>You can now <a href="/signin">sign in</a>.</p>
          </body>
        </html>
      `);
    }
  });
});

app.post('/signin', (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
    if (err) {
      res.status(500).send("Error querying the database.");
    } else if (row) {
      res.send(`
      <html>
        <body>
          <h1>SignIn successful!</h1>
          <p>You can now go to <a href="/">Home page</a>.</p>
        </body>
      </html>
    `);
    } else {
      res.status(401).send(`
      <html>
        <body>
          <h1>Incorrect username or password</h1>
          <p>please try again<a href="/signin">sign in</a>.</p>
        </body>
      </html>
    `);
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
