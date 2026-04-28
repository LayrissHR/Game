const missions = [
  {
    type: "access-card",
    room: "Входна зала",
    title: "Създай защитен пропуск",
    objective: "Отиди до входния терминал.",
    story: "Избери най-сигурния дигитален пропуск, за да влезеш в Кибер академията.",
    options: ["123456", "ivan2000", "password", "Luna#48_Kod!"],
    correctAnswer: "Luna#48_Kod!",
    correctExplanation:
      "Достъпът е разрешен! Силната парола използва главни и малки букви, цифри и специални символи.",
    wrongExplanation: "Този пропуск е слаб. Най-сигурният избор е Luna#48_Kod!.",
    note: "Силните пароли защитават профилите и личната информация."
  },
  {
    type: "email-detective",
    room: "Пощенски коридор",
    title: "Открий фалшивото съобщение",
    objective: "Провери пощенския терминал.",
    story: "Едно от съобщенията е фишинг. Открий опасния имейл.",
    emails: [
      { id: "schedule", from: "school@academy.bg", subject: "Програма за деня", body: "Виж графика на учебните дейности." },
      { id: "prize", from: "prize-now@free-phone.win", subject: "Честито! Спечели телефон!", body: "Натисни тук и въведи паролата си." },
      { id: "teacher", from: "teacher@academy.bg", subject: "Домашна работа", body: "Не забравяй задачата по информационни технологии." },
      { id: "library", from: "library@academy.bg", subject: "Нова книга", body: "Добавена е нова книга в училищната библиотека." }
    ],
    correctEmailId: "prize",
    correctExplanation:
      "Точно така! Това е фишинг – опит някой да те подмами да въведеш парола или лични данни.",
    wrongExplanation: "Опасните съобщения често обещават награди и искат парола.",
    note: "Не въвеждай пароли в съмнителни сайтове и не натискай непознати линкове."
  },
  {
    type: "network-order",
    room: "Мрежова стая",
    title: "Свържи училищната мрежа",
    objective: "Свържи мрежата.",
    story: "Натисни устройствата в правилния ред и възстанови връзката.",
    items: ["Компютър", "Рутер", "Сървър", "Интернет"],
    correctOrder: ["Компютър", "Рутер", "Сървър", "Интернет"],
    correctExplanation: "Мрежата е възстановена! Устройствата вече комуникират правилно.",
    wrongExplanation: "Правилният ред е: Компютър → Рутер → Сървър → Интернет.",
    note: "Мрежите свързват устройства и услуги, за да обменят информация."
  },
  {
    type: "switches",
    room: "Логическа лаборатория",
    title: "Активирай защитата",
    objective: "Активирай защитния панел.",
    story: "Защитата работи само когато и двете условия са изпълнени.",
    switches: [
      { id: "power", label: "Има ток" },
      { id: "button", label: "Бутонът е включен" }
    ],
    requiredOn: ["power", "button"],
    correctExplanation:
      "Защитата е активирана! Това е логика И – и двете условия трябва да са изпълнени.",
    wrongExplanation: "При логика И всички условия трябва да са верни едновременно.",
    note: "Логиката И се използва в програмиране, електроника и автоматизация."
  },
  {
    type: "terminal-choice",
    room: "Сървърна стая",
    title: "Активирай защитната стена",
    objective: "Намери сървърната конзола.",
    story: "Избери правилната команда, за да охладиш сървъра и да включиш защитната стена.",
    codeBlock: "Ако температурата е над 30 градуса:\n    включи вентилатора\nИначе:\n    включи отоплението",
    question: "Температурата в сървърната стая е 35 градуса. Коя команда трябва да се изпълни?",
    options: ["включи вентилатора", "включи отоплението", "изключи сървъра", "игнорирай предупреждението"],
    correctAnswer: "включи вентилатора",
    correctExplanation: "Сървърът е защитен! 35 е повече от 30, затова алгоритъмът включва вентилатора.",
    wrongExplanation: "Когато температурата е над 30 градуса, трябва да се включи вентилаторът.",
    note: "Алгоритмите използват условия, за да вземат правилни решения."
  }
];

const allowedTitles = [
  "Начинаещ изследовател",
  "Дигитален помощник",
  "Млад кибергерой",
  "Бъдещ IT специалист"
];

const titleBadgeClasses = {
  "Начинаещ изследовател": "badge-blue",
  "Дигитален помощник": "badge-green",
  "Млад кибергерой": "badge-purple",
  "Бъдещ IT специалист": "badge-gold"
};

const topLabels = ["Главен защитник", "Мрежов герой", "Кибер помощник"];
const SCORE_CONFIG = {
  correctMission: 100,
  wrongMission: 20,
  keyBonus: 10,
  infectedFileCorrect: 50,
  infectedFileWrong: 10,
  powerPanelCorrect: 40,
  powerPanelWrong: 10,
  cablePuzzleCorrect: 50,
  cablePuzzleWrong: 10,
  virusPenalty: 10,
  maxScore: 760
};
const mapWidth = 900;
const mapHeight = 520;
const controls = {
  ArrowUp: "up",
  KeyW: "up",
  ArrowDown: "down",
  KeyS: "down",
  ArrowLeft: "left",
  KeyA: "left",
  ArrowRight: "right",
  KeyD: "right"
};

const rooms = [
  { name: "Входна зала", x: 20, y: 20, w: 210, h: 210 },
  { name: "Пощенски коридор", x: 260, y: 20, w: 250, h: 170 },
  { name: "Коридор с вируси", x: 540, y: 20, w: 150, h: 360 },
  { name: "Мрежова стая", x: 710, y: 20, w: 170, h: 170 },
  { name: "Логическа лаборатория", x: 20, y: 300, w: 330, h: 200 },
  { name: "Сървърна стая", x: 560, y: 300, w: 320, h: 200 }
];

const walls = [
  { x: 0, y: 0, w: 900, h: 12 },
  { x: 0, y: 508, w: 900, h: 12 },
  { x: 0, y: 0, w: 12, h: 520 },
  { x: 888, y: 0, w: 12, h: 520 },
  { x: 235, y: 0, w: 16, h: 92 },
  { x: 235, y: 156, w: 16, h: 54 },
  { x: 515, y: 0, w: 16, h: 84 },
  { x: 515, y: 148, w: 16, h: 42 },
  { x: 695, y: 0, w: 16, h: 88 },
  { x: 695, y: 152, w: 16, h: 48 },
  { x: 0, y: 235, w: 146, h: 16 },
  { x: 210, y: 235, w: 160, h: 16 },
  { x: 390, y: 235, w: 170, h: 16 },
  { x: 710, y: 205, w: 178, h: 16 },
  { x: 355, y: 285, w: 16, h: 223 },
  { x: 545, y: 285, w: 16, h: 67 },
  { x: 545, y: 416, w: 16, h: 92 },
  { x: 12, y: 285, w: 134, h: 16 },
  { x: 210, y: 285, w: 132, h: 16 },
  { x: 560, y: 285, w: 328, h: 16 }
];

const doors = [
  { id: "door-1", label: "Поща", x: 235, y: 92, w: 16, h: 64, requiredMission: 0 },
  { id: "door-2", label: "Коридор", x: 515, y: 84, w: 16, h: 64, requiredMission: 1 },
  { id: "door-3", label: "Мрежа", x: 695, y: 88, w: 16, h: 64, requiredMission: 1 },
  { id: "door-4", label: "Логика", x: 146, y: 235, w: 64, h: 16, requiredMission: 2 },
  { id: "door-5", label: "Сървър", x: 545, y: 352, w: 16, h: 64, requiredMission: 3 }
];

