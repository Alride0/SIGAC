# AGENTS.md

Two independent npm packages, **no workspace/root package.json** — run all npm commands inside the package folder.

- `Backend/` — Express 5 API, CommonJS. Entry: `server.js`. Code in `src/{routes,controllers,middlewares,services,config}`.
- `Frontend/` — React 19 + Vite, ESM. Deployed on Vercel (`vercel.json` = SPA rewrite to `index.html`).

## Commands

```powershell
# Backend
cd Backend && npm run dev      # nodemon server.js, port 3000 by default
# Frontend
cd Frontend && npm run dev     # Vite dev server on :5173
cd Frontend && npm run lint    # eslint . (only verification available)
```

No tests exist in either package (`npm test` fails intentionally).

## Environment (required to run the backend)

`Backend/.env` is gitignored and must exist before starting:
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `DB_SSL_CA_PATH` — required: DB connection **always uses SSL** and crashes at startup if the CA cert file is missing (`src/config/db.js`)
- `JWT_SECRET`, `EMAIL_USER`/`EMAIL_PASSWORD` (nodemailer)
- `CORS_ORIGIN` (defaults to `http://localhost:5173`)

Frontend reads `VITE_API_URL` from an env file (Vite convention: `Frontend/.env`) for its axios base URL.

## Gotchas

- Routers are mounted with **no path prefix** (`app.use(clientsRoute)`): each route file owns its full path (e.g. `/clients`, not `/api/clients`). Don't add an `/api` prefix when writing new routes, and make sure `VITE_API_URL` matches.
- Route order matters: `authRoute` must be mounted first in `server.js`.
- Protected routes use `verifyToken` (+ `requireAdmin`) middlewares from `src/middlewares/auth.middleware.js`.
- Frontend auth token lives in `localStorage['token']`; all API calls should go through the shared axios instance in `Frontend/src/services/api.js`.
- The root-level `src/` directory is a stray artifact (contains only an empty file) — real backend code lives in `Backend/src/`. Ignore `git-installer.exe` at the repo root.
