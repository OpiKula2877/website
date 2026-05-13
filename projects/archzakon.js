// ---- PROGRESS BAR ----
window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  document.getElementById('progress-bar').style.width = (scrollTop / docHeight * 100) + '%';
});

// ---- SCROLL REVEAL ----
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ---- XP SYSTEM ----
let xp = 0;
function addXP(amount) {
  xp += amount;
  document.getElementById('xp').textContent = xp;
  // mini burst
  const burst = document.createElement('div');
  burst.className = 'burst';
  burst.style.cssText = `right:1.5rem;bottom:4rem;font-family:Bangers,cursive;font-size:1.5rem;color:#39FF14;`;
  burst.textContent = '+' + amount + ' BUB!';
  document.body.appendChild(burst);
  burst.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-60px)'}],{duration:900,fill:'forwards'})
    .onfinish = () => burst.remove();
}

// ---- SIMULATOR ----
const rhoEl = document.getElementById('rho');
const volEl = document.getElementById('vol');
const massEl = document.getElementById('mass');
const simOutputIds = ['v-rho', 'v-vol', 'v-mass', 'r-fa', 'r-g', 'r-diff', 'tank-obj', 'r-verdict'];
const hasSimulatorMarkup = Boolean(rhoEl && volEl && massEl)
  && simOutputIds.every(id => document.getElementById(id));

function updateSim() {
  const rho = parseFloat(rhoEl.value);
  const vol = parseFloat(volEl.value);
  const mass = parseFloat(massEl.value);
  const g = 10;
  const FA = rho * vol * g;
  const G = mass * g;
  const diff = FA - G;

  document.getElementById('v-rho').textContent = rho;
  document.getElementById('v-vol').textContent = vol.toFixed(4);
  document.getElementById('v-mass').textContent = mass.toFixed(2);
  document.getElementById('r-fa').textContent = FA.toFixed(2);
  document.getElementById('r-g').textContent = G.toFixed(2);
  document.getElementById('r-diff').textContent = diff.toFixed(2);

  const obj = document.getElementById('tank-obj');
  const verdict = document.getElementById('r-verdict');
  if (diff > 0.01) {
    verdict.innerHTML = 'PLAVE. Vztlaková síla je větší než tíha.';
    verdict.style.color = 'var(--green)';
    obj.style.top = '20px';
    obj.textContent = 'PL';
  } else if (diff < -0.01) {
    verdict.innerHTML = 'KLESÁ. Tíha je větší než vztlaková síla.';
    verdict.style.color = 'var(--pink)';
    obj.style.top = '120px';
    obj.textContent = 'KL';
  } else {
    verdict.innerHTML = 'ROVNOVÁHA. Vztlaková síla se rovná tíze.';
    verdict.style.color = 'var(--yellow)';
    obj.style.top = '70px';
    obj.textContent = 'RV';
  }
}

if (hasSimulatorMarkup) {
  [rhoEl, volEl, massEl].forEach(el => el.addEventListener('input', updateSim));
  updateSim();
}