const interactables = [
  { id: "mission-1", missionIndex: 0, label: "Терминал за достъп", className: "terminal", x: 102, y: 88, w: 58, h: 58, prompt: "Натисни E, за да създадеш защитен пропуск" },
  { id: "mission-2", missionIndex: 1, label: "Пощенски терминал", className: "mail-station", x: 355, y: 78, w: 58, h: 58, prompt: "Натисни E, за да провериш съобщенията" },
  { id: "mission-3", missionIndex: 2, label: "Мрежова конзола", className: "network-console", x: 765, y: 76, w: 58, h: 58, prompt: "Натисни E, за да свържеш мрежата" },
  { id: "mission-4", missionIndex: 3, label: "Защитен панел", className: "logic-panel", x: 146, y: 372, w: 62, h: 62, prompt: "Натисни E, за да активираш защитата" },
  { id: "mission-5", missionIndex: 4, label: "Сървърна конзола", className: "server-console", x: 704, y: 374, w: 68, h: 68, prompt: "Натисни E, за да активираш защитната стена" }
];

const collectibles = [
  { id: "key-1", x: 300, y: 138, w: 22, h: 22, collected: false },
  { id: "key-2", x: 615, y: 236, w: 22, h: 22, collected: false },
  { id: "key-3", x: 452, y: 372, w: 22, h: 22, collected: false },
  { id: "key-4", x: 808, y: 152, w: 22, h: 22, collected: false },
  { id: "key-5", x: 814, y: 454, w: 22, h: 22, collected: false }
];

const hazards = [
  { id: "virus-1", x: 585, y: 70, w: 26, h: 26, dx: 1.1, dy: 0, minX: 555, maxX: 660 },
  { id: "virus-2", x: 638, y: 170, w: 26, h: 26, dx: 0, dy: 1, minY: 120, maxY: 285 },
  { id: "virus-3", x: 426, y: 236, w: 26, h: 26, dx: 1.05, dy: 0, minX: 390, maxX: 528 }
];

const securityDoors = [
  { id: "security-door", label: "Сигурност", x: 574, y: 310, w: 78, h: 34, correct: true },
  { id: "spam-door", label: "Спам", x: 574, y: 354, w: 78, h: 34, correct: false },
  { id: "games-door", label: "Игри", x: 574, y: 398, w: 78, h: 34, correct: false }
];

const bonusInteractables = [
  {
    id: "bonus-files",
    type: "infected-file",
    label: "Бонус: файлове",
    className: "bonus-station file-station",
    x: 430,
    y: 104,
    w: 58,
    h: 58,
    prompt: "Натисни E за бонус: почисти заразените файлове"
  },
  {
    id: "bonus-power",
    type: "power-panel",
    label: "Бонус: енергия",
    className: "bonus-station power-station",
    x: 264,
    y: 384,
    w: 58,
    h: 58,
    prompt: "Натисни E за бонус: възстанови енергията"
  },
  {
    id: "bonus-cables",
    type: "cable-puzzle",
    label: "Бонус: кабели",
    className: "bonus-station cable-station",
    x: 792,
    y: 322,
    w: 58,
    h: 58,
    prompt: "Натисни E за бонус: мини пъзел с кабели"
  }
];

const gameState = {
  playerName: "",
  screen: "home",
  currentMissionIndex: 0,
  score: 0,
  startTime: null,
  endTime: null,
  answers: [],
  selectedOrder: [],
  selectedCable: "",
  cablePairs: [],
  switchStates: {},
  timerIntervalId: null,
  hasSavedResult: false,
  soundEnabled: true,
  leaderboard: [],
  finalResult: null
};

const inputState = {
  up: false,
  down: false,
  left: false,
  right: false
};

const mapState = {
  player: { x: 76, y: 146, width: 32, height: 32, speed: 3 },
  currentZone: "Входна зала",
  activeMissionIndex: 0,
  completedMissions: [],
  collectedKeys: 0,
  completedBonuses: [],
  virusEscapeCompleted: false,
  mobileControlsForced: false,
  doorBonusDone: false,
  doorMessageCooldown: false,
  virusCooldown: false,
  isMissionOpen: false,
  isGameOver: false,
  openModalKind: "",
  nearbyInteractable: null,
  interactionCooldown: false,
  loopStarted: false
};

const ui = {};
let audioContext = null;

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("popstate", handleRouteChange);
document.addEventListener("fullscreenchange", syncEventModeState);
window.addEventListener("resize", () => {
  if (ui.body) syncMobileControlsVisibility();
});

function init() {
  cacheElements();
  bindEvents();
  loadPreferences();
  updateSoundButton();
  syncEventModeState();
  buildMap();
  renderRoute();
  showScreen(window.location.pathname === "/leaderboard" ? "leaderboard" : "home", false);
  startGameLoop();
}

function cacheElements() {
  ui.body = document.body;
  ui.screens = {
    home: document.getElementById("screen-home"),
    instructions: document.getElementById("screen-instructions"),
    game: document.getElementById("screen-game"),
    result: document.getElementById("screen-result"),
    leaderboard: document.getElementById("screen-leaderboard")
  };
  ui.playerNameInput = document.getElementById("player-name");
  ui.homeError = document.getElementById("home-error");
  ui.soundToggle = document.getElementById("sound-toggle");
  ui.mobileControlsToggle = document.getElementById("mobile-controls-toggle");
  ui.eventModeBtn = document.getElementById("event-mode-btn");
  ui.startBtn = document.getElementById("start-btn");
  ui.beginMapBtn = document.getElementById("begin-map-btn");
  ui.homeLeaderboardBtn = document.getElementById("home-leaderboard-btn");
  ui.playerStatus = document.getElementById("player-status");
  ui.roomStatus = document.getElementById("room-status");
  ui.missionCounter = document.getElementById("mission-counter");
  ui.scoreCounter = document.getElementById("score-counter");
  ui.timerCounter = document.getElementById("timer-counter");
  ui.keyCounter = document.getElementById("key-counter");
  ui.bonusCounter = document.getElementById("bonus-counter");
  ui.objectiveText = document.getElementById("objective-text");
  ui.route = document.getElementById("mission-route");
  ui.mapMessage = document.getElementById("map-message");
  ui.academyMap = document.getElementById("academy-map");
  ui.mapLayers = document.getElementById("map-layers");
  ui.playerAvatar = document.getElementById("player-avatar");
  ui.playerLabel = document.getElementById("player-label");
  ui.interactionPrompt = document.getElementById("interaction-prompt");
  ui.objectiveMarker = document.getElementById("objective-marker");
  ui.toastArea = document.getElementById("toast-area");
  ui.missionModal = document.getElementById("mission-modal");
  ui.missionKicker = document.getElementById("mission-kicker");
  ui.missionTitle = document.getElementById("mission-title");
  ui.missionStory = document.getElementById("mission-story");
  ui.interactionArea = document.getElementById("interaction-area");
  ui.feedbackPanel = document.getElementById("feedback-panel");
  ui.feedbackBadge = document.getElementById("feedback-badge");
  ui.feedbackText = document.getElementById("feedback-text");
  ui.feedbackNote = document.getElementById("feedback-note");
  ui.continueMapBtn = document.getElementById("continue-map-btn");
  ui.resultSummary = document.getElementById("result-summary");
  ui.finalBadge = document.getElementById("final-badge");
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
  ui.mobileControls = document.getElementById("mobile-controls");
  ui.mobileActionBtn = document.getElementById("mobile-action-btn");
}

