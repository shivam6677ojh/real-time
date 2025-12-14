# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Mini Project: Real-Time Survey (Concept Demo)

This app demonstrates a conceptual model for monitoring water bodies in Delhi using simulated data, a map, charts, and a quick survey log. It’s frontend-only, fast to run, and suitable for a 1-hour presentation.

### Features
- Map of major water bodies with status colors (Safe/Moderate/Polluted)
- Simulated readings for pH, turbidity, and water level (auto-updating)
- Line charts for pH and turbidity trends
- Simple survey form to log observations

### Run Locally

```bash
npm install
npm run dev
```

Open the URL shown by Vite (usually http://localhost:5173).

### Backend (Optional)

Run a minimal Express backend that serves simulated data and an SSE stream:

```bash
cd server
npm install
npm run dev
```

Endpoints:
- `GET http://localhost:4000/api/bodies` — list of water bodies
- `GET http://localhost:4000/api/readings` — latest simulated readings with status
- `GET http://localhost:4000/api/stream` — Server-Sent Events stream (updates ~4s)

You can wire the frontend to consume these endpoints instead of local simulation if desired.

### Auth + Database (New)
- Backend now supports MongoDB (Mongoose) with JWT auth and submissions storage.
- Environment variables:

```bash
# in survey-backend/.env (create this file)
MONGODB_URI=mongodb://127.0.0.1:27017/survey_demo
JWT_SECRET=your_strong_secret
ORIGIN=http://localhost:5173
```

### Frontend Pages
- Dashboard: map + stats + charts (simulated)
- Map: focused map view
- Survey: submit observations (requires login)
- Admin: view submissions (admin sees all; users see their own)
- Login / Signup: JWT-based auth

To point the frontend at a remote backend, set:
```bash
# Real-time-survey/.env
VITE_API_URL=https://your-backend.example.com
```

### Tech
- React + Vite
- Leaflet for maps
- Chart.js via react-chartjs-2 for charts

### Notes
- Data is simulated; no backend or sensors
- Status colors: Green = Safe, Yellow = Moderate, Red = Polluted
