const missions = [
  {
    type: "access-card",
    room: "Входна зала",
    title: "Мисия 1: Създай защитен пропуск",
    story: "За да влезеш в Кибер академията, трябва да избереш най-сигурния дигитален пропуск.",
    options: ["123456", "ivan2000", "password", "Luna#48_Kod!"],
    correctAnswer: "Luna#48_Kod!",
    correctExplanation:
      "Достъпът е разрешен! Силната парола използва главни и малки букви, цифри и специални символи.",
    wrongExplanation:
      "Този пропуск е слаб и може лесно да бъде отгатнат. Най-сигурният избор е Luna#48_Kod!.",
    note: "Силните пароли защитават профилите и личната информация."
  },
  {
    type: "email-detective",
    room: "Пощенски коридор",
    title: "Мисия 2: Открий фалшивото съобщение",
    story:
      "По пътя към сървъра получаваш няколко съобщения. Едно от тях е опасно. Открий фишинг атаката.",
    emails: [
      {
        id: "schedule",
        from: "school@academy.bg",
        subject: "Програма за деня",
        body: "Виж графика на учебните дейности."
      },
      {
        id: "prize",
        from: "prize-now@free-phone.win",
        subject: "Честито! Спечели телефон!",
        body: "Натисни тук и въведи паролата си."
      },
      {
        id: "teacher",
        from: "teacher@academy.bg",
        subject: "Домашна работа",
        body: "Не забравяй задачата по информационни технологии."
      },
      {
        id: "library",
        from: "library@academy.bg",
        subject: "Нова книга",
        body: "Добавена е нова книга в училищната библиотека."
      }
    ],
    correctEmailId: "prize",
    correctExplanation:
      "Точно така! Това е фишинг – съобщение, което се опитва да те подмами да въведеш парола или лични данни.",
    wrongExplanation:
      "Провери внимателно. Опасните съобщения често обещават награди и искат парола.",
    note: "Не въвеждай пароли в съмнителни сайтове и не натискай непознати линкове."
  },
  {
    type: "network-order",
    room: "Мрежова стая",
    title: "Мисия 3: Свържи училищната мрежа",
    story:
      "За да стигнеш до сървъра, трябва да възстановиш правилната връзка между устройствата.",
    items: ["Компютър", "Рутер", "Сървър", "Интернет"],
    correctOrder: ["Компютър", "Рутер", "Сървър", "Интернет"],
    correctExplanation:
      "Мрежата е възстановена! Компютърът се свързва с рутера, рутерът достига до сървъра, а сървърът комуникира с интернет.",
    wrongExplanation:
      "Връзката не е оптимална. Правилният ред е: Компютър → Рутер → Сървър → Интернет.",
    note: "Компютърните мрежи свързват устройства, услуги и сървъри, за да обменят информация."
  },
  {
    type: "switches",
    room: "Логическа лаборатория",
    title: "Мисия 4: Активирай защитата",
    story: "Системата за защита се включва само ако две условия са изпълнени едновременно.",
    switches: [
      { id: "power", label: "Има ток" },
      { id: "button", label: "Бутонът е включен" }
    ],
    requiredOn: ["power", "button"],
    correctExplanation:
      "Защитата е активирана! Това е логика И – и двете условия трябва да са изпълнени.",
    wrongExplanation:
      "Системата не може да се активира. При логика И всички условия трябва да са верни едновременно.",
    note: "Логиката И се използва в програмирането, електрониката и автоматизираните системи."
  },
  {
    type: "terminal-choice",
    room: "Сървърна стая",
    title: "Мисия 5: Активирай защитната стена",
    story:
      "Стигна до сървърната стая. Последната задача е да избереш правилното действие в алгоритъма, за да охладиш сървъра и да активираш защитата.",
    codeBlock:
      "Ако температурата е над 30 градуса:\n    включи вентилатора\nИначе:\n    включи отоплението",
    question:
      "Температурата в сървърната стая е 35 градуса. Коя команда трябва да се изпълни?",
    options: ["включи вентилатора", "включи отоплението", "изключи сървъра", "игнорирай предупреждението"],
    correctAnswer: "включи вентилатора",
    correctExplanation:
      "Сървърът е защитен! 35 е повече от 30, затова алгоритъмът включва вентилатора.",
    wrongExplanation:
      "Провери условието. Когато температурата е над 30 градуса, трябва да се включи вентилаторът.",
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

const gameState = {
  playerName: "",
  currentMissionIndex: 0,
  score: 0,
  startTime: null,
  endTime: null,
  answers: [],
  selectedOrder: [],
  switchStates: {},
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
  ui.playerStatus = document.getElementById("player-status");
  ui.roomStatus = document.getElementById("room-status");
  ui.missionCounter = document.getElementById("mission-counter");
  ui.scoreCounter = document.getElementById("score-counter");
  ui.timerCounter = document.getElementById("timer-counter");
  ui.progressFill = document.getElementById("progress-fill");
  ui.missionMap = document.getElementById("mission-map");
  ui.missionTitle = document.getElementById("mission-title");
  ui.missionStory = document.getElementById("mission-story");
  ui.roomScene = document.getElementById("room-scene");
  ui.interactionArea = document.getElementById("interaction-area");
  ui.feedbackPanel = document.getElementById("feedback-panel");
  ui.feedbackBadge = document.getElementById("feedback-badge");
  ui.feedbackText = document.getElementById("feedback-text");
  ui.feedbackNote = document.getElementById("feedback-note");
  ui.nextMissionBtn = document.getElementById("next-mission-btn");
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
  ui.transitionOverlay = document.getElementById("transition-overlay");
  ui.transitionTitle = document.getElementById("transition-title");
  ui.transitionRoom = document.getElementById("transition-room");
}

function bindEvents() {
  ui.startBtn.addEventListener("click", startGame);
  ui.homeLeaderboardBtn.addEventListener("click", () => showScreen("leaderboard"));
  ui.nextMissionBtn.addEventListener("click", goToNextMission);
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
  showScreen(window.location.pathname === "/leaderboard" ? "leaderboard" : "home", false);
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
  gameState.switchStates = {};
  gameState.hasSavedResult = false;
  gameState.finalResult = null;
  ui.resultSummary.replaceChildren();
  ui.interactionArea.replaceChildren();
  ui.roomScene.replaceChildren();
  ui.nextMissionBtn.hidden = true;
  ui.feedbackPanel.hidden = true;
  ui.feedbackPanel.className = "feedback-panel";
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

  resetMissionInteractionState();
  ui.missionTitle.textContent = mission.title;
  ui.missionStory.textContent = mission.story;
  ui.feedbackPanel.hidden = true;
  ui.feedbackPanel.className = "feedback-panel";
  ui.nextMissionBtn.hidden = true;

  renderMissionMap();
  renderRoomScene(mission);
  renderInteraction(mission);
  updateGameHeader();
}

function resetMissionInteractionState() {
  gameState.selectedOrder = [];
  gameState.switchStates = {};
  ui.interactionArea.replaceChildren();
  ui.roomScene.replaceChildren();
}

function renderMissionMap() {
  const fragment = document.createDocumentFragment();

  missions.forEach((mission, index) => {
    const item = document.createElement("div");
    item.className = "map-node";

    if (index < gameState.currentMissionIndex) {
      item.classList.add("completed");
    } else if (index === gameState.currentMissionIndex) {
      item.classList.add("current");
    } else {
      item.classList.add("locked");
    }

    const marker = document.createElement("span");
    marker.className = "map-node__marker";
    marker.textContent = index < gameState.currentMissionIndex ? "✓" : String(index + 1);

    const label = document.createElement("span");
    label.className = "map-node__label";
    label.textContent = mission.room;

    item.append(marker, label);
    fragment.append(item);
  });

  ui.missionMap.replaceChildren(fragment);
}

function updateMissionMap() {
  renderMissionMap();
}

function renderRoomScene(mission) {
  ui.roomScene.className = `room-scene scene-${mission.type}`;

  const sceneRenderers = {
    "access-card": renderDoorScene,
    "email-detective": renderMailScene,
    "network-order": renderNetworkScene,
    switches: renderSwitchScene,
    "terminal-choice": renderServerScene
  };

  const renderer = sceneRenderers[mission.type];
  if (renderer) {
    renderer();
  }
}

function renderDoorScene() {
  ui.roomScene.innerHTML = `
    <div class="cyber-door">
      <span class="door-light"></span>
      <div class="door-core"></div>
      <div class="door-lock">ЗАКЛ</div>
    </div>
    <div class="scene-console"><span></span><span></span><span></span></div>
  `;
}

function renderMailScene() {
  ui.roomScene.innerHTML = `
    <div class="mail-corridor">
      <span class="mail-terminal"></span>
      <span class="floating-mail mail-one"></span>
      <span class="floating-mail mail-two"></span>
      <span class="floating-mail mail-three"></span>
    </div>
    <div class="shield-holo">ЩИТ</div>
  `;
}

function renderNetworkScene() {
  ui.roomScene.innerHTML = `
    <div class="network-visual">
      <span class="device-dot"></span>
      <span class="device-dot"></span>
      <span class="device-dot"></span>
      <span class="device-dot"></span>
    </div>
  `;
}

function renderSwitchScene() {
  ui.roomScene.innerHTML = `
    <div class="control-visual">
      <span class="warning-light"></span>
      <div class="shield-core">ЩИТ</div>
      <span class="warning-light"></span>
    </div>
  `;
}

function renderServerScene() {
  ui.roomScene.innerHTML = `
    <div class="server-room-visual">
      <div class="server-rack"><span></span><span></span><span></span><span></span></div>
      <div class="fan-indicator">35°</div>
      <div class="shield-core">ЩИТ</div>
    </div>
  `;
}

function renderInteraction(mission) {
  if (mission.type === "access-card") {
    renderAccessCardMission(mission);
    return;
  }

  if (mission.type === "email-detective") {
    renderEmailDetectiveMission(mission);
    return;
  }

  if (mission.type === "network-order") {
    renderNetworkOrderMission(mission);
    return;
  }

  if (mission.type === "switches") {
    renderSwitchesMission(mission);
    return;
  }

  if (mission.type === "terminal-choice") {
    renderTerminalChoiceMission(mission);
  }
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
    button.innerHTML = `
      <span class="email-card__from">От: ${email.from}</span>
      <strong>${email.subject}</strong>
      <span>${email.body}</span>
    `;
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
  slots.dataset.role = "slots";

  const devices = document.createElement("div");
  devices.className = "network-devices";

  mission.items.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "network-device";
    button.dataset.item = item;
    button.innerHTML = `<span class="device-icon">${getDeviceIcon(item)}</span><strong>${item}</strong>`;
    button.disabled = gameState.selectedOrder.includes(item);
    button.classList.toggle("selected", gameState.selectedOrder.includes(item));
    button.addEventListener("click", () => handleNetworkSelection(item, mission));
    devices.append(button);
  });

  const actions = document.createElement("div");
  actions.className = "order-actions";

  const resetButton = document.createElement("button");
  resetButton.type = "button";
  resetButton.className = "button button-secondary";
  resetButton.textContent = "Изчисти връзката";
  resetButton.addEventListener("click", () => {
    gameState.selectedOrder = [];
    renderNetworkOrderMission(mission);
    playSound("click");
  });

  const confirmButton = document.createElement("button");
  confirmButton.type = "button";
  confirmButton.className = "button button-primary";
  confirmButton.textContent = "Потвърди връзката";
  confirmButton.disabled = gameState.selectedOrder.length !== mission.correctOrder.length;
  confirmButton.addEventListener("click", () => confirmNetworkOrder(mission));

  actions.append(resetButton, confirmButton);
  wrapper.append(slots, devices, actions);
  ui.interactionArea.replaceChildren(wrapper);
  renderNetworkSlots(mission);
}