function bindEvents() {
  ui.startBtn.addEventListener("click", showInstructions);
  ui.beginMapBtn.addEventListener("click", startGame);
  ui.homeLeaderboardBtn.addEventListener("click", () => showScreen("leaderboard"));
  ui.continueMapBtn.addEventListener("click", closeMissionModal);
  ui.resultNewGameBtn.addEventListener("click", prepareNewGame);
  ui.resultLeaderboardBtn.addEventListener("click", () => showScreen("leaderboard"));
  ui.resultHomeBtn.addEventListener("click", goHome);
  ui.leaderboardNewGameBtn.addEventListener("click", prepareNewGame);
  ui.leaderboardHomeBtn.addEventListener("click", goHome);
  ui.refreshLeaderboardBtn.addEventListener("click", loadLeaderboard);
  ui.adminBtn.addEventListener("click", requestAdminClear);
  ui.soundToggle.addEventListener("click", toggleSound);
  ui.mobileControlsToggle.addEventListener("click", toggleMobileControls);
  ui.eventModeBtn.addEventListener("click", toggleEventMode);
  ui.playerNameInput.addEventListener("input", handleNameInput);
  ui.playerNameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      showInstructions();
    }
  });
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
  window.addEventListener("blur", clearMovementInput);
  bindMobileControls();
}

function bindMobileControls() {
  Array.from(ui.mobileControls.querySelectorAll("[data-direction]")).forEach((button) => {
    const direction = button.dataset.direction;
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      if (canProcessGameControls()) {
        inputState[direction] = true;
      }
      button.setPointerCapture?.(event.pointerId);
    });
    const stop = (event) => {
      event.preventDefault();
      inputState[direction] = false;
    };
    button.addEventListener("pointerup", stop);
    button.addEventListener("pointercancel", stop);
    button.addEventListener("pointerleave", stop);
  });

  ui.mobileActionBtn.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    if (canProcessGameControls()) {
      tryInteraction();
    }
  });
}

function toggleMobileControls() {
  mapState.mobileControlsForced = !mapState.mobileControlsForced;
  syncMobileControlsVisibility();
  playSound("click");
}

function syncMobileControlsVisibility() {
  if (!ui.mobileControls || !ui.mobileControlsToggle) return;
  const shouldShow = gameState.screen === "map" && (mapState.mobileControlsForced || window.matchMedia("(pointer: coarse)").matches);
  ui.body.classList.toggle("show-mobile-controls", shouldShow);
  ui.mobileControlsToggle.textContent = shouldShow ? "Скрий мобилни бутони" : "Покажи мобилни бутони";
}

function handleRouteChange() {
  showScreen(window.location.pathname === "/leaderboard" ? "leaderboard" : "home", false);
}

function showScreen(screenName, pushState = true) {
  clearMovementInput();
  gameState.screen = screenName === "game" ? "map" : screenName;
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

  syncMobileControlsVisibility();
}

function showInstructions() {
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
  gameState.playerName = playerName;
  ui.playerNameInput.value = playerName;
  setMessage(ui.homeError, "");
  playSound("click");
  showScreen("instructions");
}

function startGame() {
  const playerName = gameState.playerName || sanitizeNameInput(ui.playerNameInput.value);
  resetGameState();
  gameState.playerName = playerName;
  gameState.startTime = Date.now();
  ui.playerLabel.textContent = playerName;
  setMessage(ui.saveStatus, "");
  clearConfetti();
  startTimer();
  showScreen("game");
  updateHud();
  renderRoute();
  renderMapState();
  showToast("Мисията започва! Намери първия терминал.", "helper");
  playSound("unlock");
}

function resetGameState() {
  stopTimer();
  gameState.currentMissionIndex = 0;
  gameState.score = 0;
  gameState.startTime = null;
  gameState.endTime = null;
  gameState.answers = [];
  gameState.selectedOrder = [];
  gameState.selectedCable = "";
  gameState.cablePairs = [];
  gameState.switchStates = {};
  gameState.hasSavedResult = false;
  gameState.finalResult = null;
  mapState.player.x = 76;
  mapState.player.y = 146;
  mapState.currentZone = "Входна зала";
  mapState.activeMissionIndex = 0;
  mapState.completedMissions = [];
  mapState.collectedKeys = 0;
  mapState.completedBonuses = [];
  mapState.virusEscapeCompleted = false;
  mapState.doorBonusDone = false;
  mapState.doorMessageCooldown = false;
  mapState.virusCooldown = false;
  mapState.isMissionOpen = false;
  mapState.isGameOver = false;
  mapState.openModalKind = "";
  mapState.nearbyInteractable = null;
  mapState.interactionCooldown = false;
  collectibles.forEach((item) => {
    item.collected = false;
  });
  clearMovementInput();
  hazards[0].x = 585;
  hazards[1].y = 170;
  hazards[2].x = 426;
  ui.resultSummary.replaceChildren();
  ui.interactionArea.replaceChildren();
  ui.feedbackPanel.hidden = true;
  ui.continueMapBtn.hidden = true;
  ui.toastArea.replaceChildren();
  buildMap();
}

function prepareNewGame() {
  goHome();
}

function goHome() {
  playSound("click");
  resetGameState();
  gameState.playerName = "";
  ui.playerNameInput.value = "";
  ui.missionModal.hidden = true;
  showScreen("home");
}

function handleNameInput() {
  const sanitized = ui.playerNameInput.value.replace(/[\u0000-\u001F\u007F]/g, "");
  if (sanitized !== ui.playerNameInput.value) {
    ui.playerNameInput.value = sanitized;
  }
  setMessage(ui.homeError, "");
}

function sanitizeDisplayText(value) {
  return String(value ?? "").replace(/[\u0000-\u001F\u007F<>]/g, "").replace(/\s+/g, " ").trim();
}

function sanitizeNameInput(value) {
  return sanitizeDisplayText(value);
}

function isTypingInInput() {
  const element = document.activeElement;
  if (!element) return false;
  const tag = element.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select" || element.isContentEditable;
}

function canProcessGameControls() {
  return gameState.screen === "map" && !mapState.isMissionOpen && !mapState.isGameOver && !isTypingInInput();
}

function handleKeyDown(event) {
  if (isTypingInInput() || !canProcessGameControls()) {
    return;
  }

  if (controls[event.code]) {
    inputState[controls[event.code]] = true;
    event.preventDefault();
  }

  if (event.code === "KeyE") {
    event.preventDefault();
    tryInteraction();
  }
}

function handleKeyUp(event) {
  if (isTypingInInput() || gameState.screen !== "map") {
    return;
  }

  if (controls[event.code]) {
    inputState[controls[event.code]] = false;
    event.preventDefault();
  }
}

function clearMovementInput() {
  inputState.up = false;
  inputState.down = false;
  inputState.left = false;
  inputState.right = false;
}

function startGameLoop() {
  if (mapState.loopStarted) {
    return;
  }
  mapState.loopStarted = true;
  requestAnimationFrame(gameLoop);
}

function gameLoop() {
  if (!mapState.isMissionOpen && !mapState.isGameOver && ui.screens.game.classList.contains("active")) {
    updatePlayerMovement();
    updateHazards();
    checkCollectibles();
    checkSecurityDoors();
    checkHazards();
    checkCurrentZone();
    checkNearbyInteractable();
    renderMapState();
  }
  requestAnimationFrame(gameLoop);
}

