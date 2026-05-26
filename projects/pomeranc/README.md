# Orange Project Documentation

## 1. Introduction

- Project name: Orange Atlas
- Topic: A single-page educational website about oranges (flavor, cultivation, nutrition, and gallery content)
- Live website: <a href="https://opikula.dev/projects/pomeranc/">https://opikula.dev/projects/pomeranc/</a>

## 2. Technologies Used

- HTML5
- CSS3
- JavaScript (vanilla)
- Browser used for development/testing: Brave
- IDE: Visual Studio Code (user setup)

## 3. Directory Structure

```text
website/
├── projects/
    └── pomeranc/
        ├── 1pomeranc.png    <- Gallery/content image 1
        ├── 2pomeranc.png    <- Gallery/content image 2
        ├── 3pomeranc.png    <- Gallery/content image 3
        ├── 4pomeranc.png    <- Gallery/content image 4
        ├── 5pomeranc.png    <- Gallery/content image 5
        ├── 6pomeranc.png    <- Gallery/content image 6
        ├── 7pomeranc.png    <- Gallery/content image 7
        ├── index.html       <- Main page structure and semantic content
        ├── pomeranc.ico     <- Project favicon
        ├── README.md        <- This documentation file
        ├── robots.txt       <- Search engine crawl instructions
        ├── script.js        <- Interactive behavior (menu, accordion, tabs, reveal)
        ├── sitemap.xml      <- URL map for search engines
        ├── style.css        <- Project-specific styles and responsive layout
        └── pngs/
            ├── problem1.png <- Technical issue screenshot #1
            ├── problem2.png <- Technical issue screenshot #2
            ├── problem3.png <- Technical issue screenshot #3
            ├── problem4.png <- Technical issue screenshot #4
            ├── scr1.png     <- Desktop screenshot
            └── scr2.png     <- Mobile screenshot
```

## 4. Technical Analysis (6 Optimization Areas)

### 4.1 Header Layout and Responsive Brand Text

Theory:
The brand text should stay readable on large screens, but it should not break the header layout on small screens. The solution is to keep it on one line and hide it below a breakpoint.

Code snippet:
```css
.brand-text {
	display: inline-block;
	white-space: nowrap;
	overflow: hidden;
	max-width: 12rem;
}

@media (max-width: 48rem) {
	.brand-text,
	.hide-mobile {
		display: none;
	}
}
```

Explanation:
This prevents wrapping/overflow and removes the text on narrow viewports, so the logo, menu button, and navigation keep a clean layout.

### 4.2 Mobile Navigation Behavior and ARIA State Sync

Theory:
A mobile menu should be easy to open/close, keyboard friendly, and accessible for screen readers.

Code snippet:
```js
const closeMenu = () => {
	siteNav.classList.remove('is-open');
	menuToggle.setAttribute('aria-expanded', 'false');
	menuToggle.setAttribute('aria-label', 'Open menu');
};

const openMenu = () => {
	siteNav.classList.add('is-open');
	menuToggle.setAttribute('aria-expanded', 'true');
	menuToggle.setAttribute('aria-label', 'Close menu');
};
```

Explanation:
The menu state is mirrored both visually (`is-open`) and semantically (`aria-expanded`, `aria-label`), improving accessibility and UX consistency.

### 4.3 Accordion Stability and Spacing Fix

Theory:
Accordion panels must open/close without leaving large blank spaces. Closed panels should not affect layout.

Code snippet:
```css
.accordion-panel {
	display: none;
	padding: 0 1.15rem 1.1rem;
}

.accordion-trigger[aria-expanded="true"] + .accordion-panel {
	display: block;
}

.accordion-panel p {
	margin-block-end: 0;
}
```

Explanation:
Closed panels are fully removed from layout (`display: none`), and the paragraph bottom margin is normalized, removing the unwanted gap.

### 4.4 Gallery Centering and Tab Visibility Control

Theory:
Tabbed gallery content must stay horizontally centered and only show one panel at a time.

Code snippet:
```css
.gallery-shell > .gallery-controls,
.gallery-shell > .gallery-panels {
	grid-column: 1 / -1;
}

.gallery-panel[hidden] {
	display: none;
}
```

```js
galleryPanels.forEach((panel) => {
	const isTarget = panel.dataset.galleryPanel === target;
	panel.classList.toggle('is-active', isTarget);
	panel.hidden = !isTarget;
});
```

Explanation:
Grid spanning centers the gallery block across layout columns, while `hidden` keeps inactive panels out of view and out of layout.

### 4.5 Semantic HTML and Accessibility Mapping

Theory:
Interactive components should use semantic roles, labels, and control relationships for accessibility tools.

Code snippet:
```html
<button class="gallery-tab" type="button" role="tab" aria-selected="false"
	aria-controls="gallery-panel-orchard" id="gallery-tab-orchard"
	data-gallery-target="orchard">Orchard</button>

<figure class="gallery-panel" data-gallery-panel="orchard"
	id="gallery-panel-orchard" role="tabpanel"
	aria-labelledby="gallery-tab-orchard" hidden>
```

Explanation:
`role`, `aria-controls`, and `aria-labelledby` connect tabs to panels, making navigation understandable for assistive technologies.

