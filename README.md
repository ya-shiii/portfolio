# Portfolio

This is my personal portfolio built with **Nuxt 4**, **Tailwind CSS**, **Three.js**, and **GSAP**.

The goal isn't just to showcase projects, but to build something interactive without relying on a backend. Everything is statically generated and deployed through GitHub Pages, while keeping the project structured similarly to how I'd organize a production application.

---

## Tech Stack

- Nuxt 4
- Vue 3
- Tailwind CSS
- GSAP
- Three.js

---

## Project Structure

Most of the website content comes from local JSON files.

Instead of hardcoding text into components, sections such as the hero, experience, projects, and contact information are loaded from structured data. This made it easier to update content without touching the UI.

```
app/
├── components/
├── content/
│   ├── portfolio.json
│   └── projects/
├── pages/
└── assets/
```

Some notable files:

- `app/content/portfolio.json` – Personal information and site content.
- `app/content/projects/` – Individual project data.
- `components/global/GlobalNetwork.vue` – Interactive Three.js background.
- `components/navigation/SystemMap.vue` – Navigation overlay.

---

## Animations

The site uses GSAP for page transitions and UI animations.

The animated background is built with Three.js and includes:

- Particle network
- Mouse interaction
- Magnetic cursor effect
- Click ripple effect
- Smooth camera movement

Most of these effects are purely visual and don't affect navigation or page performance.

---

## Running Locally

Install dependencies

```bash
npm install
```

Start the development server

```bash
npm run dev
```

Generate the static site

```bash
npm run generate
```

---

## Deployment

The project is configured for GitHub Pages using Nuxt's static generation.

Pushing to the `main` branch automatically triggers the GitHub Actions workflow, builds the project, and deploys the generated files.

No server or database is required.

---

## Notes

This repository contains only the portfolio website itself.

Some featured projects reference production systems that aren't publicly available due to client confidentiality. Where possible, architecture, screenshots, or case studies are included instead of source code.