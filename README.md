# TaskBoard — Azure Boards-style Task Manager

A production-ready project management web application with Kanban boards, team collaboration, and real-time activity tracking.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose ODM) |
| Frontend | React 18, Vite |
| Auth | JWT (bcryptjs) |
| State Management | Redux Toolkit |
| Styling | Tailwind CSS |
| Drag & Drop | @hello-pangea/dnd |

## Features

- **Authentication** — Signup/Login with JWT tokens, password hashing
- **Projects** — Create, update, delete projects; manage team members with roles (Admin/Member)
- **Kanban Board** — Drag-and-drop task management across Todo / In Progress / Done columns
- **Task Management** — Create, assign, prioritize (Low/Medium/High), set due dates, filter by status/assignee/priority
- **Dashboard** — Stats overview (total, completed, in-progress, overdue), personal task list, recent activity feed
- **Comments** — Add comments on tasks
- **Activity Logs** — Track who did what and when
- **Role-based Access** — Project admins can manage members and settings; members can work on tasks

## Quick Start

### Prerequisites

- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)

### 1. Clone & Install

```bash
git clone <repo-url>
cd Task_manager
npm run install-all
```

### 2. Configure Environment

Edit the `.env` file in the project root:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_change_this
PORT=3000
NODE_ENV=development
```

### 3. Run in Development

```bash
npm run dev
```

This starts:
- **Express API** on `http://localhost:3000`
- **Vite Dev Server** on `http://localhost:5173` (proxies `/api` to Express)

Open `http://localhost:5173` in your browser.

### 4. Run in Production

```bash
npm run build    # builds React app
npm start        # starts Express serving API + React static files
```

Open `http://localhost:3000` in your browser.

## Project Structure

```
Task_manager/
├── .env                        # Environment variables
├── .gitignore
├── package.json                # Root scripts (dev, build, start)
├── README.md
├── backend/
│   ├── server.js               # Express entry point
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js             # JWT verify, role checks
│   │   ├── errorHandler.js     # Central error handling
│   │   └── validate.js         # express-validator runner
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Task.js
│   │   ├── Activity.js
│   │   └── Comment.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── project.controller.js
│   │   ├── task.controller.js
│   │   ├── comment.controller.js
│   │   └── dashboard.controller.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── project.routes.js
│   │   ├── task.routes.js
│   │   ├── comment.routes.js
│   │   └── dashboard.routes.js
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── project.validator.js
│   │   └── task.validator.js
│   └── utils/
│       └── activityLogger.js
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── api/
        │   └── axios.js
        ├── store/
        │   ├── store.js
        │   └── slices/
        │       ├── authSlice.js
        │       ├── projectSlice.js
        │       └── taskSlice.js
        ├── components/
        │   ├── auth/
        │   │   └── ProtectedRoute.jsx
        │   ├── layout/
        │   │   ├── Layout.jsx
        │   │   ├── Navbar.jsx
        │   │   └── Sidebar.jsx
        │   ├── dashboard/
        │   │   ├── StatsCard.jsx
        │   │   └── RecentActivity.jsx
        │   ├── projects/
        │   │   ├── ProjectCard.jsx
        │   │   └── AddMemberModal.jsx
        │   └── tasks/
        │       ├── KanbanBoard.jsx
        │       ├── KanbanColumn.jsx
        │       ├── TaskCard.jsx
        │       ├── TaskModal.jsx
        │       ├── TaskFilters.jsx
        │       └── CommentSection.jsx
        ├── pages/
        │   ├── Login.jsx
        │   ├── Signup.jsx
        │   ├── Dashboard.jsx
        │   ├── Projects.jsx
        │   ├── ProjectDetail.jsx
        │   └── TaskBoard.jsx
        └── utils/
            └── formatDate.js
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user (protected) |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users?search=` | Search users by name/email |
| GET | `/api/users/:id` | Get user profile |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List user's projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/:id` | Get project detail |
| PUT | `/api/projects/:id` | Update project (admin) |
| DELETE | `/api/projects/:id` | Delete project (admin) |
| POST | `/api/projects/:id/members` | Add member (admin) |
| DELETE | `/api/projects/:id/members/:userId` | Remove member (admin) |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects/:pid/tasks` | List tasks (supports ?status, ?priority, ?assignedTo) |
| POST | `/api/projects/:pid/tasks` | Create task |
| GET | `/api/projects/:pid/tasks/:tid` | Get task detail |
| PUT | `/api/projects/:pid/tasks/:tid` | Update task |
| DELETE | `/api/projects/:pid/tasks/:tid` | Delete task |
| PATCH | `/api/projects/:pid/tasks/:tid/status` | Update status (drag-drop) |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/:taskId/comments` | List comments |
| POST | `/api/tasks/:taskId/comments` | Add comment |
| DELETE | `/api/tasks/:taskId/comments/:commentId` | Delete own comment |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Dashboard stats, my tasks, recent activity |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run install-all` | Install all dependencies (root + backend + frontend) |
| `npm run dev` | Start dev servers (Express + Vite) concurrently |
| `npm run build` | Build React frontend for production |
| `npm start` | Start production server (API + static files on port 3000) |
