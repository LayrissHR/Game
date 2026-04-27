const missions = [
  {
    type: "multiple-choice",
    title: "Мисия 1: Сигурна парола",
    question: "Коя от тези пароли е най-сигурна?",
    options: ["A) 123456", "B) ivan2000", "C) password", "D) Luna#48_Kod!"],
    correctAnswer: "D) Luna#48_Kod!",
    correctExplanation: "Браво! Силната парола използва главни и малки букви, цифри и специални символи.",
    wrongExplanation:
      "Тази парола е лесна за отгатване. Най-сигурният избор е Luna#48_Kod!, защото комбинира различни символи.",
    note: "Какво научи: силните пароли са по-трудни за познаване и пазят профилите по-добре."
  },
  {
    type: "multiple-choice",
    title: "Мисия 2: Фишинг или безопасно?",
    question:
      "Получаваш съобщение: „Честито! Спечели телефон! Натисни тук и въведи паролата си.“ Какво е това?",
    options: ["A) Безопасно съобщение", "B) Фишинг измама", "C) Съобщение от учител", "D) Нормална реклама"],
    correctAnswer: "B) Фишинг измама",
    correctExplanation:
      "Точно така! Това е фишинг – опит някой да те подмами да въведеш лични данни или парола.",
    wrongExplanation:
      "Внимавай! Съобщения, които обещават награди и искат парола, често са измама.",
    note: "Какво научи: подозрителните съобщения често искат пароли или лични данни и трябва да се избягват."
  },
  {
    type: "order",
    title: "Мисия 3: Подреди мрежата",
    question: "Подреди елементите в правилния ред, за да стигне компютърът до интернет.",
    items: ["Компютър", "Рутер", "Интернет"],
    correctOrder: ["Компютър", "Рутер", "Интернет"],
    correctExplanation:
      "Браво! Компютърът се свързва с рутера, а рутерът осигурява достъп до интернет.",
    wrongExplanation:
      "Почти! Обикновено компютърът първо се свързва с рутера, а рутерът – с интернет.",
    note: "Какво научи: рутерът свързва устройствата у дома или в училище с интернет."
  },
  {
    type: "multiple-choice",
    title: "Мисия 4: Логическо предизвикателство",
    question: "Една лампа светва само когато има ток И бутонът е включен. Кога ще светне лампата?",
    options: [
      "A) Когато има ток, но бутонът е изключен",
      "B) Когато няма ток, но бутонът е включен",
      "C) Когато има ток и бутонът е включен",
      "D) Винаги"
    ],
    correctAnswer: "C) Когато има ток и бутонът е включен",
    correctExplanation: "Точно така! Това е логика И – и двете условия трябва да са изпълнени.",
    wrongExplanation:
      "При логика И всички условия трябва да са верни. Тук трябва едновременно да има ток и бутонът да е включен.",
    note: "Какво научи: при логика И резултат има само когато всички важни условия са изпълнени."
  },
  {
    type: "multiple-choice",
    title: "Мисия 5: Открий алгоритъма",
    codeBlock:
      "Ако температурата е над 30 градуса:\n    включи вентилатора\nИначе:\n    включи отоплението",
    question: "Какво ще стане, ако температурата е 35 градуса?",
    options: [
      "A) Ще се включи вентилаторът",
      "B) Ще се включи отоплението",
      "C) Нищо няма да стане",
      "D) Ще се изключи компютърът"
    ],
    correctAnswer: "A) Ще се включи вентилаторът",
    correctExplanation: "Браво! 35 е повече от 30, затова се изпълнява първата команда.",
    wrongExplanation:
      "Провери условието: ако температурата е над 30 градуса, се включва вентилаторът.",
    note: "Какво научи: алгоритъмът следва ясни условия и избира действие според резултата."
  }
];

const allowedTitles = [
  "Начинаещ изследовател",
  "Дигитален помощник",
  "Млад кибергерой",
  "Бъдещ IT специалист"
];