function buildMap() {
  const fragment = document.createDocumentFragment();

  rooms.forEach((room) => {
    const element = createMapElement("room-label", room);
    element.textContent = room.name;
    fragment.append(element);
  });

  walls.forEach((wall) => fragment.append(createMapElement("wall", wall)));
  doors.forEach((door) => {
    const element = createMapElement("door locked", door);
    element.dataset.id = door.id;
    element.textContent = door.label;
    fragment.append(element);
  });

  addGlowPath(fragment, { x: 86, y: 156, w: 760, h: 10 });
  addGlowPath(fragment, { x: 612, y: 70, w: 10, h: 382 });
  addGlowPath(fragment, { x: 160, y: 430, w: 600, h: 10 });

  interactables.forEach((item) => {
    const element = createMapElement(`interactable ${item.className}`, item);
    element.dataset.id = item.id;
    element.innerHTML = `<span></span><strong>${item.label}</strong>`;
    fragment.append(element);
  });

  bonusInteractables.forEach((item) => {
    const element = createMapElement(`interactable bonus-interactable ${item.className}`, item);
    element.dataset.id = item.id;
    element.innerHTML = `<span>★</span><strong>${item.label}</strong>`;
    fragment.append(element);
  });

  collectibles.forEach((item) => {
    const element = createMapElement("collectible-key", item);
    element.dataset.id = item.id;
    element.textContent = "◆";
    fragment.append(element);
  });

  hazards.forEach((hazard) => {
    const element = createMapElement("virus", hazard);
    element.dataset.id = hazard.id;
    element.textContent = "!";
    fragment.append(element);
  });

  securityDoors.forEach((door) => {
    const element = createMapElement("choice-door", door);
    element.dataset.id = door.id;
    element.textContent = door.label;
    fragment.append(element);
  });

  ui.mapLayers.replaceChildren(fragment);
  updateDoorVisuals();
}

function addGlowPath(fragment, rect) {
  fragment.append(createMapElement("glow-path", rect));
}

function createMapElement(className, rect) {
  const element = document.createElement("div");
  element.className = className;
  element.style.left = `${rect.x}px`;
  element.style.top = `${rect.y}px`;
  element.style.width = `${rect.w}px`;
  element.style.height = `${rect.h}px`;
  return element;
}

function updatePlayerMovement() {
  const player = mapState.player;
  let dx = 0;
  let dy = 0;

  if (inputState.left) dx -= 1;
  if (inputState.right) dx += 1;
  if (inputState.up) dy -= 1;
  if (inputState.down) dy += 1;

  if (dx === 0 && dy === 0) {
    return;
  }

  if (dx !== 0 && dy !== 0) {
    dx *= 0.707;
    dy *= 0.707;
  }

  movePlayer(dx * player.speed, 0);
  movePlayer(0, dy * player.speed);
}

function movePlayer(dx, dy) {
  const player = mapState.player;
  const next = {
    x: clamp(player.x + dx, 0, mapWidth - player.width),
    y: clamp(player.y + dy, 0, mapHeight - player.height),
    w: player.width,
    h: player.height
  };

  if (collidesWithBlocked(next)) {
    return;
  }

  player.x = next.x;
  player.y = next.y;
}

function collidesWithBlocked(rect) {
  const blockedWalls = walls.some((wall) => rectsOverlap(rect, wall));
  if (blockedWalls) {
    return true;
  }

  const blockedDoor = doors.find((door) => !isDoorUnlocked(door) && rectsOverlap(rect, door));
  if (blockedDoor) {
    setMapMessage("Тази зона все още е заключена.");
    return true;
  }

  return false;
}

function updateHazards() {
  hazards.forEach((hazard) => {
    hazard.x += hazard.dx || 0;
    hazard.y += hazard.dy || 0;

    if (hazard.dx && (hazard.x <= hazard.minX || hazard.x >= hazard.maxX)) {
      hazard.dx *= -1;
      hazard.x = clamp(hazard.x, hazard.minX, hazard.maxX);
    }

    if (hazard.dy && (hazard.y <= hazard.minY || hazard.y >= hazard.maxY)) {
      hazard.dy *= -1;
      hazard.y = clamp(hazard.y, hazard.minY, hazard.maxY);
    }
  });

  bonusInteractables.forEach((item) => {
    const element = ui.mapLayers?.querySelector(`[data-id="${item.id}"]`);
    if (!element) return;
    const completed = mapState.completedBonuses.includes(item.id);
    element.classList.toggle("current-objective", !completed);
    element.classList.toggle("completed-objective", completed);
  });
}

function checkCollectibles() {
  const playerRect = getPlayerRect();
  collectibles.forEach((item) => {
    if (!item.collected && rectsOverlap(playerRect, item)) {
      item.collected = true;
      mapState.collectedKeys += 1;
      gameState.score += SCORE_CONFIG.keyBonus;
      showToast("Събран защитен ключ! +10 точки", "success");
      playSound("correct");
      if (mapState.collectedKeys === collectibles.length) {
        completeBonus("keys");
      }
      updateHud();
    }
  });
}

function checkSecurityDoors() {
  const playerRect = getPlayerRect();
  const touchedDoor = securityDoors.find((door) => rectsOverlap(playerRect, door));
  if (!touchedDoor || mapState.doorMessageCooldown) {
    return;
  }

  mapState.doorMessageCooldown = true;
  window.setTimeout(() => {
    mapState.doorMessageCooldown = false;
  }, 1200);

  if (touchedDoor.correct && !mapState.doorBonusDone) {
    mapState.doorBonusDone = true;
    showToast("Избра правилната врата: Сигурност!", "success");
    playSound("correct");
    updateHud();
    renderMapState();
    return;
  }

  if (!touchedDoor.correct) {
    showToast("Тази врата не води към защитата. Опитай със „Сигурност“.", "error");
    playSound("wrong");
  }
}

function checkHazards() {
  if (mapState.virusCooldown) {
    return;
  }

  const playerRect = getPlayerRect();
  const touched = hazards.some((hazard) => rectsOverlap(playerRect, hazard));
  if (!touched) {
    return;
  }

  gameState.score = Math.max(0, gameState.score - SCORE_CONFIG.virusPenalty);
  mapState.virusCooldown = true;
  ui.playerAvatar.classList.add("hit");
  showToast("Докосна вирус! -10 точки", "error");
  playSound("wrong");
  updateHud();
  window.setTimeout(() => {
    mapState.virusCooldown = false;
    ui.playerAvatar.classList.remove("hit");
  }, 1500);
}

function checkCurrentZone() {
  const center = {
    x: mapState.player.x + mapState.player.width / 2,
    y: mapState.player.y + mapState.player.height / 2
  };
  const zone = rooms.find((room) => center.x >= room.x && center.x <= room.x + room.w && center.y >= room.y && center.y <= room.y + room.h);
  if (zone && zone.name !== mapState.currentZone) {
    mapState.currentZone = zone.name;
    if (zone.name === "Мрежова стая") {
      completeBonus("viruses");
    }
    updateHud();
  }
}

function checkNearbyInteractable() {
  const playerRect = inflateRect(getPlayerRect(), 20);
  mapState.nearbyInteractable =
    interactables.find((item) => rectsOverlap(playerRect, item)) ||
    bonusInteractables.find((item) => rectsOverlap(playerRect, item)) ||
    null;

  if (!mapState.nearbyInteractable) {
    ui.interactionPrompt.hidden = true;
    return;
  }

  const item = mapState.nearbyInteractable;
  ui.interactionPrompt.hidden = false;
  const isBonus = Boolean(item.type);
  const bonusDone = isBonus && mapState.completedBonuses.includes(item.id);
  ui.interactionPrompt.textContent = isBonus
    ? bonusDone ? "Завършено" : "Натисни E"
    : item.missionIndex === mapState.activeMissionIndex ? "Натисни E" : "Заключено";
  ui.interactionPrompt.style.left = `${item.x + item.w / 2}px`;
  ui.interactionPrompt.style.top = `${item.y - 12}px`;
  if (isBonus) {
    setMapMessage(bonusDone ? "Този бонус вече е изпълнен." : item.prompt);
  } else {
    setMapMessage(item.missionIndex === mapState.activeMissionIndex ? item.prompt : "Тази зона все още е заключена.");
  }
}

