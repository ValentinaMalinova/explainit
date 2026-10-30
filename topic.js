'use strict';

(() => {
  const $ = (selector) => document.querySelector(selector);
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const params = new URLSearchParams(window.location.search);
  const topicParam = params.get('topic') || 'space';
  const topic = ['space', 'earth', 'tech'].includes(topicParam) ? topicParam : 'space';

  const info = {
    space: {
      title: 'Тайните на <span class="accent">Вселената.</span>',
      titleText: 'Тайните на Вселената.',
      intro: 'Изстреляй планета, настрой гравитацията и открий как една малка промяна може да промени цялата ѝ орбита.',
      category: 'КОСМОС', difficulty: 'НИВО 01 · ОРБИТАЛЕН ПИЛОТ', scene: 'ОРБИТАЛЕН СИМУЛАТОР', coord: 'SECTOR 001 · MILKY WAY',
      hint: 'Настрой параметрите и стартирай', caption: 'Една малка промяна може да промени всичко.',
      controlIntro: 'Промени гравитацията и скоростта при старта. Можеш ли да задържиш планетата в стабилна орбита?',
      missionTitle: 'Задръж планетата в орбита', missionText: 'Настрой гравитацията и скоростта. Успей да поддържаш стабилна орбита поне за една обиколка.',
      insightTitle: 'Орбитата е постоянно падане.', insightText: 'Планетата непрекъснато е привлечена от звездата, но движението ѝ напред я кара постоянно да я „пропуска“. Това създава орбита.',
      insightNumber: '01',
    },
    earth: {
      title: 'Нашата жива <span class="accent">планета.</span>',
      titleText: 'Нашата жива планета.',
      intro: 'Погледни под повърхността. Натрупвай налягане, променяй количеството газове и тествай условията в учебния модел на вулкан.',
      category: 'ЗЕМЯ', difficulty: 'НИВО 01 · ГЕОЛОГ', scene: 'ВУЛКАНИЧЕН СИМУЛАТОР', coord: 'EARTH LAB · MAGMA CHAMBER',
      hint: 'Настрой налягането и газовете', caption: 'Под повърхността се натрупва енергия.',
      controlIntro: 'Влияй на налягането и газовете в опростения модел. Когато условията са подходящи, можеш да задействаш изригване.',
      missionTitle: 'Задействай изригване', missionText: 'Увеличи налягането и натрупването на газове. След това натисни „Симулирай изригване“ и наблюдавай резултата.',
      insightTitle: 'Под земята се натрупва налягане.', insightText: 'Магмата и разтворените в нея газове участват в процесите, които могат да доведат до изригване. Истинските вулкани са много по-сложни от този учебен модел.',
      insightNumber: '02',
    },
    tech: {
      title: 'Технологии <span class="accent">около нас.</span>',
      titleText: 'Технологии около нас.',
      intro: 'Построй собствен Wi-Fi експеримент. Отдалечавай устройството, добавяй стени и сравни как различните честоти влияят на сигнала.',
      category: 'ТЕХНОЛОГИИ', difficulty: 'НИВО 01 · МРЕЖОВИ ИЗСЛЕДОВАТЕЛ', scene: 'WI-FI SIGNAL LAB', coord: 'LOCAL NETWORK · RF SIGNAL',
      hint: 'Промени разстоянието и препятствията', caption: 'Радиовълните са невидими. Ефектът им — не.',
      controlIntro: 'Променяй разстоянието, препятствията и честотата. Накрая сканирай, за да провериш качеството на сигнала в модела.',
      missionTitle: 'Открий силен сигнал', missionText: 'Настрой модела така, че сигналът да достигне поне 65%, след което натисни „Сканирай сигнала“.',
      insightTitle: 'Невидим сигнал. Видими компромиси.', insightText: 'Стените и разстоянието могат да отслабят радиосигнала. Обикновено 2.4 GHz достига по-добре през препятствия, а 5 GHz може да осигури по-висока скорост при подходящи условия.',
      insightNumber: '03',
    },
  }[topic];

  document.body.dataset.topic = topic;
  document.title = `${info.titleText} — Интерактивна лаборатория | ExplainIt`;
  $('#topicTitle').innerHTML = info.title;
  $('#topicIntro').textContent = info.intro;
  $('#topicCategory').textContent = info.category;
  $('#topicDifficulty').textContent = info.difficulty;
  $('#sceneLabel').textContent = info.scene;
  $('#coordinateLabel').textContent = info.coord;
  $('#sceneHint').textContent = info.hint;
  $('#sceneCaption').textContent = info.caption;
  $('#controlIntro').textContent = info.controlIntro;
  $('#missionTitle').textContent = info.missionTitle;
  $('#missionText').textContent = info.missionText;
  $('#insightTitle').textContent = info.insightTitle;
  $('#insightText').textContent = info.insightText;
  $('#insightNumber').innerHTML = `${info.insightNumber}<span>/03</span>`;
  $('#year').textContent = new Date().getFullYear();
  $(`#${topic}Controls`).hidden = false;

  // Shared theme controls.
  const themeButton = $('#themeButton');
  try {
    if (localStorage.getItem('explainit-theme') === 'light') document.documentElement.classList.add('light');
  } catch (_) { /* Local files may not allow storage. */ }
  function updateThemeButton() {
    const light = document.documentElement.classList.contains('light');
    themeButton.textContent = light ? '☀' : '☾';
    themeButton.setAttribute('aria-label', light ? 'Включи тъмната тема' : 'Включи светлата тема');
  }
  updateThemeButton();
  themeButton.addEventListener('click', () => {
    document.documentElement.classList.toggle('light');
    const light = document.documentElement.classList.contains('light');
    updateThemeButton();
    try { localStorage.setItem('explainit-theme', light ? 'light' : 'dark'); } catch (_) { /* Theme still changes. */ }
  });

  // Achievements are saved locally on this device; the page works without an account.
  const completedKey = 'explainit-lab-completed';
  function readCompleted() {
    try {
      const parsed = JSON.parse(localStorage.getItem(completedKey) || '[]');
      return new Set(Array.isArray(parsed) ? parsed.filter((item) => ['space', 'earth', 'tech'].includes(item)) : []);
    } catch (_) { return new Set(); }
  }
  const completed = readCompleted();
  function updateOverallProgress() {
    const count = completed.size;
    $('#completedCount').textContent = String(count);
    $('#overallProgressFill').style.width = `${count / 3 * 100}%`;
    $('#overallProgressLabel').textContent = count === 3 ? 'Лабораторията е завършена. Страхотна работа!' : count === 0 ? 'Първата мисия те чака.' : `Още ${3 - count} ${3 - count === 1 ? 'мисия' : 'мисии'} до пълния комплект.`;
  }
  updateOverallProgress();

  const toast = $('#toast');
  let toastTimer = 0;
  function showToast(message) {
    $('#toastText').textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2800);
  }
  function celebrate() {
    const layer = $('#celebrationLayer');
    layer.replaceChildren();
    for (let i = 0; i < 40; i += 1) {
      const bit = document.createElement('span');
      bit.className = 'confetti-bit';
      bit.style.left = `${Math.random() * 100}%`;
      bit.style.animationDelay = `${Math.random() * 0.45}s`;
      bit.style.animationDuration = `${1.4 + Math.random() * 1.3}s`;
      bit.style.setProperty('--drift', `${Math.round(Math.random() * 150 - 75)}px`);
      if (i % 4 === 0) bit.style.width = '4px';
      if (i % 3 === 0) bit.style.height = '7px';
      layer.appendChild(bit);
    }
    window.setTimeout(() => layer.replaceChildren(), 3000);
  }
  let missionComplete = completed.has(topic);
  function setMissionProgress(value, label) {
    const safeValue = clamp(value, 0, 100);
    $('#missionProgress').style.width = `${safeValue}%`;
    $('#missionProgressLabel').textContent = label || `${Math.round(safeValue)}% завършено`;
  }
  function completeMission(message) {
    if (missionComplete) {
      setMissionProgress(100, '100% завършено');
      return;
    }
    missionComplete = true;
    completed.add(topic);
    try { localStorage.setItem(completedKey, JSON.stringify([...completed])); } catch (_) { /* Keep the current session working. */ }
    $('#missionStatus').textContent = '✓ ИЗПЪЛНЕНО';
    $('#missionIcon').textContent = '✓';
    $('.mission-card').classList.add('completed');
    setMissionProgress(100, '100% завършено');
    updateOverallProgress();
    celebrate();
    showToast(message || 'Мисията е завършена! Страхотна работа.');
  }
  if (missionComplete) {
    $('#missionStatus').textContent = '✓ ИЗПЪЛНЕНО';
    $('#missionIcon').textContent = '✓';
    $('.mission-card').classList.add('completed');
    setMissionProgress(100, '100% завършено');
  } else {
    setMissionProgress(0, '0% завършено');
  }

  const canvas = $('#sceneCanvas');
  const ctx = canvas.getContext('2d');
  let W = 1, H = 1, dpr = 1, stars = [], lastFrame = 0;
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    W = Math.max(1, rect.width);
    H = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = Array.from({ length: Math.round(W * H / 3900) }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.35 + 0.2,
      alpha: Math.random() * 0.6 + 0.15,
      phase: Math.random() * Math.PI * 2,
    }));
    if (topic === 'space' && (!spaceState.initialized || (!spaceState.running && spaceState.elapsed === 0 && spaceState.trail.length === 0))) initSpace();
    if (topic === 'earth') earthState.particles.length = 0;
  }
  window.addEventListener('resize', resizeCanvas, { passive: true });

  function roundRect(context, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + width, y, x + width, y + height, r);
    context.arcTo(x + width, y + height, x, y + height, r);
    context.arcTo(x, y + height, x, y, r);
    context.arcTo(x, y, x + width, y, r);
    context.closePath();
  }
  function drawStars(time, color = '#e9f5dc') {
    for (const star of stars) {
      const alpha = star.alpha * (0.76 + Math.sin(time * 1.5 + star.phase) * 0.24);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  function drawGlow(x, y, radius, inner, outer) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, inner);
    gradient.addColorStop(1, outer);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  const formatTime = (seconds) => {
    const s = Math.max(0, Math.floor(seconds));
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  };
  function setMetric(index, label, valueHTML) {
    $(`#metricLabel${index}`).textContent = label;
    $(`#metricValue${index}`).innerHTML = valueHTML;
  }
  function setLive(text) { $('#liveLabel').textContent = text; }
  function setCaption(text) { $('#sceneCaption').textContent = text; }
  function setConsole(text) { $('#consoleFootText').textContent = text; }
  function updateRangeFill(input) {
    const min = Number(input.min || 0), max = Number(input.max || 100), value = Number(input.value);
    const percentage = ((value - min) / (max - min)) * 100;
    input.style.setProperty('--fill', `${percentage}%`);
  }
  document.querySelectorAll('.lab-range').forEach(updateRangeFill);
  document.querySelectorAll('.lab-range').forEach((input) => input.addEventListener('input', () => updateRangeFill(input)));

  // SPACE: a small Newton-style gravity simulation with a trail and an orbit challenge.
  const spaceState = { initialized: false, x: 0, y: 0, vx: 0, vy: 0, running: false, failed: false, elapsed: 0, stableTime: 0, traveled: 0, lastAngle: 0, trail: [], g: 50, speed: 100, mu: 700000, startRadius: 100 };
  let spaceMessage = 'Настрой параметрите и стартирай.';
  function spaceMu() { return 700000 * (spaceState.g / 50); }
  function initSpace() {
    const radius = Math.min(W, H) * 0.29;
    const cx = W / 2, cy = H * 0.51;
    spaceState.startRadius = radius;
    spaceState.x = radius;
    spaceState.y = 0;
    spaceState.mu = spaceMu();
    const v = Math.sqrt(spaceState.mu / radius) * (spaceState.speed / 100);
    spaceState.vx = 0;
    spaceState.vy = v;
    spaceState.running = false;
    spaceState.failed = false;
    spaceState.elapsed = 0;
    spaceState.stableTime = 0;
    spaceState.traveled = 0;
    spaceState.lastAngle = 0;
    spaceState.trail = [];
    spaceState.initialized = true;
    setMetric('A', 'ГРАВИТАЦИЯ', `${spaceState.g}<span>%</span>`);
    setMetric('B', 'СКОРОСТ ПРИ СТАРТА', `${spaceState.speed}<span>%</span>`);
    setMetric('C', 'ВРЕМЕ В ОРБИТА', '00:00');
  }
  function updateSpaceInputs() {
    spaceState.g = Number($('#gravityRange').value);
    spaceState.speed = Number($('#speedRange').value);
    $('#gravityValue').textContent = `${spaceState.g}%`;
    $('#speedValue').textContent = `${spaceState.speed}%`;
    setMetric('A', 'ГРАВИТАЦИЯ', `${spaceState.g}<span>%</span>`);
    setMetric('B', 'СКОРОСТ ПРИ СТАРТА', `${spaceState.speed}<span>%</span>`);
    const currentMu = spaceMu();
    const radius = Math.max(1, Math.hypot(spaceState.x, spaceState.y));
    const circular = Math.sqrt(currentMu / radius);
    const liveSpeed = Math.hypot(spaceState.vx, spaceState.vy);
    const ratio = circular > 0 ? liveSpeed / circular : 0;
    if ($('#orbitLiveSpeed')) {
      $('#orbitLiveSpeed').textContent = `${Math.round(liveSpeed)} px/s`;
      $('#orbitDistance').textContent = `${Math.round(radius)} px`;
      $('#orbitRiskBar').style.width = `${clamp(ratio / 1.6 * 100, 4, 100)}%`;
      $('#orbitRiskBar').style.background = ratio < .72 || ratio > 1.32 ? '#ff9867' : 'var(--accent)';
      $('#orbitDiagnosticState').textContent = !spaceState.running && spaceState.elapsed === 0 ? 'STANDBY' : !spaceState.running && spaceState.failed ? 'UNSTABLE' : ratio < .72 || ratio > 1.32 ? 'RISK DETECTED' : 'TRACKING';
      $('#orbitDiagnosticNote').textContent = !spaceState.running && spaceState.elapsed === 0 ? 'Данните ще се обновяват в реално време след старта.' : ratio < .72 ? 'Скоростта е ниска спрямо гравитацията.' : ratio > 1.32 ? 'Скоростта е висока — следи дали планетата ще избяга.' : 'Съотношението изглежда подходящо. Следи траекторията.';
    }
    if (spaceState.running && circular > 0 && liveSpeed / circular > 1.45) setCaption('Планетата се движи много бързо — наблюдавай дали ще избяга.');
    else if (spaceState.running && circular > 0 && liveSpeed / circular < 0.67) setCaption('Гравитацията надделява — планетата може да падне навътре.');
    else if (!spaceState.running) setCaption('Готов ли си? Стартирай орбитата и наблюдавай движението.');
  }
  function updateSpaceDiagnostics() {
    if (!$('#orbitLiveSpeed')) return;
    const radius = Math.max(1, Math.hypot(spaceState.x, spaceState.y));
    const liveSpeed = Math.hypot(spaceState.vx, spaceState.vy);
    const circular = Math.sqrt(spaceMu() / radius);
    const ratio = circular > 0 ? liveSpeed / circular : 0;
    $('#orbitLiveSpeed').textContent = `${Math.round(liveSpeed)} px/s`;
    $('#orbitDistance').textContent = `${Math.round(radius)} px`;
    $('#orbitRiskBar').style.width = `${clamp(ratio / 1.6 * 100, 4, 100)}%`;
    $('#orbitRiskBar').style.background = ratio < .72 || ratio > 1.32 ? '#ff9867' : 'var(--accent)';
    $('#orbitDiagnosticState').textContent = !spaceState.running && spaceState.elapsed === 0 ? 'STANDBY' : !spaceState.running && spaceState.failed ? 'UNSTABLE' : ratio < .72 || ratio > 1.32 ? 'RISK DETECTED' : 'TRACKING';
    $('#orbitDiagnosticNote').textContent = !spaceState.running && spaceState.elapsed === 0 ? 'Данните ще се обновяват в реално време след старта.' : ratio < .72 ? 'Скоростта е ниска спрямо гравитацията.' : ratio > 1.32 ? 'Скоростта е висока — следи дали планетата ще избяга.' : 'Съотношението изглежда подходящо. Следи траекторията.';
  }
  const gravityRange = $('#gravityRange');
  if (gravityRange) {
    gravityRange.addEventListener('input', updateSpaceInputs);
    $('#speedRange').addEventListener('input', updateSpaceInputs);
    $('#launchButton').addEventListener('click', () => {
      if (spaceState.running) {
        spaceState.running = false;
        $('#launchButton').innerHTML = '<span class="button-symbol">▶</span> Продължи орбитата';
        setLive('SIMULATION PAUSED');
        setConsole('СИМУЛАЦИЯТА Е НА ПАУЗА');
        return;
      }
      if (spaceState.failed || !spaceState.initialized) initSpace();
      if (spaceState.elapsed === 0 && spaceState.trail.length === 0) {
        const radius = Math.min(W, H) * 0.29;
        spaceState.startRadius = radius;
        const v = Math.sqrt(spaceMu() / radius) * (spaceState.speed / 100);
        spaceState.x = radius;
        spaceState.y = 0;
        spaceState.vx = 0;
        spaceState.vy = v;
        spaceState.lastAngle = 0;
      }
      spaceState.running = true;
      spaceState.failed = false;
      $('#launchButton').innerHTML = '<span class="button-symbol">Ⅱ</span> Пауза';
      setLive('SIMULATION RUNNING');
      setConsole('ОРБИТАЛЕН ДВИГАТЕЛ АКТИВЕН');
      setCaption('Следи планетата. Можеш ли да запазиш орбитата?');
      showToast('Симулацията стартира. Следи движението на планетата.');
    });
    $('#resetSpaceButton').addEventListener('click', () => {
      initSpace();
      $('#launchButton').innerHTML = '<span class="button-symbol">▶</span> Стартирай орбитата';
      setLive('READY TO EXPLORE'); setConsole('СИСТЕМАТА Е ГОТОВА');
      if (!missionComplete) setMissionProgress(0, '0% завършено');
      showToast('Орбитата е нулирана. Пробвай друга комбинация.');
    });
  }
  function updateSpace(dt) {
    if (spaceState.running) {
      const mu = spaceMu();
      const r = Math.max(8, Math.hypot(spaceState.x, spaceState.y));
      const accel = mu / (r * r * r);
      spaceState.vx += -spaceState.x * accel * dt;
      spaceState.vy += -spaceState.y * accel * dt;
      spaceState.x += spaceState.vx * dt;
      spaceState.y += spaceState.vy * dt;
      spaceState.elapsed += dt;
      const angle = Math.atan2(spaceState.y, spaceState.x);
      let delta = angle - spaceState.lastAngle;
      while (delta > Math.PI) delta -= Math.PI * 2;
      while (delta < -Math.PI) delta += Math.PI * 2;
      spaceState.traveled += Math.abs(delta);
      spaceState.lastAngle = angle;
      spaceState.trail.push({ x: spaceState.x, y: spaceState.y });
      if (spaceState.trail.length > 115) spaceState.trail.shift();
      const minDim = Math.min(W, H);
      if (r < 15) {
        spaceState.running = false; spaceState.failed = true;
        $('#launchButton').innerHTML = '<span class="button-symbol">↻</span> Опитай отново';
        setLive('ORBIT COLLAPSED'); setConsole('ОРБИТАТА СЕ СРУТИ');
        setCaption('Твърде близо до звездата! Увеличи скоростта при старта.');
        if (!missionComplete) setMissionProgress(0, 'Орбитата се срути — опитай отново');
        showToast('Планетата се приближи твърде много до звездата. Пробвай с по-висока скорост.');
      } else if (r > minDim * 0.49) {
        spaceState.running = false; spaceState.failed = true;
        $('#launchButton').innerHTML = '<span class="button-symbol">↻</span> Опитай отново';
        setLive('ESCAPE TRAJECTORY'); setConsole('ПЛАНЕТАТА НАПУСКА ОРБИТАТА');
        setCaption('Планетата избяга от звездата! Намали скоростта или увеличи гравитацията.');
        if (!missionComplete) setMissionProgress(0, 'Планетата избяга — опитай отново');
        showToast('Планетата избяга. Намали скоростта при старта или увеличи гравитацията.');
      } else {
        const safe = r > spaceState.startRadius * 0.52 && r < spaceState.startRadius * 1.75;
        if (safe) spaceState.stableTime += dt;
        const progress = Math.min(98, (spaceState.stableTime / 7) * 98);
        if (!missionComplete) setMissionProgress(progress, `${Math.round(progress)}% · ${formatTime(spaceState.stableTime)} стабилно`);
        if (spaceState.traveled >= Math.PI * 2 && spaceState.stableTime >= 7) {
          spaceState.running = false;
          $('#launchButton').innerHTML = '<span class="button-symbol">↻</span> Нова орбита';
          setLive('MISSION COMPLETE'); setConsole('СТАБИЛНА ОРБИТА ПОТВЪРДЕНА');
          setCaption('Орбита потвърдена! Разбра как скоростта и гравитацията работят заедно.');
          completeMission('Перфектна орбита! Завърши космическата мисия.');
        } else if (!safe) {
          setCaption('Орбитата е нестабилна. Коригирай гравитацията, скоростта или рестартирай.');
        }
      }
      setMetric('C', 'ВРЕМЕ В ОРБИТА', formatTime(spaceState.elapsed));
    }
    updateSpaceDiagnostics();
  }
  function drawSpace(time) {
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#111427'); bg.addColorStop(.55, '#111922'); bg.addColorStop(1, '#080e16');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    drawGlow(W * .25, H * .2, W * .6, '#514e9a22', '#514e9a00');
    drawStars(time, '#dfe8ff');
    const cx = W / 2, cy = H * .51;
    // faint coordinate grid and orbital ring
    ctx.save(); ctx.strokeStyle = '#a8b6da0b'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.restore();
    const startR = spaceState.startRadius || Math.min(W, H) * .29;
    ctx.beginPath(); ctx.ellipse(cx, cy, startR, startR * .83, 0, 0, Math.PI * 2);
    ctx.setLineDash([3, 8]); ctx.strokeStyle = '#b3c8ef28'; ctx.lineWidth = 1; ctx.stroke(); ctx.setLineDash([]);
    // Outer star halo and corona
    drawGlow(cx, cy, 90, '#ffbb5c20', '#ff9f4500');
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath(); ctx.arc(cx, cy, 37 + i * 8, time * .05 + i, time * .05 + i + Math.PI * 1.52);
      ctx.strokeStyle = `rgba(255,190,100,${.2 - i * .04})`; ctx.lineWidth = 1; ctx.stroke();
    }
    drawGlow(cx, cy, 34, '#fff0ae', '#f58b34');
    const sun = ctx.createRadialGradient(cx - 7, cy - 9, 1, cx, cy, 23);
    sun.addColorStop(0, '#fff8d2'); sun.addColorStop(.38, '#ffd77b'); sun.addColorStop(1, '#f17f37');
    ctx.fillStyle = sun; ctx.beginPath(); ctx.arc(cx, cy, 23, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#fff0be88'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, 28 + Math.sin(time * 2) * 1.5, 0, Math.PI * 2); ctx.stroke();
    // Path of the moving planet's trail (planet coordinates are relative to the sun).
    if (spaceState.trail.length > 1) {
      for (let i = 1; i < spaceState.trail.length; i += 1) {
        const p0 = spaceState.trail[i - 1], p1 = spaceState.trail[i];
        ctx.beginPath(); ctx.moveTo(cx + p0.x, cy + p0.y); ctx.lineTo(cx + p1.x, cy + p1.y);
        ctx.strokeStyle = `rgba(125,187,255,${i / spaceState.trail.length * .5})`; ctx.lineWidth = 1.6; ctx.stroke();
      }
    }
    let px = cx + spaceState.x, py = cy + spaceState.y;
    if (spaceState.failed && !Number.isFinite(px + py)) { px = cx + startR; py = cy; }
    drawGlow(px, py, 28, '#77bfff3a', '#77bfff00');
    const planetGradient = ctx.createRadialGradient(px - 5, py - 6, 1, px, py, 12);
    planetGradient.addColorStop(0, '#e8f4ff'); planetGradient.addColorStop(.35, '#87d9ec'); planetGradient.addColorStop(1, '#3565ac');
    ctx.fillStyle = planetGradient; ctx.beginPath(); ctx.arc(px, py, 11, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.translate(px, py); ctx.rotate(time * .4); ctx.strokeStyle = '#e0f6ff99'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0, 0, 16, 5, -.25, .2, Math.PI * 1.8); ctx.stroke(); ctx.restore();
    // Satellite UI labels
    ctx.font = '700 8px DM Sans, sans-serif'; ctx.fillStyle = '#c1d1e6a8'; ctx.letterSpacing = '1px';
    ctx.fillText('STAR / A', cx + 38, cy + 4);
    ctx.fillStyle = '#b7d8ff'; ctx.fillText('PLANET / B', px + 18, py - 12);
    if (!spaceState.running && spaceState.elapsed === 0) {
      roundRect(ctx, W / 2 - 91, H - 60, 182, 25, 12);
      ctx.fillStyle = '#111925b8'; ctx.fill(); ctx.strokeStyle = '#b4cefc2c'; ctx.stroke();
      ctx.fillStyle = '#d4dfef'; ctx.textAlign = 'center'; ctx.font = '700 9px DM Sans, sans-serif'; ctx.fillText('PRESS  START  TO  LAUNCH', W / 2, H - 44); ctx.textAlign = 'left';
    }
  }

  // EARTH: pressure/gas controls drive atmospheric particles and an eruption event.
  const earthState = { pressure: 42, gas: 35, time: 0, erupting: false, eruptionTime: 0, particles: [], smokeAccumulator: 0, lavaAccumulator: 0 };
  function updateEarthInputs() {
    earthState.pressure = Number($('#pressureRange').value);
    earthState.gas = Number($('#gasRange').value);
    $('#pressureValue').textContent = `${earthState.pressure}%`;
    $('#gasValue').textContent = `${earthState.gas}%`;
    const activity = Math.round(earthState.pressure * .66 + earthState.gas * .34);
    $('#volcanoGaugeFill').style.width = `${activity}%`;
    const level = activity < 30 ? 'НИСКА' : activity < 60 ? 'УМЕРЕНА' : activity < 78 ? 'ВИСОКА' : 'КРИТИЧНА';
    $('#volcanoLevel').textContent = level;
    const pressureReady = earthState.pressure >= 72;
    const gasReady = earthState.gas >= 55;
    $('#volcanoConsoleStatus').textContent = pressureReady && gasReady ? 'Условията в модела са подходящи. Опитай изригване.' : 'Промени параметрите и наблюдавай активността.';
    $('#pressureCheck').textContent = pressureReady ? '✓' : '○';
    $('#gasCheck').textContent = gasReady ? '✓' : '○';
    $('#pressureCheck').classList.toggle('ready', pressureReady);
    $('#gasCheck').classList.toggle('ready', gasReady);
    $('#earthReadyLabel').textContent = pressureReady && gasReady ? 'READY' : 'WAITING';
    $('#earthChecklist').classList.toggle('ready', pressureReady && gasReady);
    $('#earthChecklistNote').textContent = pressureReady && gasReady ? 'Условията са изпълнени. Време е да тестваш модела.' : 'Нагласи двата параметъра, за да станат условията подходящи.';
    setMetric('A', 'НАЛЯГАНЕ', `${earthState.pressure}<span>%</span>`);
    setMetric('B', 'НАТРУПАНИ ГАЗОВЕ', `${earthState.gas}<span>%</span>`);
    setMetric('C', 'АКТИВНОСТ', `${activity}<span>%</span>`);
    if (!earthState.erupting && !missionComplete) {
      const ready = earthState.pressure >= 72 && earthState.gas >= 55;
      setMissionProgress(ready ? 45 : Math.min(40, activity * .45), ready ? 'Условията са подходящи' : `${Math.round(Math.min(40, activity * .45))}% · настрой условията`);
    }
    if (earthState.erupting) setCaption('Изригването е в ход! Наблюдавай как се движат газовете и лавата.');
    else if (earthState.pressure >= 72 && earthState.gas >= 55) setCaption('Моделът е готов за тест. Симулирай изригване.');
    else if (activity > 60) setCaption('Активността расте. Още промени могат да доближат модела до изригване.');
    else setCaption('Под повърхността се натрупва енергия.');
  }
  if ($('#pressureRange')) {
    $('#pressureRange').addEventListener('input', updateEarthInputs);
    $('#gasRange').addEventListener('input', updateEarthInputs);
    $('#igniteButton').addEventListener('click', () => {
      if (earthState.pressure < 72 || earthState.gas < 55) {
        showToast('Нужно е налягане поне 72% и натрупване на газове поне 55%.');
        setLive('PARAMETERS TOO LOW'); setConsole('ИЗЧАКВАНЕ НА ПОДХОДЯЩИ УСЛОВИЯ');
        setCaption('Увеличи налягането и газовете, преди да задействаш модела.');
        return;
      }
      earthState.erupting = true; earthState.eruptionTime = 0; earthState.particles.length = 0;
      setLive('ERUPTION SIMULATING'); setConsole('ИЗРИГВАНЕТО Е АКТИВНО');
      setCaption('Изригването е в ход! Наблюдавай как се движат газовете и лавата.');
      $('#igniteButton').innerHTML = '<span class="button-symbol">✦</span> Изригването е в ход';
      showToast('Изригването започна! Наблюдавай частиците в симулацията.');
    });
    $('#resetEarthButton').addEventListener('click', () => {
      earthState.erupting = false; earthState.eruptionTime = 0; earthState.particles.length = 0;
      $('#pressureRange').value = 42; $('#gasRange').value = 35;
      updateRangeFill($('#pressureRange')); updateRangeFill($('#gasRange')); updateEarthInputs();
      $('#igniteButton').innerHTML = '<span class="button-symbol">↯</span> Симулирай изригване';
      setLive('READY TO EXPLORE'); setConsole('СИСТЕМАТА Е ГОТОВА');
      if (!missionComplete) setMissionProgress(0, '0% завършено');
      showToast('Моделът на вулкана е нулиран.');
    });
  }
  function makeEarthParticle(type) {
    const x = W * (.49 + (Math.random() - .5) * .1);
    const y = H * .395;
    const lava = type === 'lava';
    earthState.particles.push({ type, x, y, vx: (Math.random() - .5) * (lava ? 150 : 25), vy: lava ? -Math.random() * 180 - 75 : -Math.random() * 40 - 13, life: lava ? .7 + Math.random() * .9 : 1.6 + Math.random() * 2.3, maxLife: lava ? 1.6 : 3.9, size: lava ? Math.random() * 3.8 + 1.4 : Math.random() * (8 + earthState.pressure * .12 + earthState.gas * .1) + 8 });
    if (earthState.particles.length > 230) earthState.particles.splice(0, earthState.particles.length - 230);
  }
  function updateEarth(dt) {
    earthState.time += dt;
    earthState.smokeAccumulator += dt;
    const smokeInterval = .16 - (earthState.pressure / 100) * .08 - (earthState.gas / 100) * .045;
    if (earthState.pressure > 15 && earthState.smokeAccumulator > smokeInterval) {
      makeEarthParticle('smoke'); earthState.smokeAccumulator = 0;
    }
    if (earthState.erupting) {
      earthState.eruptionTime += dt;
      earthState.lavaAccumulator += dt;
      while (earthState.lavaAccumulator > .035) { makeEarthParticle('lava'); earthState.lavaAccumulator -= .035; }
      const progress = Math.min(99, 45 + earthState.eruptionTime / 3.4 * 54);
      if (!missionComplete) setMissionProgress(progress, `${Math.round(progress)}% · изригване`);
      if (earthState.eruptionTime >= 3.4) {
        earthState.erupting = false;
        $('#igniteButton').innerHTML = '<span class="button-symbol">↻</span> Симулирай отново';
        setLive('ERUPTION COMPLETE'); setConsole('МОДЕЛЪТ ЗАПИСА ИЗРИГВАНЕ');
        setCaption('Експериментът е завършен. Промени параметрите, за да сравниш резултатите.');
        completeMission('Изригването е симулирано успешно. Мисията е завършена!');
      }
    }
    for (let i = earthState.particles.length - 1; i >= 0; i -= 1) {
      const p = earthState.particles[i];
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.vx *= p.type === 'lava' ? .995 : .99;
      p.vy += p.type === 'lava' ? 170 * dt : -2 * dt;
      p.life -= dt;
      if (p.life <= 0 || p.y < -60 || p.y > H + 30) earthState.particles.splice(i, 1);
    }
  }
  function polygon(points, fill, stroke = null) {
    ctx.beginPath(); ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
    if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
  }
  function drawEarth(time) {
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#101b2a'); bg.addColorStop(.48, '#273440'); bg.addColorStop(1, '#29221d');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    drawStars(time, '#f6d5ad');
    drawGlow(W * .78, H * .24, 125, '#ed89452a', '#ed894500');
    // Distant volcanic ridges.
    polygon([[0,H*.76],[W*.09,H*.53],[W*.2,H*.64],[W*.31,H*.49],[W*.45,H*.68],[W*.61,H*.56],[W*.77,H*.67],[W*.91,H*.5],[W,H*.66],[W,H],[0,H]], '#303a39');
    polygon([[0,H*.83],[W*.12,H*.69],[W*.28,H*.78],[W*.39,H*.67],[W*.58,H*.82],[W*.78,H*.7],[W,H*.82],[W,H],[0,H]], '#202b29');
    // Main volcano.
    const craterX = W * .5, craterY = H * .395;
    const mountain = [[W*.12,H*.92],[W*.25,H*.72],[W*.33,H*.58],[W*.41,H*.43],[W*.46,H*.38],[W*.49,H*.41],[W*.53,H*.4],[W*.57,H*.45],[W*.66,H*.61],[W*.76,H*.78],[W*.9,H*.92]];
    polygon(mountain, '#4c5148', '#87907b66');
    polygon([[W*.12,H*.92],[W*.25,H*.72],[W*.33,H*.58],[W*.41,H*.43],[W*.46,H*.38],[W*.49,H*.41],[W*.42,H*.57],[W*.36,H*.71],[W*.29,H*.82]], '#666b59');
    // Cracks and lava veins.
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(craterX - 1, craterY + 3); ctx.lineTo(W*.47, H*.51); ctx.lineTo(W*.44,H*.63); ctx.lineTo(W*.38,H*.73); ctx.lineTo(W*.36,H*.88);
    ctx.strokeStyle = '#ff683c20'; ctx.lineWidth = earthState.erupting ? 12 : 7; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(craterX - 1, craterY + 3); ctx.lineTo(W*.47, H*.51); ctx.lineTo(W*.44,H*.63); ctx.lineTo(W*.38,H*.73); ctx.lineTo(W*.36,H*.88);
    const lavaGlow = ctx.createLinearGradient(craterX, craterY, W*.36, H*.88); lavaGlow.addColorStop(0, earthState.erupting ? '#fff2a0' : '#e88a3e'); lavaGlow.addColorStop(1, '#ed5d3210');
    ctx.strokeStyle = lavaGlow; ctx.lineWidth = earthState.erupting ? 4 : 1.7; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(craterX, craterY, 22, 7, -.07, 0, Math.PI * 2); ctx.fillStyle = '#171b19'; ctx.fill();
    ctx.beginPath(); ctx.ellipse(craterX, craterY, 17, 4.5, -.07, 0, Math.PI * 2); ctx.fillStyle = earthState.erupting ? '#ffd16b' : earthState.pressure >= 72 ? '#e98743' : earthState.pressure >= 40 ? '#8e6143' : '#5c4637'; ctx.fill();
    if (earthState.erupting) drawGlow(craterX, craterY, 80, '#ff8b3c44', '#ff8b3c00');
    else if (earthState.pressure > 35) drawGlow(craterX, craterY, 22 + earthState.pressure * .38, `rgba(255,126,57,${earthState.pressure / 500})`, '#ff8b3c00');
    // Smoke and lava particles.
    for (const p of earthState.particles) {
      const alpha = clamp(p.life / p.maxLife, 0, 1) * (p.type === 'smoke' ? .42 : .95);
      ctx.globalAlpha = alpha;
      if (p.type === 'smoke') {
        const smoke = ctx.createRadialGradient(p.x, p.y, 1, p.x, p.y, p.size);
        smoke.addColorStop(0, '#c5c4ba'); smoke.addColorStop(1, '#777b7800');
        ctx.fillStyle = smoke; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      } else {
        drawGlow(p.x, p.y, p.size * 2, '#ffd778aa', '#ff592000');
        ctx.fillStyle = Math.random() > .45 ? '#ffd47b' : '#ff7043'; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = '#a9b3a5'; ctx.font = '700 8px DM Sans, sans-serif'; ctx.letterSpacing = '1.6px'; ctx.fillText('MAGMA CHAMBER / MODEL', 17, H - 22);
    if (earthState.erupting) {
      ctx.textAlign = 'right'; ctx.fillStyle = '#ffe0a8'; ctx.fillText(`ERUPTION +${earthState.eruptionTime.toFixed(1)}s`, W - 17, H - 22); ctx.textAlign = 'left';
    } else {
      ctx.textAlign = 'right'; ctx.fillStyle = '#c6cbbd88'; ctx.fillText(`PRESSURE ${earthState.pressure}%`, W - 17, H - 22); ctx.textAlign = 'left';
    }
  }

  // TECHNOLOGY: radio-wave propagation is visualized with walls, signal packets and a scan sweep.
  const wifiState = { distance: 3, walls: 1, frequency: 2.4, time: 0, scanning: false, scanTime: 0, packets: [] };
  function getSignalStrength() {
    const wallLoss = wifiState.frequency === 5 ? 14 : 9;
    return Math.round(clamp(100 - (wifiState.distance - 1) * 8 - wifiState.walls * wallLoss, 5, 100));
  }
  function updateWifiInputs() {
    wifiState.distance = Number($('#distanceRange').value);
    wifiState.walls = Number($('#wallsRange').value);
    $('#distanceValue').textContent = `${wifiState.distance} / 5`;
    $('#wallsValue').textContent = wifiState.walls === 1 ? '1 стена' : `${wifiState.walls} стени`;
    $('#frequencyValue').textContent = `${wifiState.frequency} GHz`;
    const strength = getSignalStrength();
    $('#signalPercent').textContent = `${strength}%`;
    const activeBars = Math.ceil(strength / 20);
    document.querySelectorAll('#signalBars i').forEach((bar, index) => bar.classList.toggle('active', index < activeBars));
    $('#wifiConsoleStatus').textContent = strength >= 80 ? 'Отличен сигнал в този модел.' : strength >= 60 ? 'Добър сигнал. Виж дали можеш да го подобриш.' : strength >= 40 ? 'Сигналът е среден — опитай по-малко препятствия.' : 'Слаб сигнал. Приближи устройството или смени честотата.';
    setMetric('A', 'СИЛА НА СИГНАЛА', `${strength}<span>%</span>`);
    setMetric('B', 'ПРЕПЯТСТВИЯ', `${wifiState.walls}<span></span>`);
    setMetric('C', 'РАЗСТОЯНИЕ', `${wifiState.distance}<span> / 5</span>`);
    if (!wifiState.scanning && !missionComplete) {
      const progress = Math.min(85, strength / 65 * 85);
      setMissionProgress(progress, strength >= 65 ? 'Сигналът е достатъчно силен' : `${Math.round(progress)}% · цел 65%`);
    }
    if (wifiState.scanning) setCaption('Сканиране на радиовълните…');
    else setCaption(strength >= 65 ? 'Добър сигнал! Натисни „Сканирай сигнала“, за да завършиш мисията.' : 'Сигналът е отслабен. Намали разстоянието или препятствията.');
  }
  if ($('#distanceRange')) {
    $('#distanceRange').addEventListener('input', updateWifiInputs);
    $('#wallsRange').addEventListener('input', updateWifiInputs);
    document.querySelectorAll('[data-frequency]').forEach((button) => button.addEventListener('click', () => {
      wifiState.frequency = Number(button.dataset.frequency);
      document.querySelectorAll('[data-frequency]').forEach((option) => {
        const selected = option === button;
        option.classList.toggle('selected', selected);
        option.setAttribute('aria-pressed', String(selected));
      });
      updateWifiInputs();
    }));
    $('#scanButton').addEventListener('click', () => {
      if (wifiState.scanning) return;
      if (getSignalStrength() < 65) {
        showToast('За мисията ти трябва сигнал от поне 65%. Намали разстоянието или стените.');
        setLive('SIGNAL TOO WEAK'); setConsole('СКАНИРАНЕТО Е НЕУСПЕШНО');
        return;
      }
      wifiState.scanning = true; wifiState.scanTime = 0; wifiState.packets.length = 0;
      setLive('SCANNING NETWORK'); setConsole('АНАЛИЗ НА РАДИОСИГНАЛА');
      $('#scanButton').innerHTML = '<span class="button-symbol">◌</span> Сканиране…';
      showToast('Сканирането започна. Следи вълните в стаята.');
    });
    $('#resetTechButton').addEventListener('click', () => {
      wifiState.scanning = false; wifiState.scanTime = 0; wifiState.packets.length = 0;
      wifiState.frequency = 2.4; $('#distanceRange').value = 3; $('#wallsRange').value = 1;
      document.querySelectorAll('[data-frequency]').forEach((button) => {
        const selected = Number(button.dataset.frequency) === 2.4;
        button.classList.toggle('selected', selected); button.setAttribute('aria-pressed', String(selected));
      });
      updateRangeFill($('#distanceRange')); updateRangeFill($('#wallsRange')); updateWifiInputs();
      $('#scanButton').innerHTML = '<span class="button-symbol">⌁</span> Сканирай сигнала';
      setLive('READY TO EXPLORE'); setConsole('СИСТЕМАТА Е ГОТОВА');
      if (!missionComplete) setMissionProgress(0, '0% завършено');
      showToast('Wi-Fi лабораторията е нулирана.');
    });
  }
  function drawRouter(x, y, time) {
    drawGlow(x, y, 48, '#c7f36b18', '#c7f36b00');
    ctx.save(); ctx.translate(x, y);
    ctx.strokeStyle = '#9bba9b'; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-15, -7); ctx.lineTo(-18, -24); ctx.moveTo(15, -7); ctx.lineTo(18, -24); ctx.stroke();
    roundRect(ctx, -29, -10, 58, 30, 7); ctx.fillStyle = '#263b36'; ctx.fill(); ctx.strokeStyle = '#93bda077'; ctx.lineWidth = 1; ctx.stroke();
    for (let i = 0; i < 3; i += 1) { ctx.beginPath(); ctx.arc(-13 + i * 13, 6, 2.2, 0, Math.PI * 2); ctx.fillStyle = i < 1 + Math.floor((time * 1.4) % 3) ? '#c7f36b' : '#66776d'; ctx.fill(); }
    ctx.fillStyle = '#d6e9d1'; ctx.font = '800 8px DM Sans, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('ROUTER', 0, 36); ctx.restore();
  }
  function drawLaptop(x, y, strength, time) {
    const tint = strength >= 60 ? '#c7f36b' : '#ff9867';
    drawGlow(x, y, 45, strength >= 60 ? '#c7f36b1a' : '#ff98671b', '#00000000');
    ctx.save(); ctx.translate(x, y);
    roundRect(ctx, -24, -24, 48, 36, 4); ctx.fillStyle = '#192a2c'; ctx.fill(); ctx.strokeStyle = '#a4c4b3'; ctx.lineWidth = 1.3; ctx.stroke();
    const screen = ctx.createLinearGradient(-20, -20, 20, 9); screen.addColorStop(0, '#38534d'); screen.addColorStop(1, '#182e2b');
    roundRect(ctx, -19, -19, 38, 26, 2); ctx.fillStyle = screen; ctx.fill();
    ctx.strokeStyle = tint; ctx.globalAlpha = .4 + .3 * Math.sin(time * 3); ctx.lineWidth = 1.5;
    for (let i = 1; i <= 3; i += 1) { ctx.beginPath(); ctx.arc(0, -6, i * 4, -Math.PI * .82, -Math.PI * .18); ctx.stroke(); }
    ctx.globalAlpha = 1; polygon([[-30,13],[30,13],[25,18],[-25,18]], '#8aa59a', '#c1d0bf');
    ctx.fillStyle = '#d6e9d1'; ctx.font = '800 8px DM Sans, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('DEVICE', 0, 34); ctx.restore();
  }
  function drawWifi(time) {
    const bg = ctx.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#14272a'); bg.addColorStop(.6, '#18252d'); bg.addColorStop(1, '#111a22');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    // Room grid and soft corner lights.
    ctx.strokeStyle = '#b2d2b513'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 28) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 28) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    drawGlow(W * .08, H * .53, 130, '#8ac8a51b', '#8ac8a500');
    drawGlow(W * .89, H * .53, 100, getSignalStrength() >= 60 ? '#c7f36b14' : '#ff986717', '#00000000');
    const routerX = W * .13, baseY = H * .54;
    const deviceX = W * (.42 + wifiState.distance * .09), deviceY = baseY + Math.sin(time * .6) * 2;
    // Link path.
    ctx.save(); ctx.setLineDash([3, 7]); ctx.beginPath(); ctx.moveTo(routerX + 33, baseY); ctx.lineTo(deviceX - 31, deviceY); ctx.strokeStyle = '#b0d0ba47'; ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
    const strength = getSignalStrength();
    const waveColor = strength >= 65 ? '#c7f36b' : '#ff9867';
    // Pulsing ring waves spreading from the router.
    for (let i = 0; i < 4; i += 1) {
      const radius = 22 + ((time * 43 + i * 44) % Math.max(90, deviceX - routerX - 35));
      ctx.beginPath(); ctx.arc(routerX + 14, baseY - 1, radius, -.75, .75);
      ctx.strokeStyle = strength >= 65 ? `rgba(199,243,107,${.28 * (1 - i * .08)})` : `rgba(255,152,103,${.2 * (1 - i * .08)})`;
      ctx.lineWidth = 1.2; ctx.stroke();
    }
    // Walls between the router and device. They glow when waves cross them.
    if (wifiState.walls > 0) {
      const startX = routerX + 65, endX = deviceX - 55;
      for (let i = 0; i < wifiState.walls; i += 1) {
        const x = startX + (endX - startX) * ((i + 1) / (wifiState.walls + 1));
        const wallTop = baseY - 56, wallBottom = baseY + 56;
        roundRect(ctx, x - 5, wallTop, 10, wallBottom - wallTop, 3);
        ctx.fillStyle = '#8f9d9675'; ctx.fill(); ctx.strokeStyle = '#c1d2bf65'; ctx.lineWidth = 1; ctx.stroke();
        ctx.strokeStyle = '#d0d9ca55'; ctx.beginPath(); ctx.moveTo(x - 2, wallTop + 10); ctx.lineTo(x + 2, wallBottom - 10); ctx.stroke();
      }
    }
    // Animated signal packets move toward the device while scanning.
    if (wifiState.scanning) {
      for (let i = 0; i < 8; i += 1) {
        const travel = (time * .43 + i / 8) % 1;
        const x = routerX + 35 + travel * (deviceX - routerX - 70);
        const y = baseY + Math.sin(travel * Math.PI * 3 + time * 2) * (5 + (100 - strength) * .04);
        drawGlow(x, y, 9, `${waveColor}55`, '#00000000');
        ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fillStyle = waveColor; ctx.fill();
      }
    } else {
      const packetX = routerX + 35 + ((time * 34) % Math.max(1, deviceX - routerX - 70));
      drawGlow(packetX, baseY, 8, `${waveColor}55`, '#00000000');
      ctx.beginPath(); ctx.arc(packetX, baseY, 2, 0, Math.PI * 2); ctx.fillStyle = waveColor; ctx.fill();
    }
    drawRouter(routerX, baseY, time);
    drawLaptop(deviceX, deviceY, strength, time);
    if (wifiState.scanning) {
      const scan = (wifiState.scanTime / 2.2);
      ctx.beginPath(); ctx.arc(deviceX, deviceY, 34 + scan * 42, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(199,243,107,${1 - scan * .7})`; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath(); ctx.arc(deviceX, deviceY, 20 + scan * 23, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(199,243,107,${.65 - scan * .4})`; ctx.lineWidth = 1; ctx.stroke();
    }
    // Top-right measured percentage and wall count.
    ctx.textAlign = 'right'; ctx.fillStyle = strength >= 65 ? '#c7f36b' : '#ffb18a'; ctx.font = '800 25px Manrope, sans-serif'; ctx.fillText(`${strength}%`, W - 18, 65);
    ctx.fillStyle = '#b7c8c0'; ctx.font = '700 8px DM Sans, sans-serif'; ctx.letterSpacing = '1px'; ctx.fillText('SIGNAL STRENGTH', W - 18, 79);
    ctx.textAlign = 'left'; ctx.fillStyle = '#a9bdb3'; ctx.font = '700 8px DM Sans, sans-serif'; ctx.fillText(`${wifiState.walls} WALL${wifiState.walls === 1 ? '' : 'S'}  ·  ${wifiState.frequency} GHz`, 17, H - 20);
  }
  let networkMissionDoneThisScan = false;
  function updateTech(dt) {
    wifiState.time += dt;
    if (wifiState.scanning) {
      wifiState.scanTime += dt;
      const progress = Math.min(98, wifiState.scanTime / 2.2 * 98);
      if (!missionComplete) setMissionProgress(progress, `${Math.round(progress)}% · сканиране`);
      if (wifiState.scanTime >= 2.2) {
        wifiState.scanning = false;
        $('#scanButton').innerHTML = '<span class="button-symbol">↻</span> Сканирай отново';
        setLive('NETWORK SCAN COMPLETE'); setConsole(`СКАНИРАНЕТО Е УСПЕШНО · ${getSignalStrength()}%`);
        setCaption(`Сканирането завърши със сила на сигнала ${getSignalStrength()}%. Експериментирай и сравни резултатите.`);
        networkMissionDoneThisScan = true;
        completeMission('Отлично! Намери достатъчно силен сигнал и завърши сканирането.');
      }
    }
  }

  // Keep the status and metrics initialized before the first animation frame.
  if (topic === 'space') {
    initSpace(); updateSpaceInputs();
    if (missionComplete) { $('#launchButton').innerHTML = '<span class="button-symbol">▶</span> Пусни нова орбита'; }
  } else if (topic === 'earth') {
    updateEarthInputs();
  } else {
    updateWifiInputs();
  }

  function frame(timestamp) {
    const dt = lastFrame ? clamp((timestamp - lastFrame) / 1000, 0, .034) : 0;
    lastFrame = timestamp;
    const time = timestamp / 1000;
    if (topic === 'space') { updateSpace(dt); drawSpace(time); }
    else if (topic === 'earth') { updateEarth(dt); drawEarth(time); }
    else { updateTech(dt); drawWifi(time); }
    window.requestAnimationFrame(frame);
  }
  resizeCanvas();
  window.requestAnimationFrame(frame);
})();