// ---- QUIZ DATA ----
const quizData = [
  {
    q: "Těleso má hmotnost 100 g a objem 120 cm³. Co se stane po ponoření do vody?",
    opts: [
      "Klesne ke dnu",
      "Plave, protože jeho hustota je menší než hustota vody",
      "Bude levitovat nad hladinou jak zalagované NPC",
      "Nelze rozhodnout bez hodnoty tíhového zrychlení"
    ],
    correct: 1,
    explanation: "Hustota tělesa je přibližně 833 kg/m³, což je méně než hustota vody 1000 kg/m³. Těleso proto plave."
  },
  {
    q: "Který vztah vyjadřuje Archimédův zákon pro vztlakovou sílu?",
    opts: [
      "F = m · a",
      "F = ρ · V · g",
      "E = mc²",
      "F = vibe · rizz · aura"
    ],
    correct: 1,
    explanation: "Vztlaková síla je dána hustotou kapaliny, objemem ponořené části tělesa a tíhovým zrychlením: F<sub>A</sub> = ρ · V · g."
  },
  {
    q: "Ve které kapalině bude na stejné těleso působit největší vztlaková síla?",
    opts: [
      "Čistá voda (1000 kg/m³)",
      "Slané moře (1025 kg/m³)",
      "Energeťák z automatu (99999 kg/m³)",
      "Rtuť (13600 kg/m³)"
    ],
    correct: 3,
    explanation: "Při stejném ponořeném objemu je vztlaková síla přímo úměrná hustotě kapaliny. Největší hustotu má rtuť."
  },
  {
    q: "Proč kovový klíč ve vodě obvykle klesne ke dnu?",
    opts: [
      "Protože je příliš malý",
      "Protože klíče nemají premium plavecký pass",
      "Protože hustota kovu je výrazně větší než hustota vody",
      "Protože tlak vody na dně je vyšší"
    ],
    correct: 2,
    explanation: "Hustota kovu je obvykle vyšší než hustota vody, proto je tíha tělesa větší než vztlaková síla a těleso klesá."
  },
  {
    q: "Proč plave ocelová loď, i když je ocel hustší než voda?",
    opts: [
      "Protože má hladký povrch",
      "Protože má lodní plot armor a fyzika ji nerfne",
      "Protože je dutá a její průměrná hustota je menší než hustota vody",
      "Protože mořská voda nevyvíjí tlak na dno lodi"
    ],
    correct: 2,
    explanation: "Rozhodující je průměrná hustota celé lodi (ocel + vzduch uvnitř). Je-li menší než hustota vody, loď plave."
  },
  {
    q: "Co se stane s horkovzdušným balónem po zahřátí vzduchu uvnitř?",
    opts: [
      "Balón dá rage quit a instantně spadne",
      "Vzduch uvnitř zhoustne a balón klesá",
      "Vzduch uvnitř má menší hustotu, proto se balón zvedá",
      "Nastane rovnováha bez vlivu hustoty"
    ],
    correct: 2,
    explanation: "Po zahřátí má vzduch uvnitř nižší hustotu než okolní vzduch, výsledná vztlaková síla je větší a balón stoupá."
  },
  {
    q: "Jednotka vztlakové síly v soustavě SI je:",
    opts: [
      "kg",
      "N",
      "Pa",
      "XP"
    ],
    correct: 1,
    explanation: "Vztlaková síla je síla, její jednotkou je newton (N)."
  },
  {
    q: "Jestliže je vztlaková síla stejně velká jako tíha tělesa, těleso:",
    opts: [
      "zrychleně klesá",
      "zrychleně stoupá",
      "je v rovnováze",
      "zapne idle animaci a čeká na další round"
    ],
    correct: 2,
    explanation: "Při rovnosti F<sub>A</sub> a G je výsledná síla nulová, těleso je v rovnováze."
  },
  {
    q: "Co označuje ve vzorci F<sub>A</sub> = ρ · V · g veličina V?",
    opts: [
      "celkový objem nádoby",
      "objem celé kapaliny",
      "objem ponořené části tělesa",
      "vibe objem podle nálady experimentu"
    ],
    correct: 2,
    explanation: "Do výpočtu vstupuje objem kapaliny vytlačené tělesem, tedy objem ponořené části tělesa."
  },
  {
    q: "Těleso o hustotě 1200 kg/m³ ponoříme do vody (1000 kg/m³). Co nastane?",
    opts: [
      "Těleso bude plavat",
      "Těleso bude v rovnováze",
      "Těleso klesne ke dnu",
      "Počká si na update fyziky 1.1"
    ],
    correct: 2,
    explanation: "Je-li hustota tělesa větší než hustota kapaliny, těleso klesá."
  },
  {
    q: "Při přechodu z čisté vody do slané vody se člověk obvykle:",
    opts: [
      "více ponoří",
      "méně ponoří",
      "ponoří stejně, hustota nehraje roli",
      "dostane vodní buff a začne levitovat"
    ],
    correct: 1,
    explanation: "Slaná voda má vyšší hustotu než čistá voda, proto je vztlaková síla větší a člověk se méně ponoří."
  },
  {
    q: "Na čem závisí velikost vztlakové síly u zcela ponořeného tělesa?",
    opts: [
      "jen na hmotnosti tělesa",
      "na hustotě kapaliny a objemu vytlačené kapaliny",
      "jen na hloubce ponoření",
      "na tom, jestli má těleso hlavní postavu"
    ],
    correct: 1,
    explanation: "Podle Archimédova zákona závisí na hustotě kapaliny, objemu vytlačené kapaliny a tíhovém zrychlení."
  },
  {
    q: "Jak se změní vztlaková síla, když zdvojnásobíme objem ponořené části tělesa?",
    opts: [
      "zmenší se na polovinu",
      "zůstane stejná",
      "zdvojnásobí se",
      "dá random crit a vyletí na max"
    ],
    correct: 2,
    explanation: "Ze vztahu F<sub>A</sub> = ρ · V · g plyne, že vztlaková síla je přímo úměrná objemu V."
  },
  {
    q: "Těleso plave na hladině. Které tvrzení je správné?",
    opts: [
      "F<sub>A</sub> je menší než G",
      "F<sub>A</sub> je větší nebo rovna G",
      "F<sub>A</sub> je vždy nulová",
      "G se mění podle moodu oceánu"
    ],
    correct: 1,
    explanation: "Pro plování nebo rovnováhu musí vztlaková síla vyrovnat nebo převýšit tíhu tělesa."
  },
  {
    q: "Který vztah používáme pro výpočet tíhy tělesa?",
    opts: [
      "G = m · g",
      "G = ρ · V",
      "G = p · S",
      "G = sigma · aura"
    ],
    correct: 0,
    explanation: "Tíha tělesa je síla působící gravitací, platí G = m · g."
  },
  {
    q: "Pokud těleso v kapalině ani neklesá, ani nestoupá, platí:",
    opts: [
      "F<sub>A</sub> > G",
      "F<sub>A</sub> < G",
      "F<sub>A</sub> = G",
      "fyzika jde AFK a nic neřeší"
    ],
    correct: 2,
    explanation: "Bez zrychlení ve svislém směru je výsledná síla nulová, tedy F<sub>A</sub> = G."
  },
  {
    q: "Proč je obvykle jednodušší plavat v Mrtvém moři než v bazénu se sladkou vodou?",
    opts: [
      "Mrtvé moře má nižší hustotu",
      "Mrtvé moře má vyšší hustotu kvůli soli",
      "V Mrtvém moři je menší gravitace",
      "Mrtvé moře má permanentní plavecký boost"
    ],
    correct: 1,
    explanation: "Vyšší obsah soli zvyšuje hustotu vody, a tím i vztlakovou sílu působící na tělo."
  }
];