const gameState = {
  playerName: "",
  currentMissionIndex: 0,
  score: 0,
  startTime: null,
  endTime: null,
  answers: [],
  selectedOrder: [],
  timerIntervalId: null,
  hasSavedResult: false,
  soundEnabled: true,
  leaderboard: [],
  finalResult: null
};

const ui = {};
let audioContext = null;

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("popstate", handleRouteChange);
document.addEventListener("fullscreenchange", syncEventModeState);

function init() {
  cacheElements();
  bindEvents();
  loadPreferences();
  updateSoundButton();
  syncEventModeState();
  showScreen(window.location.pathname === "/leaderboard" ? "leaderboard" : "home", false);
}

function cacheElements() {
  ui.appShell = document.getElementById("app-shell");
  ui.body = document.body;
  ui.screens = {
    home: document.getElementById("screen-home"),
    game: document.getElementById("screen-game"),
    result: document.getElementById("screen-result"),
    leaderboard: document.getElementById("screen-leaderboard")
  };
  ui.playerNameInput = document.getElementById("player-name");
  ui.homeError = document.getElementById("home-error");
  ui.soundToggle = document.getElementById("sound-toggle");
  ui.eventModeBtn = document.getElementById("event-mode-btn");
  ui.startBtn = document.getElementById("start-btn");
  ui.homeLeaderboardBtn = document.getElementById("home-leaderboard-btn");
  ui.missionCounter = document.getElementById("mission-counter");
  ui.scoreCounter = document.getElementById("score-counter");
  ui.timerCounter = document.getElementById("timer-counter");
  ui.progressFill = document.getElementById("progress-fill");
  ui.missionTitle = document.getElementById("mission-title");
  ui.missionQuestion = document.getElementById("mission-question");
  ui.missionCode = document.getElementById("mission-code");
  ui.answerOptions = document.getElementById("answer-options");
  ui.feedbackPanel = document.getElementById("feedback-panel");
  ui.feedbackBadge = document.getElementById("feedback-badge");
  ui.feedbackText = document.getElementById("feedback-text");
  ui.feedbackNote = document.getElementById("feedback-note");
  ui.nextMissionBtn = document.getElementById("next-mission-btn");
  ui.orderBuilder = document.getElementById("order-builder");
  ui.orderSlots = document.getElementById("order-slots");
  ui.orderOptions = document.getElementById("order-options");
  ui.orderResetBtn = document.getElementById("order-reset-btn");
  ui.orderConfirmBtn = document.getElementById("order-confirm-btn");
  ui.orderStatus = document.getElementById("order-status");
  ui.resultSummary = document.getElementById("result-summary");
  ui.saveStatus = document.getElementById("save-status");
  ui.resultNewGameBtn = document.getElementById("result-new-game-btn");
  ui.resultLeaderboardBtn = document.getElementById("result-leaderboard-btn");
  ui.resultHomeBtn = document.getElementById("result-home-btn");
  ui.confettiLayer = document.getElementById("confetti-layer");
  ui.leaderboardBody = document.getElementById("leaderboard-body");
  ui.leaderboardMessage = document.getElementById("leaderboard-message");
  ui.leaderboardEmpty = document.getElementById("leaderboard-empty");
  ui.leaderboardTableWrapper = document.getElementById("leaderboard-table-wrapper");
  ui.leaderboardNewGameBtn = document.getElementById("leaderboard-new-game-btn");
  ui.leaderboardHomeBtn = document.getElementById("leaderboard-home-btn");
  ui.refreshLeaderboardBtn = document.getElementById("refresh-leaderboard-btn");
  ui.adminBtn = document.getElementById("admin-btn");
}