function renderNetworkSlots(mission, answered = false) {
  const slots = ui.interactionArea.querySelector('[data-role="slots"]');
  if (!slots) {
    return;
  }

  const fragment = document.createDocumentFragment();

  for (let index = 0; index < mission.correctOrder.length; index += 1) {
    const slot = document.createElement("div");
    slot.className = "network-slot";

    const selectedItem = gameState.selectedOrder[index];
    if (selectedItem) {
      slot.classList.add("filled");
      slot.innerHTML = `<span>${index + 1}</span><strong>${selectedItem}</strong>`;
    } else {
      slot.innerHTML = `<span>${index + 1}</span><strong>Очаква избор</strong>`;
    }

    if (answered && selectedItem) {
      slot.classList.add(selectedItem === mission.correctOrder[index] ? "correct" : "incorrect");
    }

    fragment.append(slot);
  }

  slots.replaceChildren(fragment);
}

function handleNetworkSelection(item, mission) {
  if (gameState.answers[gameState.currentMissionIndex]) {
    return;
  }

  if (gameState.selectedOrder.includes(item) || gameState.selectedOrder.length >= mission.correctOrder.length) {
    return;
  }

  gameState.selectedOrder.push(item);
  renderNetworkOrderMission(mission);
  playSound("click");
}

