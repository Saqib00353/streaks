# Streaks 🔥

A habit-tracking web app with free and paid subscription tiers — track daily/weekly habits, build streaks, and unlock analytics with a premium plan.

**Live demo:** [coming soon]
**API docs:** [coming soon]

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)

---

## Overview

Most habit trackers stop at "did you do it today?" — they log a checkbox and move on, leaving you no closer to understanding your own patterns. Streaks is built to keep you motivated for the long run: clear streak tracking, visual progress you actually want to check, and a premium tier that unlocks the analytics serious habit-builders care about.

Free users get the essentials — track up to three habits and build daily streaks. Upgrade, and Streaks unlocks unlimited habits, completion-rate charts, email reminders, and data export — the kind of feature-gated pricing model you'd find in any real subscription product.

## Features

**Free tier**
- Up to 3 habits
- Daily check-ins
- Basic streak count

**Paid tier**
- Unlimited habits
- Daily / weekly / custom frequency
- Streak analytics & completion charts
- Email reminders
- CSV export

## Tech Stack

**Backend:** Django, Django REST Framework, PostgreSQL, Celery (reminders)
**Frontend:** React (Vite), Tailwind CSS, Recharts
**Auth:** JWT (djangorestframework-simplejwt)
**Payments:** Stripe (test mode)
**Infra:** Docker, Docker Compose
**Deployment:** [Railway/Render] (backend), [Vercel] (frontend)
**CI:** GitHub Actions

## Screenshots

<!-- Add GIF/screenshots once UI exists -->
<!-- ![Dashboard](docs/screenshots/dashboard.png) -->

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (if running frontend outside Docker)

### Setup

```bash
# Clone the repo
git clone https://github.com/Saqib00353/streaks.git
cd streaks

# Copy env template and fill in values
cp .env.example .env

# Start everything
docker-compose up --build
```

Backend: http://localhost:8000
Frontend: http://localhost:5173

## Environment Variables

See `.env.example` for the full list. Key variables:

| Variable | Description |
|---|---|
| `SECRET_KEY` | Django secret key |
| `DEBUG` | `True`/`False` |
| `DATABASE_URL` | Postgres connection string |
| `STRIPE_SECRET_KEY` | Stripe test-mode secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |

## Running Tests

```bash
docker-compose exec web pytest
```

## Project Structure

```
streaks/
├── backend/
│   ├── habits/          # Habit, HabitLog models & API
│   ├── users/           # Auth, Profile, subscription logic
│   └── config/          # Django settings
├── frontend/
│   └── src/
├── docker-compose.yml
└── README.md
```

## Roadmap

- [ ] Auth (register/login/logout)
- [ ] Habit CRUD
- [ ] Streak calculation logic
- [ ] Stripe subscription integration
- [ ] Analytics dashboard
- [ ] Email reminders
- [ ] CI pipeline
- [ ] Production deployment

---


Built by Muhammad Saqib as a portfolio project. [https://linkedin.com/in/dev-saqib] · [https://portfolio.com]
