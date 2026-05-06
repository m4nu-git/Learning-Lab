# Attendance System

A REST API for managing employee and guest attendance through punch-in/punch-out events. Built with **Bun**, **Express**, **Prisma 7**, and **PostgreSQL**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Bun |
| Framework | Express 5 |
| ORM | Prisma 7 |
| Database | PostgreSQL (Docker) |
| Auth | JWT + bcrypt |
| Validation | Zod 4 |

---

## Setup

**1. Start the database:**
```bash
docker run -d \
  --name attendance-db \
  -e POSTGRES_USER=user_name \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=db_name \
  -p 5432:5432 \
  postgres:16
```

**2. Install dependencies:**
```bash
bun install
```

**3. Run migrations:**
```bash
bunx prisma migrate dev
```

**4. Start the server:**
```bash
bun run dev
```

Server runs at `http://localhost:3000`

---

## Environment Variables

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/attendance_db"
JWT_SECRET="your_super_secret_jwt_key_change_in_production"
PORT=3000
```

---

## API Routes

### Auth — `/api/auth`

| Method | Route | Auth | Body |
|---|---|---|---|
| POST | `/api/auth/register` | No | `{ name, email, password, role? }` |
| POST | `/api/auth/login` | No | `{ email, password }` |

> `role` values: `ADMIN` \| `OPERATOR` (default: `OPERATOR`)
> Login returns a JWT — pass it as `Authorization: Bearer <token>` on all protected routes.

### Employees — `/api/employees`

| Method | Route | Auth | Notes |
|---|---|---|---|
| GET | `/api/employees` | Any | List all |
| GET | `/api/employees/:id` | Any | Get one |
| POST | `/api/employees` | ADMIN | `{ name, employeeCode, email?, phone? }` |
| PATCH | `/api/employees/:id/status` | ADMIN | Toggles active/inactive |

### Guests — `/api/guests`

| Method | Route | Auth | Notes |
|---|---|---|---|
| POST | `/api/guests` | Any | `{ name, phone?, purpose? }` |
| GET | `/api/guests` | Any | `?page=1&limit=10` |
| GET | `/api/guests/:id` | Any | Get one |

### Attendance — `/api/attendance`

| Method | Route | Auth | Notes |
|---|---|---|---|
| POST | `/api/attendance/employees/:employeeId/punch-in` | Any | No body |
| POST | `/api/attendance/employees/:employeeId/punch-out` | Any | No body |
| GET | `/api/attendance/employees/:employeeId/history` | Any | `?page=1&limit=20` |
| POST | `/api/attendance/guests/:guestId/punch-in` | Any | No body |
| POST | `/api/attendance/guests/:guestId/punch-out` | Any | No body |
| GET | `/api/attendance/guests/:guestId/history` | Any | `?page=1&limit=20` |

### Reports — `/api/reports`

| Method | Route | Auth | Query Params |
|---|---|---|---|
| GET | `/api/reports/employees/:employeeId/daily` | Any | `?date=2026-05-06` |
| GET | `/api/reports/employees/:employeeId/monthly` | Any | `?year=2026&month=5` |

---

## How Punch In / Punch Out Works

### Storage

Every punch action creates a `PunchEvent` record in the database:

```
PunchEvent {
  id         - unique ID
  type       - IN | OUT
  personType - EMPLOYEE | GUEST
  employeeId - (if employee)
  guestId    - (if guest)
  timestamp  - exact time of the punch
}
```

Each punch is stored as an **immutable event** — nothing is ever updated or deleted. This gives a full audit trail of every entry and exit.

### Punch-In Logic

Before recording a punch-in, the system checks the **last punch event** for that person:

- If the last event was `IN` → reject with error: *"already punched in"*
- If the last event was `OUT` or no events exist → allow punch-in

### Punch-Out Logic

Before recording a punch-out, the system checks the **last punch event**:

- If the last event was `OUT` or no events exist → reject with error: *"not punched in"*
- If the last event was `IN` → allow punch-out

This enforces a strict `IN → OUT → IN → OUT` sequence per person.

---

## How Reports Are Calculated

### Daily Report

1. Fetch all `PunchEvent` records for the employee on the given date (UTC midnight to 23:59:59)
2. Sort events by `timestamp` ascending
3. Pair each `IN` with the next `OUT` to form a **session**
4. For each session: `minutes = (punchOut - punchIn) / 60000`
5. Sum all session minutes → `totalMinutes`
6. If the last punch-in has no matching punch-out, it is recorded as an **open session** with 0 minutes (person is still inside)

**Example:**
```
08:00 IN  ─┐
10:00 OUT ─┘ → 120 min session
12:00 IN  ─┐
13:30 OUT ─┘ → 90 min session

totalMinutes = 210  →  totalHours = "3h 30m"
```

### Monthly Report

1. Fetch all `PunchEvent` records for the employee within the given month
2. **Group events by calendar date** (split on `T` in ISO string)
3. Run the same session-pairing logic for each day independently
4. Sum all daily totals → `totalMinutes` for the month
5. Return a `breakdown` array — one entry per day the employee was present, sorted by date

**Response shape:**
```json
{
  "employee": { "id": "...", "name": "Jane", "employeeCode": "EMP001" },
  "year": 2026,
  "month": 5,
  "totalMinutes": 9600,
  "totalHours": "160h 0m",
  "daysPresent": 20,
  "breakdown": [
    {
      "date": "2026-05-01",
      "totalMinutes": 480,
      "totalHours": "8h 0m",
      "sessions": [...]
    }
  ]
}
```

### Working Minutes Formula

```
sessions = []
lastPunchIn = null

for each event (sorted by time):
  if event.type == IN:
    lastPunchIn = event.timestamp
  if event.type == OUT and lastPunchIn exists:
    minutes = (event.timestamp - lastPunchIn) / 60000
    sessions.push({ punchIn, punchOut, minutes })
    lastPunchIn = null

if lastPunchIn still set → open session (person still inside)
```

Overlapping or duplicate punches are prevented at the API level before any event is stored.

---

## Database Schema

```
User         → system users (ADMIN / OPERATOR)
Employee     → tracked employees
Guest        → tracked visitors
PunchEvent   → immutable log of every IN/OUT action
```

`PunchEvent` has indexed columns on `(employeeId, timestamp)` and `(guestId, timestamp)` for fast time-range queries used in reports.
