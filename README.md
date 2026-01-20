# CleanFanatics - Home Services Booking Platform 🧹

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Stack](https://img.shields.io/badge/stack-MERN-blueviolet)

CleanFanatics is a robust **Home Services Booking System** built with the **MERN Stack** (MongoDB, Express, React, Node.js). It facilitates seamless connections between customers needing home services (cleaning, plumbing, electrical) and service providers, featuring intelligent provider assignment and real-time status tracking.

---

## 🚀 Key Features

### 🧠 Intelligent Assignment Engine
*   **Proximity-Based Matching**: Automatically finds the closest available provider using a smart mock-distance algorithm.
*   **Skill-Based Routing**: Ensures bookings are only routed to providers with the specific expertise (e.g., 'sofa-cleaning', 'leaking-tap').
*   **Automated Retry Logic**: System automatically retries assignment if the first provider rejects or is unavailable.

### 👥 Role-Based Portals

#### 👤 Customer
*   **Service Wizard**: Multi-step booking flow to select category, specific service, date, and time.
*   **Live Tracking**: Real-time status updates: `Pending` → `Assigned` → `Accepted` → `In Progress` → `Completed`.
*   **History**: View past and upcoming bookings.

#### 🔧 Provider
*   **Job Dashboard**: Kanban or list view of assigned jobs.
*   **Quick Actions**: One-tap "Accept", "Start Job", and "Complete Job" status updates.
*   **Proximity View**: See distance to customer location (mock data).

#### 🛡️ Admin
*   **System Oversight**: View all bookings, users, and system logs.
*   **Event Logging**: Comprehensive audit trail of all system actions (assignments, cancellations, status changes).
*   **Manual Override**: Ability to manually assign providers or cancel bookings.

---

## 📂 Project Structure

Verified directory structure of the application:

```text
cleanfanatics/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/          # Database and environment config
│   │   ├── controllers/     # Request handlers (Auth, Booking, Admin)
│   │   ├── middleware/      # Auth checks, RBAC, Error handling
│   │   ├── models/          # Mongoose Schemas (User, Booking, EventLog)
│   │   ├── routes/          # API Route definitions
│   │   ├── services/        # Business logic (Assignment, Proximity logic)
│   │   └── utils/           # Helper functions (Retry logic)
│   ├── .env.example         # Template for environment variables
│   └── server.js            # Entry point
│
├── frontend/                # React + Vite Client
│   ├── src/
│   │   ├── assets/          # Static images and icons
│   │   ├── components/
│   │   │   ├── admin/       # Admin-specific components (Logs, Tables)
│   │   │   ├── common/      # Reusable UI (Buttons, Badges, Loaders)
│   │   │   ├── layout/      # Navbar, Sidebar, App Layouts
│   │   │   ├── customer/    # Booking forms and customer views
│   │   │   └── provider/    # Job cards and provider dashboards
│   │   ├── context/         # React Context (Auth State)
│   │   ├── pages/           # Full page views (Login, Dashboard)
│   │   ├── services/        # Axios API wrapper functions
│   │   ├── App.jsx          # Main App component with Routing
│   │   └── main.jsx         # Entry point
│   ├── public/              # Public static assets
│   ├── eslint.config.js     # Linter configuration
│   └── vite.config.js       # Vite configuration
│
└── README.md                # Project documentation
```

---

## 🛠️ Tech Stack

### Frontend
*   **Framework**: React 18
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS (Utility-first)
*   **State Management**: React Context API
*   **Routing**: React Router DOM v6
*   **HTTP Client**: Axios

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (Atlas)
*   **ODM**: Mongoose
*   **Authentication**: JWT (JSON Web Tokens)
*   **Logging**: Custom EventLog model for audit trails

---

## 🏁 Getting Started

### Prerequisites
*   Node.js (v14 or higher)
*   MongoDB URI (Local or Atlas)

### 1. Backend Setup

```bash
cd backend
npm install

# Configure Environment Variables
# Create a .env file based on .env.example
# Ensure MONGODB_URI is set
npm run dev
```

The server will start on port `5000` (default).

### 2. Frontend Setup

```bash
cd frontend
npm install

# Start Development Server
npm run dev
```

The application will run on `http://localhost:5173`.

---

## 🧪 Demo Credentials

The application runs in **Demo Mode** with pre-configured users for testing:

| Role | Email / User | Password | Capability |
|------|--------------|----------|------------|
| **Customer** | `customer@demo.com` | `password123` | Book services, track status |
| **Provider** | `provider@demo.com` | `password123` | Accept jobs, update status |
| **Admin** | `admin@demo.com` | `admin123` | View logs, manage users |

> **Note**: The exact demo logic is handled in `auth.controller.js` using the `DEMO_USERS` object.

---

## 📝 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User authentication |
| POST | `/api/bookings` | Create a new booking |
| GET | `/api/bookings/my-bookings` | Get customer/provider specific bookings |
| PATCH | `/api/bookings/:id/status` | Update booking status (Provider/Admin) |
| GET | `/api/admin/logs` | Retrieve system event logs |

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/NewFeature`)
3. Commit your Changes (`git commit -m 'Add some NewFeature'`)
4. Push to the Branch (`git push origin feature/NewFeature`)
5. Open a Pull Request
