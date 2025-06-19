let scoreA = 0, scoreB = 0;
let timerInterval;
let startTime;
let totalElapsed = 0;
let running = false;

let mode = 'up';
let countdownTarget = 0;
let remainingCountdown = 0;
let lastSecondPlayed = null;
let hasPlayedBuzzer = false;

const beepAudio = new Audio('Timer.mp3');
const buzzerAudio = new Audio('START 3 .mp3');
beepAudio.preload = 'auto';
buzzerAudio.preload = 'auto';

function stopAudio(audio) {
  audio.pause();
  audio.currentTime = 0;
}

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
    remainingCountdown = countdownTarget - elapsed;

    if (remainingCountdown <= 0) {
      remainingCountdown = 0; // กันไม่ให้ติดลบ
      if (!hasPlayedBuzzer) {
        stopAudio(beepAudio);
        stopAudio(buzzerAudio);
        buzzerAudio.play();
        hasPlayedBuzzer = true;
      }
      clearInterval(timerInterval);
      running = false;
      document.getElementById('timer').innerText = "00:00:00";
      document.getElementById('status').innerText = "⏰ หมดเวลา!";
      document.getElementById('toggleStartPause').innerText = "▶ START";
      return;
    }

    const currentSecond = Math.floor(remainingCountdown / 1000);

    if (currentSecond !== lastSecondPlayed && currentSecond <= 10 && currentSecond > 0) {
      stopAudio(beepAudio);
      beepAudio.play();
      lastSecondPlayed = currentSecond;
    }

    const minutes = String(Math.floor(remainingCountdown / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((remainingCountdown % 60000) / 1000)).padStart(2, '0');
    const tenths = String(Math.floor((remainingCountdown % 1000) / 10)).padStart(2, '0');
    document.getElementById('timer').innerText = `${minutes}:${seconds}:${tenths}`;
  }
}

function toggleStartPause() {
  if (!running) startTimer();
  else pauseTimer();
}

function startTimer() {
  if (!running) {
    running = true;
    stopAudio(buzzerAudio);
    buzzerAudio.play();
    document.getElementById('status').innerText = "⏱ กำลังเล่น";
    document.getElementById('toggleStartPause').innerText = "⏸ PAUSE";
    startTime = new Date().getTime() - (mode === 'up' ? totalElapsed : countdownTarget - remainingCountdown);
    timerInterval = setInterval(updateTimer, 10);
  }
}

function pauseTimer() {
  if (running) {
    running = false;
    clearInterval(timerInterval);
    stopAudio(beepAudio);
    stopAudio(buzzerAudio);
    const now = new Date().getTime();
    if (mode === 'up') totalElapsed = now - startTime;
    else remainingCountdown = countdownTarget - (now - startTime);
    document.getElementById('status').innerText = "⏸ หยุดอยู่";
    document.getElementById('toggleStartPause').innerText = "▶ START";
  }
}

function resetTimer() {
  pauseTimer();
  totalElapsed = 0;
  remainingCountdown = countdownTarget;
  lastSecondPlayed = null;
  hasPlayedBuzzer = false;
  stopAudio(beepAudio);
  stopAudio(buzzerAudio);
  document.getElementById('timer').innerText = "00:00:00";
  document.getElementById('status').innerText = "ระบบจับเวลา";
}

function toggleMode() {
  if (!running) {
    mode = (mode === 'up') ? 'down' : 'up';
    document.getElementById('modeButton').innerText = `โหมด: ${mode === 'up' ? 'นับขึ้น' : 'ถอยหลัง'}`;
    document.getElementById('countdownSection').style.display = mode === 'down' ? 'flex' : 'none';
    resetTimer();
    if (mode === 'down') {
      setTimeout(() => document.getElementById('countdownInput').focus(), 100);
    }
  }
}

function setCountdown() {
  const input = document.getElementById('countdownInput').value.trim();
  const [minStr, secStr] = input.split(':');
  const minutes = parseInt(minStr) || 0;
  const seconds = parseInt(secStr) || 0;
  countdownTarget = (minutes * 60 + seconds) * 1000;
  remainingCountdown = countdownTarget;
  document.getElementById('timer').innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:00`;
  lastSecondPlayed = null;
  hasPlayedBuzzer = false;
}

function setHalf(half) {
  document.getElementById('halfLabel').innerText = half;
}

function updateTeamName(team) {
  const inputId = team === 'A' ? 'teamAName' : 'teamBName';
  const newName = document.getElementById(inputId).value;
  console.log(`Team ${team} renamed to: ${newName}`);
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      alert(`ไม่สามารถเปิดโหมดเต็มจอได้: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}

document.addEventListener('keydown', (e) => {
  const activeElement = document.activeElement;
  if (activeElement.tagName === 'INPUT') {
    // ✅ ถ้ากด Enter ตอนอยู่ใน input ให้กดตั้งเวลาได้เลย
    if (e.key === 'Enter' && activeElement.id === 'countdownInput') {
      setCountdown();
    }
    return; // ไม่ทำอย่างอื่น
  }

  const key = e.key;
  switch (key) {
    case '0': toggleStartPause(); break;
    case '1': changeScore('A', 1); break;
    case '2': changeScore('A', -1); break;
    case '6': changeScore('B', 1); break;
    case '7': changeScore('B', -1); break;
    case '8':
      const current = document.getElementById('halfLabel').innerText;
      document.getElementById('halfLabel').innerText = current.includes('แรก') ? 'ครึ่งหลัง / Second Half' : 'ครึ่งแรก / First Half';
      break;
    case '3': toggleMode(); break;
    case 'Enter': resetTimer(); break;
    case '9': toggleFullscreen(); break;
  }
});

updateScores();
