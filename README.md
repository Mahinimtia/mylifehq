# My Life HQ

Personal finance & life dashboard — Node.js / Express backend, single-page HTML frontend.

## Project structure

```
mylifehq/
├── server.js        ← Express API (all routes)
├── package.json
├── railway.json     ← Railway deployment config
└── public/
    └── index.html   ← Your frontend (served statically)
```

## Run locally

```bash
npm install
npm start
# → open http://localhost:3000
```

## Deploy to Railway (step-by-step)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   # create a repo on github.com, then:
   git remote add origin https://github.com/YOUR_USERNAME/mylifehq.git
   git push -u origin main
   ```

2. **Create Railway project**
   - Go to [railway.app](https://railway.app) → **New Project**
   - Choose **Deploy from GitHub repo**
   - Select your `mylifehq` repo

3. **Railway auto-detects Node.js** — no extra config needed.
   - It reads `railway.json` and runs `node server.js`
   - The `PORT` env variable is set automatically

4. **Get your live URL**
   - In Railway dashboard → your service → **Settings → Networking → Generate Domain**
   - Your app is live at `https://mylifehq-xxxx.up.railway.app` 🎉

## API routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | /summary | Dashboard KPIs |
| GET/POST/DELETE | /transactions | Money tracker |
| GET/POST/DELETE | /notes | Diary & notes |
| GET/POST/DELETE | /events | Calendar events |
| GET/POST/DELETE | /goals | Life planning |
| GET/POST/DELETE | /holdings | Investments |
| GET/POST/DELETE | /budgetcats | Budget categories |

> **Note:** Data is stored in memory. It resets on server restart.  
> For persistent storage, swap the `db` object for SQLite or a Railway Postgres addon.
