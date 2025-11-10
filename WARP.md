# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands
- Install deps: npm install
- Start dev server: npm run dev
- Build (type-check + bundle): npm run build
- Preview production build: npm run preview
- Lint all files: npm run lint
- Lint a single file: npm run lint -- src/pages/HomePage.tsx
- Type-check only (no emit): npx tsc -b --pretty false
- Tests: no test runner is configured (no test script found).

## Architecture overview
- Toolchain: Vite (rolldown-vite 7.x) + React 19 + TypeScript + Tailwind CSS. React Compiler is enabled via babel-plugin-react-compiler (see vite.config.ts).
- Entry: index.html → src/main.tsx mounts <App/> inside <BrowserRouter/>.
- Routing: src/App.tsx defines top-level <Routes> mapping to page components under src/pages (Home, Calendar, Skills, Budget, Wellbeing, Focus, Career). Nav links are generated inline in App.
- Styling: Tailwind configured in tailwind.config.js with custom colors (primary/accent/highlight) and container padding. Global CSS tokens and base styles are in src/index.css (CSS variables + Tailwind layers).
- Linting: eslint.config.js uses @eslint/js, typescript-eslint, react-hooks, and react-refresh presets; dist is ignored. Lint runs with npm run lint.
- TypeScript: Project references (tsconfig.json → tsconfig.app.json, tsconfig.node.json). Strict settings enabled; build runs tsc -b before Vite.
- Assets: Import via Vite URL semantics (e.g., new URL('../assets/…', import.meta.url)) and colocated under src/assets/.
- Output: Static site. npm run build emits dist/. Use a static host with SPA fallback to index.html for client-side routes.

## How to extend
- Add a new page:
  1) Create src/pages/YourPage.tsx exporting a component.
  2) Import it in src/App.tsx and add a <Route path="/your" element={<YourPage/>}/> entry.
  3) Optionally add a <NavLink> to the header list in App.
- Adjust theme: Update color tokens in tailwind.config.js and matching CSS variables in src/index.css.

## Notes from README
- React Compiler is enabled; it can affect dev/build performance. The README also shows how to enable type-aware ESLint rules if desired.
