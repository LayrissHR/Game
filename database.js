const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

const configuredDatabasePath = process.env.DATABASE_PATH || path.join(__dirname, "scores.db");
const databasePath = path.isAbsolute(configuredDatabasePath)
  ? configuredDatabasePath
  : path.resolve(__dirname, configuredDatabasePath);
try {
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
} catch (error) {
  console.error(`[database] Не може да се създаде папката за SQLite файла: ${path.dirname(databasePath)}`, {
    code: error.code,
    message: error.message
  });
  throw error;
}

let db;
const databaseReady = new Promise((resolve, reject) => {
  db = new sqlite3.Database(databasePath, (error) => {
    if (error) {
      console.error(`[database] Не може да се отвори SQLite база данни: ${databasePath}`, {
        code: error.code,
        message: error.message
      });
      reject(error);
      return;
    }

    resolve(db);
  });
});

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
  await databaseReady;
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

  await run(`
    CREATE TABLE IF NOT EXISTS reward_claims (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_name TEXT NOT NULL,
      score INTEGER NOT NULL,
      title TEXT NOT NULL,
      completed_missions INTEGER DEFAULT 0,
      game_won INTEGER DEFAULT 0,
      claim_code TEXT NOT NULL UNIQUE,
      qr_url TEXT NOT NULL,
      eligible INTEGER NOT NULL DEFAULT 0,
      reward_reason TEXT,
      reward_label TEXT,
      claimed INTEGER NOT NULL DEFAULT 0,
      claimed_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
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

async function addRewardClaim(rewardClaim) {
  const {
    student_name: studentName,
    score,
    title,
    completed_missions: completedMissions,
    game_won: gameWon,
    claim_code: claimCode,
    qr_url: qrUrl,
    eligible,
    reward_reason: rewardReason,
    reward_label: rewardLabel,
    created_at: createdAt
  } = rewardClaim;

  return run(
    `
      INSERT INTO reward_claims (
        student_name,
        score,
        title,
        completed_missions,
        game_won,
        claim_code,
        qr_url,
        eligible,
        reward_reason,
        reward_label,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      studentName,
      score,
      title,
      completedMissions,
      gameWon,
      claimCode,
      qrUrl,
      eligible,
      rewardReason,
      rewardLabel,
      createdAt
    ]
  );
}

async function getRewardClaimByCode(claimCode) {
  const rows = await all(
    `
      SELECT id, student_name, score, title, completed_missions, game_won,
        claim_code, qr_url, eligible, reward_reason, reward_label,
        claimed, claimed_at, created_at
      FROM reward_claims
      WHERE claim_code = ?
      LIMIT 1
    `,
    [claimCode]
  );

  return rows[0] || null;
}

async function markRewardClaimed(claimCode, claimedAt) {
  return run(
    `
      UPDATE reward_claims
      SET claimed = 1, claimed_at = ?
      WHERE claim_code = ? AND eligible = 1 AND claimed = 0
    `,
    [claimedAt, claimCode]
  );
}

module.exports = {
  addScore,
  addRewardClaim,
  clearScores,
  databasePath,
  getScores,
  getRewardClaimByCode,
  markRewardClaimed,
  initDatabase
};