function bindEvents() {
  ui.startBtn.addEventListener("click", startGame);
  ui.homeLeaderboardBtn.addEventListener("click", () => showScreen("leaderboard"));
  ui.nextMissionBtn.addEventListener("click", goToNextMission);
  ui.orderResetBtn.addEventListener("click", resetOrderSelection);
  ui.orderConfirmBtn.addEventListener("click", confirmOrderAnswer);
  ui.resultNewGameBtn.addEventListener("click", prepareNewGame);
  ui.resultLeaderboardBtn.addEventListener("click", () => showScreen("leaderboard"));
  ui.resultHomeBtn.addEventListener("click", goHome);
  ui.leaderboardNewGameBtn.addEventListener("click", prepareNewGame);
  ui.leaderboardHomeBtn.addEventListener("click", goHome);
  ui.refreshLeaderboardBtn.addEventListener("click", loadLeaderboard);
  ui.adminBtn.addEventListener("click", requestAdminClear);
  ui.soundToggle.addEventListener("click", toggleSound);
  ui.eventModeBtn.addEventListener("click", toggleEventMode);
  ui.playerNameInput.addEventListener("input", handleNameInput);
  ui.playerNameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      startGame();
    }
  });
}

function handleRouteChange() {
  if (window.location.pathname === "/leaderboard") {
    showScreen("leaderboard", false);
    return;
  }

  showScreen("home", false);
}

function showScreen(screenName, pushState = true) {
  Object.entries(ui.screens).forEach(([name, element]) => {
    const isActive = name === screenName;
    element.hidden = !isActive;
    element.classList.toggle("active", isActive);
  });

  if (pushState) {
    const nextPath = screenName === "leaderboard" ? "/leaderboard" : "/";
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
  }

  if (screenName === "leaderboard") {
    loadLeaderboard();
  }

  if (screenName === "home") {
    ui.playerNameInput.focus();
  }
}

function handleNameInput() {
  const sanitized = ui.playerNameInput.value.replace(/[\u0000-\u001F\u007F]/g, "");
  if (sanitized !== ui.playerNameInput.value) {
    ui.playerNameInput.value = sanitized;
  }

  setMessage(ui.homeError, "");
}

