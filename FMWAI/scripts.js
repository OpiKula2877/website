// Fake antivirus scan efekty
document.addEventListener('DOMContentLoaded', function() {
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  const virusCount = document.getElementById('virusCount');
  const urgentModal = document.getElementById('urgentModal');
  const countdownEl = document.getElementById('countdown');

  const scanPhases = [
    'Kontrola systémových souborů...',
    'Skenování registru...',
    'Analýza načtených programů...',
    'Detekce podezřelých aktivit...',
    'Kontrola síťových připojení...',
    'Kritické hrozby nalezeny!'
  ];

  // Animace progress baru - začíná na 67%
  progressFill.style.width = '67%';
  let progress = 67;
  let phaseIndex = 0;

  const progressInterval = setInterval(() => {
    progress += Math.random() * 8 + 2;
    
    if (progress >= 100) {
      progress = 100;
      clearInterval(progressInterval);
      progressText.textContent = scanPhases[5] + ' 100%';
      progressFill.style.width = '100%';
      return;
    }

    phaseIndex = Math.min(Math.floor(progress / 17), scanPhases.length - 2);
    progressFill.style.width = progress + '%';
    progressText.textContent = scanPhases[phaseIndex] + ' ' + Math.floor(progress) + '%';
  }, 800);

  // Rostoucí počet virů
  let count = parseInt(virusCount.textContent) || 247;
  const countInterval = setInterval(() => {
    count += Math.floor(Math.random() * 5) + 1;
    if (count >= 350) {
      count = 350;
      clearInterval(countInterval);
    }
    virusCount.textContent = count;
  }, 1200);

  // Urgentní modal - zobrazí se po 3 sekundách
  setTimeout(() => {
    urgentModal.style.display = 'flex';
  }, 3000);

  // Countdown timer v modalu
  let seconds = 5 * 60; // 5 minut
  const countdownInterval = setInterval(() => {
    seconds--;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    countdownEl.textContent = 
      (mins < 10 ? '0' : '') + mins + ':' + 
      (secs < 10 ? '0' : '') + secs;
    
    if (seconds <= 60) {
      countdownEl.style.color = '#c41e3a';
      countdownEl.style.animation = 'pulse 1s infinite';
    }
    if (seconds <= 0) clearInterval(countdownInterval);
  }, 1000);

  // Náhodné bliknutí varování
  const warnIcons = document.querySelectorAll('.warn-icon');
  setInterval(() => {
    warnIcons.forEach((icon, i) => {
      if (Math.random() > 0.7) {
        icon.style.transform = 'scale(1.2)';
        setTimeout(() => {
          icon.style.transform = 'scale(1)';
        }, 150);
      }
    });
  }, 500);

  // Zavření modalu při kliknutí mimo
  urgentModal.addEventListener('click', function(e) {
    if (e.target === urgentModal) {
      urgentModal.style.display = 'none';
    }
  });
});
