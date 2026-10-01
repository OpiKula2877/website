# <a href="https://OpiKula.dev"> My Website </a>

This is my personal website: who I am, what I'm learning and the projects I've made.
It is written in plain HTML, CSS and JavaScript (no frameworks) and is built with AI support.

## How I Built It

- I used Gemini to generate questions that helped form a prompt.
- I then used Claude AI to create the initial website structure.
- I refined the first version with GitHub Copilot.
- The current design (v2) was redesigned together with Claude Code.

## Design

- **One typeface:** Bricolage Grotesque, hosted in `assets/fonts/` (no request to a third party).
- **One accent colour:** electric blue `#2F3DF5` on a cool light background or deep navy.
- **Shapes from the logo:** pill-shaped buttons and navigation, a large rounded panel, and a ring (the O of the logo) as the separator in the band.
- **Two themes:** light and dark. The site follows the system setting until you pick one with the toggle. The choice is saved in `localStorage`.
- **Two languages:** English and Czech. The language is picked from the browser on the first visit and can be switched in the header. Every text exists in both languages in the HTML (`lang="en"` / `lang="cs"`), so there is no flash and no translation script.

## Motion

- Pages change with the View Transitions API: the content fades up, and the dark pill in the navigation slides to the new page. Browsers without support get a simple fade instead.
- The theme toggle opens the new theme as a circle growing from the button.
- The headline words slide up once on load.
- The band of technologies scrolls slowly and pauses on hover.
- Everything respects `prefers-reduced-motion`.

## Files

| File | What it is |
| --- | --- |
| `index.html` | Home: headline, band, selected projects, contact panel |
| `about.html` | About me and what I'm learning |
| `projects.html` | All projects as a list |
| `contact.html` | Contact links (email has a copy button) |
| `styles.css` | All styles and the colour tokens for both themes |
| `script.js` | Theme and language switch, mobile menu, copy button, logo easter egg |
| `assets/` | Logo in three sizes, social preview image (`og.png`), fonts |
| `projects/` | The individual projects (unchanged) |
| `sitemap.xml`, `robots.txt` | SEO |

## Navigation Bar

- The logo links to the home page. It spins when hovered.
- On the home page, click the big logo three times for a surprise.
- The links, the language switch and the theme toggle sit in the header, which stays at the top when scrolling.
- On narrow screens the links collapse into a menu.

## Accessibility and SEO

- Semantic structure (`header`, `nav`, `main`, `footer`, one `h1` per page) and a skip link.
- Visible focus rings, keyboard navigation, `aria-current` on the active page, `aria-pressed` on the language buttons.
- Colour contrast of at least 4.5:1 in both themes.
- Meta description, Open Graph and X (Twitter) cards, canonical links, `sitemap.xml`, `robots.txt` and JSON-LD structured data (`Person`) on the home page.
- Fonts are preloaded and use `font-display: swap`; images have fixed sizes; there are no external stylesheets or icon fonts.
