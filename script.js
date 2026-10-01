/* ==========================================================================
   opikula.dev: shared behaviour
   Theme and language are first applied by a tiny inline script in <head>
   (so there is no flash). This file adds the controls on top of that.
   ========================================================================== */
(() => {
    'use strict';

    const root = document.documentElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Strings that are built by script (everything else is bilingual markup)
    const T = {
        en: {
            toDark: 'Switch to dark mode',
            toLight: 'Switch to light mode',
            openMenu: 'Open navigation menu',
            closeMenu: 'Close navigation menu',
            copy: 'Copy',
            copied: 'Copied',
            copyLabel: 'Copy email address'
        },
        cs: {
            toDark: 'Přepnout na tmavý režim',
            toLight: 'Přepnout na světlý režim',
            openMenu: 'Otevřít navigační menu',
            closeMenu: 'Zavřít navigační menu',
            copy: 'Kopírovat',
            copied: 'Zkopírováno',
            copyLabel: 'Kopírovat e-mailovou adresu'
        }
    };

    const store = {
        get(key) {
            try { return localStorage.getItem(key); } catch (e) { return null; }
        },
        set(key, value) {
            try { localStorage.setItem(key, value); } catch (e) { /* storage can be blocked */ }
        }
    };

    const lang = () => (root.lang === 'cs' ? 'cs' : 'en');
    const theme = () => (root.dataset.theme === 'dark' ? 'dark' : 'light');

    // Remember the English page title / description so we can switch back to them
    const descMeta = document.querySelector('meta[name="description"]');
    root.dataset.titleEn = document.title;
    if (descMeta) descMeta.dataset.en = descMeta.content;

    /* ---------- View transitions helper (same-document) ---------- */
    let transitionId = 0;

    function transition(kind, update, onReady) {
        if (!document.startViewTransition || reduceMotion.matches) {
            update();
            return;
        }
        const id = ++transitionId;
        root.dataset.vt = kind;
        const vt = document.startViewTransition(update);
        // A newer transition can skip this one; only the latest one cleans up
        const done = () => { if (id === transitionId) delete root.dataset.vt; };
        // Every promise of a skipped transition rejects, so each one needs a handler
        vt.ready.then(onReady, () => {});
        vt.updateCallbackDone.catch(() => {});
        vt.finished.then(done, done);
    }

    /* ---------- Theme ---------- */
    const themeButtons = document.querySelectorAll('.theme-toggle');

    function renderTheme() {
        const label = theme() === 'dark' ? T[lang()].toLight : T[lang()].toDark;
        themeButtons.forEach((btn) => btn.setAttribute('aria-label', label));
        const color = theme() === 'dark' ? '#0A0D26' : '#F2F3F8';
        document.querySelectorAll('meta[name="theme-color"]').forEach((m) => { m.content = color; });
    }

    function setTheme(next, origin) {
        const apply = () => {
            root.dataset.theme = next;
            store.set('theme', next);
            renderTheme();
        };
        const x = origin ? origin.x : window.innerWidth / 2;
        const y = origin ? origin.y : 0;
        const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

        transition('theme', apply, () => {
            root.animate(
                { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
                { duration: 650, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)', pseudoElement: '::view-transition-new(root)' }
            );
        });
    }

    themeButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const rect = btn.getBoundingClientRect();
            setTheme(theme() === 'dark' ? 'light' : 'dark', {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            });
        });
    });

    // Follow the system setting until the visitor makes a choice
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
        if (store.get('theme')) return;
        root.dataset.theme = event.matches ? 'dark' : 'light';
        renderTheme();
    });

    /* ---------- Language ---------- */
    const langButtons = document.querySelectorAll('.lang button');

    function renderLang() {
        const l = lang();
        langButtons.forEach((btn) => btn.setAttribute('aria-pressed', String(btn.dataset.lang === l)));
        document.title = l === 'cs' && root.dataset.titleCs ? root.dataset.titleCs : root.dataset.titleEn;
        if (descMeta) descMeta.content = l === 'cs' && descMeta.dataset.cs ? descMeta.dataset.cs : descMeta.dataset.en;
        renderTheme();
        renderMenuLabel();
        renderCopy();
    }

    function setLang(next) {
        if (next === lang()) return;
        transition('lang', () => {
            root.lang = next;
            store.set('lang', next);
            renderLang();
        });
    }

    langButtons.forEach((btn) => btn.addEventListener('click', () => setLang(btn.dataset.lang)));

    /* ---------- Mobile menu ---------- */
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.getElementById('site-nav');

    function renderMenuLabel() {
        if (!menuToggle) return;
        const open = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-label', open ? T[lang()].closeMenu : T[lang()].openMenu);
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

        window.matchMedia('(min-width: 861px)').addEventListener('change', (event) => {
            if (event.matches) setMenu(false);
        });
    }

    /* ---------- Headline: slide the words up once on load ---------- */
    function splitWords(el) {
        const text = el.textContent.trim();
        if (!text) return;
        el.textContent = '';
        text.split(/\s+/).forEach((word, i, words) => {
            const outer = document.createElement('span');
            outer.className = 'w';
            const inner = document.createElement('span');
            inner.style.setProperty('--i', i);
            inner.textContent = word;
            outer.appendChild(inner);
            el.appendChild(outer);
            if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
        });
        el.classList.add('is-split');
    }

    if (!reduceMotion.matches) {
        document.querySelectorAll('[data-split] > [lang]').forEach(splitWords);
        // The slide-up is for the first load only, not for every language switch
        document.querySelectorAll('[data-split]').forEach((heading) => {
            setTimeout(() => heading.classList.add('split-done'), 2400);
        });
    }

    /* ---------- Copy e-mail address ---------- */
    const copyButtons = document.querySelectorAll('.copy');
    const copyTimers = new WeakMap();

    function renderCopy() {
        copyButtons.forEach((btn) => {
            const copied = btn.classList.contains('is-copied');
            btn.textContent = copied ? T[lang()].copied : T[lang()].copy;
            btn.setAttribute('aria-label', copied ? T[lang()].copied : T[lang()].copyLabel);
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

    /* ---------- Age: worked out from the birth date, so it never goes stale ---------- */
    const BIRTH = { year: 2009, month: 6, day: 28 };

    function currentAge(today = new Date()) {
        let age = today.getFullYear() - BIRTH.year;
        const beforeBirthday = today.getMonth() + 1 < BIRTH.month
            || (today.getMonth() + 1 === BIRTH.month && today.getDate() < BIRTH.day);
        if (beforeBirthday) age -= 1;
        return age;
    }

    document.querySelectorAll('[data-age]').forEach((el) => { el.textContent = currentAge(); });

    /* ---------- Logo easter egg: click it three times ---------- */
    const logo = document.getElementById('brand-logo');

    if (logo) {
        let clicks = 0;
        let resetTimer;
        logo.addEventListener('click', () => {
            clicks += 1;
            clearTimeout(resetTimer);
            resetTimer = setTimeout(() => { clicks = 0; }, 800);
            if (clicks >= 3) {
                clicks = 0;
                logo.classList.add('spin-fast');
                setTimeout(() => logo.classList.remove('spin-fast'), 2000);
            }
        });
    }

    console.log('%cHi there', 'color: #2F3DF5; font-size: 20px; font-weight: bold;');

    /* ---------- Page leave fade (browsers without view transitions) ---------- */
    if (!root.classList.contains('vt') && !reduceMotion.matches) {
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

    renderLang();
})();
