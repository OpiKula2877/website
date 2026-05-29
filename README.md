# <a href="https://OpiKula.dev"> My Website </a>


This is my personal website, built with AI support.

## How I Built It

- I used Gemini to generate questions that helped form a prompt.
- I then used Claude AI to create the initial website structure.
- Finally, I customized and refined the whole site with GitHub Copilot.

## Navigation Bar

The navigation bar is mostly the same across pages, with small differences on the Projects page.

It includes:
- `OK.png`: my interactive logo.
- When hovered, the logo rotates `360deg`.
- When clicked 3 or more times and released, it rotates `1080deg`.
- Navigation links to the main pages
- On smaller screen widths, the links collapse into a hamburger menu.

## `index.html`

A simple home page containing:
- An `h1` heading with the text "Home".
- A paragraph describing what visitors can find on the website.

## `about.html`

This page contains information about my personal and student life.

It has two types of content blocks:
- An expandable section that opens on click (basic information about me).
- Learning blocks that list topics and skills I am currently studying.

## `projects.html`

This page is where I store and present my projects.

It includes:
- An `h1` heading: "Projects".
- Project names displayed as hyperlinks.
- A centered layout built with Flexbox using:
  - `display: flex;`
  - `flex-direction: column;`
  - `align-items: center;`
  - `justify-content: center;`
  - `min-height: 60vh;`
  - `text-align: center;`

## `contact.html`

This page includes:
- The heading "Get in Touch".
- Links to my social and contact profiles: GitHub, email, phone number, Instagram, and YouTube.
