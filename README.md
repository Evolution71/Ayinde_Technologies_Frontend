# Ayinde Technologies — Frontend

React (Create React App) frontend, now with login, gated Projects/Courses
sections, and a captcha-protected contact form.

## Structure
frontend/src/
├── App.jsx                    <- page layout (Nav, Hero, Services, Team, Contact, Footer)
├── api.js                      <- all backend calls in one place
├── context/AuthContext.jsx      <- login state, shared across the app
└── components/
    ├── AuthForms.jsx      <- login / register form
    ├── Captcha.jsx         <- reusable captcha widget
    ├── Projects.jsx         <- case studies — requires login
    └── Courses.jsx            <- course catalog + enroll — requires login
```

## Run locally

```bash
npm install
cp .env.example .env
npm start
```

Opens at `http://localhost:3000`. Make sure the backend is running first
(see `backend/README.md`) — Projects and Courses will show a login form
instead of content until you log in, because the backend requires it.

## Build for production

```bash
npm run build
```
Outputs a static `build/` folder deployable anywhere that serves static
files (Netlify, Vercel, Railway, S3 + CloudFront, etc.).

## Connecting to the backend

All API calls go through `src/api.js`, which reads
`process.env.REACT_APP_API_URL`. Set that in `.env` (see `.env.example`) to
point at your deployed backend before building for production.

## Login, Projects, and Courses

- The nav bar shows "Log in" when logged out, or "Hi, [name] · Log out"
  once logged in.
- The Projects and Courses sections show a login/register form in place of
  content until the visitor logs in — that's the backend's `401`
  response driving the UI, not just a frontend-side hide.
- Courses show an "Enroll" button; enrolled courses show an "Enrolled ✓"
  badge that persists across page reloads (backend-tracked, not just local
  state).
- The auth token is stored in `localStorage`. That's standard for a simple
  setup like this, though a more security-conscious option later would be
  an httpOnly cookie issued by the backend instead — happy to wire that in
  if you want the extra hardening.

## Deploying

**Netlify / Vercel:** connect this folder as the project root, build
command `npm run build`, publish directory `build`. Add
`REACT_APP_API_URL` as an environment variable set to your live backend
URL, and add that same frontend URL to the backend's `ALLOWED_ORIGINS`.

## Pushing this as its own repo

```bash
cd frontend
git init
git add .
git commit -m "Initial commit — Ayinde Technologies frontend"
git remote add origin <your-frontend-repo-url>
git push -u origin main
```
