# Windows Explorer Web App

A professional-grade, hierarchical folder-structure web application built with a focus on clean architecture, performance, and modern web aesthetics.

## 🚀 Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Backend**: [ElysiaJS](https://elysiajs.com/) (High-performance web framework)
- **Frontend**: [Vue 3](https://vuejs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Architecture**: Hexagonal (Clean) Architecture

## ✨ Key Features

- **Hierarchical Navigation**: Recursive folder tree with unlimited nesting depth support.
- **Modern UI**: Two-panel Windows Explorer-like layout with smooth transitions.
- **Global Search**: Debounced real-time search across all folders and files.
- **RESTful API**: Standardized responses with proper error handling and Swagger documentation.
- **Performance Optimized**: Database indexing on parent relations and O(n) tree building algorithm.
- **Responsive Grid**: Dynamic grid view for folder contents.

## 🏗️ Architecture (Hexagonal)

The project is structured into distinct layers to ensure separation of concerns and maintainability:

### Backend Structure
- **Domain**: Pure business logic (Entities & Repository Interfaces).
- **Application**: Use cases and complex logic (Services & Tree Algorithms).
- **Infrastructure**: Technical implementation details (Database connection, Repositories Impl).
- **Interface**: Entry points (API Routes, Controllers).

### Frontend Structure
- **Components**: Reusable UI parts (Recursive TreeNodes, Content Grids).
- **Composables**: Shared reactive state logic (`useFileSystem`).
- **Services**: API client implementation.

## 🛠️ Getting Started

### Prerequisites
- [Bun](https://bun.sh/docs/installation) installed.
- PostgreSQL instance running.

### Installation

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   bun install
   ```
3. **Configure Environment**
   
   **Backend:**
   Copy `.env-example` to `.env` in `packages/backend/` and adjust the database URL:
   ```bash
   cp packages/backend/.env-example packages/backend/.env
   ```
   
   **Frontend:**
   Copy `.env-example` to `.env` in `packages/frontend/` and adjust the API URL if necessary:
   ```bash
   cp packages/frontend/.env-example packages/frontend/.env
   ```

### Database Setup
```bash
cd packages/backend
bun run db:generate
bun run db:migrate
bun run db:seed
```

### Running the Application

**Run Backend:**
```bash
cd packages/backend
bun run dev
```
*API documentation available at http://localhost:3000/swagger*

**Run Frontend:**
```bash
cd packages/frontend
bun run dev
```

## 📜 API Endpoints

- `GET /api/v1/nodes/tree`: Fetches the entire hierarchical folder structure.
- `GET /api/v1/nodes/:id/children`: Fetches direct children of a specific folder.
- `GET /api/v1/nodes/search?q=...`: Searches for nodes by name.

---

Built as part of a technical test implementation. May 3, 2026.
