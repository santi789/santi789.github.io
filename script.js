let scoreA = 0, scoreB = 0;
let timerInterval;
let startTime;
let totalElapsed = 0;
let running = false;

let mode = 'up'; // 'up' or 'down'
let countdownTarget = 0;
let remainingCountdown = 0;

function updateScores() {
  document.getElementById('scoreA').innerText = scoreA;
  document.getElementById('scoreB').innerText = scoreB;
}

function changeScore(team, change) {
  if (team === 'A') scoreA = Math.max(0, scoreA + change);
  else scoreB = Math.max(0, scoreB + change);
  updateScores();
}

function updateTimer() {
  const now = new Date().getTime();
  let elapsed = now - startTime;

  if (mode === 'up') {
    const minutes = String(Math.floor(elapsed / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((elapsed % 60000) / 1000)).padStart(2, '0');
    const tenths = String(Math.floor((elapsed % 1000) / 10)).padStart(2, '0');
    document.getElementById('timer').innerText = `${minutes}:${seconds}:${tenths}`;
  } else {
    let remaining = countdownTarget - elapsed;
    if (remaining <= 0) {
      clearInterval(timerInterval);
      document.getElementById('timer').innerText = "00:00:00";
      document.getElementById('status').innerText = "⏰ หมดเวลา";
      running = false;
      return;
    }
    remainingCountdown = remaining;
    const minutes = String(Math.floor(remaining / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0');
    const tenths = String(Math.floor((remaining % 1000) / 10)).padStart(2, '0');
    document.getElementById('timer').innerText = `${minutes}:${seconds}:${tenths}`;
  }
}

function startTimer() {
  if (!running) {
    running = true;
    document.getElementById('status').innerText = "⏱ กำลังเล่น";
    if (mode === 'up') {
      startTime = new Date().getTime() - totalElapsed;
    } else {
      startTime = new Date().getTime() - (countdownTarget - remainingCountdown);
    }
    timerInterval = setInterval(updateTimer, 10);
  }
}

function pauseTimer() {
  if (running) {
    running = false;
    document.getElementById('status').innerText = "⏸ หยุดอยู่";
    clearInterval(timerInterval);
    const now = new Date().getTime();
    if (mode === 'up') {
      totalElapsed = now - startTime;
    } else {
      remainingCountdown = countdownTarget - (now - startTime);
    }
  }
}

function resetTimer() {
  pauseTimer();
  totalElapsed = 0;
  remainingCountdown = countdownTarget;
  document.getElementById('timer').innerText = "00:00:00";
}

function toggleMode() {
  mode = (mode === 'up') ? 'down' : 'up';
  document.getElementById('modeButton').innerText = `โหมด: ${mode === 'up' ? 'นับขึ้น' : 'ถอยหลัง'}`;
  document.getElementById('countdownSection').style.display = mode === 'down' ? 'flex' : 'none';
  resetTimer();
}

function setCountdown() {
  const input = document.getElementById('countdownInput').value.trim();
  const [minStr, secStr] = input.split(':');
  const minutes = parseInt(minStr) || 0;
  const seconds = parseInt(secStr) || 0;
  countdownTarget = (minutes * 60 + seconds) * 1000;
  remainingCountdown = countdownTarget;
  document.getElementById('timer').innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:00`;
}

function setHalf(half) {
  document.getElementById('halfLabel').innerText = half;
}

function updateTeamName(team) {
  const inputId = team === 'A' ? 'teamAName' : 'teamBName';
  const newName = document.getElementById(inputId).value;
  console.log(`Team ${team} renamed to: ${newName}`);
}

updateScores();
