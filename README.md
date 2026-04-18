# tomo-otsuka.github.io

Static portfolio site for Tomo Otsuka, deployed on GitHub Pages.

## Tech Stack

- **HTML5** — Semantic markup, no framework
- **CSS3** — Custom properties (design tokens), glassmorphism, responsive layout
- **JavaScript (ES6+)** — Vanilla JS, no libraries or build tools

## How It Works

This is a pure static site with **no build step**. The three source files are served directly by GitHub Pages:

| File | Purpose |
|---|---|
| `index.html` | Page structure and content |
| `style.css` | All styling, animations, responsive breakpoints |
| `script.js` | Interactivity (particles, typing effect, scroll animations) |

## Deployment

1. Edit the 3 source files
2. Push to `main`
3. GitHub Pages automatically serves the files from the repository root

No configuration is needed — GitHub Pages detects the static files and serves them.

## Local Development

No setup required. Open `index.html` in a browser to preview changes.
