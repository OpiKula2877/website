// ====== Elementy ======
const formScreen = document.getElementById('form-screen');
const loadingScreen = document.getElementById('loading-screen');

const fotoInput = document.getElementById('foto');
const photoPreview = document.getElementById('photo-preview');
const counterEl = document.getElementById('counter');
const statusMain = document.getElementById('status-main');
const statusSub = document.getElementById('status-sub');

// ====== STATICKÁ FOTKA VÝSLEDKU ======
const STATIC_MATCH_PHOTO = 'twin.png';

let uploadedPhotoData = null;

// ====== Náhled fotky (jen pro uživatele ve formuláři) ======
fotoInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    uploadedPhotoData = ev.target.result;
    photoPreview.innerHTML = `<img src="${uploadedPhotoData}" alt="náhled">`;
  };
  reader.readAsDataURL(file);
});

// ====== Hlášky během hledání ======
const messages = [
  { main: "Hledám dvojče...", sub: "Procházím globální databázi obličejů (a tvoji mámu omylem)" },
  { main: "Analyzuji rysy obličeje...", sub: "Tvůj nos právě prochází bezpečnostní kontrolou" },
  { main: "Vybírám z několika možností...", sub: "Nalezeno 14 potenciálních shod, 3 z nich jsou tvoje selfie" },
  { main: "Porovnávám koníčky a zájmy...", sub: "Kontroluji, kdo další má rád ležení na gauči" },
  { main: "Kontroluji geografickou blízkost...", sub: "Možná žije přes ulici, možná na jiném kontinentu, kdo ví" },
  { main: "Počítám procentuální shodu...", sub: "Algoritmus DvojčeMatch™ se právě hádá s kávovarem" },
  { main: "Téměř hotovo...", sub: "Žehlím poslední pixely k naprosté dokonalosti" },
];

// ====== Odpočítávadlo ======
const COUNT_START = 2451458;
const COUNT_END = 1;
const TOTAL_DURATION = 19500;

function animateCountdown() {
  const countdownStart = performance.now();

  function frame(now) {
    const elapsed = now - countdownStart;
    let t = Math.min(elapsed / TOTAL_DURATION, 1);
    const eased = 1 - Math.pow(1 - t, 4);
    const value = Math.round(COUNT_START - eased * (COUNT_START - COUNT_END));
    counterEl.textContent = value.toLocaleString('cs-CZ').replace(/,/g, ' ');

    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      counterEl.textContent = COUNT_END.toLocaleString('cs-CZ');
    }
  }
  requestAnimationFrame(frame);
}

// ====== Cyklování hlášek ======
let messageTimers = [];

function startMessages() {
  const interval = 20000 / messages.length;
  messages.forEach((msg, i) => {
    const timer = setTimeout(() => {
      statusMain.textContent = msg.main;
      statusSub.textContent = msg.sub;
    }, i * interval);
    messageTimers.push(timer);
  });
}

function clearMessages() {
  messageTimers.forEach(t => clearTimeout(t));
  messageTimers = [];
}

// ====== Vygenerování HTML pro výsledkové okno ======
function buildResultHTML(data) {
  return `<!DOCTYPE html>
<html lang="cs">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Tvé dvojče bylo nalezeno!</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; }
  body {
    background: #e8e8e8;
    color: #1a1a1a;
    display: flex;
    justify-content: center;
    padding: 20px;
  }
  .app {
    width: 100%;
    max-width: 600px;
    background: #ffffff;
    border: 1px solid #cccccc;
    border-radius: 6px;
    overflow: hidden;
    padding: 20px;
  }
  .result-screen { text-align: center; }
  .result-screen h2 { font-size: 20px; margin-bottom: 16px; }
  .match-photo {
    width: 120px; height: 120px; border-radius: 50%;
    object-fit: cover; border: 1px solid #cccccc; margin-bottom: 12px;
  }
  .match-percent { font-size: 28px; font-weight: bold; }
  .match-label { font-size: 13px; color: #666666; margin-bottom: 16px; }
  .match-info {
    text-align: left; background: #f5f5f5; border: 1px solid #dddddd;
    border-radius: 4px; padding: 14px; font-size: 14px; line-height: 1.6;
  }
</style>
</head>
<body>
<div class="app">
  <div class="result-screen">
    <h2>Tvé dvojče bylo nalezeno!</h2>
    <img class="match-photo" src="${STATIC_MATCH_PHOTO}" alt="Dvojče">
    <div class="match-percent">99.67%</div>
    <div class="match-label">shoda</div>
  </div>
</div>
</body>
</html>`;
}

// ====== Submit formuláře ======
formScreen.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!uploadedPhotoData) {
    alert('Prosím nahraj fotku obličeje.');
    return;
  }

  const data = {
    jmeno: document.getElementById('jmeno').value,
    vek: document.getElementById('vek').value,
    stat: document.getElementById('stat').value,
    mesto: document.getElementById('mesto').value,
    koniky: document.getElementById('koniky').value,
  };

  formScreen.classList.add('hidden');
  loadingScreen.classList.remove('hidden');

  counterEl.textContent = COUNT_START.toLocaleString('cs-CZ').replace(/,/g, ' ');
  statusMain.textContent = messages[0].main;
  statusSub.textContent = messages[0].sub;

  animateCountdown();
  startMessages();

  setTimeout(() => {
    clearMessages();
    loadingScreen.classList.add('hidden');
    formScreen.classList.remove('hidden');
    formScreen.reset();
    photoPreview.innerHTML = '';
    uploadedPhotoData = null;

    // Otevře výsledek v novém okně
    const resultWindow = window.open('', '_blank');
    resultWindow.document.write(buildResultHTML(data));
    resultWindow.document.close();
  }, 20000);
});

// ====== Service Worker registrace ======
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(err => {
      console.log('SW registrace selhala:', err);
    });
  });
}