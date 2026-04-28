const path = require("path");
const express = require("express");
const {
  addScore,
  clearScores,
  databasePath,
  getScores,
  initDatabase
} = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_CODE = process.env.ADMIN_CODE || "academy2026";
const publicDirectory = path.join(__dirname, "public");

const allowedTitles = new Set([
  "Начинаещ изследовател",
  "Дигитален помощник",
  "Млад кибергерой",
  "Бъдещ IT специалист"
]);

function sanitizeName(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/[\u0000-\u001F\u007F<>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function validateScorePayload(payload) {
  const name = sanitizeName(payload?.name);
  const score = Number(payload?.score);
  const timeSeconds = Number(payload?.time_seconds);
  const title = typeof payload?.title === "string" ? payload.title.trim() : "";

  if (!name) {
    return { error: "Името е задължително." };
  }

  if (name.length > 20) {
    return { error: "Името трябва да бъде до 20 символа." };
  }

  if (!Number.isFinite(score) || !Number.isInteger(score)) {
    return { error: "Точките трябва да бъдат валидно число." };
  }

  if (score < 0 || score > 550) {
    return { error: "Точките трябва да бъдат между 0 и 550." };
  }

  if (!Number.isFinite(timeSeconds) || timeSeconds <= 0) {
    return { error: "Времето трябва да бъде положително число." };
  }

  if (!allowedTitles.has(title)) {
    return { error: "Титлата не е валидна." };
  }

  return {
    value: {
      name,
      score,
      time_seconds: timeSeconds,
      title
    }
  };
}

app.disable("x-powered-by");

app.use((request, response, next) => {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("X-Content-Type-Options", "nosniff");
  next();
});

app.use(express.json({ limit: "10kb" }));
app.use(express.static(publicDirectory, { index: false }));

app.get("/", (request, response) => {
  response.sendFile(path.join(publicDirectory, "index.html"));
});

app.get("/leaderboard", (request, response) => {
  response.sendFile(path.join(publicDirectory, "index.html"));
});

app.get("/api/scores", async (request, response, next) => {
  try {
    const scores = await getScores();
    response.json({ scores });
  } catch (error) {
    next(error);
  }
});

app.post("/api/scores", async (request, response, next) => {
  try {
    const validation = validateScorePayload(request.body);

    if (validation.error) {
      response.status(400).json({ error: validation.error });
      return;
    }

    const scoreEntry = {
      ...validation.value,
      created_at: new Date().toISOString()
    };

    const result = await addScore(scoreEntry);

    response.status(201).json({
      message: "Резултатът беше записан успешно.",
      score: {
        id: result.lastID,
        ...scoreEntry
      }
    });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/scores", async (request, response, next) => {
  try {
    const adminCode = typeof request.body?.adminCode === "string" ? request.body.adminCode.trim() : "";

    if (!adminCode) {
      response.status(400).json({ error: "Моля, въведете администраторски код." });
      return;
    }

    if (adminCode !== ADMIN_CODE) {
      response.status(403).json({ error: "Грешен администраторски код." });
      return;
    }

    await clearScores();
    response.json({ message: "Класацията беше изчистена успешно." });
  } catch (error) {
    next(error);
  }
});

app.use((error, request, response, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    response.status(400).json({ error: "Невалидни данни към сървъра." });
    return;
  }

  console.error("Server error:", error);
  response.status(500).json({ error: "Възникна сървърна грешка. Моля, опитайте отново." });
});

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`IT Quest: Мисия Академия е стартирана на http://localhost:${PORT}`);
      console.log(`Локална база данни: ${databasePath}`);
    });
  })
  .catch((error) => {
    console.error("Неуспешно стартиране на приложението:", error);
    process.exit(1);
  });
