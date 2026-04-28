# VocalFlow SaaS Platform

Full-stack MVP with:
- Next.js 14 + TypeScript + Tailwind CSS frontend
- FastAPI backend with modular route/service structure
- SQLAlchemy + Alembic + PostgreSQL-ready schema
- Auth + billing + referrals + teams + API keys + public API
- Mock generation pipeline that can be replaced by XTTS/RunPod

## Project structure

```text
/frontend
/backend
```

## Quick start with Docker (recommended)

If you have `make` installed, you can use shortcuts:

```bash
make up
```

Other shortcuts:
- `make down`
- `make reset`
- `make prod`
- `make logs`
- `make ps`

Windows PowerShell shortcuts (no `make` required):

```powershell
.\scripts\dev.ps1
```

Other scripts:
- `.\scripts\down.ps1`
- `.\scripts\reset.ps1`
- `.\scripts\prod.ps1`
- `.\scripts\logs.ps1`
- `.\scripts\ps.ps1`
- `.\scripts\restart.ps1`
- `.\scripts\run.ps1 <up|down|reset|prod|logs|ps|restart>`

Example:
```powershell
.\scripts\run.ps1 up
```

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Services:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- Postgres: `localhost:5432`
- Redis: `localhost:6379`

Stop:
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml down
```

Full reset (containers + network + volumes):
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml down -v
```

Production-style run:
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

## 1) Frontend setup (Next.js 14)

```bash
cd frontend
copy .env.example .env.local
npm install
npm run dev:clean
```

Frontend runs on `http://localhost:3000`.

## 2) Backend setup (FastAPI)

```bash
cd backend
copy .env.example .env
py -m pip install -r requirements.txt
alembic upgrade head
py -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Backend runs on `http://localhost:8000`.

## Available frontend pages

- `/` landing page
- `/login` login (real JWT auth)
- `/register` registration (creates personal workspace)
- `/pricing` pricing page
- `/dashboard` dashboard overview
- `/dashboard/generate` text-to-speech generator
- `/dashboard/history` audio history
- `/dashboard/billing` billing + invoices
- `/dashboard/referrals` affiliate dashboard
- `/dashboard/team` team workspaces
- `/dashboard/api-keys` API key management

## API endpoints

- `POST /generate` create generation job (max 1000 characters)
- `GET /jobs/{job_id}` get job status + audio URL
- `GET /history` list generated items + total usage
- `POST /auth/register` / `POST /auth/login`
- `GET /billing/summary` / `POST /billing/checkout`
- `GET /referrals/summary`
- `GET /workspaces/current` / `POST /memberships/invite`
- `GET /api-keys` / `POST /api-keys` / `POST /api-keys/{id}/revoke`
- Public API: `POST /v1/generate`, `GET /v1/jobs/{id}`, `GET /v1/history` (with `x-api-key`)
- `GET /health` service health check

## Mock generation flow

1. Frontend sends text + voice + speed to `POST /generate`
2. Backend creates DB job row in queued state (workspace-scoped)
3. Background worker simulates processing
4. Audio URL is attached to completed job, usage is recorded
5. Frontend polls `GET /jobs/{job_id}` and shows audio player
6. History page fetches generated entries from `GET /history`

## Where to connect real XTTS / RunPod

See `backend/app/services/tts_service.py`:
- Replace the mock sleep + fake URL block
- Call your GPU endpoint
- Save real audio storage URL into `audio_url`

## Notes

- Payments are intentionally not implemented yet.
- Stripe routes are scaffolded and ready for secure webhook implementation.
- Queue is thread-based for local MVP; replace with Redis/Celery for production.
