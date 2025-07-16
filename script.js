let scoreA = 0, scoreB = 0;
let timerInterval;
let startTime;
let totalElapsed = 0;
let running = false;
let inBreak = false;

let mode = 'up';
let countdownTarget = 0;
let remainingCountdown = 0;
let lastSecondPlayed = null;
let hasPlayedBuzzer = false;
let isPendingBreak = false;

const beepAudio = document.getElementById('beepAudio');
const buzzerAudio = document.getElementById('startAudio');
beepAudio.preload = 'auto';
buzzerAudio.preload = 'auto';

function stopAudio(audio) {
  audio.pause();
  audio.currentTime = 0;
  try { audio.load(); } catch (e) { }
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
    const limit = 3 * 60 * 1000;
    const timeLeft = limit - elapsed;

    if (elapsed >= limit) {
      elapsed = limit;
      clearInterval(timerInterval);
      running = false;
      document.getElementById('status').innerText = "⏰ ครบ 3 นาที!";
      document.getElementById('toggleStartPause').innerText = "▶ START";
      stopAudio(beepAudio);
      stopAudio(buzzerAudio);
      buzzerAudio.play();
    } else {
      const currentSecond = Math.floor(timeLeft / 1000);
      if (currentSecond <= 10 && currentSecond !== lastSecondPlayed && currentSecond > 0) {
        stopAudio(beepAudio);
        beepAudio.play();
        lastSecondPlayed = currentSecond;
      }
    }

    const minutes = String(Math.floor(elapsed / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((elapsed % 60000) / 1000)).padStart(2, '0');
    const tenths = String(Math.floor((elapsed % 1000) / 10)).padStart(2, '0');
    document.getElementById('timer').innerText = `${minutes}:${seconds}:${tenths}`;
  } else {
    remainingCountdown = countdownTarget - elapsed;

    if (remainingCountdown <= 0) {
      remainingCountdown = 0;
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
  if (inBreak) return;
  if (!running) startTimer();
  else pauseTimer();
}

function startTimer() {
  // ✅ รองรับกรณีเริ่มเบรกที่ค้างอยู่
  if (isPendingBreak) {
    isPendingBreak = false;
    inBreak = true;
    const breakTime = 60 * 1000;
    const breakStart = new Date().getTime();
    let lastBreakBeep = null;

    document.getElementById('status').innerText = "พักเบรก 1 นาที...";
    timerInterval = setInterval(() => {
      const now = new Date().getTime();
      const elapsed = now - breakStart;
      const remaining = breakTime - elapsed;

      if (remaining <= 0) {
        clearInterval(timerInterval);
        inBreak = false;
        document.getElementById('status').innerText = "หมดเวลาพัก!";
        document.getElementById('timer').innerText = "00:00:00";
        stopAudio(beepAudio);
        stopAudio(buzzerAudio);
        buzzerAudio.play();
        return;
      }

      const currentSecond = Math.floor(remaining / 1000);
      if (currentSecond <= 10 && currentSecond !== lastBreakBeep && currentSecond > 0) {
        stopAudio(beepAudio);
        beepAudio.play();
        lastBreakBeep = currentSecond;
      }

      const minutes = String(Math.floor(remaining / 60000)).padStart(2, '0');
      const seconds = String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0');
      const tenths = String(Math.floor((remaining % 1000) / 10)).padStart(2, '0');
      document.getElementById('timer').innerText = `${minutes}:${seconds}:${tenths}`;
    }, 10);

    return;
  }

  // ✅ เริ่มจับเวลาปกติ
  if (!running) {
    running = true;
    stopAudio(beepAudio);
    stopAudio(buzzerAudio);

    if (mode === 'up' && totalElapsed === 0) {
      buzzerAudio.play();
    } else if (mode === 'down' && remainingCountdown === countdownTarget) {
      buzzerAudio.play();
    }

    document.getElementById('status').innerText = "⏱ กำลังเล่น";
    document.getElementById('toggleStartPause').innerText = "⏸ PAUSE";
    startTime = new Date().getTime() - (mode === 'up' ? totalElapsed : countdownTarget - remainingCountdown);
    timerInterval = setInterval(updateTimer, 10);
  }
}

function pauseTimer() {
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

function resetTimer() {
  clearInterval(timerInterval);
  running = false;
  inBreak = false;
  isPendingBreak = false;

  // 🟡 รีเซตคะแนนทั้ง 2 ทีม
  scoreA = 0;
  scoreB = 0;
  updateScores();

  totalElapsed = 0;
  lastSecondPlayed = null;
  hasPlayedBuzzer = false;
  stopAudio(beepAudio);
  stopAudio(buzzerAudio);

  if (mode === 'up') {
    document.getElementById('timer').innerText = "00:00:00";
  } else {
    remainingCountdown = countdownTarget;
    const minutes = String(Math.floor(remainingCountdown / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((remainingCountdown % 60000) / 1000)).padStart(2, '0');
    document.getElementById('timer').innerText = `${minutes}:${seconds}:00`;
  }

  document.getElementById('status').innerText = "ระบบจับเวลา";
  document.getElementById('toggleStartPause').innerText = "▶ START";
}

function toggleMode() {
  if (!running && !inBreak) {
    mode = (mode === 'up') ? 'down' : 'up';
    document.getElementById('modeButton').innerText = `โหมด: ${mode === 'up' ? 'นับขึ้น' : 'ถอยหลัง'}`;
    document.getElementById('countdownSection').style.display = mode === 'down' ? 'flex' : 'none';

    if (mode === 'up') {
      countdownTarget = 0;
      remainingCountdown = 0;
    }

    resetTimer();

    if (mode === 'down') {
      setTimeout(() => document.getElementById('countdownInput').focus(), 100);
    }
  }
}

function setCountdown() {
  const inputField = document.getElementById('countdownInput');
  const input = inputField.value.trim();

  if (!/^[0-9]+$/.test(input) || parseInt(input) <= 0) {
    alert('กรุณาใส่นาที เช่น 3 หมายถึง 3 นาที');
    return;
  }

  const minutes = parseInt(input);
  countdownTarget = minutes * 60 * 1000;
  remainingCountdown = countdownTarget;
  lastSecondPlayed = null;
  hasPlayedBuzzer = false;

  const mm = String(minutes).padStart(2, '0');
  document.getElementById('timer').innerText = `${mm}:00:00`;

  inputField.blur();
}

function formatTimeInput(input) {
  input.value = input.value.replace(/[^0-9]/g, '').slice(0, 2);
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

function startBreak() {
  if (running || inBreak || isPendingBreak) return;

  isPendingBreak = true;
  document.getElementById('status').innerText = "พักเบรก 1 นาที";
  document.getElementById('toggleStartPause').innerText = "▶ START";
  document.getElementById('timer').innerText = "01:00:00";
}


document.addEventListener('keydown', (e) => {
  const activeElement = document.activeElement;
  if (activeElement.tagName === 'INPUT') {
    if (e.key === 'Enter' && activeElement.id === 'countdownInput') {
      setCountdown();
    }
    return;
  }

  switch (e.key) {
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
    case '.': resetTimer(); break;
    case '9': toggleFullscreen(); break;
    case '5': startBreak(); break;
  }
});



// 🟡 บันทึกคะแนน
let savedMatches = [];

function saveMatchStatsManual() {
  const date = new Date();
  const day = date.toLocaleDateString('th-TH');
  const time = date.toLocaleTimeString('th-TH');

  const teamA = document.getElementById('teamAName').value || 'ทีม A';
  const teamB = document.getElementById('teamBName').value || 'ทีม B';
  const modeText = mode === 'up' ? 'นับขึ้น' : 'ถอยหลัง';
  const duration = mode === 'up' ? Math.floor(totalElapsed / 1000) : Math.floor((countdownTarget - remainingCountdown) / 1000);
  const half = document.getElementById('halfLabel').innerText; // 🟡 เพิ่มข้อมูลครึ่ง

  const data = { day, time, teamA, scoreA, teamB, scoreB, modeText, duration, half };
  savedMatches.push(data);
  renderSavedMatches();
  showSavedPopup();
}

function renderSavedMatches() {
  const container = document.getElementById('savedStatsList');
  container.innerHTML = '';
  savedMatches.forEach((match, index) => {
    const div = document.createElement('div');
    div.className = 'saved-item';
    div.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong>${match.teamA}</strong> ${match.scoreA} - ${match.scoreB} <strong>${match.teamB}</strong>
          <br><small style="color: #666; font-size: 14px;">${match.half || 'ครึ่งแรก / First Half'}</small>
        </div>
        <button onclick="deleteSavedMatch(${index})" style="background: #e53935; color: white; border: none; border-radius: 4px; padding: 5px 8px; cursor: pointer; font-size: 12px;">🗑️</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function showSavedPopup() {
  const popup = document.getElementById('savedPopup');
  popup.classList.add('visible');
  setTimeout(() => popup.classList.remove('visible'), 3000);
}

function toggleSlidePanel() {
  document.getElementById('savedSlidePanel').classList.toggle('open');
}

function toggleStatsPopup() {
  const popup = document.getElementById('statsPopup');
  popup.classList.toggle('open');
}

function clearSavedStats() {
  savedMatches = [];
  renderSavedMatches();
}

function deleteSavedMatch(index) {
  if (confirm('คุณต้องการลบรายการนี้หรือไม่?')) {
    savedMatches.splice(index, 1);
    renderSavedMatches();
  }
}

updateScores();