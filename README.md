## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS, Tanstack React Query
- **Backend**: NestJS with Fastify
- **Database**: PostgreSQL
- **Package Manager**: pnpm (monorepo)

## Setup

### Prerequisites

- Node.js >= 18
- pnpm >= 8
- PostgreSQL >= 14
- Docker (Local DB instances are served trough docker, automatically settled via scripts, to set, create, migrate and work with the local db)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   pnpm install
   ```

3. Create a `.env` file at the root level (see `.env.example` for reference)

4. Setup the database:
   Done automatically when pnpm dev is run

### Development

To run both frontend and backend concurrently:

```
pnpm dev
```

The frontend will be available at http://localhost:3000 and the backend at http://localhost:3001.

### Production Build

```
pnpm build
pnpm start
```

## Project Structure

- `/frontend` - Next.js frontend application
- `/backend` - NestJS backend API
- `/package.json` - Root package.json for monorepo setup
- `/pnpm-workspace.yaml` - pnpm workspace configuration 
