# ConstructOS - Enterprise Industrial Commerce Operating System

Welcome to the **ConstructOS** monorepo repository. ConstructOS is a production-grade, highly scalable industrial software foundation designed to integrate multi-tenant contractor ERP workflows, heavy materials spot procurement, micro-telemetry stock levels, milestone B2B escrows, and logistics tipper-truck routing.

This repository is engineered using a high-performance **pnpm workspaces + Turborepo** monorepo structure.

---

## 🛠️ Technology Stack & Shared Core

### Applications (`/apps`)

- **`web`**: Next.js 14 App Router, TypeScript, TailwindCSS, Zustand reactive states, React Hook Form, and Zod schema constraints. Fully styled with dark-mode parameters and glassmorphism.
- **`api`**: NestJS modular REST API, Joi environment validations, Prisma ORM, PostgreSQL connections pooling, Swagger specifications, global interceptors/filters, and auth-ready RBAC security.

### Shared Packages (`/packages`)

- **`config`**: Shared baseline configuration matrices for TypeScript and TailwindCSS.
- **`types`**: Unified, type-safe models for RBAC (SystemRole, SystemPermission), login requests, and API payloads.
- **`utils`**: General-purpose helpers (currency converters, date parsers, response helpers, async delay utilities).
- **`ui`**: Premium shared custom component library (Button, glassmorphism Card, CSS classes mergers).

---

## 📁 Workspace Repository Tree

```text
ConstructOs/
├── apps/
│   ├── api/                  # NestJS Core Backend
│   │   ├── prisma/           # PostgreSQL Schema & Seed scripts
│   │   └── src/
│   │       ├── common/       # Guards, Decorators, Exception filters, Interceptors
│   │       ├── config/       # Environment loading & validation (Joi)
│   │       ├── database/     # Prisma integration module & services
│   │       └── modules/      # Domain modules (auth, health)
│   └── web/                  # Next.js 14 Frontend Web Client
│       └── src/
│           ├── app/          # App Router paths, loading boundaries, error catchers
│           ├── components/   # ThemeProvider & visual structures
│           ├── stores/       # Zustand auth states & local persistence
│           └── styles/       # Tailwind globals.css containing theme tokens
├── packages/
│   ├── config/               # Shared compiler and styling configs
│   ├── types/                # Strict unified interfaces (User, Auth, API)
│   ├── ui/                   # Shared Premium React primitives
│   └── utils/                # Standard workspace helper functions
├── pnpm-workspace.yaml       # Workspace declarations
├── turbo.json                # Turborepo task pipeline mappings
├── package.json              # Monorepo dependencies and pipelines scripts
└── README.md                 # System documentation
```

---

## 🏁 Fast-Track Onboarding & Startup

Follow these instructions to launch the ConstructOS ecosystem:

### 1. Prerequisites

Verify you have the following installed on your machine:

- [Node.js](https://nodejs.org) (v18.x or v20.x recommended)
- [pnpm](https://pnpm.io) (v8.x or v9.x recommended)
- [PostgreSQL](https://www.postgresql.org) database running locally or in a container.

### 2. Workspace Setup

1.  Clone this repository to your local directory.
2.  Duplicate `.env.example` at the root folder to `.env`:
    ```bash
    cp .env.example .env
    ```
    Configure `DATABASE_URL` with your PostgreSQL server connection string.
3.  Install all dependencies across all packages in a single step using pnpm:
    ```bash
    pnpm install
    ```

### 3. Database Bootstrap & Seeding

Prepare your database models and populate default security parameters (roles, permissions, and admin user):

```bash
# Generate Prisma Client models
pnpm db:generate

# Push schema directly to your PostgreSQL database
pnpm db:push

# Populate default roles, permissions, and Super Admin User
pnpm db:seed
```

### 4. Running the Development Servers

Start both the NestJS API (`http://localhost:3001`) and Next.js Web Application (`http://localhost:3000`) in parallel using Turborepo pipeline:

```bash
pnpm dev
```

---

## 🔒 Security & Auth Architecture

ConstructOS utilizes a secure, ready-to-scale **JWT Bearer Authentication** and **Fine-Grained Role-Based Access Control (RBAC)** architecture:

- **System Roles**: `SUPER_ADMIN`, `ORG_ADMIN`, `PROJECT_MANAGER`, `INVENTORY_MANAGER`, `BILLING_CLERK`, `CONTRACTOR`, `FIELD_USER`.
- **Route Protection**: Routes in the NestJS API are protected using the global `AuthGuard` and `RolesGuard`.
- **Unified Access**: Add custom metadata constraints using `@Roles(...)` or `@Permissions(...)` decorators at the class or controller level.
- **Super Admin Bypass**: The system is designed to allow `SUPER_ADMIN` to automatically bypass all constraints, ensuring platform-wide overrides when required.
