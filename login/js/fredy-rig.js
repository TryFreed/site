/*!
 * fredy-rig.js — Fredy vivo (robô Orbit Fold) em SVG com partes separadas.
 * JavaScript puro, sem dependências. Desenho = o oficial (design/rebrand/orbit-fold/fredy/, mobile/src/ui/FredyRobot.tsx).
 *
 *   const f = FredyRig.create(container, { size: 120 });
 *   f.setExpression('happy', 300);
 *   f.play('wave');
 *   f.setState('thinking');
 *   f.speak(true, 0.6); f.speak(false);
 *   f.lookAt(clientX, clientY);
 *   f.destroy();
 *
 * Sem boca e sem lip-sync: a fala aparece em olhos, visor, peito, cabeça e mãos.
 * Um único requestAnimationFrame por instância; pausa com a aba oculta ou fora da tela.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.FredyRig = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var ORB_A = 'M96.17 26.66C96.97 27.58 99.62 30.19 100.96 32.22C102.3 34.24 103.41 36.5 104.22 38.79C105.03 41.08 105.56 43.53 105.82 45.95C106.08 48.37 106.07 50.87 105.78 53.3C105.5 55.74 104.9 58.19 104.1 60.53C103.3 62.88 102.22 65.19 100.98 67.37C99.74 69.56 98.26 71.67 96.66 73.64C95.05 75.62 93.25 77.5 91.35 79.23C89.46 80.96 87.4 82.58 85.29 84.04C83.17 85.5 80.93 86.83 78.67 87.99C76.41 89.16 74.05 90.17 71.72 91.03C69.38 91.88 66.98 92.57 64.64 93.11C62.29 93.64 59.93 94 57.64 94.21C55.36 94.42 53.09 94.46 50.94 94.36C48.78 94.25 46.67 93.98 44.7 93.58C42.72 93.18 40.83 92.62 39.08 91.95C37.33 91.28 35.69 90.47 34.18 89.56C32.67 88.65 30.72 86.99 30.03 86.48A1.25 1.25 0 0 0 31.71 84.63C32.34 85.05 34.1 86.48 35.49 87.14C36.89 87.81 38.45 88.31 40.05 88.62C41.66 88.94 43.39 89.07 45.14 89.03C46.88 88.99 48.71 88.76 50.52 88.38C52.33 88 54.19 87.44 56 86.75C57.81 86.05 59.63 85.19 61.38 84.22C63.13 83.25 64.86 82.13 66.5 80.93C68.13 79.73 69.72 78.4 71.18 77.02C72.65 75.64 74.04 74.15 75.3 72.65C76.56 71.15 77.72 69.58 78.73 68.03C79.75 66.48 80.65 64.89 81.41 63.36C82.17 61.83 82.79 60.29 83.3 58.85C83.8 57.41 84.16 56.01 84.44 54.72C84.71 53.43 84.85 52.23 84.94 51.13C85.02 50.03 85.02 49.04 84.93 48.14C84.84 47.24 84.65 46.45 84.41 45.73C84.16 45.02 83.85 44.41 83.46 43.82C83.08 43.24 82.32 42.5 82.09 42.24A10.5 10.5 0 0 1 96.17 26.66Z';
  var ORB_B = 'M30.03 86.48C29.45 85.84 27.57 84.03 26.55 82.62C25.54 81.22 24.64 79.69 23.92 78.03C23.21 76.38 22.63 74.6 22.25 72.72C21.87 70.85 21.66 68.84 21.65 66.78C21.65 64.72 21.83 62.55 22.22 60.37C22.6 58.19 23.2 55.93 23.98 53.7C24.77 51.48 25.76 49.21 26.93 47.02C28.1 44.82 29.47 42.62 31 40.53C32.52 38.44 34.24 36.39 36.09 34.48C37.94 32.58 39.96 30.74 42.08 29.09C44.21 27.43 46.48 25.89 48.82 24.55C51.16 23.22 53.63 22.03 56.13 21.08C58.63 20.13 61.23 19.35 63.81 18.85C66.39 18.34 69.04 18.07 71.62 18.04C74.2 18.02 76.8 18.23 79.3 18.68C81.8 19.13 84.28 19.81 86.61 20.75C88.93 21.69 91.21 22.89 93.25 24.33C95.29 25.77 97.22 27.5 98.84 29.4C100.46 31.3 101.87 33.48 102.96 35.73C104.04 37.98 104.95 41.69 105.35 42.88L84.77 47.06C84.64 46.68 84.35 45.49 84.03 44.82C83.71 44.15 83.34 43.58 82.86 43.03C82.39 42.48 81.86 41.98 81.18 41.51C80.51 41.05 79.73 40.6 78.81 40.25C77.89 39.89 76.82 39.56 75.64 39.36C74.46 39.16 73.13 39.05 71.72 39.04C70.3 39.03 68.77 39.12 67.17 39.31C65.58 39.49 63.87 39.75 62.14 40.13C60.41 40.51 58.6 41 56.8 41.6C55 42.2 53.15 42.92 51.35 43.74C49.55 44.57 47.74 45.51 46.01 46.54C44.28 47.57 42.58 48.72 40.99 49.94C39.4 51.16 37.87 52.48 36.49 53.86C35.1 55.23 33.81 56.69 32.68 58.18C31.56 59.67 30.55 61.23 29.73 62.79C28.91 64.35 28.24 65.97 27.77 67.56C27.3 69.14 27 70.76 26.92 72.32C26.83 73.88 26.94 75.45 27.27 76.92C27.59 78.38 28.13 79.82 28.87 81.11C29.61 82.39 31.23 84.04 31.71 84.63A1.25 1.25 0 0 1 30.03 86.48Z';

  // ---------- utilidades ----------
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  var EASE = {
    lin: function (t) { return t; },
    io: function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
    out: function (t) { return 1 - Math.pow(1 - t, 3); },
    in: function (t) { return t * t * t; },
    back: function (t) { var c1 = 1.4, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
  };
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  var uid = 0;

  // ---------- 16 expressões (só olhos + cabeça + postura dos braços + enfeites) ----------
  // Cada olho é uma "cápsula curvada": T = espessura, L = comprimento da linha central,
  // q = curvatura (∩), rot = inclinação, lt/la = pálpebra de cima (fração, ângulo), lb = pálpebra de baixo,
  // tn = tom (0 ciano, 1 ciano claro). Círculo = L 0; ∩ do "feliz" = L 26 + q 22. Tudo interpolável.
  var EK = ['dx', 'dy', 'T', 'L', 'q', 'rot', 'lt', 'la', 'lb', 'tn'];
  function E(T, L, q, rot, dx, dy, lt, la, lb, tn) {
    return { T: T, L: L || 0, q: q || 0, rot: rot || 0, dx: dx || 0, dy: dy || 0, lt: lt || 0, la: la || 0, lb: lb || 0, tn: tn || 0 };
  }
  function mirror(e) { var o = {}; for (var i = 0; i < EK.length; i++) o[EK[i]] = e[EK[i]]; o.dx = -e.dx; o.rot = -e.rot; o.la = -e.la; return o; }
  var FXK = ['dots', 'waves', 'bars', 'sparkle', 'confetti', 'badge', 'ask', 'pause'];

  var DEFS = {
    neutral:   { l: E(16) },
    happy:     { l: E(7, 26, 22, 0, 0, 5), tilt: -3, Lsh: 26, Rsh: 26, fx: { sparkle: 1 } },
    excited:   { l: E(20, 0, 0, 0, 0, -2), tilt: -4, Lsh: 32, Rsh: 32, halo: .2, vglow: .05, fx: { sparkle: 1 } },
    curious:   { l: E(22, 0, 0, 0, 0, -1), r: E(14, 0, 0, 0, 0, 1, .12, 0, 0), tilt: 6, hy: -1 },
    thinking:  { l: E(10, 12, 0, 90, -10, -4), r: E(10, 12, 0, 90, -22, -4), tilt: 4, fx: { dots: 1 } },
    listening: { l: E(10, 8, 0, 0, 0, 2, 0, 0, 0, 1), tilt: -3, fx: { waves: 1 } },
    speaking:  { l: E(12, 12, 0, 90, 0, 0), Lsh: 14, Rsh: 14, Lel: 4, Rel: 4, fx: { bars: 1 } },
    surprised: { l: E(26, 0, 0, 0, 0, -2), hy: -3, Lsh: 30, Rsh: 30, halo: .16 },
    confident: { l: E(14, 8, 0, 0, 0, 1, .3, 0, .1), tilt: -3, hy: -2, Lsh: 18, Rsh: 18 },
    concerned: { l: E(18, 0, 0, 0, 0, 3, .22, -20, 0, .35), tilt: 5, hy: 2, Lsh: 4, Rsh: 4, Lel: 8, Rel: 8, halo: .09 },
    success:   { l: E(9, 34, 13, 0, 0, 7), tilt: -2, Rsh: 118, Rel: 25, fx: { confetti: 1 } },
    celebrating: { l: E(10, 36, 16, 0, 0, 6), tilt: -4, Lsh: 140, Rsh: 140, Lel: 15, Rel: 15, fx: { confetti: 1, sparkle: 1 } },
    sleepy:    { l: E(16, 0, 0, 0, 0, 5, .58, 0, .04, .5), tilt: 8, hy: 4, Lsh: 3, Rsh: 3, bright: .6, halo: .05 },
    confused:  { l: E(15, 0, 0, 0, 0, 3, .25, -12), r: E(18, 0, 0, 0, 0, -4), tilt: -8, fx: { ask: 1 } },
    alert:     { l: E(22, 0, 0, 0, 0, 0, .16, 8), fx: { badge: 1 } },
    playful:   { l: E(7, 22, 18, 0, 0, 5), r: E(18, 0, 0, 0, 0, -1), tilt: 6, Lsh: 28, Rsh: 28, fx: { sparkle: 1 } },
    _paused:   { l: E(16, 0, 0, 0, 0, 3, .35), tilt: 2, hy: 2, Lsh: 6, Rsh: 6, bright: .55, halo: .06, fx: { pause: 1 } }
  };
  var EXPRESSIONS = ['neutral', 'happy', 'excited', 'curious', 'thinking', 'listening', 'speaking', 'surprised',
    'confident', 'concerned', 'success', 'celebrating', 'sleepy', 'confused', 'alert', 'playful'];

  function flat(d) {
    var o = { tilt: d.tilt || 0, hx: d.hx || 0, hy: d.hy || 0,
      Lsh: d.Lsh == null ? 10 : d.Lsh, Rsh: d.Rsh == null ? 10 : d.Rsh, Lel: d.Lel || 0, Rel: d.Rel || 0, Lhr: 0, Rhr: 0,
      halo: d.halo == null ? .12 : d.halo, bright: d.bright == null ? 1 : d.bright, vglow: d.vglow || 0 };
    var l = d.l, r = d.r || mirror(d.l), i;
    for (i = 0; i < EK.length; i++) { o['l.' + EK[i]] = l[EK[i]]; o['r.' + EK[i]] = r[EK[i]]; }
    for (i = 0; i < FXK.length; i++) o['fx.' + FXK[i]] = (d.fx && d.fx[FXK[i]]) || 0;
    return o;
  }
  var FLAT = {}; for (var dk in DEFS) FLAT[dk] = flat(DEFS[dk]);
  var VEC_KEYS = Object.keys(FLAT.neutral);

  // ---------- gestos: linhas do tempo por canal ----------
  // Canais ABSOLUTOS (braços: Lsh/Lel/Lhr/Lth/Lfi e R*) substituem a postura base e voltam a ela no fim.
  // Todos os outros (tilt,hx,hy,bx,by,br,gx,gy) são ADITIVOS. Tempos em ms. e = easing de chegada.
  // sh = ombro (0 pendurado, + abre/levanta), el = cotovelo (+ dobra na mesma direção), hr = punho, th = polegar, fi = indicador.
  var ABS = { Lsh: 1, Lel: 1, Lhr: 1, Lth: 1, Lfi: 1, Rsh: 1, Rel: 1, Rhr: 1, Rth: 1, Rfi: 1 };
  var GESTURES = {
    wave: { expr: 'happy', dur: 3300, keys: [
      { t: 200, e: 'io', Rsh: 2, Rel: 0, tilt: 1.5, hy: 1.5, br: -1 },
      { t: 700, e: 'back', Rsh: 108, Rel: 34, Rhr: 24, Lsh: 14, tilt: -5, gx: -.15, br: 0, hy: -1 },
      { t: 930, e: 'io', Rel: 66, Rhr: 2, Rsh: 114 }, { t: 1160, Rel: 4, Rhr: 48, Rsh: 102 }, { t: 1390, Rel: 66, Rhr: 2, Rsh: 114 },
      { t: 1620, Rel: 4, Rhr: 48, Rsh: 102 }, { t: 1850, Rel: 62, Rhr: 6, Rsh: 112 }, { t: 2080, Rel: 14, Rhr: 40, Rsh: 104 },
      { t: 2300, e: 'io', Rel: 34, Rhr: 24, Rsh: 108 }, { t: 2600, e: 'io', Rel: 32, Rsh: 106 } ] },
    thumbsUp: { expr: 'happy', dur: 3400, keys: [
      { t: 220, e: 'io', Rsh: 3, Rel: 0, tilt: 1, hy: 1.5 },
      { t: 780, e: 'back', Rsh: 106, Rel: 30, Rhr: 40, Rth: 0, tilt: -3, hy: -1 },
      { t: 1050, e: 'out', Rth: 1 },
      { t: 1300, e: 'io', hy: 2.6, tilt: -1, Rel: 54, Rhr: 22, Rsh: 112 }, { t: 1550, e: 'io', hy: -1, tilt: -3, Rel: 14, Rhr: 50, Rsh: 102 },
      { t: 1800, e: 'io', hy: 2.4, Rel: 50, Rhr: 24, Rsh: 112 }, { t: 2050, e: 'io', hy: -.5, Rel: 28, Rhr: 40, Rsh: 106 },
      { t: 2500, e: 'io', Rth: 1 }, { t: 2700, e: 'io', Rth: 0 } ] },
    point: { expr: 'confident', dur: 2800, keys: [
      { t: 180, e: 'io', Rsh: 0, Rel: 0, tilt: -1.5, gx: .1 },
      { t: 640, e: 'back', Rsh: 80, Rel: 4, Rfi: 0, tilt: 3, gx: .75, br: 1.5, hx: 1 },
      { t: 820, e: 'out', Rfi: 1 }, { t: 1050, e: 'io', Rsh: 86 }, { t: 1250, e: 'io', Rsh: 80 },
      { t: 1700, Rsh: 80, Rfi: 1 }, { t: 1900, e: 'io', Rfi: 0 } ] },
    celebrate: { expr: 'celebrating', dur: 3800, keys: [
      { t: 260, e: 'io', Lsh: 0, Rsh: 0, Lel: 0, Rel: 0, by: 3, hy: 2, br: 0 },
      { t: 560, e: 'out', Lsh: 150, Rsh: 150, Lel: 12, Rel: 12, by: -9, hy: -2 },
      { t: 860, e: 'in', by: 0 }, { t: 1000, e: 'out', by: 1.5 },
      { t: 1300, e: 'io', Lsh: 166, Rsh: 166, by: -4, tilt: 4 }, { t: 1650, e: 'io', Lsh: 140, Rsh: 140, by: 0, tilt: -4 },
      { t: 1950, e: 'io', Lsh: 166, Rsh: 166, by: -4, tilt: 4 }, { t: 2350, e: 'io', Lsh: 145, Rsh: 145, by: 0, tilt: -2 } ] },
    explain: { expr: 'confident', dur: 3600, keys: [
      { t: 260, e: 'io', Lsh: 8, Rsh: 8, hy: 1.2, tilt: 1 },
      { t: 700, e: 'io', Lsh: 42, Lel: 58, Rsh: 34, Rel: 40, tilt: -2, hy: -.5, gx: -.2 },
      { t: 1200, e: 'io', Lsh: 36, Lel: 40, Rsh: 46, Rel: 62, tilt: 2, gx: .2 },
      { t: 1700, e: 'io', Lsh: 44, Lel: 62, Rsh: 34, Rel: 36, tilt: -1.5, hy: .8, gx: -.15 },
      { t: 2200, e: 'io', Lsh: 38, Lel: 44, Rsh: 44, Rel: 60, tilt: 2, gx: .15 },
      { t: 2700, e: 'io', Lsh: 40, Lel: 54, Rsh: 40, Rel: 50, tilt: 0, gx: 0 } ] },
    think: { expr: 'thinking', dur: 3800, keys: [
      { t: 260, e: 'io', Rsh: 12, tilt: 0, hy: 1 },
      { t: 900, e: 'out', Rsh: 66, Rel: 138, Rhr: -14, tilt: 5, gx: -.6, gy: -.5, hy: 0 },
      { t: 1800, e: 'io', Rhr: -8, gx: -.45, gy: -.6 }, { t: 2300, e: 'io', Rhr: -16, gx: -.65, gy: -.4, tilt: 6 },
      { t: 2900, e: 'io', Rhr: -12, gx: -.5, gy: -.5 } ] },
    welcome: { expr: 'happy', dur: 3000, keys: [
      { t: 240, e: 'io', Lsh: 2, Rsh: 2, hy: 1.5, by: 1 },
      { t: 780, e: 'back', Lsh: 64, Rsh: 64, Lel: 8, Rel: 8, Lhr: 16, Rhr: -16, hy: -1.5, tilt: -2, by: -1 },
      { t: 1100, e: 'io', Lsh: 58, Rsh: 58 }, { t: 1900, e: 'io', Lsh: 60, Rsh: 60, tilt: 1.5 } ] },
    surprise: { expr: 'surprised', dur: 2300, keys: [
      { t: 90, e: 'out', Lsh: 38, Rsh: 38, Lel: 12, Rel: 12, by: -4, br: -2.5, hy: -3, Lhr: 14, Rhr: -14, kick: 1 },
      { t: 260, e: 'io', by: -1.5, br: -1.2 }, { t: 1100, e: 'io', br: -.8 } ] },
    encourage: { expr: 'confident', dur: 3400, keys: [
      { t: 240, e: 'io', Rsh: 2, Rel: 0, hy: 2, tilt: 2, Lsh: 18 },
      { t: 740, e: 'back', Rsh: 100, Rel: 42, Rhr: 36, hy: -1, tilt: -2 },
      { t: 1050, e: 'io', Rel: 72, hy: 2.2, tilt: 1.5 }, { t: 1300, e: 'io', Rel: 42, hy: -.5, tilt: -2 },
      { t: 1600, e: 'io', Rel: 72, hy: 2.2, tilt: 1.5 }, { t: 1850, e: 'io', Rel: 44, hy: -.5, tilt: -1 },
      { t: 2300, e: 'io', hy: 0 } ] },
    goodbye: { expr: 'happy', dur: 4300, keys: [
      { t: 260, e: 'io', Lsh: 4, Lel: 0, tilt: -1, hy: 1 },
      { t: 900, e: 'back', Lsh: 108, Lel: 34, Lhr: 24, tilt: 4, gx: .1, hy: -.5 },
      { t: 1250, e: 'io', Lel: 62, Lhr: 4, Lsh: 113 }, { t: 1650, Lel: 8, Lhr: 46, Lsh: 103 }, { t: 2050, Lel: 62, Lhr: 4, Lsh: 113 },
      { t: 2450, Lel: 10, Lhr: 44, Lsh: 104 }, { t: 2850, e: 'io', Lel: 34, Lhr: 24, Lsh: 104, tilt: 2 } ],
      events: [{ t: 3000, blink: 'slow' }] }
  };
  var GESTURE_NAMES = Object.keys(GESTURES);
  // gesto espelhado (braço esquerdo <-> direito, direções invertidas)
  var MIRROR_DEFAULT_LEFT = { goodbye: 1 };
  function mirrorKeys(keys) {
    return keys.map(function (k) {
      var o = {};
      for (var c in k) {
        var v = k[c], n = c;
        if (c[0] === 'L' && ABS[c]) n = 'R' + c.slice(1);
        else if (c[0] === 'R' && ABS[c]) n = 'L' + c.slice(1);
        if (/^(L|R)hr$/.test(c)) v = -v;
        if (c === 'tilt' || c === 'gx' || c === 'hx' || c === 'br') v = -v;
        o[n] = v;
      }
      return o;
    });
  }

  function makeTL(spec, opts) {
    var keys = spec.keys, side = opts.side, native = MIRROR_DEFAULT_LEFT[spec.name] ? 'left' : 'right';
    if (side && side !== native) keys = mirrorKeys(keys);
    var ch = {}, i, c;
    for (i = 0; i < keys.length; i++) {
      for (c in keys[i]) {
        if (c === 't' || c === 'e' || c === 'kick') continue;
        (ch[c] || (ch[c] = [])).push({ t: keys[i].t, v: keys[i][c], e: EASE[keys[i].e] ? keys[i].e : 'io' });
      }
    }
    var kick = 0; for (i = 0; i < keys.length; i++) if (keys[i].kick) kick = keys[i].t;
    return { name: spec.name, dur: spec.dur, ch: ch, expr: spec.expr, events: spec.events || [], kickAt: kick, abs: !opts.additive };
  }
  // avalia um canal no tempo t: pontos = [início, ...chaves, fim]. início/fim = null -> resolvidos por quem chama
  function evalCh(pts, t, dur, startV, endV) {
    var a = { t: 0, v: startV, e: 'io' }, b;
    var i, n = pts.length;
    for (i = 0; i < n; i++) {
      b = pts[i];
      if (t < b.t) return lerp(a.v, b.v, EASE[b.e](clamp((t - a.t) / Math.max(1, b.t - a.t), 0, 1)));
      a = b;
    }
    if (t >= dur) return endV;
    return lerp(a.v, endV, EASE.io(clamp((t - a.t) / Math.max(1, dur - a.t), 0, 1)));
  }

  // ---------- ações do idle (microlinhas aditivas, curtas, com sorteio ponderado) ----------
  function R(r, a, b) { return a + r() * (b - a); }
  function sgn(r) { return r() < .5 ? -1 : 1; }
  var IDLE = [
    { id: 'lookSide', w: 3, cd: 5000, run: function (r) { var s = sgn(r), a = R(r, .35, .9), h = R(r, 900, 1900);
      return { blink: r() < .35, dur: h + 900, keys: [{ t: 260, e: 'io', gx: s * a, gy: R(r, -.25, .2), hx: s * .8 }, { t: 260 + h, e: 'io', gx: s * a * .85 }] }; } },
    { id: 'lookUp', w: 1.4, cd: 12000, run: function (r) { var h = R(r, 800, 1500);
      return { dur: h + 800, keys: [{ t: 300, e: 'io', gx: R(r, -.3, .3), gy: -R(r, .45, .7), hy: -.6 }, { t: 300 + h, e: 'io', gy: -.5 }] }; } },
    { id: 'tilt', w: 2.5, cd: 8000, run: function (r) { var s = sgn(r) * R(r, 3, 7), h = R(r, 1200, 2600);
      return { dur: h + 1000, keys: [{ t: 520, e: 'io', tilt: s, hx: s * .25, gx: s * .03 }, { t: 520 + h, e: 'io', tilt: s * .85 }] }; } },
    { id: 'armAdjust', w: 2, cd: 11000, run: function (r) { var side = r() < .5 ? 'L' : 'R', a = R(r, 5, 11);
      var k1 = {}, k2 = {}; k1[side + 'sh'] = a; k1[side + 'el'] = R(r, 4, 14); k1.e = 'io'; k1.t = 600;
      k2[side + 'sh'] = a * .35; k2[side + 'el'] = k1[side + 'el'] * .5; k2.t = 1500; k2.e = 'io';
      return { dur: 2300, keys: [k1, k2] }; } },
    { id: 'shift', w: 1.5, cd: 10000, run: function (r) { var s = sgn(r), h = R(r, 1400, 2400);
      return { dur: h + 1200, keys: [{ t: 700, e: 'io', bx: s * R(r, 1.2, 2.6), br: s * R(r, .6, 1.4), tilt: -s * .8 }, { t: 700 + h, e: 'io', bx: s * 1.4 }] }; } },
    { id: 'sigh', w: 1, cd: 16000, run: function (r) { return { dur: 3200, keys: [{ t: 1400, e: 'io', breath: 1.9, hy: -.9, Lsh: 5, Rsh: 5 }, { t: 2200, e: 'io', breath: -.5, hy: .9, Lsh: -1, Rsh: -1 }] }; } },
    { id: 'antenna', w: 1, cd: 15000, run: function (r) { return { dur: 900, kick: R(r, .8, 1.2) * sgn(r), keys: [{ t: 200, tilt: 0 }] }; } },
    { id: 'curious', w: 1, cd: 26000, expr: 'curious', run: function (r) { var s = sgn(r), h = R(r, 1300, 2200);
      return { dur: h + 800, exprFor: h + 200, keys: [{ t: 380, e: 'io', tilt: s * 3, gx: s * .35 }, { t: 380 + h, e: 'io', tilt: s * 2 }] }; } },
    { id: 'satisfied', w: .8, cd: 32000, expr: 'happy', run: function (r) { var h = R(r, 1200, 1800);
      return { dur: h + 800, exprFor: h, keys: [{ t: 300, e: 'io', hy: 1.6 }, { t: 600, e: 'io', hy: -.6 }, { t: 900, hy: 0 }] }; } }
  ];

  // ---------- montagem do SVG ----------
  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function html(svgStr) { var d = document.createElementNS(NS, 'g'); d.innerHTML = svgStr; return d; }

  function buildSVG(P, size) {
    var svg = el('svg', { xmlns: NS, viewBox: '-26 -24 252 238', width: size, height: Math.round(size * 238 / 252), role: 'img', focusable: 'false' });
    svg.style.cssText = 'display:block;overflow:visible';
    var u = function (s) { return 'url(#' + P + s + ')'; };
    var S = '#B9C6DC', S2 = '#9FB0C9';
    svg.innerHTML =
      '<defs>' +
      '<linearGradient id="' + P + 'w" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E1E9F5"/></linearGradient>' +
      '<linearGradient id="' + P + 's" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D5DFEE"/><stop offset="1" stop-color="#9FB0C9"/></linearGradient>' +
      '<linearGradient id="' + P + 'arm" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F4F7FC"/><stop offset="1" stop-color="#CBD6E8"/></linearGradient>' +
      '<linearGradient id="' + P + 'v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E1632"/><stop offset="1" stop-color="#03050F"/></linearGradient>' +
      '<linearGradient id="' + P + 'flap" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2563FF"/><stop offset="1" stop-color="#21D4FF"/></linearGradient>' +
      '<linearGradient id="' + P + 'ga" gradientUnits="userSpaceOnUse" x1="22" y1="95" x2="98" y2="22"><stop offset="0" stop-color="#0A3BFF"/><stop offset="1" stop-color="#2563FF"/></linearGradient>' +
      '<linearGradient id="' + P + 'gb" gradientUnits="userSpaceOnUse" x1="100" y1="40" x2="28" y2="98"><stop offset="0" stop-color="#2583FF"/><stop offset="1" stop-color="#21D4FF"/></linearGradient>' +
      '<clipPath id="' + P + 'visor"><path d="M64 30H136Q160 30 160 54V80L138 100H64Q40 100 40 76V54Q40 30 64 30Z"/></clipPath>' +
      '<clipPath id="' + P + 'ctl"><rect/></clipPath><clipPath id="' + P + 'cbl"><rect/></clipPath>' +
      '<clipPath id="' + P + 'ctr"><rect/></clipPath><clipPath id="' + P + 'cbr"><rect/></clipPath>' +
      '</defs>' +
      '<g class="root">' +
        '<rect x="68" y="188" width="28" height="16" rx="6" fill="' + u('s') + '"/><rect x="104" y="188" width="28" height="16" rx="6" fill="' + u('s') + '"/>' +
        '<g class="body">' +
          '<rect x="88" y="104" width="24" height="12" rx="4" fill="' + u('s') + '"/>' +
          '<path d="M72 112H128Q142 112 142 126L135 176Q134 190 120 190H80Q66 190 65 176L58 126Q58 112 72 112Z" fill="' + u('w') + '" stroke="' + S + '" stroke-width="1.5"/>' +
          '<rect x="76" y="174" width="48" height="4" rx="2" fill="' + u('s') + '"/>' +
          '<g class="chest"><rect x="84" y="128" width="32" height="32" rx="9" fill="#0B1B3B"/>' +
            '<rect class="chestglow" x="83" y="127" width="34" height="34" rx="10" fill="none" stroke="#21D4FF" stroke-width="2" opacity="0"/>' +
            '<g transform="translate(85.2 129.2) scale(.25)"><path fill="' + u('gb') + '" d="' + ORB_A + '"/><path fill="' + u('ga') + '" d="' + ORB_B + '"/></g></g>' +
        '</g>' +
        '<g class="armsBack"></g>' +
        '<g class="head">' +
          '<g class="ant"><rect x="96" y="0" width="8" height="18" rx="4" fill="' + u('s') + '"/>' +
            '<circle class="antglow" cx="100.5" cy="-7.5" r="15" fill="#21D4FF" opacity="0"/>' +
            '<g transform="translate(81.4 -24.5) scale(.3)"><path fill="' + u('gb') + '" d="' + ORB_A + '"/><path fill="' + u('ga') + '" d="' + ORB_B + '"/></g></g>' +
          '<rect x="26" y="16" width="148" height="98" rx="30" fill="' + u('w') + '" stroke="' + S + '" stroke-width="1.5"/>' +
          '<path d="M64 30H136Q160 30 160 54V80L138 100H64Q40 100 40 76V54Q40 30 64 30Z" fill="' + u('v') + '"/>' +
          '<path class="vglow" d="M64 30H136Q160 30 160 54V80L138 100H64Q40 100 40 76V54Q40 30 64 30Z" fill="#21D4FF" opacity="0"/>' +
          '<g class="eyes" clip-path="' + u('visor') + '"></g>' +
          '<path d="M160 80L138 100H160Z" fill="' + u('flap') + '"/>' +
        '</g>' +
        '<g class="armsFront"></g>' +
      '</g>' +
      '<g class="fx"></g>';
    return svg;
  }

  function buildArm(P, m) {
    var u = function (s) { return 'url(#' + P + s + ')'; };
    var g = el('g');
    g.innerHTML =
      '<path d="M-7 17V3A7 7 0 0 1 7 3V17Z" fill="' + u('arm') + '"/>' +
      '<path d="M-7 17V3A7 7 0 0 1 7 3V17" fill="none" stroke="#B9C6DC" stroke-width="1.5"/>' +
      '<g class="fore" transform="translate(0 17)">' +
        '<circle r="7" fill="' + u('arm') + '"/><rect x="-7" y="0" width="14" height="16" fill="' + u('arm') + '"/>' +
        '<path d="M-7 0V16M7 0V16" stroke="#B9C6DC" stroke-width="1.5" fill="none"/>' +
        '<g class="hand">' +
          '<rect class="thumb" x="' + (-m * 1.5 - 3.5) + '" y="22" width="8" height="14" rx="4" fill="' + u('s') + '" stroke="#9FB0C9" stroke-width="1.5" opacity="0"/>' +
          '<rect class="finger" x="-3" y="22" width="6" height="18" rx="3" fill="' + u('s') + '" stroke="#9FB0C9" stroke-width="1.5" opacity="0"/>' +
          '<rect x="-8.5" y="13" width="17" height="14" rx="6" fill="' + u('s') + '" stroke="#9FB0C9" stroke-width="1.5"/>' +
        '</g>' +
      '</g>';
    return g;
  }

  function eyeParts(P, side, parent) {
    var wrap = el('g', null, parent), clipT = el('g', { 'clip-path': 'url(#' + P + 'ct' + side + ')' }, wrap),
      clipB = el('g', { 'clip-path': 'url(#' + P + 'cb' + side + ')' }, clipT), blink = el('g', null, clipB),
      rot = el('g', null, blink);
    var halo = el('path', { fill: 'none', stroke: '#21D4FF', 'stroke-linecap': 'round' }, rot);
    var body = el('path', { fill: 'none', stroke: '#21D4FF', 'stroke-linecap': 'round' }, rot);
    var hl = el('circle', { fill: '#fff' }, blink);
    return { wrap: wrap, blink: blink, rot: rot, halo: halo, body: body, hl: hl };
  }

  function buildFX(P, g) {
    var C = '#21D4FF';
    var f = {};
    f.dots = el('g', null, g); for (var i = 0; i < 3; i++) el('circle', { cx: 190 + 14 * i, cy: 30, r: 6, fill: C }, f.dots);
    f.waves = el('g', null, g);
    ['M-4 42Q-13 64 -4 86', 'M-22 34Q-31 64 -22 94', 'M204 42Q213 64 204 86', 'M222 34Q231 64 222 94'].forEach(function (d) {
      el('path', { d: d, stroke: C, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, f.waves); });
    f.bars = el('g', null, g);
    [[186, 56, 16], [198, 47, 34], [210, 53, 22]].forEach(function (b) { el('rect', { x: b[0], y: b[1], width: 8, height: b[2], rx: 4, fill: C }, f.bars); });
    f.sparkle = el('g', null, g);
    el('path', { d: 'M4 11L7.08 18.92L15 22L7.08 25.08L4 33L0.92 25.08L-7 22L0.92 18.92Z', fill: C }, f.sparkle);
    el('path', { d: 'M204 7L206.52 13.48L213 16L206.52 18.52L204 25L201.48 18.52L195 16L201.48 13.48Z', fill: C }, f.sparkle);
    f.confetti = el('g', null, g);
    [[3, -11.5, C, -25, 10, -8], [33, -21.5, '#FBBF24', 20, 40, -18], [143, -21.5, '#2563FF', -15, 150, -18],
      [189, -7.5, C, 30, 196, -4], [205, 26.5, '#FBBF24', -20, 212, 30], [-19, 30.5, '#2563FF', 25, -12, 34]].forEach(function (c) {
      var cg = el('g', null, f.confetti);
      el('rect', { x: c[0], y: c[1], width: 14, height: 7, rx: 2, fill: c[2], transform: 'rotate(' + c[3] + ' ' + c[4] + ' ' + c[5] + ')' }, cg); });
    f.badge = el('g', null, g);
    el('rect', { x: 182, y: 6, width: 32, height: 32, rx: 10, fill: '#FBBF24' }, f.badge);
    el('rect', { x: 196.5, y: 12, width: 5, height: 12, rx: 2.5, fill: '#060B1F' }, f.badge);
    el('circle', { cx: 199, cy: 31, r: 3, fill: '#060B1F' }, f.badge);
    f.ask = el('g', null, g);
    el('path', { d: 'M186 22Q186 11 197 11Q208 11 208 21Q208 28 199 31V37', stroke: C, 'stroke-width': 5.5, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, f.ask);
    el('circle', { cx: 199, cy: 46, r: 3.4, fill: C }, f.ask);
    f.pause = el('g', null, g);
    el('rect', { x: 188, y: 18, width: 8, height: 26, rx: 4, fill: C }, f.pause);
    el('rect', { x: 202, y: 18, width: 8, height: 26, rx: 4, fill: C }, f.pause);
    for (var k in f) { f[k].setAttribute('opacity', 0); }
    return f;
  }

  // ---------- classe ----------
  function Rig(container, opts) {
    opts = opts || {};
    var self = this;
    this.opts = opts;
    this.size = opts.size || 120;
    this.rand = mulberry32(opts.seed == null ? (Math.random() * 4294967296) >>> 0 : opts.seed);
    this.P = 'fr' + (++uid) + '-';
    this.container = container;
    this.labels = Object.assign({
      idle: 'Fredy, parado', listening: 'Fredy ouvindo', thinking: 'Fredy pensando', speaking: 'Fredy falando',
      paused: 'Fredy em pausa', finished: 'Fredy terminou de falar'
    }, opts.labels || {});

    this.svg = buildSVG(this.P, this.size);
    container.appendChild(this.svg);
    var q = function (c) { return self.svg.querySelector('.' + c); };
    this.n = { root: q('root'), body: q('body'), chest: q('chest'), chestglow: q('chestglow'), head: q('head'), ant: q('ant'), antglow: q('antglow'),
      vglow: q('vglow'), eyes: q('eyes'), armsBack: q('armsBack'), armsFront: q('armsFront'), fx: q('fx') };
    this.arms = {};
    ['L', 'R'].forEach(function (s) {
      var m = s === 'L' ? 1 : -1, g = buildArm(self.P, m);
      self.n.armsBack.appendChild(g);
      self.arms[s] = { g: g, m: m, fore: g.querySelector('.fore'), hand: g.querySelector('.hand'), thumb: g.querySelector('.thumb'), finger: g.querySelector('.finger'), front: false, sx: s === 'L' ? 58 : 142 };
    });
    this.eyes = {};
    ['l', 'r'].forEach(function (s) {
      var p = eyeParts(self.P, s, self.n.eyes);
      p.clipT = self.svg.querySelector('#' + self.P + 'ct' + s + ' rect');
      p.clipB = self.svg.querySelector('#' + self.P + 'cb' + s + ' rect');
      self.eyes[s] = p;
    });
    this.fx = buildFX(this.P, this.n.fx);
    this.fxMode = opts.fx == null ? 'auto' : opts.fx;

    // estado interno
    this.now = 0;
    this.cache = new WeakMap();
    this.stateName = 'idle';
    this.userExpr = null; this.gestExpr = null; this.microExpr = null;
    this.exprName = 'neutral';
    this.cur = Object.assign({}, FLAT.neutral); this.from = this.cur; this.to = FLAT.neutral; this.eT0 = 0; this.eDur = 0;
    this.gz = { tx: 0, ty: 0, ex: 0, ey: 0, hx: 0, hy: 0, until: 0, hold: false, sx: 0, sy: 0, nextWander: 0 };
    this.bl = { next: 1200 + this.rand() * 1800, t0: -1, dur: 0, amp: 1, queue: [] };
    this.bphase = this.rand() * 6.28; this.bper = 4300;
    this.gest = null; this.micros = []; this.lastG = {};
    this.ant = { a: 0, v: 0, prevTilt: 0, prevHx: 0 };
    this.sp = { on: false, ext: 0, extAt: -1e9, lv: 0, raw: 0, pauseUntil: 0, nextPause: 1200, nextBeat: 1500, nTilt: 0, nTarget: 0, nNext: 0, avg: 0, nHy: 0 };
    this.idleNext = 2500 + this.rand() * 2500; this.idleCd = {}; this.idleLast = [];
    this.stNext = 2000; // nods / saccades de estado
    this.breathBoost = 0;
    this.finishedAt = 0;
    this.listeners = {};
    this.destroyed = false; this.running = false; this.hiddenTab = false; this.offscreen = false; this.raf = 0; this.lastTs = null;
    this.idleOn = opts.idle !== false; this.blinkOn = opts.blink !== false;

    var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    this._mq = mq;
    this.reduced = opts.reducedMotion === true || (opts.reducedMotion !== false && !!(mq && mq.matches));
    this._onMq = function () { self.reduced = opts.reducedMotion === true || (opts.reducedMotion !== false && !!(mq && mq.matches)); self._applyExpr(200); };
    if (mq && mq.addEventListener) mq.addEventListener('change', this._onMq);

    this._onVis = function () { self.hiddenTab = document.hidden; self._sync(); };
    document.addEventListener('visibilitychange', this._onVis);
    this.hiddenTab = document.hidden;
    if (typeof IntersectionObserver !== 'undefined') {
      this._io = new IntersectionObserver(function (es) { self.offscreen = !es[es.length - 1].isIntersecting; self._sync(); });
      this._io.observe(this.svg);
    }
    if (opts.followPointer !== false) {
      this._lastPtr = 0;
      this._onPtr = function (e) {
        var t = e.timeStamp; if (t - self._lastPtr < 40) return; self._lastPtr = t;
        if (self.reduced) return; self.lookAt(e.clientX, e.clientY, { ttl: 2800 });
      };
      window.addEventListener('pointermove', this._onPtr, { passive: true });
    }
    this._applyExpr(0);
    this._renderFrame(0);
    this._setLabel();
    if (opts.autoStart !== false) this._sync();
  }

  var P = Rig.prototype;

  P._busy = function () {
    if (!this.reduced) return true;
    var g = this.gz, a = this.ant;
    return this.eDur > 0 || !!this.gest || this.bl.t0 >= 0 || this.micros.length > 0 || this.stateName === 'finished' ||
      (this._timers && this._timers.length > 0) || Math.abs(this.sp.lv - (this.sp.on ? .45 : 0)) > .01 ||
      Math.abs(g.ex) + Math.abs(g.ey) + Math.abs(g.hx) + Math.abs(g.hy) > .002 || Math.abs(a.a) > .05 || Math.abs(a.v) > .5;
  };
  P._sleepTimer = function () {
    var self = this; if (this._tm) clearTimeout(this._tm);
    this._tm = setTimeout(function () { self._tm = 0; if (self.destroyed) return; self.bl.next = self.now; self._frame(16); self._sync(); },
      clamp(this.bl.next - this.now, 400, 8000));
  };
  P._wake = function () { if (!this.running && !this.destroyed) this._sync(); };
  P._sync = function () {
    var should = !this.destroyed && !this.hiddenTab && !this.offscreen && this.opts.autoStart !== false && !this._frozen;
    var run = should && this._busy();
    if (run && !this.running) { if (this._tm) { clearTimeout(this._tm); this._tm = 0; } this.running = true; this.lastTs = null; this._loop = this._loop || this._mkLoop(); this.raf = requestAnimationFrame(this._loop); }
    else if (!run && this.running) { this.running = false; cancelAnimationFrame(this.raf); }
    if (should && !run && this.blinkOn && !this._tm) this._sleepTimer();   // reduzir movimento parado: só um timer para o próximo piscar
    if (!should && this._tm) { clearTimeout(this._tm); this._tm = 0; }
  };
  P._mkLoop = function () {
    var self = this;
    return function (ts) {
      if (!self.running) return;
      var dt = self.lastTs == null ? 16 : clamp(ts - self.lastTs, 0, 50);
      self.lastTs = ts;
      self._frame(dt);
      if (self.reduced && !self._busy()) { self.running = false; self._sync(); return; }
      self.raf = requestAnimationFrame(self._loop);
    };
  };
  /** Avança o relógio interno (para testes e capturas). */
  P.advance = function (ms) { var s = 1000 / 60, n = Math.max(1, Math.round(ms / s)); for (var i = 0; i < n; i++) this._frame(s); return this; };
  /** Congela / descongela o laço (útil para capturas). */
  P.freeze = function (on) { this._frozen = !!on; this._sync(); return this; };

  // ----- API pública -----
  P.setSize = function (px) { this.size = px; this.svg.setAttribute('width', px); this.svg.setAttribute('height', Math.round(px * 238 / 252)); return this; };
  P.on = function (ev, fn) { (this.listeners[ev] = this.listeners[ev] || []).push(fn); return this; };
  P._emit = function (ev, a) { var l = this.listeners[ev]; if (l) for (var i = 0; i < l.length; i++) try { l[i](a); } catch (e) { } };
  P._normName = function (n) { return String(n || '').toLowerCase().replace(/[^a-z]/g, ''); };

  P.setExpression = function (name, ms) {
    var n = this._normName(name);
    if (!DEFS[n] || n[0] === '_') { if (typeof console !== 'undefined') console.warn('FredyRig: expressão desconhecida', name); return this; }
    this.userExpr = n;
    this._applyExpr(ms == null ? 320 : ms);
    return this;
  };
  /** Solta a expressão fixada e volta à do estado atual. */
  P.clearExpression = function (ms) { this.userExpr = null; this._applyExpr(ms == null ? 320 : ms); return this; };
  P._stateExpr = function () {
    return { idle: 'neutral', listening: 'listening', thinking: 'thinking', speaking: 'speaking', paused: '_paused', finished: 'happy' }[this.stateName] || 'neutral';
  };
  P._applyExpr = function (ms) {
    var name = this.gestExpr || this.userExpr || this.microExpr || this._stateExpr();
    var to = Object.assign({}, FLAT[name]);
    // enfeites do estado somam com os da expressão
    var sf = { listening: 'waves', thinking: 'dots', speaking: 'bars', paused: 'pause' }[this.stateName];
    if (sf) to['fx.' + sf] = 1;
    this.exprName = name;
    this._wake();
    this.from = Object.assign({}, this.cur); this.to = to; this.eT0 = this.now; this.eDur = Math.max(0, ms);
    if (ms <= 0) { this.cur = Object.assign({}, to); }
    this._setLabel();
  };
  P._setLabel = function () {
    this.svg.setAttribute('aria-label', this.labels[this.stateName] || this.labels.idle);
  };

  P.setState = function (name, opts) {
    name = this._normName(name);
    if (['idle', 'listening', 'thinking', 'speaking', 'paused', 'finished'].indexOf(name) < 0) return this;
    var prev = this.stateName;
    this.stateName = name;
    this.userExpr = null;       // o estado manda nos olhos; setExpression depois pode fixar uma emoção
    this.microExpr = null;
    this.sp.on = name === 'speaking';
    if (name === 'speaking') { this.sp.nextBeat = this.now + 700; this.sp.nextPause = this.now + 1500; this.sp.avg = .3; }
    if (name === 'finished') { this.finishedAt = this.now; this.sp.on = false; this._addMicro({ dur: 900, keys: [{ t: 260, e: 'io', hy: 1.8 }, { t: 560, e: 'io', hy: -.4 }] }); }
    this.stNext = this.now + 1500;
    this.gz.nextWander = this.now;
    this._applyExpr(360);
    if (prev !== name) this._emit('state', name);
    return this;
  };
  /** speak(true) começa, speak(false) termina. O 2o argumento (0-1) é a intensidade da voz neste quadro (opcional). */
  P.speak = function (on, level) {
    if (on === false || on === 0) { if (this.stateName === 'speaking') this.setState('finished'); this.sp.ext = 0; return this; }
    if (this.stateName !== 'speaking') this.setState('speaking');
    if (typeof level === 'number') { this.sp.ext = clamp(level, 0, 1); this.sp.extAt = this.now; }
    return this;
  };
  /** Só o nível (0-1), sem mudar de estado. Chame a cada quadro/amostra de áudio. */
  P.setLevel = function (l) { this.sp.ext = clamp(l, 0, 1); this.sp.extAt = this.now; this._wake(); return this; };

  P.lookAt = function (x, y, o) {
    var g = this.gz;
    if (x == null) { g.until = 0; g.hold = false; return this; }
    var r = this.svg.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height * .4;
    var dx = (x - cx), dy = (y - cy), reach = Math.max(180, r.width * 1.8);
    g.tx = clamp(dx / reach, -1, 1); g.ty = clamp(dy / reach, -1, 1);
    o = o || {}; g.hold = o.ttl === 0; g.until = this.now + (o.ttl == null ? 2800 : o.ttl);
    return this;
  };
  /** Olha para um ponto normalizado (-1..1) em vez de coordenadas da tela. */
  P.lookAtNorm = function (nx, ny, ttl) { var g = this.gz; g.tx = clamp(nx, -1, 1); g.ty = clamp(ny, -1, 1); g.hold = ttl === 0; g.until = this.now + (ttl == null ? 2800 : ttl); return this; };

  P.play = function (name, o) {
    var self = this; o = o || {};
    var n = this._normName(name);
    var key = GESTURE_NAMES.filter(function (k) { return k.toLowerCase() === n; })[0];
    if (!key) { if (typeof console !== 'undefined') console.warn('FredyRig: gesto desconhecido', name); return Promise.resolve(); }
    var spec = Object.assign({ name: key }, GESTURES[key]);
    var tl = makeTL(spec, { side: o.side });
    tl.speed = o.speed || 1;
    // continuidade: canais do gesto anterior que o novo não usa voltam à base em 300 ms
    var carry = {};
    if (this.gest) for (var c in this.lastG) if (!tl.ch[c]) carry[c] = this.lastG[c];
    tl.start = {}; for (var c2 in tl.ch) tl.start[c2] = this.lastG[c2];
    tl.carry = carry;
    tl.t0 = this.now;
    tl.firedEv = 0; tl.kicked = false;
    if (this.reduced) {
      // sem movimento grande: só a expressão do gesto, por um instante
      tl.reducedOnly = true; tl.dur = 1600;
    }
    if (this.gest && this.gest.resolve) this.gest.resolve();
    this.gest = tl;
    this._wake();
    if (tl.expr) { this.gestExpr = tl.expr; this._applyExpr(260); }
    return new Promise(function (res) { tl.resolve = res; });
  };
  P.stopGesture = function () { if (this.gest) { this._endGesture(); } return this; };
  P._endGesture = function () {
    var g = this.gest; this.gest = null; this.lastG = {};
    if (this.gestExpr) { this.gestExpr = null; this._applyExpr(340); }
    if (g && g.resolve) g.resolve();
    this._emit('gestureend', g && g.name);
  };

  P._addMicro = function (spec) {
    var tl = makeTL({ name: 'm', dur: spec.dur, keys: spec.keys }, { additive: true });
    tl.t0 = this.now; tl.mdur = spec.dur;
    this.micros.push(tl);
    if (this.micros.length > 4) this.micros.shift();
    return tl;
  };
  P.blinkNow = function (kind) { this._startBlink(kind || 'normal'); this._wake(); return this; };

  P.destroy = function () {
    this.destroyed = true; this.running = false; cancelAnimationFrame(this.raf); if (this._tm) clearTimeout(this._tm);
    document.removeEventListener('visibilitychange', this._onVis);
    if (this._onPtr) window.removeEventListener('pointermove', this._onPtr);
    if (this._mq && this._mq.removeEventListener) this._mq.removeEventListener('change', this._onMq);
    if (this._io) this._io.disconnect();
    if (this.svg.parentNode) this.svg.parentNode.removeChild(this.svg);
    this.listeners = {};
  };

  // ----- piscar -----
  P._startBlink = function (kind) {
    var b = this.bl, r = this.rand;
    if (b.t0 >= 0 && this.now - b.t0 < b.dur * .6) return;
    var pick = kind;
    if (kind === 'auto') {
      var x = r(); pick = x < .68 ? 'normal' : x < .8 ? 'double' : x < .92 ? 'slow' : 'half';
      if (this.exprName === 'sleepy' || this.stateName === 'paused') pick = r() < .6 ? 'slow' : 'normal';
    }
    b.t0 = this.now; b.amp = 1; b.queue = [];
    if (pick === 'normal') b.dur = R(r, 120, 170);
    else if (pick === 'slow') b.dur = R(r, 300, 400);
    else if (pick === 'half') { b.dur = R(r, 150, 200); b.amp = .55; }
    else if (pick === 'double') { b.dur = R(r, 110, 140); b.queue.push({ at: this.now + b.dur + 70, dur: b.dur }); }
  };
  P._blinkVal = function () {
    var b = this.bl;
    if (b.t0 < 0) return 0;
    var t = this.now - b.t0;
    if (t >= b.dur) {
      if (b.queue.length && this.now >= b.queue[0].at) { var q = b.queue.shift(); b.t0 = this.now; b.dur = q.dur; t = 0; }
      else if (t >= b.dur) { b.t0 = -1; return 0; }
    }
    var p = t / b.dur;
    var c = p < .38 ? EASE.out(p / .38) : 1 - EASE.io((p - .38) / .62);
    return clamp(c, 0, 1) * b.amp;
  };

  // ----- laço principal -----
  P._frame = function (dt) {
    this.now += dt;
    this._renderFrame(dt);
  };

  P._renderFrame = function (dt) {
    var now = this.now, r = this.rand, red = this.reduced, i, k;
    var sdt = dt / 1000;

    // 1. expressão (interpolação)
    var cur = this.cur;
    if (this.eDur > 0) {
      var p = clamp((now - this.eT0) / this.eDur, 0, 1), ep = EASE.io(p);
      for (i = 0; i < VEC_KEYS.length; i++) { k = VEC_KEYS[i]; cur[k] = lerp(this.from[k], this.to[k], ep); }
      if (p >= 1) this.eDur = 0;
    }

    // 2. estado "finished" volta ao idle sozinho
    if (this.stateName === 'finished' && now - this.finishedAt > 2200) this.setState('idle');

    // 3. piscar
    if (this.blinkOn && now >= this.bl.next && this.bl.t0 < 0) {
      this._startBlink('auto');
      var mult = { idle: 1, listening: 1.2, thinking: 1.9, speaking: .8, paused: 1.6, finished: 1 }[this.stateName] || 1;
      this.bl.next = now + R(r, 2100, 5900) * mult;
    }
    var blinkV = this._blinkVal();

    // 4. idle: sorteio ponderado com cooldown (só em idle; sem movimento se reduced)
    if (this.idleOn && !red && this.stateName === 'idle' && !this.gest && now >= this.idleNext) this._idleStep();
    if (!red) this._stateLife(sdt);

    // 5. gesto + microlinhas
    var gv = this._gv || (this._gv = {}), mv = this._mv || (this._mv = {}), ch;
    for (ch in gv) delete gv[ch];
    for (ch in mv) mv[ch] = 0;
    var g = this.gest;
    if (g && !g.reducedOnly) {
      var t = (now - g.t0) * g.speed, c;
      for (ch in g.ch) {
        var base = ABS[ch] ? cur[ch] != null ? cur[ch] : 0 : 0;
        var sv = g.start[ch] != null ? g.start[ch] : base;
        var v = evalCh(g.ch[ch], t, g.dur, sv, base);
        if (ABS[ch] && (ch[1] === 't' || ch[1] === 'f')) { /* th, fi: base 0 */ }
        gv[ch] = v; this.lastG[ch] = v;
      }
      for (ch in g.carry) {
        var bb = ABS[ch] ? (cur[ch] != null ? cur[ch] : 0) : 0, cv = lerp(g.carry[ch], bb, EASE.io(clamp(t / 300, 0, 1)));
        gv[ch] = cv; this.lastG[ch] = cv;
      }
      if (g.kickAt && !g.kicked && t >= g.kickAt - 40) { g.kicked = true; this.ant.v += 260; }
      while (g.firedEv < g.events.length && t >= g.events[g.firedEv].t) { var ev = g.events[g.firedEv++]; if (ev.blink) this._startBlink(ev.blink); }
      if (t >= g.dur) this._endGesture();
    } else if (g && g.reducedOnly) {
      if (now - g.t0 >= g.dur) this._endGesture();
    }
    for (i = this.micros.length - 1; i >= 0; i--) {
      var m = this.micros[i], mt = now - m.t0;
      if (mt >= m.mdur) { this.micros.splice(i, 1); continue; }
      for (ch in m.ch) mv[ch] = (mv[ch] || 0) + evalCh(m.ch[ch], mt, m.mdur, 0, 0);
    }

    // 6. olhar
    var gz = this.gz, tx = 0, ty = 0;
    if (!red) {
      var ptr = now < gz.until || gz.hold;
      if (ptr) { tx = gz.tx; ty = gz.ty; }
      else if (this.stateName === 'thinking') { tx = -.55 + Math.sin(now / 1700) * .12; ty = -.5 + Math.cos(now / 2300) * .1; }
      else if (this.stateName === 'listening') { tx = Math.sin(now / 3100) * .06; ty = .05; }
      else if (this.stateName === 'speaking') { tx = gz.sx; ty = gz.sy; }
      tx += (gv.gx || 0) + (mv.gx || 0); ty += (gv.gy || 0) + (mv.gy || 0);
      tx = clamp(tx, -1, 1); ty = clamp(ty, -1, 1);
    }
    var ke = 1 - Math.exp(-dt / 70), kh = 1 - Math.exp(-dt / 260);
    gz.ex += (tx - gz.ex) * ke; gz.ey += (ty - gz.ey) * ke;
    gz.hx += (tx - gz.hx) * kh; gz.hy += (ty - gz.hy) * kh;

    // 7. fala (intensidade)
    var sp = this.sp, lv = 0;
    if (sp.on) {
      var raw;
      if (red) raw = .45;
      else if (now - sp.extAt < 260) raw = sp.ext;
      else {
        if (now >= sp.nextPause) { sp.pauseUntil = now + R(r, 140, 320); sp.nextPause = now + R(r, 900, 2300); }
        raw = now < sp.pauseUntil ? .06 : clamp(.5 + .3 * Math.sin(now / 83) * Math.sin(now / 410 + 1) + .22 * Math.sin(now / 37 + 2) + (r() - .5) * .25, 0, 1);
      }
      var kk = 1 - Math.exp(-dt / (raw > sp.lv ? 40 : 120));
      sp.lv += (raw - sp.lv) * kk;
      sp.avg += (sp.lv - sp.avg) * (1 - Math.exp(-dt / 700));
    } else { sp.lv += (0 - sp.lv) * (1 - Math.exp(-dt / 160)); sp.avg *= .98; }
    lv = sp.lv;
    var spTilt = 0, spHy = 0;
    if (sp.on && !red) {
      if (now >= sp.nNext) { sp.nTarget = R(r, -1, 1); sp.nHy = R(r, -1, 1); sp.nNext = now + R(r, 380, 950); }
      sp.nTilt += (sp.nTarget - sp.nTilt) * (1 - Math.exp(-dt / 220));
      spTilt = sp.nTilt * 1.7 * (.4 + sp.avg); spHy = -lv * .9 + sp.nHy * .4 * sp.avg;
      if (now >= sp.nextBeat && !this.gest) {
        sp.nextBeat = now + R(r, 1500, 3300);
        if (sp.avg > .2) { var sd = r() < .5 ? 'L' : 'R', amp = .6 + sp.avg, kf = {};
          var a1 = { t: 260, e: 'out' }, a2 = { t: 620, e: 'io' }; a1[sd + 'sh'] = 11 * amp; a1[sd + 'el'] = 22 * amp; a2[sd + 'sh'] = 2; a2[sd + 'el'] = 4;
          this._addMicro({ dur: 1000, keys: [a1, a2] }); }
      }
    }

    // 8. respiração
    var b = 0;
    if (!red) {
      var bp = this.bper * (1 + .08 * Math.sin(now / 9000));
      this.bphase += dt / bp * 6.2832;
      b = Math.sin(this.bphase) * (1 + (mv.breath || 0)) * (this.stateName === 'paused' ? .6 : 1);
    }

    // 9. composição
    var tilt = cur.tilt + (gv.tilt || 0) + (mv.tilt || 0) + gz.hx * 3.2 + spTilt;
    var hx = cur.hx + (gv.hx || 0) + (mv.hx || 0) + gz.hx * 2.2;
    var hy = cur.hy + (gv.hy || 0) + (mv.hy || 0) + gz.hy * 1.2 - b * .8 + spHy;
    var bx = (gv.bx || 0) + (mv.bx || 0), by = (gv.by || 0) + (mv.by || 0), br = (gv.br || 0) + (mv.br || 0);

    // antena: mola amortecida movida pelo movimento da cabeça
    var A = this.ant;
    if (dt > 0) {
      var tv = (tilt - A.prevTilt) / sdt, xv = (hx + bx - A.prevHx) / sdt;
      A.prevTilt = tilt; A.prevHx = hx + bx;
      var target = clamp(-tv * .11 - xv * .9, -22, 22);
      var w = 15, zt = .3, h = Math.min(sdt, .033);
      var acc = -w * w * (A.a - target) - 2 * zt * w * A.v;
      A.v += acc * h; A.a += A.v * h;
      A.a = clamp(A.a, -26, 26);
    }

    this._paint({ tilt: tilt, hx: hx, hy: hy, bx: bx, by: by, br: br, b: b, blink: blinkV, lv: lv, gv: gv, mv: mv, cur: cur, antA: A.a, now: now });
  };

  P._idleStep = function () {
    var now = this.now, r = this.rand, cands = [], ws = [], tot = 0, i;
    for (i = 0; i < IDLE.length; i++) {
      var a = IDLE[i];
      if (now < (this.idleCd[a.id] || 0)) continue;
      if (a.expr && this.userExpr) continue;
      var w = a.w * (this.idleLast.indexOf(a.id) >= 0 ? .2 : 1);
      cands.push(a); ws.push(w); tot += w;
    }
    this.idleNext = now + R(r, 2800, 7500);
    if (!cands.length) return;
    var x = r() * tot, pick = cands[cands.length - 1];
    for (i = 0; i < cands.length; i++) { x -= ws[i]; if (x <= 0) { pick = cands[i]; break; } }
    this.idleCd[pick.id] = now + pick.cd * R(r, .8, 1.4);
    this.idleLast.push(pick.id); if (this.idleLast.length > 3) this.idleLast.shift();
    var spec = pick.run(r);
    if (spec.blink) this._startBlink('normal');
    if (spec.kick) this.ant.v += 220 * spec.kick;
    this._addMicro(spec);
    if (pick.expr) {
      var self = this; this.microExpr = pick.expr; this._applyExpr(280);
      setTimeout0(function () { if (self.microExpr === pick.expr) { self.microExpr = null; self._applyExpr(420); } }, spec.exprFor, this);
    }
    this._emit('idle', pick.id);
  };
  // temporizador no relógio interno (funciona com advance())
  function setTimeout0(fn, ms, rig) { (rig._timers = rig._timers || []).push({ at: rig.now + ms, fn: fn }); }

  P._stateLife = function (sdt) {
    var now = this.now, r = this.rand;
    if (this._timers && this._timers.length) {
      for (var i = this._timers.length - 1; i >= 0; i--) if (now >= this._timers[i].at) { var t = this._timers.splice(i, 1)[0]; t.fn(); }
    }
    if (now < this.stNext) return;
    if (this.stateName === 'listening') { this.stNext = now + R(r, 2600, 5200); this._addMicro({ dur: 700, keys: [{ t: 230, e: 'io', hy: 1.6, tilt: R(r, -1, 1) }, { t: 450, e: 'io', hy: -.2 }] }); }
    else if (this.stateName === 'speaking') { this.stNext = now + R(r, 1200, 2800); this.gz.sx = R(r, -.25, .25); this.gz.sy = R(r, -.15, .1); }
    else if (this.stateName === 'thinking') { this.stNext = now + R(r, 3000, 6000); this._addMicro({ dur: 1500, keys: [{ t: 600, e: 'io', tilt: R(r, 0, 2.2), hx: R(r, -.5, .5) }] }); }
    else this.stNext = now + 2000;
  };

  // ----- pintar (DOM) -----
  P._set = function (n, a, v) {
    var c = this.cache.get(n); if (!c) { c = {}; this.cache.set(n, c); }
    if (c[a] === v) return; c[a] = v; n.setAttribute(a, v);
  };
  function f2(v) { return (Math.round(v * 100) / 100).toString(); }
  function rgb(tn) { return 'rgb(' + Math.round(lerp(33, 143, tn)) + ',' + Math.round(lerp(212, 235, tn)) + ',255)'; }

  P._paint = function (s) {
    var n = this.n, cur = s.cur, gv = s.gv, mv = s.mv, red = this.reduced, S = this._set.bind(this), lv = s.lv, i;
    // raiz (corpo todo) e respiração
    S(n.root, 'transform', 'translate(' + f2(s.bx) + ' ' + f2(s.by) + ') rotate(' + f2(s.br) + ' 100 190)');
    var bs = 1 + .010 * s.b;
    S(n.body, 'transform', 'translate(0 190) scale(1 ' + f2(bs * 1000) / 1000 + ') translate(0 -190)');
    var pul = 1 + .02 * s.b + lv * .035;
    S(n.chest, 'transform', 'translate(100 144) scale(' + f2(pul * 1000) / 1000 + ') translate(-100 -144)');
    // brilho do peito / visor / antena (estado visível além dos olhos)
    var think = this.stateName === 'thinking' && !red ? .5 + .5 * Math.sin(s.now / 420) : 0;
    S(n.chestglow, 'opacity', f2(clamp(lv * .9 + think * .55, 0, 1)));
    S(n.antglow, 'opacity', f2(think * .3 + lv * .22));
    S(n.vglow, 'opacity', f2(cur.vglow + lv * .09 + think * .02));
    // cabeça (pivô no pescoço) e antena
    S(n.head, 'transform', 'translate(' + f2(s.hx) + ' ' + f2(s.hy) + ') rotate(' + f2(s.tilt) + ' 100 112)');
    S(n.ant, 'transform', 'rotate(' + f2(s.antA) + ' 100 16)');
    // olhos
    var sides = ['l', 'r'], gz = this.gz;
    for (var si = 0; si < 2; si++) {
      var sd = sides[si], e = this.eyes[sd], p = function (k) { return cur[sd + '.' + k]; };
      var T = p('T') + lv * 1.6, L = Math.max(.001, p('L')), q = p('q');
      var gxp = gz.ex * 7, gyp = gz.ey * 3.8;
      var cx = (sd === 'l' ? 80 : 120) + p('dx') + gxp * (1 - Math.abs(gz.ex) * .1), cy = 64 + p('dy') + gyp;
      S(e.wrap, 'transform', 'translate(' + f2(cx) + ' ' + f2(cy) + ')');
      var d = 'M' + f2(-L / 2) + ' 0Q0 ' + f2(-q) + ' ' + f2(L / 2) + ' 0';
      S(e.body, 'd', d); S(e.halo, 'd', d);
      S(e.body, 'stroke-width', f2(T)); S(e.halo, 'stroke-width', f2(T + 6 + 2 * clamp((T - 9) / 6, 0, 1)));
      var col = rgb(p('tn'));
      S(e.body, 'stroke', col); S(e.halo, 'stroke', col);
      var br = cur.bright;
      S(e.body, 'stroke-opacity', f2(br)); S(e.halo, 'stroke-opacity', f2(clamp((cur.halo + lv * .3) * br, 0, 1)));
      S(e.rot, 'transform', 'rotate(' + f2(p('rot')) + ')');
      var bl = Math.max(.07, 1 - s.blink * .93);
      S(e.blink, 'transform', 'scale(1 ' + f2(bl) + ')');
      // brilho especular (só em olhos redondos)
      var Rr = T / 2, hlO = clamp(1 - p('L') / 5, 0, 1) * clamp((T - 9) / 4, 0, 1);
      S(e.hl, 'cx', f2(Rr * .35)); S(e.hl, 'cy', f2(-Rr * .35)); S(e.hl, 'r', f2(Rr * .26)); S(e.hl, 'opacity', f2(hlO * br));
      // pálpebras
      var lt = p('lt'), ramp = Math.min(1, lt * 10), cutT = (-T / 2 + lt * T) * ramp + (-80) * (1 - ramp);
      S(e.clipT, 'x', -60); S(e.clipT, 'width', 120); S(e.clipT, 'y', f2(cutT)); S(e.clipT, 'height', 160);
      S(e.clipT, 'transform', 'rotate(' + f2(p('la')) + ')');
      var lb = p('lb'), rampb = Math.min(1, lb * 10), cutB = (T / 2 - lb * T) * rampb + 80 * (1 - rampb);
      S(e.clipB, 'x', -60); S(e.clipB, 'width', 120); S(e.clipB, 'y', f2(cutB - 160)); S(e.clipB, 'height', 160);
    }
    // braços
    for (var sk in this.arms) {
      var a = this.arms[sk], pre = sk;
      var sh = (gv[pre + 'sh'] != null ? gv[pre + 'sh'] : cur[pre + 'sh']) + (mv[pre + 'sh'] || 0) + (red ? 0 : s.b * 1.1);
      var elb = (gv[pre + 'el'] != null ? gv[pre + 'el'] : cur[pre + 'el']) + (mv[pre + 'el'] || 0) + (red ? 0 : s.b * .8);
      var hr = (gv[pre + 'hr'] != null ? gv[pre + 'hr'] : 0) + (mv[pre + 'hr'] || 0);
      var th = gv[pre + 'th'] != null ? gv[pre + 'th'] : 0, fi = gv[pre + 'fi'] != null ? gv[pre + 'fi'] : 0;
      S(a.g, 'transform', 'translate(' + a.sx + ' ' + f2(130 - s.b * .6) + ') rotate(' + f2(a.m * sh) + ')');
      S(a.fore, 'transform', 'translate(0 17) rotate(' + f2(a.m * elb) + ')');
      S(a.hand, 'transform', 'rotate(' + f2(a.m * hr) + ' 0 13)');
      S(a.thumb, 'opacity', f2(clamp(th * 3, 0, 1))); S(a.thumb, 'transform', 'translate(0 24) scale(' + f2(.3 + .7 * clamp(th, 0, 1)) + ') translate(0 -24)');
      S(a.finger, 'opacity', f2(clamp(fi * 3, 0, 1))); S(a.finger, 'transform', 'translate(0 24) scale(' + f2(.3 + .7 * clamp(fi, 0, 1)) + ') translate(0 -24)');
      // braço levantado passa por cima da cabeça (como no desenho oficial)
      var tot = sh + elb, wantFront = a.front ? tot > 95 : tot > 105;
      if (wantFront !== a.front) { a.front = wantFront; (wantFront ? n.armsFront : n.armsBack).appendChild(a.g); }
    }
    // enfeites fora do corpo
    var show = this.fxMode === true || (this.fxMode === 'auto' && this.size >= 56);
    var now = s.now;
    for (var fk in this.fx) {
      var amt = show ? cur['fx.' + fk] : 0, node = this.fx[fk];
      S(node, 'opacity', f2(clamp(amt, 0, 1)));
      if (amt < .01) continue;
      var tr = '', anim = !red;
      if (fk === 'dots' && anim) { for (i = 0; i < 3; i++) node.children[i].setAttribute('opacity', f2(.25 + .75 * Math.max(0, Math.sin(now / 260 - i * .9)))); }
      else if (fk === 'waves' && anim) { for (i = 0; i < 4; i++) node.children[i].setAttribute('opacity', f2((i % 2 ? .45 : 1) * (.55 + .45 * Math.sin(now / 380 + (i % 2) * 1.2)))); }
      else if (fk === 'bars') {
        var base = [16, 34, 22], mid = [64, 64, 64];
        for (i = 0; i < 3; i++) {
          var hh = base[i] * (this.sp.on || lv > .02 ? .35 + 1.1 * clamp(lv + .25 * Math.sin(now / (110 + i * 40) + i * 2) * lv, 0, 1) : 1);
          if (red) hh = base[i];
          var rc = node.children[i]; rc.setAttribute('height', f2(hh)); rc.setAttribute('y', f2(64 - hh / 2));
        }
      } else if (fk === 'sparkle' && anim) { tr = 'translate(0 0)'; node.children[0].setAttribute('transform', 'translate(0 22) scale(' + f2(.85 + .15 * Math.sin(now / 300)) + ') translate(0 -22)'); node.children[1].setAttribute('transform', 'translate(204 16) scale(' + f2(.85 + .15 * Math.sin(now / 340 + 1.5)) + ') translate(-204 -16)'); }
      else if (fk === 'confetti' && anim) { for (i = 0; i < 6; i++) { node.children[i].setAttribute('transform', 'translate(0 ' + f2(Math.sin(now / 520 + i * 1.1) * 3) + ')'); } }
      else if (fk === 'badge' && anim) { node.setAttribute('transform', 'translate(198 22) scale(' + f2(1 + .06 * Math.sin(now / 240)) + ') translate(-198 -22)'); }
    }
  };

  // ---------- API do módulo ----------
  return {
    create: function (container, opts) { return new Rig(container, opts); },
    EXPRESSIONS: EXPRESSIONS.slice(),
    GESTURES: GESTURE_NAMES.slice(),
    STATES: ['idle', 'listening', 'thinking', 'speaking', 'paused', 'finished'],
    version: '1.0'
  };
});