function sanitizeDisplayText(value) {
  return String(value ?? "")
    .replace(/[\u0000-\u001F\u007F<>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeNameInput(value) {
  return sanitizeDisplayText(value);
}

function startGame() {
  const playerName = sanitizeNameInput(ui.playerNameInput.value);

  if (!playerName) {
    setMessage(ui.homeError, "Моля, въведи име или псевдоним.", "error");
    ui.playerNameInput.focus();
    return;
  }

  if (playerName.length > 20) {
    setMessage(ui.homeError, "Името трябва да бъде до 20 символа.", "error");
    ui.playerNameInput.focus();
    return;
  }

  playSound("click");
  resetGameState();
  gameState.playerName = playerName;
  gameState.startTime = Date.now();
  ui.playerNameInput.value = playerName;
  setMessage(ui.homeError, "");
  setMessage(ui.saveStatus, "");
  clearConfetti();
  startTimer();
  showScreen("game");
  renderMission();
}

function resetGameState() {
  stopTimer();
  gameState.playerName = "";
  gameState.currentMissionIndex = 0;
  gameState.score = 0;
  gameState.startTime = null;
  gameState.endTime = null;
  gameState.answers = [];
  gameState.selectedOrder = [];
  gameState.hasSavedResult = false;
  gameState.finalResult = null;
  ui.resultSummary.replaceChildren();
  ui.answerOptions.replaceChildren();
  ui.orderOptions.replaceChildren();
  ui.orderSlots.replaceChildren();
  ui.nextMissionBtn.hidden = true;
  ui.feedbackPanel.hidden = true;
  ui.feedbackPanel.className = "feedback-panel";
  setMessage(ui.orderStatus, "");
}

function prepareNewGame() {
  goHome();
}

function goHome() {
  playSound("click");
  resetGameState();
  ui.playerNameInput.value = "";
  showScreen("home");
}

function renderMission() {
  const mission = missions[gameState.currentMissionIndex];

  if (!mission) {
    return;
  }

  gameState.selectedOrder = [];
  ui.missionTitle.textContent = mission.title;
  ui.missionQuestion.textContent = mission.question;
  ui.missionCode.hidden = !mission.codeBlock;
  ui.missionCode.textContent = mission.codeBlock || "";
  ui.feedbackPanel.hidden = true;
  ui.feedbackPanel.className = "feedback-panel";
  ui.nextMissionBtn.hidden = true;
  setMessage(ui.orderStatus, "");

  if (mission.type === "order") {
    ui.answerOptions.hidden = true;
    ui.answerOptions.replaceChildren();
    ui.orderBuilder.hidden = false;
    renderOrderMission(mission);
  } else {
    ui.orderBuilder.hidden = true;
    ui.orderOptions.replaceChildren();
    ui.orderSlots.replaceChildren();
    renderMultipleChoiceMission(mission);
  }

  updateGameHeader();
}

function renderMultipleChoiceMission(mission) {
  const fragment = document.createDocumentFragment();

  mission.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-button";
    button.dataset.option = option;

    const text = document.createElement("span");
    text.className = "answer-button__text";
    text.textContent = option;

    button.append(text);
    button.addEventListener("click", () => handleAnswer(option));
    fragment.append(button);
  });

  ui.answerOptions.replaceChildren(fragment);
  ui.answerOptions.hidden = false;
}

function renderOrderMission(mission) {
  renderOrderSlots(mission);
  renderOrderOptions(mission);
  updateOrderButtons();
}

function renderOrderSlots(mission, answered = false) {
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < mission.correctOrder.length; index += 1) {
    const slot = document.createElement("div");
    slot.className = "order-slot";

    const step = document.createElement("span");
    step.className = "order-slot__step";
    step.textContent = `Стъпка ${index + 1}`;

    const value = document.createElement("span");
    value.className = "order-slot__value";

    const selectedItem = gameState.selectedOrder[index];
    if (selectedItem) {
      slot.classList.add("order-slot--filled");
      value.textContent = selectedItem;
    } else {
      value.textContent = "Очаква избор";
    }

    if (answered && selectedItem) {
      slot.classList.add(selectedItem === mission.correctOrder[index] ? "order-slot--correct" : "order-slot--incorrect");
    }

    slot.append(step, value);
    fragment.append(slot);
  }

  ui.orderSlots.replaceChildren(fragment);
}

function renderOrderOptions(mission, answered = false) {
  const fragment = document.createDocumentFragment();

  mission.items.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "order-button";
    button.dataset.item = item;
    button.disabled = answered || gameState.selectedOrder.includes(item);

    if (gameState.selectedOrder.includes(item)) {
      button.classList.add("selected");
    }

    const text = document.createElement("span");
    text.className = "order-button__text";
    text.textContent = item;

    const meta = document.createElement("span");
    meta.className = "order-button__meta";
    meta.textContent = answered
      ? "Изборът е заключен"
      : button.disabled
        ? "Избрано"
        : "Натисни за подреждане";

    button.append(text, meta);
    button.addEventListener("click", () => handleOrderSelection(item));
    fragment.append(button);
  });

  ui.orderOptions.replaceChildren(fragment);
}

function updateGameHeader() {
  ui.missionCounter.textContent = `Мисия ${gameState.currentMissionIndex + 1} от ${missions.length}`;
  ui.scoreCounter.textContent = `Точки: ${gameState.score}`;
  ui.timerCounter.textContent = `Време: ${formatTime(getElapsedSeconds())}`;
  ui.progressFill.style.width = `${((gameState.currentMissionIndex + 1) / missions.length) * 100}%`;
}

function startTimer() {
  stopTimer();
  ui.timerCounter.textContent = "Време: 00:00";
  gameState.timerIntervalId = window.setInterval(() => {
    ui.timerCounter.textContent = `Време: ${formatTime(getElapsedSeconds())}`;
  }, 250);
}

function stopTimer() {
  if (gameState.timerIntervalId) {
    window.clearInterval(gameState.timerIntervalId);
    gameState.timerIntervalId = null;
  }
}

