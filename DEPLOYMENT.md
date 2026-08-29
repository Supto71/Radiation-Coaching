# Radiation Coaching — Deployment & Safety Guide

## Architecture

| Layer | Tool | Purpose |
|-------|------|---------|
| Code | GitHub (main branch) | Source of truth for all code |
| Backend | Render | Runs FastAPI Python server |
| Database | Supabase (PostgreSQL) | Stores all student/fee/exam data |
| Frontend | Render | Serves the React app |

---

## Code Safety Rules

### SAFE to commit to GitHub:
- All .jsx, .py, .js, .css source files
- requirements.txt, package.json
- Public assets (images in frontend/public/)
- .gitignore, README.md, DEPLOYMENT.md

### NEVER commit:
- .env files (contains DB passwords)
- fix_*.py / fix_*.js (temporary scripts)
- *.db / *.sqlite3 (local database files)

---

## Database Safety

- New columns are automatically added on startup via backend/app/main.py
- Existing data is NEVER deleted when new code is deployed
- Database lives on Supabase — completely separate from Render

### How to add a new DB column safely:
Add inside the try/except block in main.py:

    try:
        conn.execute(text("ALTER TABLE tablename ADD COLUMN col_name TYPE DEFAULT value;"))
    except Exception:
        pass  # Already exists — safe to ignore

### Supabase Manual Backup:
Supabase Dashboard -> Settings -> Database -> Backups -> Download

---

## Deployment Workflow

1. Make code changes locally
2. git add -A
3. git commit -m "feat/fix: description"
4. git push origin main
5. Render auto-detects push and builds
6. Server restarts, main.py runs auto-migrations
7. Website is live with new changes

---

## Environment Variables (set in Render Dashboard — NEVER in code)

- DATABASE_URL : Supabase PostgreSQL connection string
- SECRET_KEY   : JWT token signing key

---

## Emergency Recovery

If something breaks after a deploy:
1. Go to GitHub, find last working commit
2. Run: git revert HEAD
3. Push to main — Render auto-deploys old version
4. Database data is ALWAYS safe, only code changes

---

## Checklist Before Every Major Update

[ ] New DB columns added to main.py auto-migration block
[ ] No .env or secrets in the commit
[ ] git status shows no unwanted files
[ ] Commit message is descriptive (feat:, fix:, chore:)
