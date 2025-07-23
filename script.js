let roundNumber = 10000 + Math.floor(Math.random() * 1000);
let intervalId = null;

function generatePrediction() {
  const colors = ['Green', 'Red', 'Violet'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  document.getElementById("round").innerText = ++roundNumber;
  document.getElementById("color").innerText = color;
  document.getElementById("status").innerText = `New prediction generated at ${new Date().toLocaleTimeString()}`;
}

function setTimer(seconds) {
  if (intervalId) clearInterval(intervalId);
  generatePrediction();
  intervalId = setInterval(() => {
    generatePrediction();
  }, seconds * 1000);
  document.getElementById("status").innerText = `Auto-generating every ${seconds} seconds...`;
}
