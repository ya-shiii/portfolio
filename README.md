# Systems in Motion Portfolio — Joshua Vicente

A production-ready, immersive, static-generated personal portfolio website for Joshua Vicente, built using **Nuxt 4**, **Three.js**, **GSAP**, and **Tailwind CSS**.

## Project Architecture

This application represents a custom digital system where components dynamically display values loaded from local static JSON files. It does not use external runtime servers, APIs, or databases, allowing seamless static deployment.

### Technologies
- **Core Framework**: Nuxt 4 (Future compatibility directory configuration enabled)
- **Styling**: Tailwind CSS & PostCSS
- **Animations**: GSAP
- **3D Network Backdrop**: Three.js WebGL canvas utilizing customized shader particles, spring-restoration physics, magnetic cursor fields, and pointer-click repulsion pulses.

---

## File System Overview
- [portfolio.json](file:///c:/Users/Gamer/OneDrive/Desktop/Rhenli%20Commissions/Portfolio/app/content/portfolio.json): Holds identity parameters, Hero statements, About profiles, Experience milestones, and Contact pointers.
- [projects/](file:///c:/Users/Gamer/OneDrive/Desktop/Rhenli%20Commissions/Portfolio/app/content/projects/): Separate JSON matrices containing complete metadata, decision sheets, and transactional data routes.
- [GlobalNetwork.vue](file:///c:/Users/Gamer/OneDrive/Desktop/Rhenli%20Commissions/Portfolio/app/components/global/GlobalNetwork.vue): Coordinates standard WebGL drift states and constellation transitions.
- [SystemMap.vue](file:///c:/Users/Gamer/OneDrive/Desktop/Rhenli%20Commissions/Portfolio/app/components/navigation/SystemMap.vue): Star map navigational overlay.

---

## Setup and Local Development

Follow these steps to run the project locally on your machine:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Verify Static Generation (Local HTML Compile)**:
   ```bash
   npm run generate
   ```

## GitHub Pages Deployment

The static output is configured using Nitro's `github-pages` preset, rendering static pathways under `/` or sub-folders dynamically.

A pre-configured CI/CD workflow is available under [.github/workflows/deploy.yml](file:///c:/Users/Gamer/OneDrive/Desktop/Rhenli%20Commissions/Portfolio/.github/workflows/deploy.yml). When you push code changes to the `main` branch, the static site compiles and deploys to GitHub Pages automatically.