function tryInteraction() {
  if (mapState.isMissionOpen || mapState.isGameOver || mapState.interactionCooldown || !ui.screens.game.classList.contains("active")) {
    return;
  }

  const item = mapState.nearbyInteractable;
  if (!item) {
    return;
  }

  mapState.interactionCooldown = true;
  window.setTimeout(() => {
    mapState.interactionCooldown = false;
  }, 350);

  if (item.type) {
    if (mapState.completedBonuses.includes(item.id)) {
      showToast("Този бонус вече е изпълнен.", "helper");
      return;
    }
    openBonusModal(item);
    return;
  }

  if (item.missionIndex !== mapState.activeMissionIndex) {
    showToast("Тази зона все още е заключена.", "error");
    return;
  }

  openMissionModal(item.missionIndex);
}

function openMissionModal(index) {
  const mission = missions[index];
  clearMovementInput();
  mapState.isMissionOpen = true;
  mapState.openModalKind = "mission";
  gameState.selectedOrder = [];
  gameState.switchStates = {};
  ui.missionKicker.textContent = `Мисия ${index + 1} от ${missions.length}`;
  ui.missionTitle.textContent = mission.title;
  ui.missionStory.textContent = mission.story;
  ui.feedbackPanel.hidden = true;
  ui.feedbackPanel.className = "feedback-panel";
  ui.continueMapBtn.hidden = true;
  renderInteraction(mission);
  ui.missionModal.hidden = false;
  playSound("click");
}

function openBonusModal(item) {
  clearMovementInput();
  mapState.isMissionOpen = true;
  mapState.openModalKind = "bonus";
  gameState.switchStates = {};
  gameState.selectedCable = "";
  gameState.cablePairs = [];
  ui.missionKicker.textContent = "Бонус";
  ui.feedbackPanel.hidden = true;
  ui.feedbackPanel.className = "feedback-panel";
  ui.continueMapBtn.hidden = true;

  if (item.type === "infected-file") {
    renderInfectedFileBonus(item);
  }
  if (item.type === "power-panel") {
    renderPowerPanelBonus(item);
  }
  if (item.type === "cable-puzzle") {
    renderCablePuzzleBonus(item);
  }

  ui.missionModal.hidden = false;
  playSound("click");
}

function closeMissionModal() {
  ui.missionModal.hidden = true;
  mapState.isMissionOpen = false;
  const closedKind = mapState.openModalKind;
  mapState.openModalKind = "";
  clearMovementInput();
  updateHud();
  renderRoute();

  if (mapState.completedMissions.length >= missions.length) {
    finishGame();
    return;
  }

  if (closedKind === "mission" && mapState.completedMissions.length > 0) {
    showToast("Достъпът е разрешен. Следващата зона е отключена.", "success");
    playSound("unlock");
  }
}

function renderInteraction(mission) {
  if (mission.type === "access-card") renderAccessCardMission(mission);
  if (mission.type === "email-detective") renderEmailDetectiveMission(mission);
  if (mission.type === "network-order") renderNetworkOrderMission(mission);
  if (mission.type === "switches") renderSwitchesMission(mission);
  if (mission.type === "terminal-choice") renderTerminalChoiceMission(mission);
}

function renderAccessCardMission(mission) {
  const grid = document.createElement("div");
  grid.className = "access-card-grid";
  mission.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "access-card";
    button.dataset.value = option;
    button.innerHTML = `<span class="access-card__chip"></span><strong>${option}</strong><small>Дигитален пропуск</small>`;
    button.addEventListener("click", () => {
      handleMissionResult(option === mission.correctAnswer, { selected: option });
      lockChoiceButtons(".access-card", option, mission.correctAnswer);
    });
    grid.append(button);
  });
  ui.interactionArea.replaceChildren(grid);
}

function renderEmailDetectiveMission(mission) {
  const grid = document.createElement("div");
  grid.className = "email-grid";
  mission.emails.forEach((email) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "email-card";
    button.dataset.value = email.id;
    button.innerHTML = `<span class="email-card__from">От: ${email.from}</span><strong>${email.subject}</strong><span>${email.body}</span>`;
    button.addEventListener("click", () => {
      handleMissionResult(email.id === mission.correctEmailId, { selected: email.id });
      lockChoiceButtons(".email-card", email.id, mission.correctEmailId);
    });
    grid.append(button);
  });
  ui.interactionArea.replaceChildren(grid);
}

function renderNetworkOrderMission(mission) {
  const wrapper = document.createElement("div");
  wrapper.className = "network-builder";
  const slots = document.createElement("div");
  slots.className = "network-slots";
  for (let index = 0; index < mission.correctOrder.length; index += 1) {
    const slot = document.createElement("div");
    slot.className = `network-slot ${gameState.selectedOrder[index] ? "filled" : ""}`;
    slot.innerHTML = `<span>${index + 1}</span><strong>${gameState.selectedOrder[index] || "Избери устройство"}</strong>`;
    slots.append(slot);
  }

  const devices = document.createElement("div");
  devices.className = "network-devices";
  mission.items.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "network-device";
    button.disabled = gameState.selectedOrder.includes(item);
    button.innerHTML = `<span class="device-icon">${getDeviceIcon(item)}</span><strong>${item}</strong>`;
    button.addEventListener("click", () => {
      if (gameState.selectedOrder.length >= mission.correctOrder.length) return;
      gameState.selectedOrder.push(item);
      renderNetworkOrderMission(mission);
      playSound("click");
    });
    devices.append(button);
  });

  const actions = document.createElement("div");
  actions.className = "order-actions";
  const confirmButton = document.createElement("button");
  confirmButton.type = "button";
  confirmButton.className = "button button-primary";
  confirmButton.textContent = "Потвърди връзката";
  confirmButton.disabled = gameState.selectedOrder.length !== mission.correctOrder.length;
  confirmButton.addEventListener("click", () => {
    const isCorrect = mission.correctOrder.every((item, index) => gameState.selectedOrder[index] === item);
    handleMissionResult(isCorrect, { selectedOrder: [...gameState.selectedOrder] });
    Array.from(ui.interactionArea.querySelectorAll("button")).forEach((button) => {
      button.disabled = true;
      button.classList.add("is-locked");
    });
    markNetworkSlots(mission);
  });

  const clearButton = document.createElement("button");
  clearButton.type = "button";
  clearButton.className = "button button-secondary";
  clearButton.textContent = "Изчисти връзката";
  clearButton.addEventListener("click", () => {
    gameState.selectedOrder = [];
    renderNetworkOrderMission(mission);
    playSound("click");
  });

  actions.append(confirmButton, clearButton);
  wrapper.append(slots, devices, actions);
  ui.interactionArea.replaceChildren(wrapper);
}

function markNetworkSlots(mission) {
  Array.from(ui.interactionArea.querySelectorAll(".network-slot")).forEach((slot, index) => {
    slot.classList.add(gameState.selectedOrder[index] === mission.correctOrder[index] ? "correct" : "incorrect");
  });
}

function renderSwitchesMission(mission) {
  const panel = document.createElement("div");
  panel.className = "switch-panel";
  const switches = document.createElement("div");
  switches.className = "switch-list";

  mission.switches.forEach((item) => {
    gameState.switchStates[item.id] = Boolean(gameState.switchStates[item.id]);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `switch-control ${gameState.switchStates[item.id] ? "on" : ""}`;
    button.innerHTML = `<span class="switch-track"><span class="switch-thumb"></span></span><strong>${item.label}</strong>`;
    button.addEventListener("click", () => {
      if (gameState.answers[gameState.currentMissionIndex]) return;
      gameState.switchStates[item.id] = !gameState.switchStates[item.id];
      renderSwitchesMission(mission);
      playSound("click");
    });
    switches.append(button);
  });

  const confirmButton = document.createElement("button");
  confirmButton.type = "button";
  confirmButton.className = "button button-primary";
  confirmButton.textContent = "Активирай защитата";
  confirmButton.addEventListener("click", () => {
    const isCorrect = mission.requiredOn.every((id) => gameState.switchStates[id]);
    handleMissionResult(isCorrect, { switches: { ...gameState.switchStates } });
    Array.from(ui.interactionArea.querySelectorAll("button")).forEach((button) => {
      button.disabled = true;
      button.classList.add("is-locked");
    });
  });

  panel.append(switches, confirmButton);
  ui.interactionArea.replaceChildren(panel);
}

