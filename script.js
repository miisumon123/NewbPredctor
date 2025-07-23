let intervalId = null;
let countdownId = null;
let currentTimer = null;
let countdownSecondsLeft = null;

function saveToStorage(data) {
  localStorage.setItem('bdgPredictor', JSON.stringify(data));
}

function loadFromStorage() {
  const data = localStorage.getItem('bdgPredictor');
  if (data) return JSON.parse(data);
  return null;
}

function generatePrediction(triggeredBy, color, number, type) {
  // Use provided prediction if available (on load), else random generate
  if (color === undefined || number === undefined || type === undefined) {
    const colors = ['Green', 'Red', 'Violet'];
    color = colors[Math.floor(Math.random() * colors.length)];
    number = Math.floor(Math.random() * 10);
    type = number < 5 ? 'Small' : 'Big';
  }

  document.getElementById("timer-label").innerText = 
    triggeredBy === 'Manual' ? 'Manual' : (currentTimer ? `${currentTimer} seconds` : 'None');
  document.getElementById("prediction-type").innerText = triggeredBy === 'Manual' ? 'Manual' : `Auto (${currentTimer}s)`;
  document.getElementById("color").innerText = color;
  document.getElementById("number").innerText = number;
  document.getElementById("type").innerText = type;
  document.getElementById("status").innerText = `New prediction generated at ${new Date().toLocaleTimeString()}`;

  // Save current state to localStorage except for manual trigger
  if(triggeredBy !== 'Manual'){
    saveToStorage({
      currentTimer,
      color,
      number,
      type,
      timestamp: Date.now()
    });
  }
}

function setTimer(seconds) {
  currentTimer = seconds;
  if (intervalId) clearInterval(intervalId);
  if (countdownId) clearInterval(countdownId);

  generatePrediction('Auto');

  intervalId = setInterval(() => {
    generatePrediction('Auto');
    startCountdown(seconds);
  }, seconds * 1000);

  startCountdown(seconds);
  document.getElementById("status").innerText = `Auto-generating every ${seconds} seconds...`;
}

function startCountdown(seconds) {
  if (countdownId) clearInterval(countdownId);
  countdownSecondsLeft = seconds;
  document.getElementById("countdown").innerText = `Next prediction in: ${countdownSecondsLeft}s`;

  countdownId = setInterval(() => {
    countdownSecondsLeft--;
    document.getElementById("countdown").innerText = `Next prediction in: ${countdownSecondsLeft}s`;
    if (countdownSecondsLeft <= 0) {
      clearInterval(countdownId);
    }
  }, 1000);
}

function resumeTimer() {
  const data = loadFromStorage();
  if(data) {
    currentTimer = data.currentTimer;
    // Restore last prediction values
    generatePrediction('Auto', data.color, data.number, data.type);

    // Calculate elapsed time since last prediction
    const elapsed = Math.floor((Date.now() - data.timestamp) / 1000);
    let remaining = currentTimer - elapsed;
    if(remaining <= 0) remaining = 0;

    countdownSecondsLeft = remaining;
    document.getElementById("countdown").innerText = `Next prediction in: ${countdownSecondsLeft}s`;

    // Start countdown timer with remaining time
    countdownId = setInterval(() => {
      countdownSecondsLeft--;
      document.getElementById("countdown").innerText = `Next prediction in: ${countdownSecondsLeft}s`;
      if (countdownSecondsLeft <= 0) {
        clearInterval(countdownId);
      }
    }, 1000);

    // Start auto interval with currentTimer and sync prediction interval
    intervalId = setInterval(() => {
      generatePrediction('Auto');
      startCountdown(currentTimer);
    }, currentTimer * 1000);

    document.getElementById("status").innerText = `Resumed auto-generating every ${currentTimer} seconds...`;
    document.getElementById("timer-label").innerText = `${currentTimer} seconds`;
    document.getElementById("prediction-type").innerText = `Auto (${currentTimer}s)`;
  }
}

// On page load, try to resume saved timer and prediction
window.onload = () => {
  resumeTimer();
};
