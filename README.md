# Public Grievance & Infrastructure Monitoring System

A next-generation, modern, responsive web portal for civic grievance reporting, real-time infrastructure tracking, dispatch scheduling, and cyber telemetry auditing.

Designed with a premium **Deep Space Dark Theme** inspired by modern glassmorphism aesthetics, featuring a dark slate layout, neon-lime accents, and elegant micro-animations.

---

## 🌌 Core Visual Identity
- **Primary Color Palette:** Deep space backgrounds (`#07080e`), dark slate glass cards (`#0f111a`), signature neon-lime highlights (`#D1FD0A`), and smooth indigo gradients.
- **Glassmorphism & Telemetry aesthetics:** Matte borders, interactive hover radial-glow cursor overlays, and smooth transitions.
- **Responsive Layout:** Tailored layouts designed for Desktop, Tablet, and Mobile screens.

---

## 🚀 Key Features

### 👤 Citizen Workspace
- **Dynamic Homepage:** Interactive hero banner, civic statistics, project features, workflow guide, and a feedback footer.
- **Create Complaint Form:** Dynamic dropdown selectors for municipal categories, automatic telemetry pre-checks, and file attachment simulations.
- **Interactive Tracking:** A real-time timeline tracking ticket status updates (Submitted ➔ Under Review ➔ Assigned ➔ In Progress ➔ Resolved).
- **Security & Profile Settings:** Citizen notifications bulletin, OTP verification during registration, and editable profile details.

### 👮 Ground Officer Portal
- **Case Analytics:** Aggregated dashboard tracking active cases, pending status updates, and resolutions.
- **Assigned Incidents List:** View dispatch details, area coordinates, and priority logs.
- **Resolution updates:** Log action details, upload proof of resolution, and close tickets.

### 🔑 Administrative Command Center
- **Control Dashboard:** Centralized graphs representing category distribution and monthly ticket resolutions.
- **Citizen Registry:** Directory listing all registered citizens and activation statuses.
- **Officer Deployment:** Deployment panel featuring interactive officer search and dispatch scheduling.
- **Incident Monitor:** Consolidated global table with live query searching and multi-parameter filters (Category, Priority, Work Status).
- **Incident Dispatch:** Route pending complaints to nearest crews.

### 🛡️ Cybersecurity Telemetry & Compliance
- **Security Dashboard:** High-priority threat monitor displaying real-time intrusion flags, firewall state, and database health logs.
- **Audit Logs:** Secure registry logging user authentications, administrative dispatches, and role elevations with timestamp indicators.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React.js (Vite environment)
- **State Management:** Redux Toolkit (stores for auth, complaints, and security compliance logs)
- **Styling:** Tailwind CSS, PostCSS (Glassmorphism overrides, Custom cursor glows, Scrollbar thumb styles)
- **Data Visualization:** Recharts (responsive line charts, bar charts, custom interactive tooltips)
- **Iconography:** Lucide React (futuristic high-tech line icons)
- **Routing:** React Router v6

### Backend
- **Runtime:** Node.js (Express framework)
- **Database:** SQLite (local persistent file-based SQL store)
- **Authentication:** JWT (JSON Web Tokens) with Secure HTTP Header session validation
- **Password Security:** Salted Hashing via bcryptjs (10 rounds)
- **Email Dispatch:** Gmail SMTP integration with automated OTP generation and Ethereal Mail fallback

---

## 📁 Project Structure
```text
project/
├── backend/                # Node.js + Express Backend API
│   ├── config/             # SQLite connection & Database initialization
│   │   └── db.js
│   ├── controllers/        # Handlers for Auth, Login, Registration, OTPs, Reset
│   │   └── authController.js
│   ├── middleware/         # JWT parser and Route Guards (Role-Based Access Control)
│   │   └── authMiddleware.js
│   ├── models/             # Database queries wrapper
│   │   └── userModel.js
│   ├── routes/             # Authentication & verification routing endpoints
│   │   └── authRoutes.js
│   ├── server.js           # Server initializer, JSON Parser, and CORS setup
│   ├── .env.example        # Environment variables structure template
│   └── database.db         # Persistent SQLite database (local-only, git ignored)
├── public/                 # Static assets (Favicons, images)
├── src/
│   ├── assets/             # SVG graphics and logos
│   ├── components/
│   │   └── Shared/         # Reusable layouts (Navbar, Sidebar, Card, Loader)
│   ├── pages/
│   │   ├── Public/         # Public pages (Home, About, Contact, Login, Register, ForgotPassword, ResetPassword, OTPVerify)
│   │   ├── Citizen/        # Citizen workflow pages
│   │   ├── Officer/        # Ground officer action dashboards
│   │   ├── Admin/          # Administrative dashboards & registries
│   │   └── Cybersecurity/  # Cybersecurity Compliance & Audit logs
│   ├── store/
│   │   ├── slices/         # Redux state logic (auth, complaints, security)
│   │   └── index.js        # Global Redux Store config
│   ├── App.jsx             # Main router mapping, layout config, and Role Guards
│   ├── index.css           # Glassmorphism utilities & global style overrides
│   └── main.jsx            # Application entry point
├── tailwind.config.js      # Color definitions & design tokens
├── postcss.config.js       # CSS preprocessor settings
└── package.json            # Frontend dependencies & build scripts
```

---

## 💻 Local Execution Guide

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 1. Setup Backend API
Navigate to the `/backend` directory:
```bash
cd backend
```

Install backend dependencies:
```bash
npm install
```

Configure Environment variables. Copy the `.env.example` template:
```bash
cp .env.example .env
```
Open the created `.env` file and set the following credentials:
```env
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
SMTP_EMAIL=your_gmail_address_here
SMTP_PASSWORD=your_gmail_app_password_here
```
*(Note: If SMTP credentials are left blank, the server automatically falls back to generating local mock preview URLs)*

Start the backend development server:
```bash
npm run dev
```
The backend API server will launch at `http://localhost:5000`.

### 2. Setup Frontend React App
Navigate back to the project root directory:
```bash
cd ..
```

Install frontend dependencies:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```
The React app will launch at `http://localhost:5173`.

---

## 🔐 Default Pre-seeded Credentials
For testing different roles, the backend automatically seeds the database on first run with the following default accounts (password for all accounts is `password123`):

*   **Citizen Workspace**:
    *   Email: `citizen@example.com`
    *   Password: `password123`
*   **Ground Officer Workspace**:
    *   Email: `officer@example.com`
    *   Password: `password123`
*   **Administrator Command Center**:
    *   Email: `admin@example.com`
    *   Password: `password123`
