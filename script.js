/* ==========================================================================
   opikula.dev: shared behaviour
   Language is first applied by a tiny inline script in <head> (so there is
   no flash). This file adds the controls, the motion and the two small apps.
   ========================================================================== */
(() => {
    'use strict';

    const root = document.documentElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Strings that are built by script (everything else is bilingual markup)
    const T = {
        en: {
            openMenu: 'Open navigation menu',
            closeMenu: 'Close navigation menu',
            copy: 'Copy',
            copied: 'Copied',
            copyLabel: 'Copy email address',
            feedEmpty: 'GitHub is not answering right now. Try again later.',
            noDesc: 'no description',
            away: 'Hey, come back.'
        },
        cs: {
            openMenu: 'Otevřít navigační menu',
            closeMenu: 'Zavřít navigační menu',
            copy: 'Kopírovat',
            copied: 'Zkopírováno',
            copyLabel: 'Kopírovat e-mailovou adresu',
            feedEmpty: 'GitHub teď neodpovídá. Zkuste to později.',
            noDesc: 'bez popisu',
            away: 'Hej, vraťte se.'
        }
    };

    const store = {
        get(key, area = localStorage) {
            try { return area.getItem(key); } catch (e) { return null; }
        },
        set(key, value, area = localStorage) {
            try { area.setItem(key, value); } catch (e) { /* storage can be blocked */ }
        }
    };

    const lang = () => (root.lang === 'cs' ? 'cs' : 'en');
    const t = (key) => T[lang()][key];

    // Remember the English page title / description so we can switch back to them
    const descMeta = document.querySelector('meta[name="description"]');
    root.dataset.titleEn = document.title;
    if (descMeta) descMeta.dataset.en = descMeta.content;

    const pageTitle = () => (lang() === 'cs' && root.dataset.titleCs ? root.dataset.titleCs : root.dataset.titleEn);

    /* ---------- Language ---------- */
    const langButtons = document.querySelectorAll('.lang button');
    const langListeners = [];

    function renderLang() {
        const l = lang();
        langButtons.forEach((btn) => btn.setAttribute('aria-pressed', String(btn.dataset.lang === l)));
        if (!document.hidden) document.title = pageTitle();
        if (descMeta) descMeta.content = l === 'cs' && descMeta.dataset.cs ? descMeta.dataset.cs : descMeta.dataset.en;
        renderMenuLabel();
        renderCopy();
        langListeners.forEach((fn) => fn(l));
    }

    function setLang(next) {
        if (next === lang()) return;
        root.lang = next;
        store.set('lang', next);
        renderLang();
    }

    langButtons.forEach((btn) => btn.addEventListener('click', () => setLang(btn.dataset.lang)));

    /* ---------- Mobile menu ---------- */
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.getElementById('site-nav');

    function renderMenuLabel() {
        if (!menuToggle) return;
        const open = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-label', open ? t('closeMenu') : t('openMenu'));
    }

    function setMenu(open) {
        if (!menuToggle || !nav) return;
        menuToggle.setAttribute('aria-expanded', String(open));
        nav.classList.toggle('is-open', open);
        renderMenuLabel();
    }

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
        });

        nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && nav.classList.contains('is-open')) {
                setMenu(false);
                menuToggle.focus();
            }
        });

        document.addEventListener('click', (event) => {
            if (nav.classList.contains('is-open') && !nav.contains(event.target) && !menuToggle.contains(event.target)) {
                setMenu(false);
            }
        });

        window.matchMedia('(min-width: 721px)').addEventListener('change', (event) => {
            if (event.matches) setMenu(false);
        });
    }

    /* ---------- Headline: "decrypt" from 0-9 A-F on load ---------- */
    const HEX = '0123456789ABCDEF';

    function decrypt(el, duration = 1100) {
        const text = el.textContent.trim();
        if (!text || reduceMotion.matches) return;
        el.setAttribute('aria-label', text);
        const start = performance.now();
        const order = [...text].map((_, i) => i / text.length * 0.7 + Math.random() * 0.3);

        el.classList.add('decrypt');
        const frame = (now) => {
            const p = Math.min(1, (now - start) / duration);
            let html = '';
            [...text].forEach((ch, i) => {
                if (ch === ' ' || p >= order[i]) html += ch === '<' ? '&lt;' : ch;
                else html += `<span class="d-char">${HEX[Math.floor(Math.random() * 16)]}</span>`;
            });
            el.innerHTML = html;
            if (p < 1) requestAnimationFrame(frame);
            else { el.textContent = text; el.classList.remove('decrypt'); }
        };
        requestAnimationFrame(frame);
    }

    document.querySelectorAll('[data-decrypt]').forEach((el) => decrypt(el));
    document.querySelectorAll('[data-decrypt-lang] > [lang]').forEach((el) => decrypt(el));

    /* ---------- Background: dot grid, blinking bits, packets, warm cursor ---------- */
    const canvas = document.querySelector('.grid-bg');

    if (canvas && canvas.getContext) {
        const ctx = canvas.getContext('2d');
        const GAP = 24;
        // Phones and small screens get a still grid, so nothing runs in the background
        const lite = window.matchMedia('(max-width: 860px), (pointer: coarse)');
        const COLORS = { dim: '#2e1418', mid: '#7a1424', hot: '#ff5468' };
        let w = 0, h = 0, dpr = 1, cols = 0, rows = 0;
        let mouse = { x: -9999, y: -9999 };
        let bits = [];
        let packets = [];
        let last = 0;
        let running = false;

        const resize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            cols = Math.ceil(w / GAP) + 1;
            rows = Math.ceil(h / GAP) + 1;
            draw(performance.now());
        };

        const draw = (now) => {
            ctx.clearRect(0, 0, w, h);
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const x = c * GAP + GAP / 2;
                    const y = r * GAP + GAP / 2;
                    const d = Math.hypot(x - mouse.x, y - mouse.y);
                    if (d < 140) {
                        ctx.fillStyle = d < 60 ? COLORS.hot : COLORS.mid;
                        ctx.globalAlpha = 1 - d / 160;
                        ctx.fillRect(x - 1, y - 1, 2, 2);
                        ctx.globalAlpha = 1;
                    } else {
                        ctx.fillStyle = COLORS.dim;
                        ctx.fillRect(x - 1, y - 1, 2, 2);
                    }
                }
            }
            // Blinking bits
            bits = bits.filter((b) => now - b.t < 900);
            bits.forEach((b) => {
                const a = 1 - (now - b.t) / 900;
                ctx.globalAlpha = a;
                ctx.fillStyle = COLORS.hot;
                ctx.font = '10px "Cascadia Code", monospace';
                ctx.fillText(b.v, b.c * GAP + GAP / 2 - 3, b.r * GAP + GAP / 2 + 3);
            });
            ctx.globalAlpha = 1;
            // Packets: little snakes that run along the grid, turn at the dots
            // and leave through the far edge of the screen
            packets.forEach(drawPacket);
        };

        const MAX_PACKETS = 4;
        const px = (c) => c * GAP + GAP / 2;

        function packetHead(p) {
            const [hx, hy] = p.pts[p.pts.length - 1];
            return [hx + p.dir[0] * p.t, hy + p.dir[1] * p.t];
        }

        function drawPacket(p) {
            const pts = [...p.pts.slice(-p.len), packetHead(p)];
            ctx.lineWidth = 2;
            ctx.lineCap = 'square';
            for (let i = 1; i < pts.length; i++) {
                ctx.globalAlpha = (i / pts.length) * 0.9;
                ctx.strokeStyle = i > pts.length - 3 ? COLORS.hot : COLORS.mid;
                ctx.beginPath();
                ctx.moveTo(px(pts[i - 1][0]), px(pts[i - 1][1]));
                ctx.lineTo(px(pts[i][0]), px(pts[i][1]));
                ctx.stroke();
            }
            const [hx, hy] = pts[pts.length - 1];
            ctx.globalAlpha = 0.25;
            ctx.fillStyle = COLORS.hot;
            ctx.fillRect(px(hx) - 5, px(hy) - 5, 10, 10);
            ctx.globalAlpha = 1;
            ctx.fillRect(px(hx) - 2, px(hy) - 2, 4, 4);
        }

        function spawnPacket() {
            const main = [[1, 0], [-1, 0], [0, 1], [0, -1]][Math.floor(Math.random() * 4)];
            const start = main[0]
                ? [main[0] > 0 ? -1 : cols, Math.floor(Math.random() * rows)]
                : [Math.floor(Math.random() * cols), main[1] > 0 ? -1 : rows];
            packets.push({
                pts: [start],
                main,
                dir: main,
                side: 0,
                t: 0,
                speed: 5 + Math.random() * 7, // dots per second
                len: 5 + Math.floor(Math.random() * 7)
            });
        }

        function turn(p) {
            const onMain = p.dir === p.main;
            if (onMain && Math.random() < 0.3) {
                // Step aside, left or right of the main direction
                const s = Math.random() < 0.5 ? 1 : -1;
                p.dir = [p.main[1] * s, p.main[0] * s];
                p.side = 0;
            } else if (!onMain && (p.side >= 3 || Math.random() < 0.45)) {
                p.dir = p.main;
            }
            if (!onMain) p.side += 1;
        }

        const outside = ([c, r]) => c < -2 || r < -2 || c > cols + 1 || r > rows + 1;

        function movePacket(p, dt) {
            p.t += p.speed * dt;
            while (p.t >= 1) {
                p.t -= 1;
                const [hx, hy] = p.pts[p.pts.length - 1];
                p.pts.push([hx + p.dir[0], hy + p.dir[1]]);
                if (p.pts.length > p.len + 2) p.pts.shift();
                turn(p);
            }
        }

        const tick = (now) => {
            if (!running) return;
            if (now - last > 33) {
                const dt = Math.min(0.1, (now - last) / 1000);
                if (Math.random() < 0.06) bits.push({ c: Math.floor(Math.random() * cols), r: Math.floor(Math.random() * rows), v: Math.random() < 0.5 ? '0' : '1', t: now });
                if (packets.length < MAX_PACKETS && Math.random() < 0.02) spawnPacket();
                packets.forEach((p) => movePacket(p, dt));
                // A packet is gone only once its whole tail has left the screen
                packets = packets.filter((p) => p.pts.length < 3 || !p.pts.slice(-p.len).every(outside));
                draw(now);
                last = now;
            }
            requestAnimationFrame(tick);
        };

        const start = () => {
            if (running || reduceMotion.matches || lite.matches || document.hidden) return;
            last = performance.now();
            running = true;
            requestAnimationFrame(tick);
        };

        window.addEventListener('resize', resize);
        window.addEventListener('pointermove', (event) => { mouse = { x: event.clientX, y: event.clientY }; }, { passive: true });
        document.addEventListener('pointerleave', () => { mouse = { x: -9999, y: -9999 }; });
        document.addEventListener('visibilitychange', () => { if (document.hidden) running = false; else start(); });
        const restart = () => { running = false; packets = []; start(); draw(performance.now()); };
        reduceMotion.addEventListener('change', restart);
        lite.addEventListener('change', restart);
        resize();
        start();
    }

    /* ---------- Sections slide up once ---------- */
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-in');
                io.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -10% 0px' });
        reveals.forEach((el) => io.observe(el));
    } else {
        reveals.forEach((el) => el.classList.add('is-in'));
    }

    /* ---------- Copy e-mail address ---------- */
    const copyButtons = document.querySelectorAll('.copy');
    const copyTimers = new WeakMap();

    function renderCopy() {
        copyButtons.forEach((btn) => {
            const copied = btn.classList.contains('is-copied');
            btn.textContent = copied ? t('copied') : t('copy');
            btn.setAttribute('aria-label', copied ? t('copied') : t('copyLabel'));
        });
    }

    async function copyText(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (e) { /* fall back to the old way below */ }

        const field = document.createElement('textarea');
        field.value = text;
        field.setAttribute('readonly', '');
        field.style.cssText = 'position: fixed; top: 0; left: 0; opacity: 0;';
        document.body.appendChild(field);
        field.select();
        let ok = false;
        try { ok = document.execCommand('copy'); } catch (e) { /* ignore */ }
        field.remove();
        return ok;
    }

    copyButtons.forEach((btn) => {
        btn.addEventListener('click', async () => {
            if (!(await copyText(btn.dataset.copy))) return; // the e-mail link still works
            btn.classList.add('is-copied');
            renderCopy();
            clearTimeout(copyTimers.get(btn));
            copyTimers.set(btn, setTimeout(() => {
                btn.classList.remove('is-copied');
                renderCopy();
            }, 2000));
        });
    });

    /* ---------- Age and year: worked out from today, so they never go stale ---------- */
    const BIRTH = { year: 2009, month: 6, day: 28 };

    function currentAge(today = new Date()) {
        let age = today.getFullYear() - BIRTH.year;
        const beforeBirthday = today.getMonth() + 1 < BIRTH.month
            || (today.getMonth() + 1 === BIRTH.month && today.getDate() < BIRTH.day);
        if (beforeBirthday) age -= 1;
        return age;
    }

    document.querySelectorAll('[data-age]').forEach((el) => { el.textContent = currentAge(); });
    document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

    /* ---------- Tab title when the visitor leaves ---------- */
    document.addEventListener('visibilitychange', () => {
        document.title = document.hidden ? t('away') : pageTitle();
    });

    /* ---------- App: terminal ---------- */
    const term = document.getElementById('term');
    const termOut = document.getElementById('term-out');
    const termForm = document.getElementById('term-form');
    const termInput = document.getElementById('term-input');

    const egg = (name, ...args) => (window.OKeggs && window.OKeggs[name] ? window.OKeggs[name](...args) : false);

    function print(text, cls) {
        const p = document.createElement('p');
        if (cls) p.className = cls;
        p.textContent = text;
        termOut.appendChild(p);
        termOut.scrollTop = termOut.scrollHeight;
        return p;
    }

    function printLink(label, href) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = href;
        a.textContent = label;
        if (/^https?:/.test(href)) { a.target = '_blank'; a.rel = 'noopener'; }
        p.appendChild(a);
        termOut.appendChild(p);
        termOut.scrollTop = termOut.scrollHeight;
    }

    const L = (en, cs) => (lang() === 'cs' ? cs : en);

    const COMMANDS = {
        help() {
            print(L('Commands:', 'Příkazy:'), 't-muted');
            [
                ['about', L('who I am', 'kdo jsem')],
                ['kontakt', L('how to reach me', 'jak mě zastihnout')],
                ['store', L('open store.opikula.dev', 'otevřít store.opikula.dev')],
                ['github', L('open my GitHub', 'otevřít můj GitHub')],
                ['datum', L('today\'s date', 'dnešní datum')],
                ['clear', L('clear the screen', 'vyčistit obrazovku')]
            ].forEach(([cmd, desc]) => print(`  ${cmd.padEnd(9)}${desc}`));
        },
        about() {
            print(L(`Samuel Pelc, ${currentAge()}, IT student from Varnsdorf. Into C#, games and anime.`,
                `Samuel Pelc, ${currentAge()}, student IT z Varnsdorfu. Baví ho C#, hry a anime.`));
            const target = document.getElementById('o-mne');
            if (target) target.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth' });
        },
        kontakt() {
            printLink('pelcsamuel464@gmail.com', 'mailto:pelcsamuel464@gmail.com');
            printLink('github.com/OpiKula2877', 'https://github.com/OpiKula2877');
            printLink('youtube.com/@OpiKula', 'https://www.youtube.com/@OpiKula');
        },
        store() {
            print(L('Opening the store in a new tab...', 'Otevírám store v nové kartě...'), 't-ok');
            window.open('https://store.opikula.dev/', '_blank', 'noopener');
        },
        github() {
            print(L('Opening GitHub in a new tab...', 'Otevírám GitHub v nové kartě...'), 't-ok');
            window.open('https://github.com/OpiKula2877', '_blank', 'noopener');
        },
        datum() {
            print(new Date().toLocaleString(lang() === 'cs' ? 'cs-CZ' : 'en-GB', { dateStyle: 'full', timeStyle: 'short' }));
        },
        clear() { termOut.textContent = ''; },
        whoami() { print(L('guest. but a curious one.', 'host. ale zvědavý.')); },
        ls() { print('about.txt  kontakt.txt  .tajne/', 't-muted'); },
        cd(arg) {
            if (/tajne/.test(arg)) print(L('Permission denied. Nice try though.', 'Přístup odepřen. Ale dobrý pokus.'), 't-err');
            else print(L(`cd: ${arg || '~'}: there is nowhere to go`, `cd: ${arg || '~'}: není kam jít`), 't-muted');
        },
        cat(arg) {
            if (/about/.test(arg)) COMMANDS.about();
            else if (/kontakt/.test(arg)) COMMANDS.kontakt();
            else if (/tajne/.test(arg)) print(L('cat: .tajne: it is a directory. and it is locked.', 'cat: .tajne: je to složka. a je zamčená.'), 't-err');
            else print(L('meow.', 'mňau.'));
        },
        echo(arg) { print(arg); },
        ok() { print('OK.', 't-ok'); },
        exit() {
            print(L('There is no exit.', 'Odsud se neodchází.'), 't-hot');
            setTimeout(() => print(L('...just kidding. Close the tab like a normal person.', '...dělám si srandu. Zavřete kartu jako normální člověk.'), 't-muted'), 1200);
        },
        sudo(arg) {
            if (/rm\s+-rf/.test(arg)) {
                if (!egg('meltdown')) print(L('Nice try.', 'Pěkný pokus.'), 't-err');
            } else {
                print(L('samuel is not in the sudoers file. This incident will be reported.', 'samuel není v souboru sudoers. Tento incident bude nahlášen.'), 't-err');
            }
        },
        vlak() { print(L('Do you hear that?', 'Slyšíte to?'), 't-hot'); egg('train'); },
        poker() { print(L('Shuffling...', 'Míchám...'), 't-ok'); egg('poker'); },
        minecraft() { print(L('Loading chunks...', 'Načítám chunky...'), 't-ok'); egg('minecraft'); },
        znk() { egg('znk'); print('o/', 't-hot'); },
        matrix() { egg('matrix'); print(L('Wake up, Samuel...', 'Probuď se, Samueli...'), 't-ok'); },
        hack() { egg('matrix'); print(L('ACCESS GRANTED (to absolutely nothing)', 'PŘÍSTUP POVOLEN (k ničemu)'), 't-ok'); }
    };

    // Aliases
    Object.assign(COMMANDS, {
        contact: COMMANDS.kontakt,
        date: COMMANDS.datum,
        cls: COMMANDS.clear,
        dir: COMMANDS.ls,
        train: COMMANDS.vlak,
        allin: COMMANDS.poker,
        'o-mne': COMMANDS.about
    });

    if (term && termForm && termInput) {
        const history = [];
        let historyIndex = 0;

        print(L('To list the commands, type "help".', 'Pro vypsání příkazů napište "help".'), 't-muted');

        term.addEventListener('click', () => {
            if (!window.getSelection().toString()) termInput.focus({ preventScroll: true });
        });

        termForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const raw = termInput.value.trim();
            termInput.value = '';
            if (!raw) return;
            history.push(raw);
            historyIndex = history.length;
            print(`$ ${raw}`, 't-muted');
            const [name, ...rest] = raw.split(/\s+/);
            const cmd = COMMANDS[name.toLowerCase()];
            if (cmd && Object.prototype.hasOwnProperty.call(COMMANDS, name.toLowerCase())) cmd(rest.join(' '));
            else print(L(`${name}: command not found`, `${name}: příkaz nenalezen`), 't-err');
        });

        termInput.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowUp' && historyIndex > 0) {
                historyIndex -= 1;
                termInput.value = history[historyIndex];
                event.preventDefault();
            } else if (event.key === 'ArrowDown') {
                historyIndex = Math.min(history.length, historyIndex + 1);
                termInput.value = history[historyIndex] || '';
                event.preventDefault();
            }
        });
    }

    /* ---------- App: latest GitHub pushes ---------- */
    const feed = document.getElementById('feed');
    let repos = null;

    function timeAgo(date) {
        const rtf = new Intl.RelativeTimeFormat(lang() === 'cs' ? 'cs' : 'en', { numeric: 'auto' });
        const sec = (date - Date.now()) / 1000;
        const steps = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]];
        for (const [unit, size] of steps) {
            if (Math.abs(sec) >= size) return rtf.format(Math.round(sec / size), unit);
        }
        return rtf.format(Math.round(sec), 'second');
    }

    function renderFeed() {
        if (!feed) return;
        feed.textContent = '';
        feed.setAttribute('aria-busy', 'false');
        if (!repos || !repos.length) {
            const li = document.createElement('li');
            li.className = 'small';
            li.textContent = t('feedEmpty');
            feed.appendChild(li);
            return;
        }
        repos.forEach((repo) => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = repo.url;
            a.target = '_blank';
            a.rel = 'noopener';
            a.textContent = repo.name;
            const desc = document.createElement('span');
            desc.className = 'small';
            desc.textContent = repo.desc || t('noDesc');
            const meta = document.createElement('span');
            meta.className = 'meta';
            if (repo.lang) {
                const l = document.createElement('span');
                const dot = document.createElement('span');
                dot.className = 'dot';
                dot.setAttribute('aria-hidden', 'true');
                l.append(dot, repo.lang);
                meta.appendChild(l);
            }
            const when = document.createElement('span');
            when.textContent = timeAgo(new Date(repo.pushed));
            meta.appendChild(when);
            li.append(a, desc, meta);
            feed.appendChild(li);
        });
    }

    async function loadFeed() {
        if (!feed) return;
        const cached = store.get('gh-feed', sessionStorage);
        if (cached) {
            try {
                const data = JSON.parse(cached);
                if (Date.now() - data.at < 10 * 60 * 1000) { repos = data.repos; renderFeed(); return; }
            } catch (e) { /* refetch */ }
        }
        try {
            const res = await fetch('https://api.github.com/users/OpiKula2877/repos?sort=pushed&per_page=12', { headers: { Accept: 'application/vnd.github+json' } });
            if (!res.ok) throw new Error(res.status);
            const list = await res.json();
            repos = list.filter((r) => !r.fork).slice(0, 4).map((r) => ({
                name: r.name, url: r.html_url, desc: r.description, lang: r.language, pushed: r.pushed_at
            }));
            store.set('gh-feed', JSON.stringify({ at: Date.now(), repos }), sessionStorage);
        } catch (e) {
            repos = null;
        }
        renderFeed();
    }

    loadFeed();
    langListeners.push(() => { if (repos) renderFeed(); });

    /* ---------- Page leave fade ---------- */
    if (!reduceMotion.matches) {
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[href]');
            if (!link || event.defaultPrevented || event.button !== 0) return;
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            if ((link.target && link.target !== '_self') || link.hasAttribute('download')) return;

            const url = new URL(link.href, location.href);
            if (url.origin !== location.origin) return;
            if (url.pathname === location.pathname && url.search === location.search) return;

            event.preventDefault();
            root.classList.add('is-leaving');
            setTimeout(() => { location.href = link.href; }, 180);
        });

        window.addEventListener('pageshow', (event) => {
            if (event.persisted) root.classList.remove('is-leaving');
        });
    }

    // Shared bits the easter eggs use
    window.OKsite = { lang, reduceMotion, onLang: (fn) => langListeners.push(fn) };

    renderLang();
})();