function getElapsedSeconds() {
  if (!gameState.startTime) {
    return 0;
  }

  const endTime = gameState.endTime || Date.now();
  return Math.max(0, (endTime - gameState.startTime) / 1000);
}

function formatTime(seconds) {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const remainingSeconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

function handleAnswer(selectedOption) {
  if (gameState.answers[gameState.currentMissionIndex]) {
    return;
  }

  const mission = missions[gameState.currentMissionIndex];
  const isCorrect = selectedOption === mission.correctAnswer;
  const earnedPoints = isCorrect ? 100 : 20;

  gameState.score += earnedPoints;
  gameState.answers[gameState.currentMissionIndex] = {
    type: mission.type,
    selectedOption,
    correct: isCorrect,
    earnedPoints
  };

  lockMultipleChoiceOptions(selectedOption, mission.correctAnswer, isCorrect);
  showFeedback(isCorrect, earnedPoints, isCorrect ? mission.correctExplanation : mission.wrongExplanation, mission.note);
  ui.nextMissionBtn.textContent =
    gameState.currentMissionIndex === missions.length - 1 ? "Виж резултата" : "Следваща мисия";
  ui.nextMissionBtn.hidden = false;
  updateGameHeader();
  playSound(isCorrect ? "correct" : "wrong");
}

function lockMultipleChoiceOptions(selectedOption, correctAnswer, isCorrect) {
  Array.from(ui.answerOptions.querySelectorAll(".answer-button")).forEach((button) => {
    const option = button.dataset.option;
    button.disabled = true;
    button.classList.add("is-locked");

    const meta = document.createElement("span");
    meta.className = "answer-button__meta";

    if (option === correctAnswer) {
      button.classList.add("is-correct");
      meta.textContent = option === selectedOption ? "Твоят верен избор" : "Верният отговор";
      button.append(meta);
      return;
    }

    if (option === selectedOption && !isCorrect) {
      button.classList.add("is-incorrect");
      meta.textContent = "Твоят избор";
      button.append(meta);
    }
  });
}

function handleOrderSelection(item) {
  if (gameState.answers[gameState.currentMissionIndex]) {
    return;
  }

  if (gameState.selectedOrder.includes(item) || gameState.selectedOrder.length >= 3) {
    return;
  }

  gameState.selectedOrder.push(item);
  const mission = missions[gameState.currentMissionIndex];
  renderOrderSlots(mission);
  renderOrderOptions(mission);
  updateOrderButtons();
  setMessage(ui.orderStatus, "");
  playSound("click");
}

function resetOrderSelection() {
  if (gameState.answers[gameState.currentMissionIndex]) {
    return;
  }

  gameState.selectedOrder = [];
  const mission = missions[gameState.currentMissionIndex];
  renderOrderSlots(mission);
  renderOrderOptions(mission);
  updateOrderButtons();
  setMessage(ui.orderStatus, "");
  playSound("click");
}

function updateOrderButtons(answered = false) {
  ui.orderResetBtn.disabled = answered || gameState.selectedOrder.length === 0;
  ui.orderConfirmBtn.disabled = answered || gameState.selectedOrder.length !== 3;
}

function confirmOrderAnswer() {
  if (gameState.answers[gameState.currentMissionIndex]) {
    return;
  }

  if (gameState.selectedOrder.length !== 3) {
    setMessage(ui.orderStatus, "Избери трите елемента, за да продължиш.", "error");
    return;
  }

  const mission = missions[gameState.currentMissionIndex];
  const isCorrect = mission.correctOrder.every((item, index) => gameState.selectedOrder[index] === item);
  const earnedPoints = isCorrect ? 100 : 20;

  gameState.score += earnedPoints;
  gameState.answers[gameState.currentMissionIndex] = {
    type: mission.type,
    selectedOrder: [...gameState.selectedOrder],
    correct: isCorrect,
    earnedPoints
  };

  renderOrderSlots(mission, true);
  renderOrderOptions(mission, true);
  updateOrderButtons(true);
  setMessage(ui.orderStatus, `Избраният ред е: ${gameState.selectedOrder.join(" → ")}`, "helper");
  showFeedback(
    isCorrect,
    earnedPoints,
    isCorrect ? mission.correctExplanation : `${mission.wrongExplanation} Правилен ред: ${mission.correctOrder.join(" → ")}`,
    mission.note
  );
  ui.nextMissionBtn.textContent =
    gameState.currentMissionIndex === missions.length - 1 ? "Виж резултата" : "Следваща мисия";
  ui.nextMissionBtn.hidden = false;
  updateGameHeader();
  playSound(isCorrect ? "correct" : "wrong");
}

function showFeedback(isCorrect, earnedPoints, explanation, note) {
  ui.feedbackPanel.hidden = false;
  ui.feedbackPanel.className = `feedback-panel ${isCorrect ? "correct" : "incorrect"}`;
  ui.feedbackBadge.textContent = isCorrect
    ? `Верен отговор! +${earnedPoints} точки`
    : `Продължавай смело! +${earnedPoints} точки за участие`;
  ui.feedbackText.textContent = explanation;
  ui.feedbackNote.textContent = note;
}

function goToNextMission() {
  playSound("click");

  if (gameState.currentMissionIndex >= missions.length - 1) {
    finishGame();
    return;
  }

  gameState.currentMissionIndex += 1;
  renderMission();
}

function calculateTimeBonus(timeSeconds) {
  if (timeSeconds < 45) {
    return 50;
  }

  if (timeSeconds <= 70) {
    return 30;
  }

  if (timeSeconds <= 90) {
    return 10;
  }

  return 0;
}

function calculateTitle(score) {
  if (score <= 150) {
    return allowedTitles[0];
  }

  if (score <= 300) {
    return allowedTitles[1];
  }

  if (score <= 450) {
    return allowedTitles[2];
  }

  return allowedTitles[3];
}

function finishGame() {
  stopTimer();
  gameState.endTime = Date.now();

  const timeSeconds = Number(Math.max(0.1, getElapsedSeconds()).toFixed(2));
  const timeBonus = calculateTimeBonus(timeSeconds);
  const finalScore = gameState.score + timeBonus;
  const title = calculateTitle(finalScore);

  gameState.finalResult = {
    name: gameState.playerName,
    score: finalScore,
    timeSeconds,
    title,
    timeBonus
  };

  renderResult();
  showScreen("result");
  launchConfetti();
  playSound("success");
  saveScore();
}

function renderResult() {
  const result = gameState.finalResult;
  if (!result) {
    return;
  }

  const items = [
    { label: "Име", value: result.name },
    { label: "Точки", value: String(result.score) },
    { label: "Време", value: formatTime(result.timeSeconds) },
    { label: "Титла", value: result.title },
    { label: "Бонус за време", value: `+${result.timeBonus}` }
  ];

  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "summary-item";

    const label = document.createElement("span");
    label.className = "summary-item__label";
    label.textContent = item.label;

    const value = document.createElement("span");
    value.className = "summary-item__value";
    value.textContent = sanitizeDisplayText(item.value);

    card.append(label, value);
    fragment.append(card);
  });

  ui.resultSummary.replaceChildren(fragment);
}

