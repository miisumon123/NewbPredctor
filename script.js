let intervalId = null;
let countdownId = null;

function generatePrediction() {
  const colors = ['Green', 'Red', 'Violet'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const number = Math.floor(Math.random() * 10);
  const type = number < 5 ? 'Small' : 'Big';

  document.getElementById("color").innerText = color;
  document.getElementById("number").innerText = number;
  document.getElementById("type").innerText = type;
  document.getElementById("status").innerText = `New prediction generated at ${new Date().toLocaleTimeString()}`;
}

function setTimer(seconds) {
  if (intervalId) clearInterval(intervalId);
  if (countdownId) clearInterval(countdownId);
  generatePrediction();

  intervalId = setInterval(() => {
    generatePrediction();
    startCountdown(seconds);
  }, seconds * 1000);

  startCountdown(seconds);
  document.getElementById("status").innerText = `Auto-generating every ${seconds} seconds...`;
}

function startCountdown(seconds) {
  let timeLeft = seconds;
  document.getElementById("countdown").innerText = `Next prediction in: ${timeLeft}s`;
  countdownId = setInterval(() => {
    timeLeft--;
    document.getElementById("countdown").innerText = `Next prediction in: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(countdownId);
    }
  }, 1000);
}
