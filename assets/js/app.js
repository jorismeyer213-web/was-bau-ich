/* Was bau ich? – Logik: Zufall, Text-Shuffle, Sound, Haptik, Verlauf, Filter. */
(function () {
  "use strict";

  const D = window.WBI_DATA;
  const $ = (id) => document.getElementById(id);

  const app = $("app");
  const stageEl = $("stage");
  const glowEl = $("glow");
  const goBtn = $("goBtn");
  const goLabel = $("goLabel");
  const sentenceEl = $("sentence");
  const liveEl = $("live");
  const twistToggle = $("twistToggle");
  const soundBtn = $("soundBtn");
  const optSound = $("optSound");
  const historySheet = $("historySheet");
  const settingsSheet = $("settingsSheet");
  const exampleBtn = $("exampleBtn");
  const exampleText = $("exampleText");

  const slots = {
    format: { root: $("slotFormat"), btn: $("formatBtn"), word: $("formatWord"), group: $("formatGroup") },
    thema: { root: $("slotThema"), btn: $("themaBtn"), word: $("themaWord"), group: $("themaGroup") },
    twist: { root: $("slotTwist"), btn: $("twistBtn"), word: $("twistWord"), group: $("twistGroup") }
  };

  const mq = (q) => (window.matchMedia ? window.matchMedia(q) : { matches: false });
  const reduceMotion = mq("(prefers-reduced-motion: reduce)");
  const coarsePointer = mq("(pointer: coarse)");

  const LABEL_IDLE = "Was bau ich?";
  const LABEL_BUSY = "Mal sehen …";
  const HISTORY_MAX = 10;

  // Zeitplan in ms (siehe Plan: Format rastet bei 1500 ein, Thema bei 2250)
  const TIMING = {
    format: { flicker: 900, from: 45, to: 130, decode: 600 },
    thema: { delay: 120, flicker: 1530, from: 55, to: 160, decode: 600 },
    example: 400,
    twist: { flicker: 300, from: 50, to: 110, decode: 300 },
    reroll: { flicker: 500, from: 45, to: 120, decode: 500 },
    restore: 400,
    calmGap: 150
  };

  /* ---------- Speicher ---------- */

  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw == null ? fallback : JSON.parse(raw);
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) { /* ohne Speicher geht es auch */ }
    }
  };
  const KEY_SETTINGS = "wbi.v1.settings";
  const KEY_HISTORY = "wbi.v1.history";

  // Formatgruppen im Modus „Für wen“: die normalen plus Produktideen
  const FORMAT_GROUPS = { ...D.formate, produktideen: D.produktideen };

  const allOn = (obj) => Object.fromEntries(Object.keys(obj).map((k) => [k, true]));
  const DEFAULTS = {
    mode: "thema",
    formate: allOn(D.formate),
    themen: allOn(D.themen),
    twist: allOn(D.twist),
    formateFuer: allOn(FORMAT_GROUPS),
    fuer: allOn(D.fuer),
    twistOn: false,
    sound: true
  };

  function loadSettings() {
    const saved = store.get(KEY_SETTINGS, {}) || {};
    const out = JSON.parse(JSON.stringify(DEFAULTS));
    if (saved.mode === "fuer") out.mode = "fuer";
    for (const pool of ["formate", "themen", "twist", "formateFuer", "fuer"]) {
      const s = saved[pool];
      if (s && typeof s === "object") {
        for (const k of Object.keys(out[pool])) if (typeof s[k] === "boolean") out[pool][k] = s[k];
      }
      if (!Object.values(out[pool]).some(Boolean)) out[pool] = { ...DEFAULTS[pool] };
    }
    if (typeof saved.twistOn === "boolean") out.twistOn = saved.twistOn;
    if (typeof saved.sound === "boolean") out.sound = saved.sound;
    return out;
  }
  const settings = loadSettings();
  const saveSettings = () => store.set(KEY_SETTINGS, settings);

  let history = (store.get(KEY_HISTORY, []) || []).filter((h) => h && h.ref && typeof h.text === "string").slice(0, HISTORY_MAX);
  const saveHistory = () => store.set(KEY_HISTORY, history);

  /* ---------- Zufall ---------- */

  function randInt(n) {
    if (window.crypto && crypto.getRandomValues) {
      const buf = new Uint32Array(1);
      const limit = Math.floor(0x100000000 / n) * n;
      let x;
      do {
        crypto.getRandomValues(buf);
        x = buf[0];
      } while (x >= limit);
      return x % n;
    }
    return Math.floor(Math.random() * n);
  }

  function shuffled(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = randInt(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Shuffle-Bag: jeder Begriff kommt erst wieder, wenn der Beutel leer ist.
  class Bag {
    constructor(items) {
      this.items = items;
      this.queue = [];
      this.last = null;
    }
    next() {
      if (!this.queue.length) {
        this.queue = shuffled(this.items);
        const n = this.queue.length;
        if (n > 1 && this.queue[n - 1] === this.last) {
          [this.queue[0], this.queue[n - 1]] = [this.queue[n - 1], this.queue[0]];
        }
      }
      this.last = this.queue.pop();
      return this.last;
    }
    // abgelehnten Begriff ans Ende des aktuellen Durchlaufs legen statt ihn zu verlieren
    putBack(item) {
      if (!this.queue.includes(item)) this.queue.unshift(item);
    }
  }

  let pools;
  let bags;

  const isFuer = () => settings.mode === "fuer";

  function buildPools() {
    const formats = [];
    const bereiche = [];
    const fuer = [];
    const twists = [];
    const formatGroups = isFuer() ? FORMAT_GROUPS : D.formate;
    const formatOn = isFuer() ? settings.formateFuer : settings.formate;
    for (const [key, g] of Object.entries(formatGroups)) {
      if (formatOn[key]) g.items.forEach((it, idx) => formats.push({ ...it, group: key, groupName: g.name, idx }));
    }
    if (isFuer()) {
      for (const [key, g] of Object.entries(D.fuer)) {
        if (settings.fuer[key]) g.items.forEach((it, idx) => fuer.push({ ...it, group: key, groupName: g.name, idx }));
      }
      // eine Twist-Zielgruppe würde sich mit „Für wen“ beißen, deshalb nur Stile
      D.twist.stil.items.forEach((it, idx) => twists.push({ ...it, type: "stil", typeName: D.twist.stil.name, idx }));
    } else {
      for (const [key, g] of Object.entries(D.themen)) {
        if (settings.themen[key]) g.bereiche.forEach((it, idx) => bereiche.push({ ...it, group: key, groupName: g.name, idx }));
      }
      for (const [key, g] of Object.entries(D.twist)) {
        if (settings.twist[key]) g.items.forEach((it, idx) => twists.push({ ...it, type: key, typeName: g.name, idx }));
      }
    }
    pools = { formats, bereiche, fuer, twists };
    bags = {
      format: new Bag(formats),
      bereich: new Bag(bereiche),
      fuer: new Bag(fuer),
      twist: new Bag(twists),
      examples: new Map()
    };
  }

  function exampleBag(bereich) {
    const key = bereich.group + ":" + bereich.idx;
    if (!bags.examples.has(key)) {
      bags.examples.set(key, new Bag(bereich.beispiele.map((b, idx) => ({ ...b, idx }))));
    }
    return bags.examples.get(key);
  }

  const sameFormat = (a, b) => !!a && !!b && a.group === b.group && a.idx === b.idx;
  const sameBereich = sameFormat;
  const sameTwist = (a, b) => !!a && !!b && a.type === b.type && a.idx === b.idx;
  const sameBeispiel = (a, b) => !!a && !!b && a.idx === b.idx;

  function drawDifferent(bag, current, same) {
    let next = bag.next();
    if (bag.items.length > 1 && same(next, current)) {
      const rejected = next;
      next = bag.next();
      bag.putBack(rejected);
    }
    return next;
  }

  // zweite Zeile: Thema-Bereich oder „Für wen“
  const second = (r) => (r.mode === "fuer" ? r.fuer : r.bereich);

  function inRecentHistory(format, other) {
    const key = isFuer() ? "w" : "b";
    return history.some((h) =>
      (h.ref.m || "thema") === settings.mode &&
      h.ref.f[0] === format.group && h.ref.f[1] === format.idx &&
      h.ref[key] && h.ref[key][0] === other.group && h.ref[key][1] === other.idx);
  }

  function drawAll() {
    const otherBag = isFuer() ? bags.fuer : bags.bereich;
    const format = bags.format.next();
    let other = otherBag.next();
    // Kombination stand gerade im Verlauf: nur die zweite Zeile tauschen
    for (let tries = 0; tries < 5 && otherBag.items.length > 1 && inRecentHistory(format, other); tries++) {
      const rejected = other;
      other = otherBag.next();
      otherBag.putBack(rejected);
    }
    const twist = settings.twistOn && pools.twists.length ? bags.twist.next() : null;
    if (isFuer()) return { mode: "fuer", format, fuer: other, twist };
    return { mode: "thema", format, bereich: other, beispiel: exampleBag(other).next(), twist };
  }

  /* ---------- Satz ---------- */

  function sentenceParts(r) {
    const target = r.mode === "fuer" ? r.fuer.satz : r.beispiel.satz;
    const parts = [["Bau "], [r.format.akk, true], [" "], [target, true]];
    if (r.twist) parts.push([" – "], [r.twist.satz, true]);
    parts.push(["."]);
    return parts;
  }

  const sentenceText = (r) => sentenceParts(r).map((p) => p[0]).join("");

  function renderSentence(r) {
    sentenceEl.textContent = "";
    const arrow = document.createElement("span");
    arrow.className = "sentence__arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";
    sentenceEl.appendChild(arrow);
    for (const [txt, hl] of sentenceParts(r)) {
      if (hl) {
        const span = document.createElement("span");
        span.className = "hl";
        span.textContent = txt;
        sentenceEl.appendChild(span);
      } else {
        sentenceEl.appendChild(document.createTextNode(txt));
      }
    }
  }

  /* ---------- Sound (Web Audio, alles synthetisch) ---------- */

  const sound = (function () {
    let ctx = null;
    let master = null;
    let noiseBuf = null;
    let lastTick = 0;
    const LEVEL = 0.8;

    function init() {
      if (ctx) {
        if (ctx.state === "suspended") ctx.resume().catch(() => {});
        return;
      }
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try {
        if (navigator.audioSession) navigator.audioSession.type = "ambient";
      } catch (e) { /* nicht überall vorhanden */ }
      try {
        ctx = new AC();
      } catch (e) {
        ctx = null;
        return;
      }
      master = ctx.createGain();
      master.gain.value = settings.sound ? LEVEL : 0;
      master.connect(ctx.destination);
      const len = Math.floor(ctx.sampleRate * 0.3);
      noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    }

    const ready = () => ctx && ctx.state === "running" && settings.sound;

    function setEnabled(on) {
      if (master) master.gain.setTargetAtTime(on ? LEVEL : 0, ctx.currentTime, 0.015);
    }

    function noise(at, dur, type, freq, q, peak) {
      const src = ctx.createBufferSource();
      src.buffer = noiseBuf;
      const filter = ctx.createBiquadFilter();
      filter.type = type;
      filter.frequency.value = freq;
      filter.Q.value = q;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(peak, at + 0.001);
      g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
      src.connect(filter);
      filter.connect(g);
      g.connect(master);
      src.start(at, Math.random() * 0.2);
      src.stop(at + dur + 0.02);
    }

    function tick(vol) {
      if (!ready()) return;
      const now = ctx.currentTime;
      if (now - lastTick < 0.04) return; // höchstens ~25 Ticks pro Sekunde
      lastTick = now;
      noise(now, 0.018, "bandpass", 3200 * (0.92 + Math.random() * 0.16), 4, 0.3 * (vol == null ? 1 : vol));
    }

    function klack(freq) {
      if (!ready()) return;
      const now = ctx.currentTime;
      const o = ctx.createOscillator();
      o.type = "triangle";
      o.frequency.setValueAtTime(freq, now);
      o.frequency.exponentialRampToValueAtTime(freq / 2, now + 0.08);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.26, now + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
      o.connect(g);
      g.connect(master);
      o.start(now);
      o.stop(now + 0.16);
      noise(now, 0.03, "lowpass", 1800, 0.7, 0.12);
    }

    function ding() {
      if (!ready()) return;
      const now = ctx.currentTime;
      [660, 990].forEach((f, i) => {
        const o = ctx.createOscillator();
        o.type = "sine";
        o.frequency.value = f;
        const g = ctx.createGain();
        const at = now + i * 0.06;
        g.gain.setValueAtTime(0.0001, at);
        g.gain.exponentialRampToValueAtTime(0.045, at + 0.006);
        g.gain.exponentialRampToValueAtTime(0.0001, at + 0.42);
        o.connect(g);
        g.connect(master);
        o.start(at);
        o.stop(at + 0.45);
      });
    }

    return { init, setEnabled, tick, klack, ding };
  })();

  /* ---------- Haptik ---------- */

  const hapticLabel = $("hapticLabel");

  function haptic() {
    try {
      if (navigator.vibrate) {
        navigator.vibrate(12);
        return;
      }
    } catch (e) { /* im Rahmen gesperrt */ }
    // iPhone (Safari 18+): ein Klick auf einen Schalter löst die System-Haptik aus.
    if (!coarsePointer.matches || !hapticLabel) return;
    const active = document.activeElement;
    try {
      hapticLabel.click();
    } catch (e) { /* egal */ }
    if (active && active !== document.activeElement && active.focus) active.focus({ preventScroll: true });
  }

  function pulseGlow() {
    if (reduceMotion.matches) return;
    glowEl.classList.remove("is-pulsing");
    void glowEl.offsetWidth;
    glowEl.classList.add("is-pulsing");
  }

  /* ---------- Shuffle-Bausteine ---------- */

  const state = { run: 0, busy: false, pending: null, pendingHistory: true };
  let current = null;

  const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ";
  const LOWER = "abcdefghijklmnopqrstuvwxyzäöüß";
  const DIGITS = "0123456789";
  const SYMBOLS = "#*/+?!&%";

  const pick = (s) => s[randInt(s.length)];
  const isLetter = (c) => c.toLowerCase() !== c.toUpperCase();
  const isLockable = (c) => isLetter(c) || /\d/.test(c);

  function noiseFor(c) {
    if (/\d/.test(c)) return pick(DIGITS);
    if (randInt(5) === 0) return pick(SYMBOLS);
    return c === c.toLowerCase() ? pick(LOWER) : pick(UPPER);
  }

  function wait(ms, run) {
    return new Promise((resolve) => setTimeout(() => resolve(run === state.run), ms));
  }

  // Phase 1: echte Begriffe flackern, das Intervall wird immer länger.
  function flicker(el, names, duration, from, to, run) {
    return new Promise((resolve) => {
      const start = performance.now();
      let nextAt = start;
      let last = el.textContent;
      el.classList.add("is-flicker");
      function frame(now) {
        if (run !== state.run) return resolve(false);
        const t = Math.min(1, (now - start) / duration);
        if (now >= nextAt && t < 1) {
          let n = names[randInt(names.length)];
          if (names.length > 1 && n === last) n = names[(names.indexOf(n) + 1) % names.length];
          el.textContent = n;
          last = n;
          sound.tick();
          nextAt = now + from + (to - from) * t * t;
        }
        if (t >= 1) return resolve(true);
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    });
  }

  // Phase 2: Zeichensalat, der von links nach rechts zum Zielwort einrastet.
  function decode(el, target, duration, run, tickVol) {
    return new Promise((resolve) => {
      el.classList.remove("is-flicker");
      el.textContent = "";
      const chars = Array.from(target);
      const open = [];
      for (const c of chars) {
        if (c === " ") {
          el.appendChild(document.createTextNode(" "));
          continue;
        }
        const span = document.createElement("span");
        span.className = "ch";
        if (isLockable(c)) {
          span.classList.add("is-noise");
          span.textContent = noiseFor(c);
          open.push({ span, c });
        } else {
          span.textContent = c;
        }
        el.appendChild(span);
      }
      const perChar = open.length ? duration / open.length : duration;
      const start = performance.now();
      let lastNoise = start;
      let locked = 0;
      function frame(now) {
        if (run !== state.run) return resolve(false);
        const due = Math.min(open.length, Math.floor((now - start) / perChar));
        while (locked < due) {
          const o = open[locked];
          o.span.textContent = o.c;
          o.span.classList.remove("is-noise");
          locked++;
          sound.tick(tickVol == null ? 0.7 : tickVol);
        }
        if (now - lastNoise >= 40) {
          for (let i = locked; i < open.length; i++) open[i].span.textContent = noiseFor(open[i].c);
          lastNoise = now;
        }
        if (locked >= open.length && now - start >= duration) {
          el.textContent = target;
          return resolve(true);
        }
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    });
  }

  // Ersatz bei reduzierter Bewegung: einfach einblenden.
  function fadeTo(el, text, run) {
    el.classList.remove("is-flicker");
    el.textContent = text;
    if (el.animate) el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: "ease-out" });
    return wait(200, run);
  }

  function lockSlot(slot, groupName, freq) {
    slot.group.textContent = groupName;
    slot.root.classList.add("is-locked");
    sound.klack(freq);
    haptic();
    pulseGlow();
  }

  async function rollSlot(slot, names, target, groupName, freq, t, run) {
    slot.root.classList.remove("is-locked");
    if (t.delay && !(await wait(t.delay, run))) return false;
    if (reduceMotion.matches) {
      if (!(await fadeTo(slot.word, target, run))) return false;
    } else {
      if (!(await flicker(slot.word, names, t.flicker, t.from, t.to, run))) return false;
      if (!(await decode(slot.word, target, t.decode, run))) return false;
    }
    lockSlot(slot, groupName, freq);
    return true;
  }

  function rollExample(text, run) {
    exampleBtn.hidden = false;
    exampleBtn.classList.remove("is-dim");
    if (reduceMotion.matches) return fadeTo(exampleText, text, run);
    return decode(exampleText, text, TIMING.example, run, 0.4);
  }

  const names = {
    formats: () => pools.formats.map((x) => x.name),
    others: () => (isFuer() ? pools.fuer : pools.bereiche).map((x) => x.name),
    twists: () => pools.twists.map((x) => x.name)
  };

  const themaLabel = $("themaLabel");
  const setSecondLabel = (mode) => {
    themaLabel.textContent = mode === "fuer" ? "Für wen" : "Thema";
  };

  /* ---------- Ablauf ---------- */

  function begin(r, addsHistory) {
    state.busy = true;
    state.pending = r;
    state.pendingHistory = addsHistory;
    const run = ++state.run;
    app.classList.add("is-spinning");
    app.classList.remove("is-fresh");
    stageEl.setAttribute("aria-busy", "true");
    goLabel.textContent = LABEL_BUSY;
    sentenceEl.classList.add("is-hidden");
    setSecondLabel(r.mode);
    return run;
  }

  function prepareSlots(r) {
    for (const s of Object.values(slots)) s.root.classList.remove("is-locked");
    exampleBtn.hidden = r.mode === "fuer";
    exampleBtn.classList.add("is-dim");
    const tw = slots.twist.root;
    tw.hidden = !r.twist;
    tw.classList.toggle("is-dim", !!r.twist);
  }

  async function animateFull(r, run) {
    if (reduceMotion.matches) {
      const gap = TIMING.calmGap;
      if (!(await rollSlot(slots.format, null, r.format.name, r.format.groupName, 180, {}, run))) return false;
      if (!(await rollSlot(slots.thema, null, second(r).name, second(r).groupName, 160, { delay: gap }, run))) return false;
      if (r.mode !== "fuer") {
        if (!(await wait(gap, run))) return false;
        if (!(await rollExample(r.beispiel.text, run))) return false;
      }
      if (r.twist) {
        slots.twist.root.classList.remove("is-dim");
        if (!(await rollSlot(slots.twist, null, r.twist.name, r.twist.typeName, 200, { delay: gap }, run))) return false;
      }
      return wait(gap, run);
    }

    const both = await Promise.all([
      rollSlot(slots.format, names.formats(), r.format.name, r.format.groupName, 180, TIMING.format, run),
      rollSlot(slots.thema, names.others(), second(r).name, second(r).groupName, 160, TIMING.thema, run)
    ]);
    if (!both.every(Boolean)) return false;
    if (!(await wait(100, run))) return false;
    if (r.mode !== "fuer" && !(await rollExample(r.beispiel.text, run))) return false;
    if (r.twist) {
      slots.twist.root.classList.remove("is-dim");
      if (!(await rollSlot(slots.twist, names.twists(), r.twist.name, r.twist.typeName, 200, TIMING.twist, run))) return false;
    }
    return wait(150, run);
  }

  function renderFinal(r) {
    for (const [key, s] of Object.entries(slots)) {
      s.word.classList.remove("is-flicker");
      if (key === "twist" && !r.twist) continue;
      s.root.classList.add("is-locked");
    }
    slots.format.word.textContent = r.format.name;
    slots.format.group.textContent = r.format.groupName;
    setSecondLabel(r.mode);
    slots.thema.word.textContent = second(r).name;
    slots.thema.group.textContent = second(r).groupName;
    exampleBtn.hidden = r.mode === "fuer";
    exampleBtn.classList.remove("is-dim");
    exampleText.textContent = r.mode === "fuer" ? "" : r.beispiel.text;
    const tw = slots.twist.root;
    tw.classList.remove("is-dim");
    tw.hidden = !r.twist;
    if (r.twist) {
      slots.twist.word.textContent = r.twist.name;
      slots.twist.group.textContent = r.twist.typeName;
    } else {
      tw.classList.remove("is-locked");
    }
    renderSentence(r);
    requestAnimationFrame(() => sentenceEl.classList.remove("is-hidden"));
  }

  function updateAria(r) {
    slots.format.btn.setAttribute("aria-label", `Format: ${r.format.name}. Nur das Format neu würfeln`);
    if (r.mode === "fuer") {
      slots.thema.btn.setAttribute("aria-label", `Für wen: ${r.fuer.name}. Nur „Für wen“ neu würfeln`);
    } else {
      slots.thema.btn.setAttribute("aria-label", `Thema: ${r.bereich.name}. Nur das Thema neu würfeln`);
      exampleBtn.setAttribute("aria-label", `Beispiel: ${r.beispiel.text}. Nur das Beispiel neu würfeln`);
    }
    if (r.twist) slots.twist.btn.setAttribute("aria-label", `${r.twist.typeName}: ${r.twist.name}. Nur den Twist neu würfeln`);
  }

  function finish(r, opts) {
    const { addToHistory = true, skipped = false } = opts || {};
    current = r;
    state.busy = false;
    state.pending = null;
    renderFinal(r);
    app.classList.remove("is-spinning");
    stageEl.removeAttribute("aria-busy");
    goLabel.textContent = LABEL_IDLE;
    for (const s of Object.values(slots)) s.btn.disabled = false;
    exampleBtn.disabled = false;
    updateAria(r);
    liveEl.textContent = sentenceText(r);
    if (skipped) {
      sound.klack(170);
      haptic();
      pulseGlow();
    } else {
      sound.ding();
    }
    if (addToHistory) addHistory(r);
  }

  function skip() {
    if (!state.busy || !state.pending) return;
    const r = state.pending;
    state.run++;
    finish(r, { skipped: true, addToHistory: state.pendingHistory });
  }

  async function spin() {
    const r = drawAll();
    const run = begin(r, true);
    prepareSlots(r);
    const ok = await animateFull(r, run);
    if (!ok || run !== state.run) return;
    finish(r);
  }

  function goPress() {
    sound.init();
    goBtn.classList.add("is-pressed");
    setTimeout(() => goBtn.classList.remove("is-pressed"), 120);
    if (state.busy) skip();
    else spin();
  }

  async function reroll(kind) {
    if (!current || state.busy) return;
    sound.init();
    const r = { ...current };
    if (kind === "format") r.format = drawDifferent(bags.format, current.format, sameFormat);
    if (kind === "thema" && r.mode === "fuer") r.fuer = drawDifferent(bags.fuer, current.fuer, sameBereich);
    if (kind === "thema" && r.mode !== "fuer") {
      r.bereich = drawDifferent(bags.bereich, current.bereich, sameBereich);
      r.beispiel = exampleBag(r.bereich).next();
    }
    if (kind === "beispiel") r.beispiel = drawDifferent(exampleBag(r.bereich), current.beispiel, sameBeispiel);
    if (kind === "twist") r.twist = drawDifferent(bags.twist, current.twist, sameTwist);

    const run = begin(r, true);
    const t = TIMING.reroll;
    let ok = true;
    if (kind === "format") {
      ok = await rollSlot(slots.format, names.formats(), r.format.name, r.format.groupName, 180, t, run);
    } else if (kind === "thema" && r.mode === "fuer") {
      ok = await rollSlot(slots.thema, names.others(), r.fuer.name, r.fuer.groupName, 160, t, run);
    } else if (kind === "thema") {
      exampleBtn.classList.add("is-dim");
      ok = (await rollSlot(slots.thema, names.others(), r.bereich.name, r.bereich.groupName, 160, t, run)) &&
        (await rollExample(r.beispiel.text, run));
    } else if (kind === "beispiel") {
      ok = await rollExample(r.beispiel.text, run);
    } else if (kind === "twist") {
      const tw = slots.twist.root;
      tw.hidden = false;
      tw.classList.remove("is-dim");
      ok = await rollSlot(slots.twist, names.twists(), r.twist.name, r.twist.typeName, 200, TIMING.twist, run);
    }
    if (!ok || run !== state.run) return;
    if (!(await wait(100, run))) return;
    finish(r);
  }

  function removeTwist() {
    current = { ...current, twist: null };
    const tw = slots.twist.root;
    tw.classList.add("is-dim");
    sentenceEl.classList.add("is-hidden");
    setTimeout(() => {
      if (state.busy || current.twist) return;
      tw.hidden = true;
      tw.classList.remove("is-dim", "is-locked");
      renderSentence(current);
      sentenceEl.classList.remove("is-hidden");
      liveEl.textContent = sentenceText(current);
    }, 250);
  }

  async function restore(entry) {
    const r = fromRef(entry.ref);
    if (!r) return;
    sound.init();
    if (state.busy) state.run++;
    if (r.mode !== settings.mode) setMode(r.mode, { keepView: true });
    setTwistOn(!!r.twist);
    const run = begin(r, false);
    prepareSlots(r);
    exampleBtn.classList.remove("is-dim");
    slots.twist.root.classList.remove("is-dim");
    const d = TIMING.restore;
    const show = (el, text, vol) => (reduceMotion.matches ? fadeTo(el, text, run) : decode(el, text, d, run, vol));
    const jobs = [show(slots.format.word, r.format.name), show(slots.thema.word, second(r).name)];
    if (r.mode !== "fuer") jobs.push(show(exampleText, r.beispiel.text, 0.4));
    if (r.twist) jobs.push(show(slots.twist.word, r.twist.name));
    const done = await Promise.all(jobs);
    if (!done.every(Boolean) || run !== state.run) return;
    sound.klack(170);
    haptic();
    finish(r, { addToHistory: false });
  }

  /* ---------- Verlauf ---------- */

  // m: Modus, f: Format, b/e: Bereich + Beispiel (Thema), w: Für wen, t: Twist – jeweils [Gruppe, Index]
  function refOf(r) {
    const ref = { m: r.mode, f: [r.format.group, r.format.idx], t: r.twist ? [r.twist.type, r.twist.idx] : null };
    if (r.mode === "fuer") ref.w = [r.fuer.group, r.fuer.idx];
    else Object.assign(ref, { b: [r.bereich.group, r.bereich.idx], e: r.beispiel.idx });
    return ref;
  }

  // ältere Einträge haben noch kein m und stammen aus dem Thema-Modus
  function fromRef(ref) {
    try {
      const fg = FORMAT_GROUPS[ref.f[0]];
      const format = { ...fg.items[ref.f[1]], group: ref.f[0], groupName: fg.name, idx: ref.f[1] };
      let twist = null;
      if (ref.t) {
        const tg = D.twist[ref.t[0]];
        twist = { ...tg.items[ref.t[1]], type: ref.t[0], typeName: tg.name, idx: ref.t[1] };
        if (!twist.name) return null;
      }
      if (!format.name) return null;
      if (ref.m === "fuer") {
        const wg = D.fuer[ref.w[0]];
        const fuer = { ...wg.items[ref.w[1]], group: ref.w[0], groupName: wg.name, idx: ref.w[1] };
        return fuer.name ? { mode: "fuer", format, fuer, twist } : null;
      }
      const bg = D.themen[ref.b[0]];
      const bereich = { ...bg.bereiche[ref.b[1]], group: ref.b[0], groupName: bg.name, idx: ref.b[1] };
      const beispiel = { ...bereich.beispiele[ref.e], idx: ref.e };
      if (!bereich.name || !beispiel.text) return null;
      return { mode: "thema", format, bereich, beispiel, twist };
    } catch (e) {
      return null;
    }
  }

  function addHistory(r) {
    const text = sentenceText(r);
    if (history[0] && history[0].text === text) return;
    history.unshift({ ref: refOf(r), text, ts: Date.now() });
    history = history.slice(0, HISTORY_MAX);
    saveHistory();
    renderHistoryCount();
    if (historySheet.open) renderHistory();
  }

  function renderHistoryCount() {
    $("historyCount").textContent = `(${history.length})`;
  }

  function relTime(ts) {
    const min = Math.floor((Date.now() - ts) / 60000);
    if (min < 1) return "gerade eben";
    if (min < 60) return `vor ${min} Min.`;
    const h = Math.floor(min / 60);
    if (h < 24) return `vor ${h} Std.`;
    const d = Math.floor(h / 24);
    return d === 1 ? "gestern" : `vor ${d} Tagen`;
  }

  function renderHistory() {
    const list = $("historyList");
    list.textContent = "";
    for (const entry of history) {
      const r = fromRef(entry.ref);
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "history__item";
      const text = document.createElement("span");
      text.className = "history__text";
      text.textContent = r ? sentenceText(r) : entry.text;
      const meta = document.createElement("span");
      meta.className = "history__meta";
      meta.textContent = relTime(entry.ts);
      btn.append(text, meta);
      btn.addEventListener("click", () => {
        closeSheet(historySheet);
        restore(entry);
      });
      li.appendChild(btn);
      list.appendChild(li);
    }
    const empty = history.length === 0;
    $("historyEmpty").hidden = !empty;
    $("historyFoot").hidden = empty;
    $("clearBtn").hidden = false;
    $("clearConfirm").hidden = true;
  }

  /* ---------- Filter ---------- */

  // Im Modus „Für wen“ gibt es eigene Format-Schalter (mit Produktideen) und keinen Twist-Filter (nur Stile).
  function sections() {
    const items = (g) => g.items.length;
    if (isFuer()) {
      return [
        { pool: "formateFuer", title: "Formate", src: FORMAT_GROUPS, count: items },
        { pool: "fuer", title: "Für wen", src: D.fuer, count: items }
      ];
    }
    return [
      { pool: "formate", title: "Formate", src: D.formate, count: items },
      { pool: "themen", title: "Themen", src: D.themen, count: (g) => g.bereiche.length },
      { pool: "twist", title: "Twist würfelt aus", src: D.twist, count: items }
    ];
  }

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  const optsWrap = $("opts");

  function renderOptions() {
    const wrap = optsWrap;
    wrap.textContent = "";
    for (const sec of sections()) {
      const fs = el("fieldset", "opt-group");
      fs.appendChild(el("legend", "opt-group__title", sec.title));
      for (const [key, g] of Object.entries(sec.src)) {
        const id = `opt-${sec.pool}-${key}`;
        const label = el("label", "opt");
        label.htmlFor = id;
        const input = el("input", "switch-input");
        input.type = "checkbox";
        input.id = id;
        input.setAttribute("role", "switch");
        input.checked = !!settings[sec.pool][key];
        input.dataset.pool = sec.pool;
        input.dataset.key = key;
        const sw = el("span", "switch");
        sw.setAttribute("aria-hidden", "true");
        label.append(el("span", "opt__name", g.name), el("span", "opt__count", String(sec.count(g))), input, sw);
        fs.appendChild(label);
      }
      const note = el("p", "opt-group__note", "Mindestens eine Gruppe bleibt an.");
      note.dataset.note = sec.pool;
      note.hidden = true;
      fs.appendChild(note);
      wrap.appendChild(fs);
    }
    refreshOptionStates();
  }

  optsWrap.addEventListener("change", (e) => {
    const t = e.target;
    if (!t.dataset || !t.dataset.pool) return;
    settings[t.dataset.pool][t.dataset.key] = t.checked;
    saveSettings();
    buildPools();
    refreshOptionStates();
    updateCombos();
  });

  function refreshOptionStates() {
    for (const sec of sections()) {
      const active = Object.keys(settings[sec.pool]).filter((k) => settings[sec.pool][k]);
      const lastOne = active.length === 1;
      for (const key of Object.keys(sec.src)) {
        const input = $(`opt-${sec.pool}-${key}`);
        if (input) input.disabled = lastOne && settings[sec.pool][key];
      }
      const note = document.querySelector(`[data-note="${sec.pool}"]`);
      if (note) note.hidden = !lastOne;
    }
  }

  const fmtNum = (n) => n.toLocaleString("de-DE");

  function updateCombos() {
    const others = isFuer() ? pools.fuer.length : pools.bereiche.reduce((sum, b) => sum + b.beispiele.length, 0);
    let total = pools.formats.length * others;
    if (settings.twistOn) total *= pools.twists.length;
    $("comboNum").textContent = fmtNum(total);
    $("comboLabel").textContent = settings.twistOn ? "mögliche Kombinationen mit Twist" : "mögliche Kombinationen";
  }

  /* ---------- Ton & Twist ---------- */

  function setSound(on) {
    settings.sound = on;
    saveSettings();
    sound.setEnabled(on);
    soundBtn.classList.toggle("is-muted", !on);
    soundBtn.setAttribute("aria-label", on ? "Ton ausschalten" : "Ton einschalten");
    optSound.checked = on;
  }

  function setTwistOn(on) {
    settings.twistOn = on;
    twistToggle.checked = on;
    saveSettings();
    updateCombos();
  }

  /* ---------- Modus ---------- */

  const modeToggle = $("modeToggle");
  const PLACEHOLDER = { thema: ["Was bau ich?", "Und worüber?"], fuer: ["Was bau ich?", "Und für wen?"] };

  // Startansicht des aktuellen Modus: die beiden Fragen statt eines Ergebnisses
  function showFresh() {
    current = null;
    app.classList.add("is-fresh");
    setSecondLabel(settings.mode);
    for (const s of Object.values(slots)) {
      s.root.classList.remove("is-locked", "is-dim");
      s.word.classList.remove("is-flicker");
      s.group.textContent = "";
      s.btn.disabled = true;
    }
    slots.format.word.textContent = PLACEHOLDER[settings.mode][0];
    slots.thema.word.textContent = PLACEHOLDER[settings.mode][1];
    slots.twist.root.hidden = true;
    exampleBtn.hidden = true;
    exampleBtn.disabled = true;
    sentenceEl.textContent = "Drück den Knopf – oder die Leertaste.";
    sentenceEl.classList.remove("is-hidden");
    slots.format.btn.setAttribute("aria-label", "Nur das Format neu würfeln");
    slots.thema.btn.setAttribute("aria-label", isFuer() ? "Nur „Für wen“ neu würfeln" : "Nur das Thema neu würfeln");
    liveEl.textContent = "";
  }

  // keepView: beim Wiederherstellen aus dem Verlauf nicht erst auf die Startansicht springen
  function setMode(mode, opts) {
    settings.mode = mode;
    modeToggle.checked = mode === "fuer";
    saveSettings();
    buildPools();
    renderOptions();
    updateCombos();
    if (opts && opts.keepView) return;
    if (state.busy) {
      state.run++;
      state.busy = false;
      state.pending = null;
      app.classList.remove("is-spinning");
      stageEl.removeAttribute("aria-busy");
      goLabel.textContent = LABEL_IDLE;
    }
    showFresh();
  }

  /* ---------- Sheets ---------- */

  function openSheet(d) {
    if (d.open) return;
    if (d === historySheet) renderHistory();
    d.classList.remove("is-closing");
    d.showModal();
  }

  function closeSheet(d) {
    if (!d.open || d.classList.contains("is-closing")) return;
    if (reduceMotion.matches) {
      d.close();
      return;
    }
    d.classList.add("is-closing");
    setTimeout(() => {
      d.classList.remove("is-closing");
      d.close();
    }, 220);
  }

  for (const d of [historySheet, settingsSheet]) {
    d.addEventListener("cancel", (e) => {
      e.preventDefault();
      closeSheet(d);
    });
    d.addEventListener("click", (e) => {
      if (e.target === d) closeSheet(d);
    });
    d.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => closeSheet(d)));
  }

  /* ---------- Ereignisse ---------- */

  goBtn.addEventListener("click", goPress);
  slots.format.btn.addEventListener("click", () => reroll("format"));
  slots.thema.btn.addEventListener("click", () => reroll("thema"));
  slots.twist.btn.addEventListener("click", () => reroll("twist"));
  exampleBtn.addEventListener("click", () => reroll("beispiel"));

  $("historyBtn").addEventListener("click", () => openSheet(historySheet));
  $("settingsBtn").addEventListener("click", () => openSheet(settingsSheet));

  $("clearBtn").addEventListener("click", () => {
    $("clearBtn").hidden = true;
    $("clearConfirm").hidden = false;
    $("clearNo").focus();
  });
  $("clearNo").addEventListener("click", () => {
    $("clearConfirm").hidden = true;
    $("clearBtn").hidden = false;
    $("clearBtn").focus();
  });
  $("clearYes").addEventListener("click", () => {
    history = [];
    saveHistory();
    renderHistoryCount();
    renderHistory();
  });

  soundBtn.addEventListener("click", () => {
    sound.init();
    setSound(!settings.sound);
  });
  optSound.addEventListener("change", () => {
    sound.init();
    setSound(optSound.checked);
  });

  twistToggle.addEventListener("change", () => {
    sound.init();
    setTwistOn(twistToggle.checked);
    if (!current || state.busy) return;
    if (settings.twistOn && !current.twist) reroll("twist");
    else if (!settings.twistOn && current.twist) removeTwist();
  });

  modeToggle.addEventListener("change", () => {
    sound.init();
    setMode(modeToggle.checked ? "fuer" : "thema");
  });

  // Leertaste / Enter würfeln, solange kein Bedienelement den Fokus hat.
  document.addEventListener("keydown", (e) => {
    if (e.key !== " " && e.key !== "Enter") return;
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
    if (document.querySelector("dialog[open]")) return;
    const t = e.target;
    if (t && t !== document.body && t.closest && t.closest("button, input, a, label, select, textarea, [contenteditable]")) return;
    e.preventDefault();
    if (e.repeat) return;
    goPress();
  });

  /* ---------- Start ---------- */

  buildPools();
  renderOptions();
  twistToggle.checked = settings.twistOn;
  modeToggle.checked = isFuer();
  setSound(settings.sound);
  updateCombos();
  renderHistoryCount();
  showFresh();

  // Offline-Fähigkeit nur, wenn die Seite als installierbare App ausgeliefert wird.
  if ("serviceWorker" in navigator && document.querySelector('link[rel="manifest"]') && /^https?:$/.test(location.protocol)) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }

  // für die Datenprüfung im Browser
  window.WBI = { drawAll, sentenceText, pools: () => pools, settings, setMode };
})();
