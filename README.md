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
- **Alerts & Profile Settings:** Citizen notifications bulletin and editable profile details.

### 👮 Ground Officer Portal
- **Case Analytics:** Aggregated dashboard tracking active cases, pending status updates, and resolutions.
- **Assigned Incidents List:** View dispatch details, area coordinates, and priority logs.
- **Resolution updates:** Log action details, upload proof of resolution, and close tickets.

### 🔑 Administrative Command Center
- **Control Dashboard:** Centralized graphs representing category distribution and monthly ticket resolutions.
- **Citizen Registry:** Directory listing all registered citizens and activation statuses.
- **Officer Deployment:** Deployment panel featuring interactive officer search and dispatch scheduling.
- **incident Monitor:** Consolidated global table with live query searching and multi-parameter filters (Category, Priority, Work Status).
- **Incident Dispatch:** Route pending complaints to nearest crews.

### 🛡️ Cybersecurity Telemetry & Compliance
- **Security Dashboard:** High-priority threat monitor displaying real-time intrusion flags, firewall state, and database health logs.
- **Audit Logs:** Secure registry logging user authentications, administrative dispatches, and role elevations with timestamp indicators.

---

## 🛠️ Technology Stack
- **Framework:** React.js (Vite environment)
- **State Management:** Redux Toolkit (stores for auth, complaints, and security compliance logs)
- **Styling:** Tailwind CSS, PostCSS (Glassmorphism overrides, Custom cursor glows, Scrollbar thumb styles)
- **Data Visualization:** Recharts (responsive line charts, bar charts, custom interactive tooltips)
- **Iconography:** Lucide React (futuristic high-tech line icons)
- **Routing:** React Router v6

---

## 📁 Project Structure
```text
project/
├── public/                 # Static assets (Favicons, images)
├── src/
│   ├── assets/             # SVG graphics and logos
│   ├── components/
│   │   └── Shared/         # Reusable layouts (Navbar, Sidebar, Card, Loader)
│   ├── pages/
│   │   ├── Public/         # Public pages (Home, About, Contact, Login, Register)
│   │   ├── Citizen/        # Citizen workflow pages
│   │   ├── Officer/        # Ground officer action dashboards
│   │   ├── Admin/          # Administrative dashboards & registries
│   │   └── Cybersecurity/  # Cybersecurity Compliance & Audit logs
│   ├── store/
│   │   ├── slices/         # Redux state logic (auth, complaints, security)
│   │   └── index.js        # Global Redux Store config
│   ├── App.jsx             # Main router mapping & layouts
│   ├── index.css           # Glassmorphism utilities & global style overrides
│   └── main.jsx            # Application entry point
├── tailwind.config.js      # Color definitions & design tokens
├── postcss.config.js       # CSS preprocessor settings
└── package.json            # Dependencies & build scripts
```

---

## 💻 Local Execution Guide

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 1. Installation
Clone the repository and install project dependencies:
```bash
# Install NPM packages
npm install
```

### 2. Launch Local Server
Start the local Vite development server:
```bash
npm run dev
```
Open your browser and navigate to the address shown in the terminal (usually `http://localhost:5173`).

### 3. Production Build
To compile and minify the project files for production deployment:
```bash
npm run build
```

---

## 🧪 Simulation Guide
To quickly review the workspaces of different roles without resetting credentials:
1. Log in with any credentials or click Register/Login.
2. Locate the **Role Selector dropdown** on the top navigation bar (only visible when authenticated).
3. Switch between **ADMIN**, **OFFICER**, and **CITIZEN** accounts to test role-specific dashboards and live data synchronization instantly.