let currentQuizState = quizData.map(() => ({ answered: false, correct: false }));

function renderQuiz() {
  const container = document.getElementById('quiz-container');
  container.innerHTML = '';
  quizData.forEach((q, qi) => {
    const box = document.createElement('div');
    box.className = 'quiz-box';
    box.innerHTML = `
      <h3>Otázka ${qi + 1} / ${quizData.length}</h3>
      <p class="quiz-question">${q.q}</p>
      <div class="quiz-options">
        ${q.opts.map((opt, oi) => `
          <button class="quiz-btn ${currentQuizState[qi].answered ? (oi === q.correct ? 'correct' : (currentQuizState[qi].chosen === oi ? 'wrong' : '')) : ''}"
            onclick="answerQuiz(${qi}, ${oi})"
            ${currentQuizState[qi].answered ? 'disabled' : ''}>
            ${opt}
          </button>
        `).join('')}
      </div>
      <div class="quiz-result" id="qr-${qi}">
        ${currentQuizState[qi].answered ? (currentQuizState[qi].correct
          ? `Správně! +50 BUB <br><small style="color:#aaa">${q.explanation}</small>`
          : `Špatně! <br><small style="color:#aaa">${q.explanation}</small>`) : ''}
      </div>`;
    container.appendChild(box);
  });
}

function answerQuiz(qi, chosen) {
  if (currentQuizState[qi].answered) return;
  const q = quizData[qi];
  const isCorrect = chosen === q.correct;
  currentQuizState[qi] = { answered: true, correct: isCorrect, chosen };
  renderQuiz();
  if (isCorrect) addXP(50);
  else addXP(5);
}

function restartQuiz() {
  currentQuizState = quizData.map(() => ({ answered: false, correct: false }));
  renderQuiz();
}

renderQuiz();

// ---- EASTER EGG ----
let konamiSeq = [];
const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
document.addEventListener('keydown', e => {
  konamiSeq.push(e.key);
  konamiSeq = konamiSeq.slice(-10);
  if (JSON.stringify(konamiSeq) === JSON.stringify(konamiCode)) {
    alert("Skrytý bonus aktivován: +100 BUB.");
    addXP(100);
  }
});