function renderTerminalChoiceMission(mission) {
  const panel = document.createElement("div");
  panel.className = "terminal-panel";
  const code = document.createElement("pre");
  code.textContent = mission.codeBlock;
  const question = document.createElement("p");
  question.textContent = mission.question;
  const buttons = document.createElement("div");
  buttons.className = "terminal-buttons";

  mission.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "terminal-command";
    button.dataset.value = option;
    button.textContent = option;
    button.addEventListener("click", () => {
      handleMissionResult(option === mission.correctAnswer, { selected: option });
      lockChoiceButtons(".terminal-command", option, mission.correctAnswer);
    });
    buttons.append(button);
  });

  panel.append(code, question, buttons);
  ui.interactionArea.replaceChildren(panel);
}

function renderInfectedFileBonus(item) {
  ui.missionTitle.textContent = "Бонус ниво: Почисти заразените файлове";
  ui.missionStory.textContent = "Кой файл изглежда най-опасен?";
  const files = ["homework.docx", "photo.png", "free_game_hack.exe", "presentation.pptx"];
  const grid = document.createElement("div");
  grid.className = "file-grid";
  files.forEach((file) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "file-card";
    button.dataset.value = file;
    button.innerHTML = `<span class="file-icon">▤</span><strong>${file}</strong>`;
    button.addEventListener("click", () => {
      const isCorrect = file === "free_game_hack.exe";
      handleBonusResult(item.id, isCorrect, isCorrect ? SCORE_CONFIG.infectedFileCorrect : SCORE_CONFIG.infectedFileWrong, isCorrect
        ? "Точно така! Файлове с подозрителни имена и .exe разширение могат да бъдат опасни."
        : "Помисли пак. Файлът free_game_hack.exe изглежда най-съмнителен.");
      lockChoiceButtons(".file-card", file, "free_game_hack.exe");
    });
    grid.append(button);
  });
  ui.interactionArea.replaceChildren(grid);
}

function renderPowerPanelBonus(item) {
  ui.missionTitle.textContent = "Бонус ниво: Възстанови енергията";
  ui.missionStory.textContent = "За да включиш резервното захранване, активирай правилната комбинация.";
  const switches = [
    { id: "power", label: "Захранване" },
    { id: "cooling", label: "Охлаждане" },
    { id: "alarm", label: "Аларма" }
  ];
  const panel = document.createElement("div");
  panel.className = "switch-panel";
  const list = document.createElement("div");
  list.className = "switch-list";
  switches.forEach((switchItem) => {
    gameState.switchStates[switchItem.id] = Boolean(gameState.switchStates[switchItem.id]);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `switch-control ${gameState.switchStates[switchItem.id] ? "on" : ""}`;
    button.innerHTML = `<span class="switch-track"><span class="switch-thumb"></span></span><strong>${switchItem.label}</strong>`;
    button.addEventListener("click", () => {
      gameState.switchStates[switchItem.id] = !gameState.switchStates[switchItem.id];
      renderPowerPanelBonus(item);
      playSound("click");
    });
    list.append(button);
  });
  const confirmButton = document.createElement("button");
  confirmButton.type = "button";
  confirmButton.className = "button button-primary";
  confirmButton.textContent = "Включи захранването";
  confirmButton.addEventListener("click", () => {
    const isCorrect = gameState.switchStates.power && gameState.switchStates.cooling && !gameState.switchStates.alarm;
    handleBonusResult(item.id, isCorrect, isCorrect ? SCORE_CONFIG.powerPanelCorrect : SCORE_CONFIG.powerPanelWrong, isCorrect
      ? "Резервното захранване е включено! +40 точки"
      : "Комбинацията не е правилна. Провери кои системи са нужни за стабилна работа.");
  });
  panel.append(list, confirmButton);
  ui.interactionArea.replaceChildren(panel);
}

function renderCablePuzzleBonus(item) {
  ui.missionTitle.textContent = "Бонус ниво: Мини пъзел с кабели";
  ui.missionStory.textContent = "Свържи всеки кабел към порт със същия цвят.";
  const colors = [
    { id: "blue", cable: "Син кабел", port: "Син порт" },
    { id: "green", cable: "Зелен кабел", port: "Зелен порт" },
    { id: "red", cable: "Червен кабел", port: "Червен порт" }
  ];
  const panel = document.createElement("div");
  panel.className = "cable-panel";
  const cableList = document.createElement("div");
  cableList.className = "cable-list";
  const portList = document.createElement("div");
  portList.className = "cable-list";

  colors.forEach((itemColor) => {
    const cableButton = document.createElement("button");
    cableButton.type = "button";
    cableButton.className = `cable-card cable-${itemColor.id}`;
    cableButton.classList.toggle("selected", gameState.selectedCable === itemColor.id);
    cableButton.textContent = itemColor.cable;
    cableButton.addEventListener("click", () => {
      gameState.selectedCable = itemColor.id;
      renderCablePuzzleBonus(item);
      playSound("click");
    });
    cableList.append(cableButton);

    const portButton = document.createElement("button");
    portButton.type = "button";
    portButton.className = `cable-card cable-${itemColor.id}`;
    portButton.textContent = itemColor.port;
    portButton.addEventListener("click", () => {
      if (!gameState.selectedCable) return;
      gameState.cablePairs.push(`${gameState.selectedCable}:${itemColor.id}`);
      gameState.selectedCable = "";
      renderCablePuzzleBonus(item);
      playSound("click");
    });
    portList.append(portButton);
  });

  const pairs = gameState.cablePairs;
  const result = document.createElement("div");
  result.className = "cable-result";
  result.textContent = pairs.length ? `Свързани двойки: ${pairs.length}/3` : "Избери кабел, после порт.";
  const confirmButton = document.createElement("button");
  confirmButton.type = "button";
  confirmButton.className = "button button-primary";
  confirmButton.textContent = "Потвърди кабелите";
  confirmButton.disabled = pairs.length < 3;
  confirmButton.addEventListener("click", () => {
    const correctPairs = new Set(["blue:blue", "green:green", "red:red"]);
    const uniquePairs = new Set(pairs);
    const isCorrect = pairs.length === 3 && uniquePairs.size === 3 && pairs.every((pair) => correctPairs.has(pair));
    handleBonusResult(item.id, isCorrect, isCorrect ? SCORE_CONFIG.cablePuzzleCorrect : SCORE_CONFIG.cablePuzzleWrong, isCorrect
      ? "Кабелите са свързани правилно! Мрежата е стабилна."
      : "Част от кабелите не са в правилните портове. Опитай да съвпаднат по цвят.");
  });
  panel.append(cableList, portList, result, confirmButton);
  ui.interactionArea.replaceChildren(panel);
}

function handleBonusResult(id, isCorrect, earnedPoints, explanation) {
  if (mapState.completedBonuses.includes(id)) {
    showToast("Този бонус вече е изпълнен.", "helper");
    return;
  }
  gameState.score += earnedPoints;
  completeBonus(id);
  showFeedback(isCorrect, earnedPoints, explanation, isCorrect ? "Бонусът е завършен." : "Бонусът е отчетен и можеш да продължиш.");
  ui.continueMapBtn.hidden = false;
  Array.from(ui.interactionArea.querySelectorAll("button")).forEach((button) => {
    button.disabled = true;
    button.classList.add("is-locked");
  });
  updateHud();
  renderMapState();
  playSound(isCorrect ? "correct" : "wrong");
}

function completeBonus(id) {
  if (!mapState.completedBonuses.includes(id)) {
    mapState.completedBonuses.push(id);
  }
}

