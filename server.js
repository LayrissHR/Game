require("dotenv").config({ override: false });

const path = require("path");
const crypto = require("crypto");
const express = require("express");
const QRCode = require("qrcode");
const {
  addScore,
  addRewardClaim,
  clearScores,
  databasePath,
  getRewardClaimByCode,
  getScores,
  initDatabase,
  markRewardClaimed,
} = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_CODE = process.env.ADMIN_CODE || "academy2026";
const ADMIN_SECRET = process.env.ADMIN_SECRET || "1234";
const HOST = "0.0.0.0";
const SCORE_CONFIG = {
  maxScore: 760,
};
const REWARD_CONFIG = {
  missionCount: 5,
  rewardLabel: "Физическа награда",
  eligibleTitles: ["Млад кибергерой", "Бъдещ IT специалист"],
};
const publicDirectory = path.join(__dirname, "public");
const jsQrScriptPath = path.join(
  __dirname,
  "node_modules",
  "jsqr",
  "dist",
  "jsQR.js",
);

const allowedTitles = new Set([
  "Начинаещ изследовател",
  "Дигитален помощник",
  "Млад кибергерой",
  "Бъдещ IT специалист",
  ...REWARD_CONFIG.eligibleTitles,
]);

if (!process.env.ADMIN_SECRET) {
  console.warn(
    "[admin] ADMIN_SECRET не е зададен. Използва се временен локален код 1234.",
  );
}

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

  if (score < 0 || score > SCORE_CONFIG.maxScore) {
    return {
      error: `Точките трябва да бъдат между 0 и ${SCORE_CONFIG.maxScore}.`,
    };
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
      title,
    },
  };
}

function sanitizeClaimCode(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "")
    .slice(0, 32);
}

function validateRewardPayload(payload) {
  const studentName = sanitizeName(payload?.studentName);
  const score = Number(payload?.score);
  const title = typeof payload?.title === "string" ? payload.title.trim() : "";
  const completedMissions = Number(payload?.completedMissions);
  const gameWon = Boolean(payload?.gameWon);

  if (!studentName) {
    return { error: "Името е задължително." };
  }

  if (studentName.length > 20) {
    return { error: "Името трябва да бъде до 20 символа." };
  }

  if (
    !Number.isFinite(score) ||
    !Number.isInteger(score) ||
    score < 0 ||
    score > SCORE_CONFIG.maxScore
  ) {
    return {
      error: `Точките трябва да бъдат цяло число между 0 и ${SCORE_CONFIG.maxScore}.`,
    };
  }

  if (!allowedTitles.has(title)) {
    return { error: "Титлата не е валидна." };
  }

  if (
    !Number.isFinite(completedMissions) ||
    !Number.isInteger(completedMissions) ||
    completedMissions < 0 ||
    completedMissions > REWARD_CONFIG.missionCount
  ) {
    return { error: "Броят изпълнени мисии не е валиден." };
  }

  return {
    value: {
      studentName,
      score,
      title,
      completedMissions,
      gameWon,
    },
  };
}

function calculateRewardEligibility(score, title, completedMissions, gameWon) {
  if (REWARD_CONFIG.eligibleTitles.includes(title)) {
    return {
      eligible: true,
      reason: `Ученикът е достигнал титла „${title}“.`,
      rewardLabel: REWARD_CONFIG.rewardLabel,
    };
  }

  return {
    eligible: false,
    reason:
      "Участникът няма право на физическа награда, защото не е достигнал титла „Млад кибергерой“ или „Бъдещ IT специалист“.",
    rewardLabel: REWARD_CONFIG.rewardLabel,
  };
}

function generateClaimCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.randomBytes(8);
  let code = "";

  for (const byte of bytes) {
    code += alphabet[byte % alphabet.length];
  }

  return `KA-${new Date().getFullYear()}-${code.slice(0, 4)}-${code.slice(4, 8)}`;
}

async function generateUniqueClaimCode() {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const claimCode = generateClaimCode();
    const existingClaim = await getRewardClaimByCode(claimCode);
    if (!existingClaim) {
      return claimCode;
    }
  }

  throw new Error("Не може да се генерира уникален код за награда.");
}

function getRequestOrigin(request) {
  const protocol = request.get("x-forwarded-proto") || request.protocol;
  return `${protocol}://${request.get("host")}`;
}

