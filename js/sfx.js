// Tiny, dependency-free UI sound effects using WebAudio.
// Creates subtle, tasteful clicks and whooshes for UI actions.
(function () {
  let ctx;
  let enabled = true;

  function ensureCtx() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      ctx = new AudioCtx();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function envGain(duration = 0.12, attack = 0.002, release = 0.08) {
    const c = ensureCtx();
    if (!c) return null;
    const g = c.createGain();
    const now = c.currentTime;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.5, now + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration + release);
    g.connect(c.destination);
    return g;
  }

  function osc(type = 'sine', freq = 420, duration = 0.12) {
    const c = ensureCtx();
    if (!c) return;
    const o = c.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    const g = envGain(duration);
    if (!g) return;
    o.connect(g);
    o.start();
    o.stop(c.currentTime + duration + 0.1);
  }

  function blip(freqStart = 520, freqEnd = 300, duration = 0.11) {
    const c = ensureCtx();
    if (!c) return;
    const o = c.createOscillator();
    o.type = 'triangle';
    o.frequency.setValueAtTime(freqStart, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(freqEnd, c.currentTime + duration);
    const g = envGain(duration, 0.003, 0.06);
    if (!g) return;
    o.connect(g);
    o.start();
    o.stop(c.currentTime + duration + 0.05);
  }

  function click() { if (!enabled) return; osc('sine', 440, 0.07); }
  function open() { if (!enabled) return; blip(600, 320, 0.12); }
  function close() { if (!enabled) return; blip(320, 220, 0.10); }

  function bindClicks() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-click-sfx]');
      if (target) click();
    });
  }

  function setEnabled(v) { enabled = !!v; }

  window.SFX = { click, open, close, setEnabled };
  window.addEventListener('DOMContentLoaded', bindClicks);
})();