function handleMissionResult(isCorrect, selectedData) {
  if (gameState.answers[gameState.currentMissionIndex]) {
    return;
  }

  const mission = missions[gameState.currentMissionIndex];
  const earnedPoints = isCorrect ? SCORE_CONFIG.correctMission : SCORE_CONFIG.wrongMission;
  gameState.score += earnedPoints;
  gameState.answers[gameState.currentMissionIndex] = {
    type: mission.type,
    correct: isCorrect,
    earnedPoints,
    ...selectedData
  };
  mapState.completedMissions.push(gameState.currentMissionIndex);
  mapState.activeMissionIndex = Math.min(missions.length - 1, mapState.activeMissionIndex + 1);
  gameState.currentMissionIndex = mapState.activeMissionIndex;
  showFeedback(isCorrect, earnedPoints, isCorrect ? mission.correctExplanation : mission.wrongExplanation, mission.note);
  ui.continueMapBtn.hidden = false;
  updateDoorVisuals();
  updateHud();
  renderRoute();
  playSound(isCorrect ? "correct" : "wrong");
}

function showFeedback(isCorrect, earnedPoints, explanation, note) {
  ui.feedbackPanel.hidden = false;
  ui.feedbackPanel.className = `feedback-panel ${isCorrect ? "correct" : "incorrect"}`;
  ui.feedbackBadge.textContent = isCorrect ? `Успех! +${earnedPoints} точки` : `Продължавай смело! +${earnedPoints} точки за участие`;
  ui.feedbackText.textContent = explanation;
  ui.feedbackNote.textContent = note;
}

function lockChoiceButtons(selector, selectedValue, correctValue) {
  Array.from(ui.interactionArea.querySelectorAll(selector)).forEach((button) => {
    const value = button.dataset.value;
    button.disabled = true;
    button.classList.add("is-locked");
    if (value === correctValue) button.classList.add("is-correct");
    if (value === selectedValue && value !== correctValue) button.classList.add("is-incorrect");
  });
}

function updateDoorVisuals() {
  doors.forEach((door) => {
    const element = ui.mapLayers?.querySelector(`[data-id="${door.id}"]`);
    if (!element) return;
    const unlocked = isDoorUnlocked(door);
    element.classList.toggle("locked", !unlocked);
    element.classList.toggle("unlocked", unlocked);
  });

  interactables.forEach((item) => {
    const element = ui.mapLayers?.querySelector(`[data-id="${item.id}"]`);
    if (!element) return;
    element.classList.toggle("current-objective", item.missionIndex === mapState.activeMissionIndex);
    element.classList.toggle("completed-objective", mapState.completedMissions.includes(item.missionIndex));
  });
}

function isDoorUnlocked(door) {
  return mapState.completedMissions.includes(door.requiredMission);
}

function renderMapState() {
  ui.playerAvatar.style.left = `${mapState.player.x}px`;
  ui.playerAvatar.style.top = `${mapState.player.y}px`;

  hazards.forEach((hazard) => {
    const element = ui.mapLayers.querySelector(`[data-id="${hazard.id}"]`);
    if (element) {
      element.style.left = `${hazard.x}px`;
      element.style.top = `${hazard.y}px`;
    }
  });

  collectibles.forEach((item) => {
    const element = ui.mapLayers.querySelector(`[data-id="${item.id}"]`);
    if (element) {
      element.hidden = item.collected;
    }
  });

  securityDoors.forEach((door) => {
    const element = ui.mapLayers.querySelector(`[data-id="${door.id}"]`);
    if (element) {
      element.classList.toggle("completed-objective", door.correct && mapState.doorBonusDone);
    }
  });

  bonusInteractables.forEach((item) => {
    const element = ui.mapLayers.querySelector(`[data-id="${item.id}"]`);
    if (element) {
      element.classList.toggle("completed-objective", mapState.completedBonuses.includes(item.id));
    }
  });

  const target = interactables[mapState.activeMissionIndex];
  if (target) {
    ui.objectiveMarker.hidden = false;
    ui.objectiveMarker.style.left = `${target.x + target.w / 2}px`;
    ui.objectiveMarker.style.top = `${target.y - 22}px`;
  } else {
    ui.objectiveMarker.hidden = true;
  }

  updateDoorVisuals();
}

function renderRoute() {
  const fragment = document.createDocumentFragment();
  missions.forEach((mission, index) => {
    const item = document.createElement("span");
    item.className = "route-step";
    if (mapState.completedMissions.includes(index)) item.classList.add("completed");
    else if (index === mapState.activeMissionIndex) item.classList.add("current");
    else item.classList.add("locked");
    item.textContent = mission.room.replace("на зала", "").replace(" коридор", "");
    fragment.append(item);
  });
  ui.route.replaceChildren(fragment);
}

function getBonusCount() {
  const bonusIds = new Set(mapState.completedBonuses);
  return Math.min(5, bonusIds.size);
}

function updateHud() {
  const completedCount = mapState.completedMissions.length;
  const mission = missions[Math.min(mapState.activeMissionIndex, missions.length - 1)];
  ui.playerStatus.textContent = gameState.playerName || "-";
  ui.roomStatus.textContent = mapState.currentZone;
  ui.scoreCounter.textContent = String(gameState.score);
  ui.timerCounter.textContent = formatTime(getElapsedSeconds());
  ui.keyCounter.textContent = `${mapState.collectedKeys}/${collectibles.length}`;
  ui.missionCounter.textContent = `${completedCount}/${missions.length}`;
  ui.bonusCounter.textContent = `${getBonusCount()}/5`;
  ui.objectiveText.textContent = completedCount >= missions.length ? "Защитата е активирана." : mission.objective;
}

function setMapMessage(text) {
  if (ui.mapMessage.textContent === text) {
    return;
  }
  setMessage(ui.mapMessage, text, text.includes("заключена") ? "error" : "helper");
}

function showToast(text, type = "helper") {
  const toast = document.createElement("div");
  toast.className = `toast-message ${type}`;
  toast.textContent = text;
  ui.toastArea.append(toast);
  window.setTimeout(() => toast.remove(), 2200);
}

function finishGame() {
  if (mapState.isGameOver) {
    return;
  }

  mapState.isGameOver = true;
  stopTimer();
  gameState.endTime = Date.now();
  const timeSeconds = Number(Math.max(0.1, getElapsedSeconds()).toFixed(2));
  const timeBonus = calculateTimeBonus(timeSeconds);
  const finalScore = Math.min(SCORE_CONFIG.maxScore, gameState.score + timeBonus);
  const title = calculateTitle(finalScore);

  gameState.finalResult = {
    name: gameState.playerName,
    score: finalScore,
    timeSeconds,
    title,
    timeBonus,
    keys: mapState.collectedKeys,
    missions: mapState.completedMissions.length,
    bonuses: getBonusCount()
  };

  renderResult();
  showScreen("result");
  launchConfetti();
  playSound("success");
  saveScore();
}

function calculateTimeBonus(timeSeconds) {
  if (timeSeconds < 120) return 70;
  if (timeSeconds <= 210) return 40;
  if (timeSeconds <= 300) return 20;
  return 0;
}

function calculateTitle(score) {
  if (score <= 200) return allowedTitles[0];
  if (score <= 400) return allowedTitles[1];
  if (score <= 600) return allowedTitles[2];
  return allowedTitles[3];
}