function normalizeRewardClaim(row) {
  if (!row) return null;
  return {
    ...row,
    eligible: Boolean(row.eligible),
    claimed: Boolean(row.claimed),
    game_won: Boolean(row.game_won),
  };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatAdminDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Неизвестна дата";
  return date.toLocaleString("bg-BG", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderAdminVerifyPage(claim, options = {}) {
  const message = options.message || "";
  const messageType = options.messageType || "helper";

  if (!claim) {
    return `<!DOCTYPE html>
<html lang="bg">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Невалиден код</title>
  ${renderAdminStyles()}
</head>
<body>
  <main class="verify-shell">
    <section class="verify-card">
      <p class="eyebrow">Кибер академия</p>
      <h1>Невалиден код</h1>
      <p class="status not-eligible">Такъв QR код не е намерен.</p>
      <p class="muted">Проверете дали кодът е сканиран правилно или се обърнете към организатор.</p>
    </section>
  </main>
</body>
</html>`;
  }

  const statusClass = claim.claimed
    ? "claimed"
    : claim.eligible
      ? "eligible"
      : "not-eligible";
  const statusText = claim.claimed
    ? "Наградата вече е получена"
    : claim.eligible
      ? "Има право на награда"
      : "Няма право на награда";
  const canClaim = claim.eligible && !claim.claimed;

  return `<!DOCTYPE html>
<html lang="bg">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Проверка на награда</title>
  ${renderAdminStyles()}
</head>
<body>
  <main class="verify-shell">
    <section class="verify-card">
      <p class="eyebrow">Кибер академия</p>
      <h1>Проверка на награда</h1>
      ${message ? `<p class="message ${escapeHtml(messageType)}">${escapeHtml(message)}</p>` : ""}
      <p class="status ${statusClass}">${statusText}</p>
      <dl class="claim-list">
        <div><dt>Име</dt><dd>${escapeHtml(claim.student_name)}</dd></div>
        <div><dt>Резултат</dt><dd>${escapeHtml(claim.score)} точки</dd></div>
        <div><dt>Титла</dt><dd>${escapeHtml(claim.title)}</dd></div>
        <div><dt>Уникален код</dt><dd class="claim-code">${escapeHtml(claim.claim_code)}</dd></div>
        <div><dt>Причина</dt><dd>${escapeHtml(claim.reward_reason)}</dd></div>
        <div><dt>Генериран</dt><dd>${escapeHtml(formatAdminDate(claim.created_at))}</dd></div>
        ${claim.claimed_at ? `<div><dt>Получена</dt><dd>${escapeHtml(formatAdminDate(claim.claimed_at))}</dd></div>` : ""}
      </dl>
      ${claim.claimed ? `<p class="warning">Тази награда вече е получена.</p>` : ""}
      ${!claim.eligible ? `<p class="warning">Този участник няма право на физическа награда според зададените критерии.</p>` : ""}
      ${
        canClaim
          ? `
        <form class="claim-form" method="post" action="/admin/claim/${encodeURIComponent(claim.claim_code)}">
          <label for="adminSecret">Администраторски код</label>
          <input id="adminSecret" name="adminSecret" type="password" inputmode="numeric" autocomplete="one-time-code" required />
          <button type="submit">Маркирай като получена</button>
        </form>
      `
          : ""
      }
    </section>
  </main>
</body>
</html>`;
}

function renderAdminStyles() {
  return `<style>
    :root { color-scheme: dark; --bg: #050816; --panel: rgba(12, 21, 45, 0.94); --line: rgba(102, 217, 255, 0.28); --text: #f3fbff; --muted: #9cb5d9; --green: #5df7c5; --danger: #ff6ca8; --warning: #ffc96c; }
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100dvh; font-family: Verdana, "Segoe UI", sans-serif; color: var(--text); background: radial-gradient(circle at top left, rgba(47, 184, 255, 0.18), transparent 34%), linear-gradient(180deg, #030510, #071024 62%, #040811); }
    .verify-shell { width: min(720px, 100%); min-height: 100dvh; margin: 0 auto; padding: 18px; display: grid; place-items: center; }
    .verify-card { width: 100%; padding: clamp(18px, 5vw, 34px); border-radius: 18px; background: linear-gradient(180deg, rgba(12, 21, 45, 0.96), rgba(9, 15, 33, 0.88)); border: 1px solid var(--line); box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45); }
    .eyebrow { margin: 0 0 8px; color: #9bfbe6; text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.82rem; }
    h1 { margin: 0 0 18px; font-size: clamp(1.8rem, 7vw, 3rem); line-height: 1.05; }
    .status, .message, .warning { padding: 14px 16px; border-radius: 12px; font-weight: 900; line-height: 1.45; }
    .status.eligible { color: #04150f; background: var(--green); }
    .status.not-eligible { color: #260611; background: var(--danger); }
    .status.claimed { color: #211502; background: var(--warning); }
    .message.error { color: #ffd4e5; background: rgba(255, 108, 168, 0.16); border: 1px solid rgba(255, 108, 168, 0.34); }
    .message.success { color: #dffff6; background: rgba(93, 247, 197, 0.14); border: 1px solid rgba(93, 247, 197, 0.34); }
    .claim-list { display: grid; gap: 10px; margin: 18px 0; }
    .claim-list div { padding: 12px; border-radius: 12px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(146, 215, 255, 0.16); }
    dt { color: var(--muted); font-size: 0.82rem; margin-bottom: 5px; }
    dd { margin: 0; font-weight: 900; overflow-wrap: anywhere; }
    .claim-code { color: #9bfbe6; letter-spacing: 0.08em; }
    .warning { color: #fff7dc; background: rgba(255, 201, 108, 0.14); border: 1px solid rgba(255, 201, 108, 0.34); }
    .muted { color: #d3e6ff; line-height: 1.55; }
    .claim-form { display: grid; gap: 12px; margin-top: 18px; }
    label { color: #d3e6ff; font-weight: 800; }
    input, button { min-height: 54px; border-radius: 12px; font: inherit; }
    input { padding: 14px 16px; border: 1px solid rgba(146, 215, 255, 0.28); background: rgba(7, 17, 36, 0.92); color: var(--text); }
    button { border: 0; color: #04150f; background: linear-gradient(135deg, rgba(47, 184, 255, 0.96), rgba(93, 247, 197, 0.92)); font-weight: 900; cursor: pointer; }
  </style>`;
}

app.disable("x-powered-by");
app.set("trust proxy", true);

app.use((request, response, next) => {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("X-Content-Type-Options", "nosniff");
  next();
});

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));
app.use(express.static(publicDirectory, { index: false }));