async function saveScore() {
  if (!gameState.finalResult || gameState.hasSavedResult) {
    return;
  }

  setMessage(ui.saveStatus, "Записване на резултата...", "helper");

  try {
    const response = await fetch("/api/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: gameState.finalResult.name,
        score: gameState.finalResult.score,
        time_seconds: gameState.finalResult.timeSeconds,
        title: gameState.finalResult.title
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Резултатът не беше записан. Моля, опитайте отново.");
    }

    gameState.hasSavedResult = true;
    setMessage(ui.saveStatus, "Резултатът беше записан успешно.", "success");
  } catch (error) {
    setMessage(ui.saveStatus, getNetworkAwareMessage(error, "Резултатът не беше записан. Моля, опитайте отново."), "error");
  }
}

async function loadLeaderboard() {
  setMessage(ui.leaderboardMessage, "Зареждане на класацията...", "helper");

  try {
    const response = await fetch("/api/scores", { cache: "no-store" });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Класацията не може да бъде заредена в момента.");
    }

    gameState.leaderboard = sortScores(Array.isArray(data.scores) ? data.scores : []);
    renderLeaderboard();
    setMessage(ui.leaderboardMessage, "");
  } catch (error) {
    gameState.leaderboard = [];
    renderLeaderboard();
    setMessage(
      ui.leaderboardMessage,
      getNetworkAwareMessage(error, "Класацията не може да бъде заредена в момента."),
      "error"
    );
  }
}

