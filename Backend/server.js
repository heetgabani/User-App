const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("database.db");

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT,
    mobile TEXT,
    address TEXT
  )
`);

app.post("/add-user", (req, res) => {
  const { name, mobile, address } = req.body;
  db.run(
    "INSERT INTO users (name, mobile, address) VALUES (?, ?, ?)",
    [name, mobile, address],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error inserting data");
      } else {
        res.send("User added successfully");
      }
    }
  );
});

app.get("/search-users", (req, res) => {
  const query = req.query.query;
  const searchPattern = `%${query}%`;
  const sql =
    "SELECT * FROM users WHERE name LIKE ? OR mobile LIKE ? OR address LIKE ?";

  db.all(sql, [searchPattern, searchPattern, searchPattern], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching data");
    } else {
      res.json(rows);
    }
  });
});

app.get("/autosuggest", (req, res) => {
  const query = req.query.query;
  const searchPattern = `%${query}%`;
  const sql = "SELECT name FROM users WHERE name LIKE ?";
  db.all(sql, [searchPattern], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching autosuggestions");
    } else {
      const suggestions = rows.map((row) => row.name);
      res.json(suggestions);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
