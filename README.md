# Xpense

Xpense is a full-stack personal finance tracker built with Next.js 16, TypeScript, Prisma, and PostgreSQL. It lets users register, verify their email, log income and expense transactions, view dashboard summaries, review transaction history, and manage account recovery through OTP-based flows.

## 1. What this app does

Xpense provides a simple, polished experience for tracking money with:

- User registration and login
- Email verification with one-time passcodes
- Password reset via OTP
- Secure session handling with httpOnly cookies and JWTs
- Transaction creation, editing, and deletion
- Income and expense tracking
- Dashboard summary cards
- Daily income/expense chart
- Category breakdown chart
- Transaction list with pagination
- Protected routes and auth-based navigation

## 2. Tech stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS
- UI motion: Framer Motion
- Charts: Recharts
- Backend/API: Next.js route handlers and server actions
- Database: PostgreSQL via Prisma ORM
- Auth: JWT + httpOnly cookies + bcrypt + OTP email flow
- Mail: Nodemailer

## 3. Project structure

- app/(marketing): landing page and marketing UI
- app/(auth): login, register, OTP verification, password reset pages
- app/(app): authenticated dashboard, transactions, and shared app shell
- app/api/auth: authentication API endpoints
- app/api/analytics: dashboard analytics endpoints
- lib: shared helpers, auth utilities, Prisma client, validation schemas
- prisma: Prisma schema and migrations

## 4. Prerequisites

Before running the app, make sure you have:

- Node.js 20+ recommended
- npm or pnpm
- PostgreSQL running locally or remotely
- A mail provider or SMTP credentials (optional for development)

## 5. Environment variables

Create a file named .env.local in the project root with the following values:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"
JWT_ACCESS_SECRET="replace-with-a-long-random-string"
JWT_REFRESH_SECRET="replace-with-a-long-random-string"
JWT_FLOW_SECRET="replace-with-a-long-random-string"

# Optional for email OTP delivery
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-smtp-user"
SMTP_PASS="your-smtp-password"
SMTP_FROM=""Xpense" <no-reply@xpense.app>"
```

Notes:
- If SMTP settings are not provided, OTP codes will still be generated, but they will be logged to the terminal in development mode instead of being emailed.
- The app expects a PostgreSQL database that Prisma can connect to.

## 6. Installation and setup

Run the following commands from the project root:

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

### If you are starting from a fresh local database

If your PostgreSQL instance is empty, the migration command above will apply the existing migrations and create the required tables.

### If you want to inspect or change the database schema

```bash
npx prisma studio
```

## 7. How the app works

### Authentication flow

1. A user creates an account on the register screen.
2. The server creates or updates the user record and sends an OTP to the email.
3. The user enters the 6-digit OTP on the verification screen.
4. After verification, the app issues access and refresh tokens stored in httpOnly cookies.
5. The middleware protects routes such as /dashboard and /transactions and redirects unauthenticated users to /login.

### Transaction flow

1. A signed-in user opens the transactions section.
2. They can add an income or expense transaction with a title, amount, category, and optional notes.
3. The transaction is saved to PostgreSQL through Prisma.
4. Dashboard metrics and charts update from the stored transaction data.

### Analytics flow

- The dashboard shows:
  - Total income
  - Total expense
  - Net balance
  - Daily income/expense chart
  - Category breakdown chart
- Analytics are served from dedicated API routes and use transaction data for the current month by default.

## 8. Main routes

- /: landing page
- /login: sign-in page
- /register: account creation page
- /verify-otp: OTP confirmation screen
- /forgot-password: password reset initiation
- /reset-password: new password form
- /dashboard: authenticated overview page
- /transactions: transaction list and management
- /transactions/new: add transaction form
- /transactions/[id]/edit: edit transaction form

## 9. Database models

The Prisma schema currently includes:

- User
  - id, name, email, password, emailVerified, createdAt, updatedAt
- Otp
  - email, codeHash, purpose, expiresAt, attempts, consumedAt
- Category
  - name, transactions
- Transaction
  - title, amount, type, notes, category, user, createdAt, updatedAt

## 10. Current feature notes and limitations

The app is already functional for core personal finance tracking, but a few UI elements are still partially implemented:

- The transactions page includes search, type, category, and date controls in the toolbar, but filtering is not yet wired to the backend.
- The current app focuses on single-user personal finance tracking rather than multi-user or team-based budgeting.
- The dashboard and charts are based on the currently signed-in user’s transactions.

## 11. Useful commands

```bash
npm run dev
npm run build
npm run lint
npx prisma generate
npx prisma migrate deploy
npx prisma studio
```

## 12. Development notes

- The app uses server components and server actions heavily, so most business logic lives on the server side.
- Auth state is driven by cookies rather than client-side storage.
- For local development, the email OTP flow is easiest to test when SMTP is configured; otherwise the code is printed to the console.