app.get("/", (request, response) => {
  response.sendFile(path.join(publicDirectory, "index.html"));
});

app.get("/leaderboard", (request, response) => {
  response.sendFile(path.join(publicDirectory, "index.html"));
});

app.get("/admin/scanner", (request, response) => {
  response.sendFile(path.join(publicDirectory, "admin-scanner.html"));
});

app.get("/vendor/jsQR.js", (request, response) => {
  response.sendFile(jsQrScriptPath);
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
      created_at: new Date().toISOString(),
    };

    const result = await addScore(scoreEntry);

    response.status(201).json({
      message: "Резултатът беше записан успешно.",
      score: {
        id: result.lastID,
        ...scoreEntry,
      },
    });
  } catch (error) {
    console.error("[api/scores] Неуспешен запис на резултат.", {
      code: error.code,
      message: error.message,
    });
    next(error);
  }
});

app.post("/api/reward-claims", async (request, response, next) => {
  try {
    const validation = validateRewardPayload(request.body);

    if (validation.error) {
      response.status(400).json({ error: validation.error });
      return;
    }

    const { studentName, score, title, completedMissions, gameWon } =
      validation.value;
    const reward = calculateRewardEligibility(
      score,
      title,
      completedMissions,
      gameWon,
    );
    const claimCode = await generateUniqueClaimCode();
    const verifyUrl = `${getRequestOrigin(request)}/admin/verify/${encodeURIComponent(claimCode)}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 280,
    });
    const createdAt = new Date().toISOString();

    await addRewardClaim({
      student_name: studentName,
      score,
      title,
      completed_missions: completedMissions,
      game_won: gameWon ? 1 : 0,
      claim_code: claimCode,
      qr_url: verifyUrl,
      eligible: reward.eligible ? 1 : 0,
      reward_reason: reward.reason,
      reward_label: reward.rewardLabel,
      created_at: createdAt,
    });

    response.status(201).json({
      success: true,
      claimCode,
      verifyUrl,
      qrDataUrl,
      eligible: reward.eligible,
      rewardReason: reward.reason,
      rewardLabel: reward.rewardLabel,
    });
  } catch (error) {
    console.error("[api/reward-claims] Неуспешно създаване на QR талон.", {
      code: error.code,
      message: error.message,
    });
    next(error);
  }
});

app.get("/admin/verify/:claimCode", async (request, response, next) => {
  try {
    const claimCode = sanitizeClaimCode(request.params.claimCode);
    const claim = normalizeRewardClaim(await getRewardClaimByCode(claimCode));

    response.type("html").send(renderAdminVerifyPage(claim));
  } catch (error) {
    next(error);
  }
});

app.post("/admin/claim/:claimCode", async (request, response, next) => {
  try {
    const claimCode = sanitizeClaimCode(request.params.claimCode);
    const adminSecret =
      typeof request.body?.adminSecret === "string"
        ? request.body.adminSecret.trim()
        : "";
    const wantsJson =
      request.is("application/json") ||
      request.get("accept")?.includes("application/json");
    const claim = normalizeRewardClaim(await getRewardClaimByCode(claimCode));

    if (!claim) {
      if (wantsJson) {
        response.status(404).json({ error: "Невалиден код." });
        return;
      }
      response.status(404).type("html").send(renderAdminVerifyPage(null));
      return;
    }

    if (adminSecret !== ADMIN_SECRET) {
      if (wantsJson) {
        response.status(403).json({ error: "Невалиден администраторски код." });
        return;
      }
      response
        .status(403)
        .type("html")
        .send(
          renderAdminVerifyPage(claim, {
            message: "Невалиден администраторски код.",
            messageType: "error",
          }),
        );
      return;
    }

    if (!claim.eligible) {
      if (wantsJson) {
        response.status(400).json({
          error:
            "Този участник няма право на физическа награда според зададените критерии.",
        });
        return;
      }
      response
        .status(400)
        .type("html")
        .send(
          renderAdminVerifyPage(claim, {
            message:
              "Този участник няма право на физическа награда според зададените критерии.",
            messageType: "error",
          }),
        );
      return;
    }

    if (claim.claimed) {
      if (wantsJson) {
        response.status(409).json({ error: "Тази награда вече е получена." });
        return;
      }
      response
        .status(409)
        .type("html")
        .send(
          renderAdminVerifyPage(claim, {
            message: "Тази награда вече е получена.",
            messageType: "error",
          }),
        );
      return;
    }

    await markRewardClaimed(claimCode, new Date().toISOString());
    const updatedClaim = normalizeRewardClaim(
      await getRewardClaimByCode(claimCode),
    );

    if (wantsJson) {
      response.json({
        success: true,
        message: "Наградата е маркирана като получена.",
        claim: updatedClaim,
      });
      return;
    }

    response.type("html").send(
      renderAdminVerifyPage(updatedClaim, {
        message: "Наградата е маркирана като получена.",
        messageType: "success",
      }),
    );
  } catch (error) {
    next(error);
  }
});

app.delete("/api/scores", async (request, response, next) => {
  try {
    const adminCode =
      typeof request.body?.adminCode === "string"
        ? request.body.adminCode.trim()
        : "";

    if (!adminCode) {
      response
        .status(400)
        .json({ error: "Моля, въведете администраторски код." });
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

  console.error("[server] Необработена грешка.", {
    method: request.method,
    path: request.path,
    code: error.code,
    message: error.message,
  });
  response.status(500).json({
    error:
      "Сървърът не успя да обработи заявката. Проверете логовете на приложението.",
  });
});

initDatabase()
  .then(() => {
    app.listen(PORT, HOST, () => {
      console.log(
        `IT Quest: Мисия Академия е стартирана на http://localhost:${PORT}`,
      );
      console.log(`Локална база данни: ${databasePath}`);
    });
  })
  .catch((error) => {
    console.error(
      "Неуспешно стартиране на приложението. Проверете DATABASE_PATH и правата за запис.",
      {
        databasePath,
        code: error.code,
        message: error.message,
      },
    );
    process.exit(1);
  });