function confirmNetworkOrder(mission) {
  if (gameState.answers[gameState.currentMissionIndex]) {
    return;
  }

  if (gameState.selectedOrder.length !== mission.correctOrder.length) {
    return;
  }

  const isCorrect = mission.correctOrder.every((item, index) => gameState.selectedOrder[index] === item);
  handleMissionResult(isCorrect, { selectedOrder: [...gameState.selectedOrder] });
  renderNetworkSlots(mission, true);
  Array.from(ui.interactionArea.querySelectorAll("button")).forEach((button) => {
    button.disabled = true;
    button.classList.add("is-locked");
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
    button.dataset.switchId = item.id;
    button.innerHTML = `<span class="switch-track"><span class="switch-thumb"></span></span><strong>${item.label}</strong>`;
    button.addEventListener("click", () => {
      if (gameState.answers[gameState.currentMissionIndex]) {
        return;
      }
      gameState.switchStates[item.id] = !gameState.switchStates[item.id];
      renderSwitchesMission(mission);
      syncShieldGlow();
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
    syncShieldGlow();
  });

  panel.append(switches, confirmButton);
  ui.interactionArea.replaceChildren(panel);
  syncShieldGlow();
}

function syncShieldGlow() {
  const shield = ui.roomScene.querySelector(".shield-core");
  if (!shield) {
    return;
  }
  const active = Object.values(gameState.switchStates).filter(Boolean).length >= 2;
  shield.classList.toggle("active", active);
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

function getDeviceIcon(item) {
  const icons = {
    Компютър: "▣",
    Рутер: "⌁",
    Сървър: "▤",
    Интернет: "◎"
  };
  return icons[item] || "●";
}

function lockChoiceButtons(selector, selectedValue, correctValue) {
  Array.from(ui.interactionArea.querySelectorAll(selector)).forEach((button) => {
    const value = button.dataset.value;
    button.disabled = true;
    button.classList.add("is-locked");

    if (value === correctValue) {
      button.classList.add("is-correct");
    }

    if (value === selectedValue && value !== correctValue) {
      button.classList.add("is-incorrect");
    }
  });
}

function handleMissionResult(isCorrect, selectedData) {
  if (gameState.answers[gameState.currentMissionIndex]) {
    return;
  }

  const mission = missions[gameState.currentMissionIndex];
  const earnedPoints = isCorrect ? 100 : 20;

  gameState.score += earnedPoints;
  gameState.answers[gameState.currentMissionIndex] = {
    type: mission.type,
    correct: isCorrect,
    earnedPoints,
    ...selectedData
  };

  ui.roomScene.classList.toggle("scene-success", isCorrect);
  ui.roomScene.classList.toggle("scene-warning", !isCorrect);
  showFeedback(isCorrect, earnedPoints, isCorrect ? mission.correctExplanation : mission.wrongExplanation, mission.note);
  ui.nextMissionBtn.textContent =
    gameState.currentMissionIndex === missions.length - 1 ? "Виж резултата" : "Следваща стая";
  ui.nextMissionBtn.hidden = false;
  updateGameHeader();
  updateMissionMap();
  playSound(isCorrect ? "correct" : "wrong");
}

function showFeedback(isCorrect, earnedPoints, explanation, note) {
  ui.feedbackPanel.hidden = false;
  ui.feedbackPanel.className = `feedback-panel ${isCorrect ? "correct" : "incorrect"}`;
  ui.feedbackBadge.textContent = isCorrect
    ? `Успех! +${earnedPoints} точки`
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

  const nextMission = missions[gameState.currentMissionIndex + 1];
  showRoomTransition(nextMission).then(() => {
    gameState.currentMissionIndex += 1;
    renderMission();
  });
}

function showRoomTransition(nextMission) {
  ui.transitionTitle.textContent = "Вратата се отключва…";
  ui.transitionRoom.textContent = `Следваща зона: ${nextMission.room}`;
  ui.transitionOverlay.hidden = false;
  ui.transitionOverlay.classList.add("active");
  playSound("unlock");

  return new Promise((resolve) => {
    window.setTimeout(() => {
      ui.transitionOverlay.classList.remove("active");
      ui.transitionOverlay.hidden = true;
      resolve();
    }, 950);
  });
}

function updateGameHeader() {
  const mission = missions[gameState.currentMissionIndex];
  ui.playerStatus.textContent = gameState.playerName || "-";
  ui.roomStatus.textContent = mission?.room || "-";
  ui.missionCounter.textContent = `Мисия ${gameState.currentMissionIndex + 1} от ${missions.length}`;
  ui.scoreCounter.textContent = String(gameState.score);
  ui.timerCounter.textContent = formatTime(getElapsedSeconds());
  ui.progressFill.style.width = `${((gameState.currentMissionIndex + 1) / missions.length) * 100}%`;
}

function startTimer() {
  stopTimer();
  ui.timerCounter.textContent = "00:00";
  gameState.timerIntervalId = window.setInterval(() => {
    ui.timerCounter.textContent = formatTime(getElapsedSeconds());
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

  ui.finalBadge.className = `final-badge ${titleBadgeClasses[result.title] || "badge-blue"}`;
  ui.finalBadge.textContent = result.title;

  const items = [
    { label: "Име", value: result.name },
    { label: "Точки", value: String(result.score) },
    { label: "Време", value: formatTime(result.timeSeconds) },
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
  if (!gameState.finalResult || gameState.hasSavedResult) {
    return;
  }

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
    setMessage(ui.leaderboardMessage, getNetworkAwareMessage(error, "Класацията не може да бъде заредена в момента."), "error");
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminCode })
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Класацията не може да бъде изчистена в момента.");
    }

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

  if (kind === "unlock") {
    playTone({ frequency: 240, endFrequency: 520, duration: 0.18, type: "sine", volume: 0.04 });
    playTone({ frequency: 620, endFrequency: 760, duration: 0.12, type: "triangle", delay: 0.16, volume: 0.035 });
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
  if (!ui.body || !ui.eventModeBtn) {
    return;
  }

  const isActive = Boolean(document.fullscreenElement) || ui.body.classList.contains("event-mode");
  ui.body.classList.toggle("event-mode", isActive);
  ui.eventModeBtn.textContent = isActive ? "Изход от режим за събитие" : "Режим за събитие";
}
