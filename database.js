const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const databasePath = path.join(__dirname, "scores.db");
const db = new sqlite3.Database(databasePath);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) {
        reject(error);
        return;
      }

      resolve({
        lastID: this.lastID,
        changes: this.changes
      });
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows);
    });
  });
}

async function initDatabase() {
  await run(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      score INTEGER NOT NULL,
      time_seconds REAL NOT NULL,
      title TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);
}

async function getScores() {
  return all(
    `
      SELECT id, name, score, time_seconds, title, created_at
      FROM scores
      ORDER BY score DESC, time_seconds ASC, created_at DESC
    `
  );
}

async function addScore(scoreEntry) {
  const { name, score, time_seconds: timeSeconds, title, created_at: createdAt } = scoreEntry;

  return run(
    `
      INSERT INTO scores (name, score, time_seconds, title, created_at)
      VALUES (?, ?, ?, ?, ?)
    `,
    [name, score, timeSeconds, title, createdAt]
  );
}

async function clearScores() {
  return run("DELETE FROM scores");
}

module.exports = {
  addScore,
  clearScores,
  databasePath,
  getScores,
  initDatabase
};