function sortScores(scores) {
  return [...scores].sort((first, second) => {
    if (second.score !== first.score) {
      return second.score - first.score;
    }

    if (first.time_seconds !== second.time_seconds) {
      return first.time_seconds - second.time_seconds;
    }

    return new Date(second.created_at).getTime() - new Date(first.created_at).getTime();
  });
}

function renderLeaderboard() {
  ui.leaderboardBody.replaceChildren();

  if (gameState.leaderboard.length === 0) {
    ui.leaderboardEmpty.hidden = false;
    ui.leaderboardTableWrapper.hidden = true;
    return;
  }

  ui.leaderboardEmpty.hidden = true;
  ui.leaderboardTableWrapper.hidden = false;

  const fragment = document.createDocumentFragment();

  gameState.leaderboard.forEach((entry, index) => {
    const row = document.createElement("tr");
    if (index < 3) {
      row.classList.add(`place-${index + 1}`);
    }

    const cells = [
      createRankCell(index + 1),
      createTextCell(sanitizeDisplayText(entry.name)),
      createTextCell(String(entry.score)),
      createTextCell(formatTime(Number(entry.time_seconds))),
      createTextCell(sanitizeDisplayText(entry.title)),
      createTextCell(formatDate(entry.created_at))
    ];

    cells.forEach((cell) => row.append(cell));
    fragment.append(row);
  });

  ui.leaderboardBody.replaceChildren(fragment);
}

function createRankCell(rank) {
  const cell = document.createElement("td");
  const badge = document.createElement("span");
  badge.className = "rank-badge";
  badge.textContent = String(rank);
  cell.append(badge);
  return cell;
}

function createTextCell(text) {
  const cell = document.createElement("td");
  cell.textContent = text;
  return cell;
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Непозната дата";
  }

  return date.toLocaleString("bg-BG", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function requestAdminClear() {
  playSound("click");
  const adminCode = window.prompt("Въведете администраторския код:");

  if (adminCode === null) {
    return;
  }

  const normalizedAdminCode = adminCode.trim();
  if (!normalizedAdminCode) {
    setMessage(ui.leaderboardMessage, "Моля, въведете администраторски код.", "error");
    return;
  }

  const confirmed = window.confirm("Сигурни ли сте, че искате да изчистите класацията?");
  if (!confirmed) {
    return;
  }

  clearLeaderboard(normalizedAdminCode);
}

async function clearLeaderboard(adminCode) {
  setMessage(ui.leaderboardMessage, "Изчистване на класацията...", "helper");

  try {
    const response = await fetch("/api/scores", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ adminCode })
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Класацията не може да бъде изчистена в момента.");
    }

    await loadLeaderboard();
    setMessage(ui.leaderboardMessage, "Класацията беше изчистена успешно.", "success");
  } catch (error) {
    setMessage(
      ui.leaderboardMessage,
      getNetworkAwareMessage(error, "Класацията не може да бъде изчистена в момента."),
      "error"
    );
  }
}

function getNetworkAwareMessage(error, fallbackMessage) {
  if (error instanceof TypeError || /Failed to fetch/i.test(error?.message || "")) {
    return "Няма връзка със сървъра. Проверете дали проектът е стартиран правилно.";
  }

  return error?.message || fallbackMessage;
}