function renderResult() {
  const result = gameState.finalResult;
  if (!result) return;

  ui.finalBadge.className = `final-badge ${titleBadgeClasses[result.title] || "badge-blue"}`;
  ui.finalBadge.textContent = result.title;

  const items = [
    { label: "Име", value: result.name },
    { label: "Точки", value: String(result.score) },
    { label: "Време", value: formatTime(result.timeSeconds) },
    { label: "Събрани ключове", value: `${result.keys}/${collectibles.length}` },
    { label: "Изпълнени мисии", value: `${result.missions}/5` },
    { label: "Изпълнени бонуси", value: `${result.bonuses}/5` },
    { label: "Бонус за време", value: `+${result.timeBonus}` },
    { label: "Титла", value: result.title }
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
  if (!gameState.finalResult || gameState.hasSavedResult) return;
  setMessage(ui.saveStatus, "Записване на резултата...", "helper");

  try {
    const response = await fetch("/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: gameState.finalResult.name,
        score: gameState.finalResult.score,
        time_seconds: gameState.finalResult.timeSeconds,
        title: gameState.finalResult.title
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Резултатът не беше записан. Моля, опитайте отново.");
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
    if (!response.ok) throw new Error(data.error || "Класацията не може да бъде заредена в момента.");
    gameState.leaderboard = sortScores(Array.isArray(data.scores) ? data.scores : []);
    renderLeaderboard();
    setMessage(ui.leaderboardMessage, "");
  } catch (error) {
    gameState.leaderboard = [];
    renderLeaderboard();
    setMessage(ui.leaderboardMessage, getNetworkAwareMessage(error, "Класацията не може да бъде заредена в момента."), "error");
  }
}

function sortScores(scores) {
  return [...scores].sort((first, second) => {
    if (second.score !== first.score) return second.score - first.score;
    if (first.time_seconds !== second.time_seconds) return first.time_seconds - second.time_seconds;
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
    if (index < 3) row.classList.add(`place-${index + 1}`);
    [
      createRankCell(index + 1),
      createTextCell(sanitizeDisplayText(entry.name)),
      createTextCell(String(entry.score)),
      createTextCell(formatTime(Number(entry.time_seconds))),
      createTextCell(sanitizeDisplayText(entry.title)),
      createTextCell(formatDate(entry.created_at))
    ].forEach((cell) => row.append(cell));
    fragment.append(row);
  });
  ui.leaderboardBody.replaceChildren(fragment);
}

function createRankCell(rank) {
  const cell = document.createElement("td");
  const wrapper = document.createElement("span");
  wrapper.className = `rank-badge rank-${rank <= 3 ? rank : "normal"}`;
  wrapper.textContent = String(rank);
  cell.append(wrapper);
  if (rank <= 3) {
    const label = document.createElement("span");
    label.className = "top-rank-label";
    label.textContent = topLabels[rank - 1];
    cell.append(label);
  }
  return cell;
}

function createTextCell(text) {
  const cell = document.createElement("td");
  cell.textContent = text;
  return cell;
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Непозната дата";
  return date.toLocaleString("bg-BG", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function requestAdminClear() {
  playSound("click");
  const adminCode = window.prompt("Въведете администраторския код:");
  if (adminCode === null) return;
  const normalizedAdminCode = adminCode.trim();
  if (!normalizedAdminCode) {
    setMessage(ui.leaderboardMessage, "Моля, въведете администраторски код.", "error");
    return;
  }
  const confirmed = window.confirm("Сигурни ли сте, че искате да изчистите класацията?");
  if (confirmed) clearLeaderboard(normalizedAdminCode);
}

async function clearLeaderboard(adminCode) {
  setMessage(ui.leaderboardMessage, "Изчистване на класацията...", "helper");

  try {
    const response = await fetch("/api/scores", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminCode })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Класацията не може да бъде изчистена в момента.");
    await loadLeaderboard();
    setMessage(ui.leaderboardMessage, "Класацията беше изчистена успешно.", "success");
  } catch (error) {
    setMessage(ui.leaderboardMessage, getNetworkAwareMessage(error, "Класацията не може да бъде изчистена в момента."), "error");
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

function startTimer() {
  stopTimer();
  ui.timerCounter.textContent = "00:00";
  gameState.timerIntervalId = window.setInterval(updateHud, 250);
}

function stopTimer() {
  if (gameState.timerIntervalId) {
    window.clearInterval(gameState.timerIntervalId);
    gameState.timerIntervalId = null;
  }
}

function getElapsedSeconds() {
  if (!gameState.startTime) return 0;
  const endTime = gameState.endTime || Date.now();
  return Math.max(0, (endTime - gameState.startTime) / 1000);
}

function formatTime(seconds) {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const remainingSeconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

function rectsOverlap(a, b) {
  const aw = a.w ?? a.width;
  const ah = a.h ?? a.height;
  const bw = b.w ?? b.width;
  const bh = b.h ?? b.height;
  return a.x < b.x + bw && a.x + aw > b.x && a.y < b.y + bh && a.y + ah > b.y;
}

function inflateRect(rect, amount) {
  return { x: rect.x - amount, y: rect.y - amount, w: rect.w + amount * 2, h: rect.h + amount * 2 };
}

function getPlayerRect() {
  return { x: mapState.player.x, y: mapState.player.y, w: mapState.player.width, h: mapState.player.height };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getDeviceIcon(item) {
  const icons = { Компютър: "▣", Рутер: "⌁", Сървър: "▤", Интернет: "◎" };
  return icons[item] || "●";
}

function toggleSound() {
  gameState.soundEnabled = !gameState.soundEnabled;
  savePreferences();
  updateSoundButton();
  if (gameState.soundEnabled) playSound("click");
}

function updateSoundButton() {
  ui.soundToggle.textContent = gameState.soundEnabled ? "Звук: включен" : "Звук: изключен";
}

function loadPreferences() {
  try {
    const storedPreference = window.localStorage.getItem("it-quest-sound-enabled");
    if (storedPreference !== null) gameState.soundEnabled = storedPreference === "true";
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
  if (!AudioContextClass) return null;
  if (!audioContext) audioContext = new AudioContextClass();
  if (audioContext.state === "suspended") audioContext.resume();
  return audioContext;
}

function playTone({ frequency, duration, type = "sine", delay = 0, endFrequency = frequency, volume = 0.05 }) {
  const context = ensureAudioContext();
  if (!context) return;
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
  if (!gameState.soundEnabled) return;
  if (kind === "click") playTone({ frequency: 560, endFrequency: 620, duration: 0.08, type: "triangle", volume: 0.03 });
  if (kind === "unlock") {
    playTone({ frequency: 240, endFrequency: 520, duration: 0.18, type: "sine", volume: 0.04 });
    playTone({ frequency: 620, endFrequency: 760, duration: 0.12, type: "triangle", delay: 0.16, volume: 0.035 });
  }
  if (kind === "correct") {
    playTone({ frequency: 520, endFrequency: 620, duration: 0.12, type: "triangle", volume: 0.04 });
    playTone({ frequency: 700, endFrequency: 820, duration: 0.16, type: "triangle", delay: 0.09, volume: 0.04 });
  }
  if (kind === "wrong") playTone({ frequency: 320, endFrequency: 200, duration: 0.18, type: "sawtooth", volume: 0.035 });
  if (kind === "success") {
    playTone({ frequency: 523, duration: 0.14, type: "triangle", volume: 0.04 });
    playTone({ frequency: 659, duration: 0.14, type: "triangle", delay: 0.12, volume: 0.04 });
    playTone({ frequency: 784, duration: 0.2, type: "triangle", delay: 0.24, volume: 0.04 });
  }
}

function launchConfetti() {
  clearConfetti();
  const colors = ["#2fb8ff", "#5df7c5", "#9c7bff", "#ffc96c", "#ff6ca8"];
  for (let index = 0; index < 28; index += 1) {
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
  if (!ui.body || !ui.eventModeBtn) return;
  const isActive = Boolean(document.fullscreenElement) || ui.body.classList.contains("event-mode");
  ui.body.classList.toggle("event-mode", isActive);
  ui.eventModeBtn.textContent = isActive ? "Изход от режим за събитие" : "Режим за събитие";
}