### 4.6 Performance and SEO Readiness

Theory:
Performance and discoverability improve with lazy loading, reduced-motion support, and crawler metadata files.

Code snippet:
```html
<img src="6pomeranc.png" alt="A sunlit orange tree..." loading="lazy">
```

```css
@media (prefers-reduced-motion: reduce) {
	*, *::before, *::after {
		animation-duration: 0.01ms !important;
		transition-duration: 0.01ms !important;
	}
}
```

Explanation:
Images below the fold load on demand, animations are minimized for motion-sensitive users, and `robots.txt` + `sitemap.xml` support search indexing.

## 5. AI Log

### Prompt 1: Full page generation prompt
After answering the questions, Gemini generated this prompt for me.:
```markdown
Here is the prompt you can give Claude:
Create a complete single-page website in HTML, CSS, and JavaScript as three separate files named index.html, style.css, and script.js on the topic of Oranges.
The HTML must include the following sections in this order. First, a sticky header with a logo or site name on the left, a hamburger menu button for mobile using a button element with aria-expanded and aria-controls attributes, a centered back button with the class back-button positioned absolutely on mobile and statically on desktop, and a horizontal nav element with anchor links to each section. Second, a hero section with the id hero containing a two-column grid on desktop with text on the left and an image card on the right, an eyebrow paragraph, an h1, a lead paragraph, two CTA buttons with classes button button-primary and button button-secondary, and three stat items in a ul with the class hero-stats. Third, a features section with the id features containing a section heading with eyebrow and h2, and a three-column card grid where each card has an image with a 4/3 aspect ratio, an h3, and a paragraph. Fourth, a facts section with the id facts containing a two-column grid on desktop with the heading on the left and an accordion on the right, the accordion built from button elements with aria-expanded and aria-controls pointing to sibling div panels that use the hidden attribute. Fifth, a gallery section with the id gallery containing tab buttons with data-gallery-target attributes and corresponding figure panels with data-gallery-panel attributes that toggle visibility using the hidden attribute and an is-active class. Sixth, a contact section with the id contact containing a two-column grid on desktop with descriptive text on the left and a form on the right, the form having labeled inputs for name, email, and a textarea for message plus a submit button. Seventh, a footer with copyright text on the left and a list of social links on the right.
For the CSS, define all colors and spacing as custom properties on the root element. Use a white background with a subtle orange-tinted radial gradient. Make the header sticky with backdrop blur. Use smooth scroll on the html element. All section cards, the accordion container, the contact form, and gallery panels must have a white background, a light border, a large border radius, and a soft box shadow. Buttons must be pill-shaped with bold text and a hover transform and box shadow transition. Add a reveal animation class that starts with opacity zero and a translateY of 28 pixels and transitions to fully visible when the class is-visible is added. Support a prefers-reduced-motion media query that disables all transitions and animations. On mobile the nav must be hidden with max-height zero and expand with a transition when the is-open class is added. On desktop at 48rem the hamburger button hides, the nav becomes a flex row, and the grid layouts activate for hero, features, facts, gallery, and contact sections.
For the JavaScript, select all elements needed at the top. Implement the hamburger menu so clicking toggles the is-open class on the nav and updates aria-expanded and aria-label on the button. Close the menu when any nav link is clicked or when the Escape key is pressed. Implement the accordion so clicking any trigger closes all other triggers and panels first, then opens the clicked one unless it was already open, toggling aria-expanded and the hidden attribute on the panel. Implement the gallery tabs so clicking a tab updates is-active and aria-selected on all tabs and toggles is-active and hidden on all panels to show only the matching one. Implement a scroll reveal using IntersectionObserver with a threshold of 0.18 that adds is-visible to each element with the reveal class when it enters the viewport and then unobserves it.
Use semantic HTML5 elements throughout. Every image must have a descriptive alt attribute. Every interactive element must have appropriate aria attributes. Use loading lazy on all images below the fold. Do not use any external libraries or frameworks.
```

### Prompt 2: Header and alignment fixes
- Purpose: Fix header text placement and responsive behavior.
- AI contribution: Suggested breakpoint-based text hiding and layout-safe header rules.

### Prompt 3: Accordion spacing issue
- Purpose: Remove unexpected empty space when accordion panels are opened/closed.
- AI contribution: Identified panel display/margin conflict and proposed a stable CSS/JS solution.

### Prompt 4: Gallery centering and panel switching
- Purpose: Center gallery controls/content and keep tab switching functional.
- AI contribution: Added grid-column spanning and explicit `[hidden]` handling for reliable visibility toggling.

## 6. Installation and Local Run

If you want to clone the full repository, use:

```bash
git clone https://github.com/OpiKula2877/website
cd website
```

To run locally:

1. Open the project in Visual Studio Code.
2. Open `projects/pomeranc/index.html`.
3. Run with a local static server, for example:
	 - Live Server extension
	 - Live Preview extension

## 7. Gallery

### Desktop
![Desktop view](pngs/scr1.png)

### Mobile
![Mobile view](pngs/scr2.png)

### Key Feature/Debug Screens
![Problem 1](pngs/problem1.png)
![Problem 2](pngs/problem2.png)
![Problem 3](pngs/problem3.png)
![Problem 4](pngs/problem4.png)