function setMessage(element, text, type = "") {
  element.textContent = text;
  element.className = type ? `message ${type}` : "message";
}

function toggleSound() {
  gameState.soundEnabled = !gameState.soundEnabled;
  savePreferences();
  updateSoundButton();
  if (gameState.soundEnabled) {
    playSound("click");
  }
}

function updateSoundButton() {
  ui.soundToggle.textContent = gameState.soundEnabled ? "Звук: включен" : "Звук: изключен";
}

function loadPreferences() {
  try {
    const storedPreference = window.localStorage.getItem("it-quest-sound-enabled");
    if (storedPreference !== null) {
      gameState.soundEnabled = storedPreference === "true";
    }
  } catch (error) {
    gameState.soundEnabled = true;
  }
}

function savePreferences() {
  try {
    window.localStorage.setItem("it-quest-sound-enabled", String(gameState.soundEnabled));
  } catch (error) {
    return;
  }
}

function ensureAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
}

function playTone({ frequency, duration, type = "sine", delay = 0, endFrequency = frequency, volume = 0.05 }) {
  const context = ensureAudioContext();
  if (!context) {
    return;
  }

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const startTime = context.currentTime + delay;
  const endTime = startTime + duration;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  oscillator.frequency.linearRampToValueAtTime(endFrequency, endTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(startTime);
  oscillator.stop(endTime);
}

function playSound(kind) {
  if (!gameState.soundEnabled) {
    return;
  }

  if (kind === "click") {
    playTone({ frequency: 560, endFrequency: 620, duration: 0.08, type: "triangle", volume: 0.03 });
    return;
  }

  if (kind === "correct") {
    playTone({ frequency: 520, endFrequency: 620, duration: 0.12, type: "triangle", volume: 0.04 });
    playTone({ frequency: 700, endFrequency: 820, duration: 0.16, type: "triangle", delay: 0.09, volume: 0.04 });
    return;
  }

  if (kind === "wrong") {
    playTone({ frequency: 320, endFrequency: 200, duration: 0.18, type: "sawtooth", volume: 0.035 });
    return;
  }

  if (kind === "success") {
    playTone({ frequency: 523, endFrequency: 523, duration: 0.14, type: "triangle", volume: 0.04 });
    playTone({ frequency: 659, endFrequency: 659, duration: 0.14, type: "triangle", delay: 0.12, volume: 0.04 });
    playTone({ frequency: 784, endFrequency: 784, duration: 0.2, type: "triangle", delay: 0.24, volume: 0.04 });
  }
}

function launchConfetti() {
  clearConfetti();

  const colors = ["#2fb8ff", "#5df7c5", "#9c7bff", "#ffc96c", "#ff6ca8"];

  for (let index = 0; index < 24; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.setProperty("--piece-left", `${Math.random() * 100}%`);
    piece.style.setProperty("--piece-color", colors[index % colors.length]);
    piece.style.setProperty("--piece-rotate", `${Math.random() * 360}deg`);
    piece.style.animationDelay = `${Math.random() * 0.45}s`;
    ui.confettiLayer.append(piece);
  }

  window.setTimeout(clearConfetti, 3200);
}

function clearConfetti() {
  ui.confettiLayer.replaceChildren();
}

async function toggleEventMode() {
  playSound("click");
  const fullscreenActive = Boolean(document.fullscreenElement);

  try {
    if (!fullscreenActive && document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
      return;
    }

    if (fullscreenActive && document.exitFullscreen) {
      await document.exitFullscreen();
      return;
    }
  } catch (error) {
    ui.body.classList.toggle("event-mode");
    syncEventModeState();
    return;
  }

  ui.body.classList.toggle("event-mode");
  syncEventModeState();
}

function syncEventModeState() {
  const isActive = Boolean(document.fullscreenElement) || ui.body.classList.contains("event-mode");
  ui.body.classList.toggle("event-mode", isActive);
  ui.eventModeBtn.textContent = isActive ? "Изход от режим за събитие" : "Режим за събитие";
}
