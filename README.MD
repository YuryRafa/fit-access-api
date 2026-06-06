# 🔐 Fit Access API

> A RESTful API for gym access management — member authentication, daily check-ins, and gym tracking.

---

## ⚠️ Status: Work in Progress

This project is currently under active development. Some features are incomplete or not yet implemented.

---

## 📖 Description

**Fit Access API** is a backend service built with **Node.js** and **TypeScript**, designed to manage gym access operations. It handles member registration, authentication, gym registration, and daily check-in tracking — with a clean modular architecture separating concerns across controllers, services, and repositories.

The API uses **Prisma ORM** backed by a relational database (via Docker), enforces a one-check-in-per-day rule per user, includes geo-distance utilities for proximity-based gym validation, and is built with testability in mind through in-memory repository implementations.

---

## 🗂️ Project Structure

```
fit-access-api/
├── prisma/
│   ├── migrations/          # Database migration history
│   └── schema.prisma        # Prisma schema definition
├── src/
│   ├── @types/              # Shared TypeScript interfaces
│   │   ├── auth-interfaces.ts
│   │   ├── check-ins-interfaces.ts
│   │   └── gyms-interfaces.ts
│   ├── env/
│   │   └── index.ts         # Environment variable validation
│   ├── generated/           # Auto-generated Prisma client
│   ├── lib/
│   │   └── prisma.ts        # Prisma client singleton
│   ├── modules/
│   │   ├── auth/            # Member registration & authentication
│   │   │   ├── factories/
│   │   │   ├── auth-controller.ts
│   │   │   ├── auth-repository.ts
│   │   │   ├── auth-service.ts
│   │   │   ├── auth.test.ts
│   │   │   └── in-memory-auth-repository.ts
│   │   ├── check-ins/       # Daily check-in logic
│   │   │   ├── check-in-controller.ts
│   │   │   ├── check-in-repository.ts
│   │   │   ├── check-in-service.ts
│   │   │   ├── check-in.test.ts
│   │   │   └── in-memory-check-in-repository.ts
│   │   └── gyms/            # Gym registration & management
│   │       ├── gyms-controller.ts
│   │       ├── gyms-repository.ts
│   │       ├── gyms-service.ts
│   │       ├── gyms.test.ts
│   │       └── in-memory-gyms-repository.ts
│   ├── routes/              # Route definitions
│   ├── services/            # Shared services
│   ├── utils/
│   │   ├── app-error.ts     # Custom error handling
│   │   ├── auth-helper.ts   # Auth utilities
│   │   └── get-distance-between-coordinates.ts  # Geo-distance logic
│   ├── app.ts               # App setup
│   └── server.ts            # Entry point
├── .env.example
├── docker-compose.yml       # Database container
├── prisma.config.ts
├── vite.config.ts
└── tsconfig.json
```

---

## ✨ Features

- **Member Authentication** — Register and look up users by email or ID
- **Daily Check-ins** — One check-in per user per day, enforced at the service layer
- **Paginated Check-in History** — Retrieve a user's full check-in history (20 per page)
- **Gym Management** — Register and manage gym locations
- **Geo-distance Validation** — Utility to calculate distance between coordinates for proximity checks
- **Custom Error Handling** — Centralized `AppError` class for consistent API error responses
- **In-Memory Repositories** — Fast, isolated unit testing without a real database
- **Modular Architecture** — Each domain is self-contained with its own controller, service, repository, and tests
- **Docker Support** — Database spun up via `docker-compose.yml`

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| ORM | Prisma |
| Database | PostgreSQL (Docker) |
| Date handling | Day.js |
| Testing | Vitest |
| Linting | ESLint |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose

### Installation

```bash
git clone https://github.com/your-username/fit-access-api.git
cd fit-access-api
npm install
```

### Environment Setup

```bash
cp .env.example .env
```

Then fill in the values in `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/fitaccess"
```

### Start the Database

```bash
docker-compose up -d
```

### Database Setup

```bash
npx prisma migrate dev
npx prisma generate
```

### Running the Server

```bash
npm run dev
```

---

## 🧪 Testing

Each module has unit tests backed by in-memory repositories for fast, isolated testing.

```bash
npm run test
```


---
