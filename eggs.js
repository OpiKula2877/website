/* ==========================================================================
   opikula.dev: nothing to see here.
   ========================================================================== */
(() => {
    'use strict';

    const site = window.OKsite || { lang: () => 'en', reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)') };
    const L = (en, cs) => (site.lang() === 'cs' ? cs : en);
    const root = document.documentElement;
    const active = new Set();

    const el = (tag, cls, html) => {
        const n = document.createElement(tag);
        if (cls) n.className = cls;
        if (html != null) n.innerHTML = html;
        return n;
    };
    const rand = (a, b) => a + Math.random() * (b - a);
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));

    /* ---------- Styles, injected only when this file runs ---------- */
    const css = `
.egg-layer{position:fixed;inset:0;z-index:9990;pointer-events:none}
.egg-toast{position:fixed;left:50%;bottom:24px;z-index:9999;transform:translateX(-50%);padding:10px 16px;background:#1f0508;border:1px solid #4a1218;border-radius:8px;color:#f2e6e6;font:700 13px/1.4 "Cascadia Code",ui-monospace,monospace;box-shadow:0 24px 60px -30px #000;white-space:nowrap;pointer-events:none}
.egg-close{position:absolute;display:grid;place-items:center;width:36px;height:36px;border:0;border-radius:999px;background:#c8102e;color:#fff;font:700 18px/1 "Cascadia Code",monospace;cursor:pointer}
.egg-close:hover{background:#de1a3a}

.egg-znk{position:fixed;top:0;left:0;z-index:9995;will-change:transform}
.egg-znk a{display:block;padding:14px 14px 10px;background:#fff;border:3px solid #000;border-radius:10px;box-shadow:6px 6px 0 #c8102e;color:#000;text-decoration:none;font:700 12px/1 "Cascadia Code",monospace;text-align:right}
.egg-znk a:hover{box-shadow:8px 8px 0 #de1a3a}
.egg-znk img{width:220px;height:auto;margin-bottom:8px;image-rendering:auto}
.egg-znk .egg-close{top:-14px;right:-14px}
.egg-dust{position:fixed;z-index:9994;width:6px;height:6px;background:#a88a8c;pointer-events:none}

.mc-btn{position:relative;display:grid;place-items:center;width:var(--s);height:var(--s);padding:0;border:0;background:none;cursor:pointer;perspective:900px;touch-action:none}
.mc-float{position:fixed;right:32px;bottom:32px;z-index:9990}
.mc-cube{position:relative;width:calc(var(--s)*.62);height:calc(var(--s)*.62);transform-style:preserve-3d;animation:mc-spin 16s linear infinite}
.mc-btn:hover .mc-cube{animation-play-state:paused}
.mc-face{position:absolute;inset:0;background-size:100% 100%;image-rendering:pixelated;backface-visibility:hidden}
.mc-face::after{content:"";position:absolute;inset:0;background:var(--crack,none) center/100% 100% no-repeat;image-rendering:pixelated}
.mc-face.fr{transform:translateZ(calc(var(--s)*.31))}
.mc-face.bk{transform:rotateY(180deg) translateZ(calc(var(--s)*.31))}
.mc-face.rt{transform:rotateY(90deg) translateZ(calc(var(--s)*.31))}
.mc-face.lt{transform:rotateY(-90deg) translateZ(calc(var(--s)*.31))}
.mc-face.tp{transform:rotateX(90deg) translateZ(calc(var(--s)*.31))}
.mc-face.bt{transform:rotateX(-90deg) translateZ(calc(var(--s)*.31))}
.mc-face.rt,.mc-face.lt{filter:brightness(.8)}
.mc-face.bk{filter:brightness(.7)}
.mc-face.bt{filter:brightness(.55)}
@keyframes mc-spin{from{transform:rotateX(-24deg) rotateY(0)}to{transform:rotateX(-24deg) rotateY(360deg)}}
.mc-item{--s:64px;position:absolute;left:50%;top:60%;margin:-32px 0 0 -32px;animation:mc-bob 1.6s ease-in-out infinite}
.mc-item .mc-cube{animation-duration:4s}
@keyframes mc-bob{50%{transform:translateY(-10px)}}
.mc-xp{position:absolute;left:50%;top:30%;transform:translateX(-50%);color:#7dff3c;font:700 18px/1 "Cascadia Code",monospace;text-shadow:2px 2px 0 #1a3d00;pointer-events:none;white-space:nowrap}
.mc-bit{position:fixed;z-index:9993;pointer-events:none;image-rendering:pixelated}

.egg-night{position:fixed;inset:0;z-index:9996;overflow:hidden;background:#000;opacity:0;cursor:pointer}
.egg-night.on{animation:egg-flicker 1.2s steps(1) forwards}
@keyframes egg-flicker{0%{opacity:.2}8%{opacity:0}16%{opacity:.6}22%{opacity:.1}34%{opacity:.8}40%{opacity:.4}55%,100%{opacity:.93}}
.egg-night.off{transition:opacity 1.2s;opacity:0!important;animation:none}
.egg-rail{position:absolute;left:0;right:0;bottom:36px;height:12px;border-top:4px solid #4a1218;background:repeating-linear-gradient(90deg,#2e1418 0 12px,transparent 12px 40px)}
.egg-train{position:absolute;left:0;bottom:52px;display:flex;align-items:flex-end;gap:10px;will-change:transform}
.egg-train>*{flex:none;position:relative;animation:egg-rattle .18s steps(2) infinite}
@keyframes egg-rattle{50%{transform:translateY(-2px)}}
.egg-loco{width:250px;height:170px}
.egg-loco .body{position:absolute;left:0;bottom:0;width:250px;height:110px;background:#170d0e;border:2px solid #2e1418;border-radius:40px 6px 6px 6px}
.egg-loco .cab{position:absolute;right:0;bottom:108px;width:110px;height:62px;background:#170d0e;border:2px solid #2e1418;border-radius:6px 6px 0 0}
.egg-loco .cab::after{content:"";position:absolute;left:18px;top:14px;width:40px;height:28px;background:#050303;box-shadow:inset 0 0 18px #c8102e}
.egg-loco .stack{position:absolute;left:44px;bottom:108px;width:28px;height:40px;background:#140c0d;border:2px solid #2e1418}
.egg-loco .lamp{position:absolute;left:6px;bottom:52px;width:16px;height:16px;border-radius:50%;background:#fff3e0;box-shadow:0 0 22px 8px rgba(255,230,200,.7)}
.egg-loco .beam{position:absolute;right:236px;bottom:-20px;width:520px;height:160px;background:linear-gradient(to left,rgba(255,230,200,.32),rgba(255,230,200,0));clip-path:polygon(100% 46%,100% 54%,0 100%,0 0)}
.egg-smoke{position:absolute;left:46px;bottom:150px;width:26px;height:26px;border-radius:50%;background:#2e1418;opacity:.8;animation:egg-smoke 1.4s ease-out infinite}
@keyframes egg-smoke{to{transform:translate(60px,-90px) scale(3);opacity:0}}
.egg-car{width:340px;height:150px;background:#140c0d;border:2px solid #2e1418;border-radius:6px;overflow:visible}
.egg-wins{position:absolute;top:14px;left:16px;right:16px;display:flex;justify-content:space-between}
.egg-win{position:relative;width:44px;height:34px;background:#050303;border:2px solid #2e1418}
.egg-eyes{position:absolute;left:50%;top:44%;display:flex;gap:8px;transform:translateX(-50%);animation:egg-blink 3.2s infinite}
.egg-eyes i{width:5px;height:5px;background:#ff2a3d;box-shadow:0 0 8px 2px rgba(255,42,61,.8)}
@keyframes egg-blink{0%,92%,100%{transform:translateX(-50%) scaleY(1)}95%{transform:translateX(-50%) scaleY(.1)}}
.egg-tag{position:absolute;left:18px;right:18px;top:62px;color:#ff5468;font:700 34px/1 "Cascadia Code",monospace;letter-spacing:.02em;text-align:center;text-shadow:3px 3px 0 #000,0 0 14px rgba(255,84,104,.45);transform:rotate(-4deg)}
.egg-tag.alt{color:#f2e6e6;text-shadow:3px 3px 0 #7a1424;transform:rotate(3deg);font-size:30px}
.egg-drip{position:absolute;top:30px;width:4px;height:0;background:currentColor;border-radius:0 0 3px 3px;animation:egg-drip 2.4s ease-in forwards}
@keyframes egg-drip{to{height:var(--h)}}
.egg-wheels{position:absolute;left:24px;right:24px;bottom:-14px;display:flex;justify-content:space-between}
.egg-wheels i{width:30px;height:30px;border-radius:50%;background:#0e0a0a;border:4px dashed #4a1218;animation:egg-wheel .5s linear infinite}
@keyframes egg-wheel{to{transform:rotate(-360deg)}}
.egg-door{position:absolute;right:28px;top:56px;width:58px;height:92px;background:#050303;border:2px solid #2e1418}
.egg-fig{position:absolute;left:50%;bottom:0;width:34px;height:78px;transform:translateX(-50%)}
.egg-fig::before{content:"";position:absolute;left:5px;top:0;width:24px;height:28px;border-radius:45% 45% 40% 40%;background:#d9cfcf}
.egg-fig::after{content:"";position:absolute;left:0;top:26px;width:34px;height:52px;border-radius:10px 10px 0 0;background:#000}
.egg-fig b{position:absolute;top:10px;z-index:1;width:5px;height:7px;background:#000;transition:background .3s}
.egg-fig b:first-child{left:11px}.egg-fig b:last-child{left:20px}
.egg-fig.look b{background:#ff2a3d;box-shadow:0 0 8px #ff2a3d}
.egg-stop{position:absolute;left:50%;top:40%;transform:translate(-50%,-50%);color:#ff2a3d;font:700 clamp(28px,6vw,64px)/1.1 "Cascadia Code",monospace;letter-spacing:-.02em;text-align:center;text-shadow:0 0 24px rgba(255,42,61,.5);opacity:0;transition:opacity .4s;white-space:nowrap}
.egg-stop.on{opacity:1;animation:egg-shake .12s steps(2) 6}
@keyframes egg-shake{50%{transform:translate(calc(-50% + 3px),calc(-50% - 2px))}}

.egg-table{position:fixed;inset:0;z-index:9996;display:grid;place-items:center;background:rgba(14,10,10,.88);font-family:"Cascadia Code",ui-monospace,monospace}
.egg-table .egg-close{top:20px;right:20px}
.egg-hand{--cw:clamp(58px,13vw,112px);position:relative;width:calc(var(--cw)*5);height:calc(var(--cw)*3.4)}
.egg-card{position:absolute;left:50%;top:30%;width:var(--cw);height:calc(var(--cw)*1.4);margin-left:calc(var(--cw)/-2);transform-style:preserve-3d;perspective:800px}
.egg-card>div{position:absolute;inset:0;border-radius:8px;backface-visibility:hidden}
.egg-card .face{display:flex;flex-direction:column;justify-content:space-between;padding:6px 8px;background:#f2e6e6;color:#c8102e;border:1px solid #000;font-weight:700;font-size:calc(var(--cw)*.2)}
.egg-card .face .mid{align-self:center;font-size:calc(var(--cw)*.5);line-height:1;font-variant-emoji:text}
.egg-card .face .br{align-self:flex-end;transform:rotate(180deg)}
.egg-card .back{transform:rotateY(180deg);background:#c8102e;border:3px solid #f2e6e6;display:grid;place-items:center;color:#fff;font-weight:700;font-size:calc(var(--cw)*.24);box-shadow:inset 0 0 0 4px #c8102e,inset 0 0 0 6px #ff5468}
.egg-flush{position:absolute;left:0;right:0;top:0;text-align:center;color:#ff5468;font-weight:700;font-size:13px;letter-spacing:.08em;opacity:0}
.egg-chips{position:absolute;left:-12%;bottom:6%;display:flex;gap:8px;align-items:flex-end}
.egg-chips span{display:flex;flex-direction:column-reverse}
.egg-chips i{width:calc(var(--cw)*.42);height:calc(var(--cw)*.1);margin-top:-2px;border-radius:50%;border:2px dashed rgba(255,255,255,.7)}
.egg-seat{position:absolute;left:50%;bottom:0;transform:translateX(-50%);display:inline-flex;align-items:center;gap:10px;min-height:48px;padding:0 22px;border-radius:6px;background:#c8102e;color:#fff;font-weight:700;font-size:16px;text-decoration:none;white-space:nowrap;opacity:0}
.egg-seat:hover{background:#de1a3a}
.egg-seat small{font-weight:400;opacity:.85;font-size:12px}

.egg-matrix{position:fixed;inset:0;z-index:9996;width:100%;height:100%;cursor:pointer;transition:opacity .8s}

.ok-bubble{position:absolute;left:50%;top:-18px;transform:translate(-50%,-100%);padding:8px 14px;background:#170d0e;border:1px solid #4a1218;border-radius:10px;color:#f2e6e6;font:700 15px/1.2 "Cascadia Code",monospace;white-space:nowrap;pointer-events:none}
.ok-bubble::after{content:"";position:absolute;left:50%;bottom:-7px;width:12px;height:12px;margin-left:-6px;background:#170d0e;border:solid #4a1218;border-width:0 1px 1px 0;transform:rotate(45deg)}
.leet{color:#ff5468}
`;
    const style = el('style');
    style.textContent = css;
    document.head.appendChild(style);

    /* ---------- Sound: all synthesized, no files ---------- */
    let ac = null;
    let noiseBuf = null;

    function audio() {
        try {
            if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
            if (ac.state === 'suspended') ac.resume();
            if (!noiseBuf) {
                noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
                const d = noiseBuf.getChannelData(0);
                for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
            }
            return ac;
        } catch (e) { return null; }
    }

    function tone(freq, dur, { type = 'sine', gain = 0.12, at = 0, slide = null, filter = null } = {}) {
        const a = audio();
        if (!a) return;
        const t0 = a.currentTime + at;
        const o = a.createOscillator();
        const g = a.createGain();
        o.type = type;
        o.frequency.setValueAtTime(freq, t0);
        if (slide) o.frequency.exponentialRampToValueAtTime(slide, t0 + dur);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(gain, t0 + Math.min(0.03, dur / 4));
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        let node = o;
        if (filter) {
            const f = a.createBiquadFilter();
            f.type = 'lowpass';
            f.frequency.value = filter;
            o.connect(f);
            node = f;
        }
        node.connect(g).connect(a.destination);
        o.start(t0);
        o.stop(t0 + dur + 0.05);
    }

    function noise(dur, { type = 'lowpass', freq = 800, gain = 0.2, at = 0, fade = true } = {}) {
        const a = audio();
        if (!a) return null;
        const t0 = a.currentTime + at;
        const s = a.createBufferSource();
        s.buffer = noiseBuf;
        s.loop = true;
        const f = a.createBiquadFilter();
        f.type = type;
        f.frequency.value = freq;
        const g = a.createGain();
        g.gain.setValueAtTime(fade ? gain : 0.0001, t0);
        if (fade) g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        s.connect(f).connect(g).connect(a.destination);
        s.start(t0);
        s.stop(t0 + dur + 0.05);
        return g;
    }

    function toast(text, ms = 2600) {
        const t = el('div', 'egg-toast');
        t.textContent = text;
        t.setAttribute('role', 'status');
        document.body.appendChild(t);
        t.animate([{ opacity: 0, transform: 'translate(-50%, 12px)' }, { opacity: 1, transform: 'translate(-50%, 0)' }], { duration: 250, easing: 'ease-out' });
        setTimeout(() => {
            t.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300 }).onfinish = () => t.remove();
        }, ms);
    }

    function shake(target = document.body, power = 6) {
        target.animate([
            { transform: 'none' },
            { transform: `translate(${power}px, ${-power / 2}px)` },
            { transform: `translate(${-power}px, ${power / 2}px)` },
            { transform: `translate(${power / 2}px, 0)` },
            { transform: 'none' }
        ], { duration: 320, easing: 'ease-out' });
    }

    /* ======================================================================
       1. znk(): a block falls from the sky
       ====================================================================== */
    function znk() {
        if (active.has('znk')) return L('It is already here. Look down.', 'Už tam je. Podívej se dolů.');
        active.add('znk');

        const box = el('div', 'egg-znk');
        box.innerHTML = `<a href="https://znk.cz/" target="_blank" rel="noopener"><img src="assets/egg/znk.png" width="242" height="146" alt="ZNK">znk.cz →</a>`;
        const close = el('button', 'egg-close', '×');
        close.type = 'button';
        close.setAttribute('aria-label', L('Close', 'Zavřít'));
        box.appendChild(close);
        document.body.appendChild(box);

        const w = box.offsetWidth;
        const h = box.offsetHeight;
        let x = rand(0.08, 0.72) * Math.max(0, window.innerWidth - w);
        let y = -h - 40;
        let vy = 0;
        let rot = rand(-35, 35);
        let vr = rand(-120, 120);
        const tilt = rand(-7, 7);
        let rest = false;
        let landed = false;
        let last = performance.now();
        const floor = () => window.innerHeight - h - 24;

        const step = (now) => {
            if (!box.isConnected) return;
            const dt = Math.min(0.033, (now - last) / 1000);
            last = now;
            vy += 2600 * dt;
            y += vy * dt;
            rot += vr * dt;
            if (y >= floor()) {
                y = floor();
                if (!landed) {
                    landed = true;
                    shake(document.querySelector('main') || document.body, 8);
                    noise(0.35, { freq: 220, gain: 0.5 });
                    tone(70, 0.3, { type: 'sine', gain: 0.4, slide: 40 });
                    dust(x + w / 2, y + h);
                }
                if (Math.abs(vy) > 260) {
                    vy = -vy * 0.42;
                    vr = -vr * 0.5;
                    noise(0.12, { freq: 300, gain: 0.2 });
                } else {
                    vy = 0;
                    rest = true;
                }
            }
            if (landed) {
                vr = 0;
                rot += (tilt - rot) * Math.min(1, dt * 7);
            }
            box.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
            if (!rest || Math.abs(tilt - rot) > 0.3) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);

        const onResize = () => {
            if (!rest) return;
            x = Math.min(x, Math.max(0, window.innerWidth - w));
            y = floor();
            box.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
        };
        window.addEventListener('resize', onResize);

        close.addEventListener('click', () => {
            window.removeEventListener('resize', onResize);
            box.animate([{ opacity: 1 }, { opacity: 0, transform: `translate(${x}px, ${window.innerHeight + 40}px) rotate(${rot + 40}deg)` }], { duration: 500, easing: 'ease-in' }).onfinish = () => {
                box.remove();
                active.delete('znk');
            };
        });

        return L('Told you not to. o/', 'Říkal jsem, ať to nepíšeš. o/');
    }

    function dust(cx, cy) {
        for (let i = 0; i < 14; i++) {
            const d = el('i', 'egg-dust');
            d.style.left = `${cx + rand(-110, 110)}px`;
            d.style.top = `${cy - 6}px`;
            document.body.appendChild(d);
            d.animate([
                { transform: 'translate(0, 0)', opacity: 0.9 },
                { transform: `translate(${rand(-60, 60)}px, ${rand(-70, -20)}px)`, opacity: 0 }
            ], { duration: rand(500, 900), easing: 'cubic-bezier(.2,.7,.2,1)' }).onfinish = () => d.remove();
        }
    }

    window.znk = znk;

    /* ======================================================================
       2. minecraft: the logo becomes a grass block you can mine
       ====================================================================== */
    function pixelTexture(paint) {
        const c = document.createElement('canvas');
        c.width = c.height = 16;
        const g = c.getContext('2d');
        for (let y = 0; y < 16; y++) {
            for (let x = 0; x < 16; x++) {
                g.fillStyle = paint(x, y);
                g.fillRect(x, y, 1, 1);
            }
        }
        return c.toDataURL();
    }

    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const GRASS = ['#5d9e3a', '#4f8c30', '#6cb043', '#47812b', '#79bd4c'];
    const DIRT = ['#866043', '#6b4a30', '#9a7350', '#5d3f28', '#7a573a'];
    let tex = null;
    let cracks = null;

    function textures() {
        if (tex) return tex;
        const edge = Array.from({ length: 16 }, () => 3 + Math.floor(Math.random() * 3));
        tex = {
            top: pixelTexture(() => pick(GRASS)),
            side: pixelTexture((x, y) => (y < edge[x] ? pick(GRASS) : pick(DIRT))),
            dirt: pixelTexture(() => pick(DIRT))
        };
        // Crack stages: one random walk from the middle, revealed bit by bit
        const path = [];
        for (let b = 0; b < 5; b++) {
            let x = 8, y = 8;
            for (let i = 0; i < 12; i++) {
                x = Math.max(0, Math.min(15, x + Math.round(rand(-1, 1))));
                y = Math.max(0, Math.min(15, y + Math.round(rand(-1, 1))));
                path.push([x, y]);
            }
        }
        path.sort(() => Math.random() - 0.5).sort((a, b) => Math.hypot(a[0] - 8, a[1] - 8) - Math.hypot(b[0] - 8, b[1] - 8));
        cracks = [];
        for (let s = 1; s <= 9; s++) {
            const c = document.createElement('canvas');
            c.width = c.height = 16;
            const g = c.getContext('2d');
            g.fillStyle = 'rgba(0,0,0,.72)';
            path.slice(0, Math.round(path.length * s / 9)).forEach(([x, y]) => g.fillRect(x, y, 1, 1));
            cracks.push(c.toDataURL());
        }
        return tex;
    }

    function cube(size) {
        const t = textures();
        const btn = el('button', 'mc-btn');
        btn.type = 'button';
        btn.style.setProperty('--s', `${size}px`);
        const c = el('div', 'mc-cube');
        [['fr', t.side], ['bk', t.side], ['rt', t.side], ['lt', t.side], ['tp', t.top], ['bt', t.dirt]].forEach(([k, src]) => {
            const f = el('div', `mc-face ${k}`);
            f.style.backgroundImage = `url(${src})`;
            c.appendChild(f);
        });
        btn.appendChild(c);
        return { btn, cubeEl: c };
    }

    function minecraft() {
        if (active.has('mc')) return;
        active.add('mc');

        const logo = document.getElementById('brand-logo');
        const holder = logo ? logo.parentElement : document.body;
        const size = logo ? logo.offsetWidth : 140;
        const { btn, cubeEl } = cube(size);
        btn.setAttribute('aria-label', L('Grass block. Hold to mine.', 'Blok trávy. Držte a těžte.'));
        if (!logo) btn.classList.add('mc-float');

        if (logo) logo.style.display = 'none';
        holder.appendChild(btn);
        btn.animate([{ transform: 'scale(.2) rotate(-90deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 500, easing: 'cubic-bezier(.2,1.4,.4,1)' });
        tone(220, 0.15, { type: 'square', gain: 0.05, filter: 1200 });
        tone(330, 0.15, { type: 'square', gain: 0.05, filter: 1200, at: 0.1 });

        let stage = 0;
        let timer = null;

        const hit = () => {
            stage += 1;
            cubeEl.style.setProperty('--crack', `url(${cracks[Math.min(stage, 9) - 1]})`);
            noise(0.07, { type: 'bandpass', freq: rand(500, 900), gain: 0.35 });
            btn.animate([{ transform: 'scale(1)' }, { transform: 'scale(.96)' }, { transform: 'scale(1)' }], { duration: 110 });
            if (stage >= 10) breakBlock();
        };

        const startMining = (event) => {
            if (event) event.preventDefault();
            if (timer) return;
            hit();
            timer = setInterval(hit, 140);
        };
        const stopMining = () => { clearInterval(timer); timer = null; };

        btn.addEventListener('pointerdown', startMining);
        ['pointerup', 'pointerleave', 'pointercancel'].forEach((e) => btn.addEventListener(e, stopMining));
        btn.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); hit(); }
        });

        function breakBlock() {
            stopMining();
            const r = btn.getBoundingClientRect();
            noise(0.3, { freq: 700, gain: 0.5 });
            for (let i = 0; i < 26; i++) {
                const b = el('i', 'mc-bit');
                const s = rand(6, 14);
                b.style.cssText = `left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;width:${s}px;height:${s}px;background:${pick(i % 3 ? DIRT : GRASS)}`;
                document.body.appendChild(b);
                const dx = rand(-160, 160);
                b.animate([
                    { transform: 'translate(0,0)', opacity: 1 },
                    { transform: `translate(${dx * 0.6}px, ${rand(-140, -60)}px)`, opacity: 1, offset: 0.35 },
                    { transform: `translate(${dx}px, ${rand(60, 180)}px)`, opacity: 0 }
                ], { duration: rand(600, 1000), easing: 'ease-in' }).onfinish = () => b.remove();
            }
            btn.remove();

            // The dropped item
            const { btn: item } = cube(64);
            item.classList.add('mc-item');
            item.setAttribute('aria-label', L('Pick up the block', 'Sebrat blok'));
            const xp = el('span', 'mc-xp', '+1 XP');
            const wrap = logo ? holder : document.body;
            if (!logo) {
                item.style.position = 'fixed';
                item.style.left = `${r.left + r.width / 2}px`;
                item.style.top = `${r.top + r.height / 2}px`;
                xp.style.position = 'fixed';
                xp.style.left = `${r.left + r.width / 2}px`;
                xp.style.top = `${r.top}px`;
            }
            item.style.setProperty('--s', '64px');
            wrap.append(item, xp);
            xp.animate([{ opacity: 0, transform: 'translate(-50%, 10px)' }, { opacity: 1, offset: 0.2 }, { opacity: 0, transform: 'translate(-50%, -50px)' }], { duration: 1600, fill: 'forwards' });
            tone(1568, 0.12, { gain: 0.08 });
            tone(2093, 0.18, { gain: 0.08, at: 0.08 });

            item.addEventListener('click', () => {
                tone(500, 0.12, { type: 'sine', gain: 0.15, slide: 1100 });
                item.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(-80px) scale(.2)', opacity: 0 }], { duration: 300, easing: 'ease-in' }).onfinish = () => {
                    item.remove();
                    xp.remove();
                    if (logo) {
                        logo.style.display = '';
                        logo.animate([{ transform: 'scale(.6)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 400, easing: 'cubic-bezier(.2,1.4,.4,1)' });
                    }
                    toast(L('Block collected. 1 / 64', 'Blok sebrán. 1 / 64'));
                    active.delete('mc');
                };
            });
        }
        return true;
    }

    /* ======================================================================
       3. The train. It comes at night.
       ====================================================================== */
    function train() {
        if (active.has('train')) return;
        active.add('train');

        const night = el('div', 'egg-night');
        night.setAttribute('aria-hidden', 'true');
        night.innerHTML = '<div class="egg-rail"></div>';
        const trainEl = el('div', 'egg-train');

        const loco = el('div', 'egg-loco', '<div class="beam"></div><div class="stack"></div><div class="cab"></div><div class="body"></div><div class="lamp"></div><div class="egg-wheels"><i></i><i></i><i></i></div>');
        for (let i = 0; i < 3; i++) {
            const s = el('div', 'egg-smoke');
            s.style.animationDelay = `${i * 0.45}s`;
            loco.appendChild(s);
        }
        trainEl.appendChild(loco);

        const tags = [
            ['HORRORCORE', ''],
            [L('DON\'T LOOK BACK', 'NEOTÁČEJ SE'), 'alt'],
            ['3:33', ''],
            ['', 'door']
        ];
        tags.forEach(([text, kind], idx) => {
            const car = el('div', 'egg-car');
            const wins = el('div', 'egg-wins');
            for (let w = 0; w < 5; w++) {
                const win = el('div', 'egg-win');
                if (Math.random() < 0.45 || (idx === 0 && w === 2)) {
                    const eyes = el('div', 'egg-eyes', '<i></i><i></i>');
                    eyes.style.animationDelay = `${rand(0, 3)}s`;
                    win.appendChild(eyes);
                }
                wins.appendChild(win);
            }
            car.appendChild(wins);
            if (kind === 'door') {
                const door = el('div', 'egg-door', '<div class="egg-fig"><b></b><b></b></div>');
                car.appendChild(door);
                const tag = el('div', 'egg-tag', 'OK');
                tag.style.right = '110px';
                car.appendChild(tag);
            } else {
                const tag = el('div', `egg-tag ${kind}`);
                tag.textContent = text;
                for (let d = 0; d < 6; d++) {
                    const drip = el('i', 'egg-drip');
                    drip.style.left = `${rand(4, 96)}%`;
                    drip.style.setProperty('--h', `${rand(10, 34)}px`);
                    drip.style.animationDelay = `${rand(0, 1.5)}s`;
                    tag.appendChild(drip);
                }
                car.appendChild(tag);
            }
            car.appendChild(el('div', 'egg-wheels', '<i></i><i></i><i></i><i></i>'));
            trainEl.appendChild(car);
        });

        night.appendChild(trainEl);
        const stop = el('div', 'egg-stop');
        stop.textContent = L('Next stop: you.', 'Další zastávka: ty.');
        night.appendChild(stop);
        document.body.appendChild(night);
        requestAnimationFrame(() => night.classList.add('on'));

        // Sound: horn, rumble, wheels
        const a = audio();
        const DURATION = 7.5;
        if (a) {
            [0.6, 2.2].forEach((at) => {
                tone(185, 1.3, { type: 'sawtooth', gain: 0.07, at, filter: 900 });
                tone(233, 1.3, { type: 'sawtooth', gain: 0.06, at, filter: 900 });
                tone(277, 1.3, { type: 'sawtooth', gain: 0.04, at, filter: 900 });
            });
            const rumble = noise(DURATION + 1, { freq: 120, gain: 0.0001, fade: false });
            if (rumble) {
                const t0 = a.currentTime;
                rumble.gain.exponentialRampToValueAtTime(0.5, t0 + 2.5);
                rumble.gain.exponentialRampToValueAtTime(0.0001, t0 + DURATION + 0.8);
            }
            for (let k = 1.2; k < DURATION; k += 0.42) {
                noise(0.04, { type: 'bandpass', freq: 1800, gain: 0.12, at: k });
                noise(0.04, { type: 'bandpass', freq: 1600, gain: 0.1, at: k + 0.12 });
            }
        }

        const from = window.innerWidth + 40;
        const to = -trainEl.scrollWidth - 40;
        const run = trainEl.animate([
            { transform: `translateX(${from}px)` },
            { transform: `translateX(${to}px)` }
        ], { duration: DURATION * 1000, delay: 1100, easing: 'cubic-bezier(.3,0,.7,1)', fill: 'forwards' });

        const fig = night.querySelector('.egg-fig');
        const lookTimer = setTimeout(() => { if (fig) fig.classList.add('look'); }, 1100 + DURATION * 1000 * 0.62);

        let ended = false;
        const end = () => {
            if (ended) return;
            ended = true;
            clearTimeout(lookTimer);
            document.removeEventListener('keydown', onKey);
            night.classList.remove('on');
            night.classList.add('off');
            setTimeout(() => { night.remove(); active.delete('train'); }, 1300);
        };
        const onKey = (event) => { if (event.key === 'Escape') end(); };

        run.onfinish = () => {
            stop.classList.add('on');
            tone(110, 1.2, { type: 'triangle', gain: 0.12, slide: 55 });
            setTimeout(end, 2000);
        };
        night.addEventListener('click', end);
        document.addEventListener('keydown', onKey);
        return true;
    }

    /* ======================================================================
       4. poker: deal a royal flush, then take a seat
       ====================================================================== */
    function poker() {
        if (active.has('poker')) return;
        active.add('poker');

        const table = el('div', 'egg-table');
        table.setAttribute('role', 'dialog');
        table.setAttribute('aria-label', 'Royal flush');
        const hand = el('div', 'egg-hand');
        const flush = el('div', 'egg-flush', 'ROYAL FLUSH');
        hand.appendChild(flush);

        const chips = el('div', 'egg-chips');
        [['#c8102e', 6], ['#f2e6e6', 4], ['#d9a13b', 5]].forEach(([color, n]) => {
            const stack = el('span');
            for (let i = 0; i < n; i++) {
                const c = el('i');
                c.style.background = color;
                stack.appendChild(c);
            }
            chips.appendChild(stack);
        });
        chips.style.opacity = '0';
        hand.appendChild(chips);

        const ranks = ['10', 'J', 'Q', 'K', 'A'];
        const cards = ranks.map((rank) => {
            const card = el('div', 'egg-card');
            card.innerHTML = `<div class="face"><span>${rank}♥&#xFE0E;</span><span class="mid">♥&#xFE0E;</span><span class="br">${rank}♥&#xFE0E;</span></div><div class="back">OK</div>`;
            hand.appendChild(card);
            return card;
        });

        const seat = el('a', 'egg-seat');
        seat.href = 'https://poker.opikula.dev/';
        seat.target = '_blank';
        seat.rel = 'noopener';
        seat.innerHTML = `${L('Take a seat →', 'Sedni ke stolu →')} <small>poker.opikula.dev</small>`;
        hand.appendChild(seat);

        const close = el('button', 'egg-close', '×');
        close.type = 'button';
        close.setAttribute('aria-label', L('Close', 'Zavřít'));
        table.append(hand, close);
        document.body.appendChild(table);
        table.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250 });

        const cw = cards[0].offsetWidth;
        cards.forEach((card, i) => {
            const k = i - 2;
            const end = `translate(${k * cw * 0.82}px, ${Math.abs(k) * 12}px) rotate(${k * 7}deg) rotateY(0deg)`;
            card.animate([
                { transform: `translate(0, ${window.innerHeight * 0.6}px) rotate(${rand(-40, 40)}deg) rotateY(180deg)`, opacity: 0 },
                { opacity: 1, offset: 0.2 },
                { transform: end, opacity: 1 }
            ], { duration: 650, delay: 200 + i * 190, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'both' });
            noise(0.05, { type: 'highpass', freq: 3000, gain: 0.25, at: 0.2 + i * 0.19 });
        });

        const after = 200 + 4 * 190 + 650;
        flush.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 400, delay: after, fill: 'forwards' });
        chips.animate([{ opacity: 0, transform: 'translateY(-60px)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: after + 150, easing: 'cubic-bezier(.2,1.4,.4,1)', fill: 'forwards' });
        [0, 0.07, 0.14, 0.21].forEach((d) => tone(2400 + rand(-300, 300), 0.08, { gain: 0.05, at: (after + 300) / 1000 + d }));
        seat.animate([{ opacity: 0, transform: 'translate(-50%, 20px)' }, { opacity: 1, transform: 'translate(-50%, 0)' }], { duration: 400, delay: after + 600, fill: 'forwards' })
            .onfinish = () => seat.focus({ preventScroll: true });

        const end = () => {
            document.removeEventListener('keydown', onKey);
            table.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250 }).onfinish = () => { table.remove(); active.delete('poker'); };
        };
        const onKey = (event) => { if (event.key === 'Escape') end(); };
        close.addEventListener('click', end);
        table.addEventListener('click', (event) => { if (event.target === table) end(); });
        document.addEventListener('keydown', onKey);
        return true;
    }

    /* ======================================================================
       5. Gravity (Konami code) and the sudo meltdown
       ====================================================================== */
    function gravity({ selector, message, auto = 0, spin = 28 } = {}) {
        if (active.has('gravity')) return false;
        active.add('gravity');

        const sel = selector || '.brand, .nav a, .lang, .hero-copy > *, .hero-mark, .section-head > *, .about li, .window, .panel, .page-head > *, .crow, .footer-inner > p';
        const items = [...document.querySelectorAll(sel)].filter((n) => {
            const r = n.getBoundingClientRect();
            return r.bottom > 0 && r.top < window.innerHeight && r.width > 0;
        });
        const anims = [];
        root.style.overflow = 'hidden';

        items.forEach((n, i) => {
            const r = n.getBoundingClientRect();
            const d = window.innerHeight - r.bottom - rand(0, 30);
            const rot = rand(-spin, spin);
            const delay = auto ? i * 25 : rand(0, 450);
            const anim = n.animate([
                { transform: 'none' },
                { transform: `translateY(${d}px) rotate(${rot}deg)`, offset: 0.72, easing: 'cubic-bezier(.5,0,.75,0)' },
                { transform: `translateY(${d - 28}px) rotate(${rot * 1.1}deg)`, offset: 0.86 },
                { transform: `translateY(${d}px) rotate(${rot}deg)` }
            ], { duration: rand(900, 1300), delay, fill: 'forwards', easing: 'ease-in' });
            setTimeout(() => noise(0.08, { freq: 180, gain: 0.25 }), delay + 700);
            anims.push(anim);
        });

        toast(message || L('Gravity: on. Click anywhere to fix it.', 'Gravitace: zapnuta. Klikněte kamkoli a opravím to.'), auto || 3200);

        const restore = () => {
            document.removeEventListener('click', restore, true);
            document.removeEventListener('keydown', onKey);
            anims.forEach((a) => {
                a.playbackRate = 2;
                a.reverse();
            });
            setTimeout(() => {
                anims.forEach((a) => a.cancel());
                root.style.overflow = '';
                active.delete('gravity');
            }, 1500);
        };
        const onKey = (event) => { if (event.key === 'Escape') restore(); };

        if (auto) setTimeout(restore, auto);
        else {
            setTimeout(() => {
                document.addEventListener('click', restore, true);
                document.addEventListener('keydown', onKey);
            }, 600);
        }
        return true;
    }

    function meltdown() {
        noise(1.2, { freq: 400, gain: 0.3 });
        return gravity({
            selector: 'main h1, main h2, main h3, main p, main li, main .btn, main .window, .brand, .nav a, .hero-mark',
            message: L('Nice try.', 'Pěkný pokus.'),
            auto: 3000,
            spin: 70
        });
    }

    /* ======================================================================
       6. matrix: hex rain in the house colours
       ====================================================================== */
    function matrix() {
        if (active.has('matrix')) return;
        active.add('matrix');
        const c = el('canvas', 'egg-matrix');
        c.setAttribute('aria-hidden', 'true');
        document.body.appendChild(c);
        const g = c.getContext('2d');
        const W = c.width = window.innerWidth;
        const H = c.height = window.innerHeight;
        const size = 16;
        const drops = Array.from({ length: Math.ceil(W / size) }, () => rand(-40, 0));
        g.fillStyle = '#0e0a0a';
        g.fillRect(0, 0, W, H);
        let alive = true;
        const draw = () => {
            if (!alive) return;
            g.fillStyle = 'rgba(14,10,10,.14)';
            g.fillRect(0, 0, W, H);
            g.font = `700 ${size}px "Cascadia Code", monospace`;
            drops.forEach((y, i) => {
                const ch = '0123456789ABCDEF'[Math.floor(Math.random() * 16)];
                g.fillStyle = Math.random() < 0.08 ? '#f2e6e6' : (Math.random() < 0.5 ? '#ff5468' : '#7a1424');
                g.fillText(ch, i * size, y * size);
                drops[i] = y * size > H && Math.random() > 0.96 ? 0 : y + 1;
            });
            setTimeout(() => requestAnimationFrame(draw), 45);
        };
        draw();
        const end = () => {
            if (!alive) return;
            c.style.opacity = '0';
            setTimeout(() => { alive = false; c.remove(); active.delete('matrix'); }, 800);
        };
        c.addEventListener('click', end);
        setTimeout(end, 5200);
        return true;
    }

    /* ======================================================================
       7. Small ones: OK guy, 1337
       ====================================================================== */
    const logo = document.getElementById('brand-logo');
    if (logo) {
        let clicks = 0;
        let reset;
        logo.addEventListener('click', () => {
            clicks += 1;
            clearTimeout(reset);
            reset = setTimeout(() => { clicks = 0; }, 700);
            if (clicks < 3 || active.has('guy')) return;
            clicks = 0;
            active.add('guy');
            const bubble = el('div', 'ok-bubble');
            bubble.textContent = L('Hi! I live here.', 'Ahoj! Já tu bydlím.');
            logo.parentElement.appendChild(bubble);
            tone(660, 0.1, { type: 'square', gain: 0.04, filter: 1500 });
            tone(880, 0.12, { type: 'square', gain: 0.04, filter: 1500, at: 0.1 });
            // Hop three times and wave
            logo.animate([
                { transform: 'translateY(0)' },
                { transform: 'translateY(-26px)', easing: 'ease-in' },
                { transform: 'translateY(0)' }
            ], { duration: 380, iterations: 3, easing: 'ease-out' });
            const arms = logo.querySelector('.g-arms');
            if (arms) {
                arms.animate([
                    { transform: 'rotate(0)' },
                    { transform: 'rotate(-14deg)' },
                    { transform: 'rotate(14deg)' },
                    { transform: 'rotate(0)' }
                ], { duration: 520, iterations: 4, delay: 300 });
            }
            logo.querySelectorAll('.g-leg').forEach((leg, i) => {
                leg.animate([
                    { transform: 'rotate(0)' },
                    { transform: `rotate(${i ? -10 : 10}deg)` },
                    { transform: 'rotate(0)' }
                ], { duration: 380, iterations: 3 });
            });
            setTimeout(() => {
                bubble.remove();
                active.delete('guy');
            }, 3600);
        });
    }

    document.querySelectorAll('[data-year]').forEach((y) => {
        y.addEventListener('dblclick', () => {
            const real = y.textContent;
            if (real === '1337') return;
            y.textContent = '1337';
            y.classList.add('leet');
            window.getSelection().removeAllRanges();
            setTimeout(() => { y.textContent = real; y.classList.remove('leet'); }, 2500);
        });
    });

    /* ---------- Secret words and the Konami code ---------- */
    const WORDS = { minecraft, vlak: train, train, poker, allin: poker, matrix };
    const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
    let typed = '';
    let keys = [];

    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        const target = event.target;
        if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
        const key = (event.key || '').toLowerCase();

        keys = [...keys, key].slice(-KONAMI.length);
        if (keys.join() === KONAMI.join()) {
            keys = [];
            gravity();
            return;
        }

        if (key.length !== 1) return;
        typed = (typed + key).slice(-12);
        for (const word of Object.keys(WORDS)) {
            if (typed.endsWith(word)) {
                typed = '';
                WORDS[word]();
                break;
            }
        }
    });

    /* ---------- The train sometimes comes on its own ---------- */
    if (!site.reduceMotion.matches) {
        const hour = new Date().getHours();
        let seen = null;
        try { seen = sessionStorage.getItem('night-train'); } catch (e) { /* ignore */ }
        if (hour < 4 && !seen) {
            setTimeout(() => {
                try { sessionStorage.setItem('night-train', '1'); } catch (e) { /* ignore */ }
                if (!document.hidden) train();
            }, 20000);
        } else if (Math.random() < 0.01) {
            setTimeout(() => { if (!document.hidden) train(); }, rand(25000, 45000));
        }
    }

    /* ---------- For the curious ones with DevTools open ---------- */
    console.log(
        '%c OK %c opikula.dev',
        'background:#c8102e;color:#fff;font:700 28px "Cascadia Code",monospace;padding:4px 12px;border-radius:6px',
        'color:#a88a8c;font:400 14px "Cascadia Code",monospace'
    );

    window.OKeggs = { znk, minecraft, train, poker, matrix, gravity, meltdown };
})();
