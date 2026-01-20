# CleanFanatics - Home Services Booking Platform 🧹

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-v14+-green.svg)
![React](https://img.shields.io/badge/react-18-61dafb.svg)

CleanFanatics is a modern, full-stack MERN application designed to streamline the home services booking process. It connects customers with service providers (cleaners, plumbers, electricians) through a seamless, responsive, and professional interface.

![CleanFanatics Dashboard](https://via.placeholder.com/800x400?text=CleanFanatics+Dashboard)

---

## 📋 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Configuration](#️-configuration)
- [API Reference](#-api-reference)
- [Screenshots](#-screenshots)
- [Roadmap](#️-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## ✨ Features

### 👤 Customer Portal

- **📊 Dashboard**: Comprehensive view of all bookings with real-time status tracking
- **🛎️ Service Booking**: Intuitive multi-step booking wizard for:
  - 🧹 Cleaning Services
  - 🔧 Plumbing Services
  - ⚡ Electrical Services
- **🔄 Real-time Status Updates**: Track your bookings through the complete lifecycle:
  - ⏳ Pending → 👷 Assigned → ✅ Accepted → 🔨 In Progress → ✔️ Completed
- **❌ Booking Management**: Cancel bookings before work begins
- **📱 Responsive Design**: Seamless experience across all devices

### 🔧 Provider Dashboard

- **📋 Job Management**: View and manage assigned jobs in kanban-style or list view
- **⚡ Quick Actions**: One-click workflow for Accept → Start → Complete
- **👥 Customer Communication**: Access to customer details and service location
- **📈 Performance Tracking**: Monitor completed jobs and ratings
- **🔔 Real-time Notifications**: Instant updates on new job assignments

### 👨‍💼 Admin Dashboard

- **📊 System Overview**: 
  - Total bookings statistics
  - Provider performance metrics
  - Service type distribution
  - Revenue analytics
- **⚙️ Operations Management**:
  - Manual provider assignment
  - Booking status overrides
  - Provider availability management
- **📝 Activity Logs**: Comprehensive event logs for all system activities
- **👥 User Management**: Manage customers and service providers

---

## 🎥 Demo

**Live Demo**: [Coming Soon](#)

### 🔑 Demo Credentials

The application runs in **Demo Mode** with instant access - no registration required!

| Role | Username | Features |
|------|----------|----------|
| 👤 **Customer** | `John Customer` | Book services, track orders, cancel bookings |
| 🔧 **Provider** | `Mike Cleaner`<br>`Sam Plumber`<br>`Alex Electrician` | Accept jobs, update status, complete services |
| 👨‍💼 **Admin** | `Admin User` | Full system access, analytics, user management |

---

## 🛠️ Tech Stack

### Frontend
- **⚛️ React 18** - Modern UI library with hooks
- **⚡ Vite** - Next-generation frontend tooling
- **🎨 Tailwind CSS** - Utility-first CSS framework with custom design system
- **🧭 React Router** - Client-side routing
- **📡 Axios** - HTTP client for API calls

### Backend
- **🟢 Node.js** - JavaScript runtime environment
- **🚂 Express.js** - Fast, minimalist web framework
- **🔐 JWT** - Secure authentication
- **✅ Express Validator** - Request validation middleware

### Database
- **🍃 MongoDB** - NoSQL database
- **📦 Mongoose** - Elegant MongoDB object modeling

### Development Tools
- **🔧 Nodemon** - Auto-restart development server
- **🎯 ESLint** - Code quality and consistency
- **🔍 Postman** - API testing (collection included)

---

## 🏁 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
```bash
node --version  # v14.0.0 or higher
npm --version   # v6.0.0 or higher
```

You'll also need either:
- MongoDB installed locally, OR
- MongoDB Atlas account (free tier available)

### Installation

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/gaurav1Nn/CleanFanatics.git
cd CleanFanatics
```

#### 2️⃣ Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cleanfanatics
# OR for MongoDB Atlas:
# MONGODB_URI=mongo_db url

JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```
```bash
# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

#### 3️⃣ Frontend Setup

Open a new terminal window:
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`



## 📁 Project Structure
```
CleanFanatics/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── customer/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── BookingForm.jsx
│   │   │   │   └── BookingCard.jsx
│   │   │   ├── provider/
│   │   │   │   ├── ProviderDashboard.jsx
│   │   │   │   └── JobCard.jsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── Analytics.jsx
│   │   │   │   └── UserManagement.jsx
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── LoadingSpinner.jsx
│   │   │   └── auth/
│   │   │       └── Login.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Services.jsx
│   │   │   └── Contact.jsx
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── helpers.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Booking.js
│   │   │   └── Service.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── bookings.js
│   │   │   ├── users.js
│   │   │   └── admin.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── bookingController.js
│   │   │   └── adminController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── config/
│   │   │   └── database.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── docs/
│   ├── API.md
│   └── SETUP.md
├── .gitignore
├── LICENSE
└── README.md
```

---

## ⚙️ Configuration

### Environment Variables

#### Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/cleanfanatics
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cleanfanatics

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d

# Demo Mode
DEMO_MODE=true

# CORS
CORS_ORIGIN=http://localhost:5173
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=CleanFanatics
```

### MongoDB Setup

#### Option 1: Local MongoDB
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod --dbpath /path/to/data/directory
```

#### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Add it to your `.env` file

---

## 📚 API Reference

### Base URL
```
http://localhost:5000/api
```

### Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Endpoints

#### 🔐 Authentication

**Login (Demo Mode)**
```http
POST /api/auth/demo-login
Content-Type: application/json

{
  "role": "customer" | "provider" | "admin",
  "name": "John Customer"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Customer",
    "role": "customer"
  }
}
```

#### 📋 Bookings

**Get All Bookings**
```http
GET /api/bookings
Authorization: Bearer {token}
```

**Create Booking**
```http
POST /api/bookings
Authorization: Bearer {token}
Content-Type: application/json

{
  "serviceType": "cleaning",
  "scheduledDate": "2024-01-25",
  "scheduledTime": "10:00",
  "address": "123 Main St, City, State",
  "description": "Deep cleaning required",
  "estimatedPrice": 150
}
```

**Update Booking Status**
```http
PATCH /api/bookings/:id/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "accepted" | "in_progress" | "completed" | "cancelled"
}
```

**Cancel Booking**
```http
DELETE /api/bookings/:id
Authorization: Bearer {token}
```

#### 👥 Provider Routes

**Get Assigned Jobs**
```http
GET /api/provider/jobs
Authorization: Bearer {token}
```

**Accept Job**
```http
POST /api/provider/jobs/:id/accept
Authorization: Bearer {token}
```

#### 👨‍💼 Admin Routes

**Get Dashboard Stats**
```http
GET /api/admin/stats
Authorization: Bearer {token}
```

**Assign Provider to Booking**
```http
POST /api/admin/bookings/:id/assign
Authorization: Bearer {token}
Content-Type: application/json

{
  "providerId": "provider_id_here"
}
```

**Get System Logs**
```http
GET /api/admin/logs
Authorization: Bearer {token}
```

### Error Response Format
```json
{
  "success": false,
  "error": "Error message here",
  "statusCode": 400
}
```





## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--primary-blue: #3B82F6
--primary-indigo: #6366F1

/* Neutrals */
--gray-50: #F9FAFB
--gray-100: #F3F4F6
--gray-200: #E5E7EB
--gray-700: #374151
--gray-900: #111827

/* Status Colors */
--success: #10B981
--warning: #F59E0B
--error: #EF4444
--info: #3B82F6
```

### Typography

- **Font Family**: Inter, system-ui, sans-serif
- **Headings**: Bold, 600-700 weight
- **Body**: Regular, 400 weight
- **Small Text**: 14px, 500 weight

---

## 🗺️ Roadmap

### ✅ Version 1.0.0 (Current)
- [x] Customer booking system
- [x] Provider job management
- [x] Admin dashboard with analytics
- [x] Real-time status tracking
- [x] Demo mode authentication
- [x] Responsive design

### 🚧 Version 1.1.0 (In Progress)
- [ ] Email notifications
- [ ] SMS alerts for job updates
- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Customer reviews and ratings
- [ ] Provider availability calendar

### 🔮 Version 2.0.0 (Planned)
- [ ] Real-time chat between customer and provider
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Service history and recommendations
- [ ] Loyalty rewards program

### 💡 Future Enhancements
- [ ] AI-powered service recommendations
- [ ] Automated provider matching
- [ ] Video consultation feature
- [ ] IoT device integration
- [ ] Subscription-based services

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
```bash
   git checkout -b feature/AmazingFeature
```
3. **Commit your changes**
```bash
   git commit -m 'Add some AmazingFeature'
```
4. **Push to the branch**
```bash
   git push origin feature/AmazingFeature
```
5. **Open a Pull Request**

### Coding Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed
- Test your changes thoroughly

---

## 🐛 Known Issues

- [ ] Booking calendar may show incorrect timezone in some cases
- [ ] Provider dashboard refresh needed after status update
- [ ] Mobile view: Long addresses may overflow on small screens

See [Issues](https://github.com/gaurav1Nn/CleanFanatics/issues) for a complete list.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```
MIT License

Copyright (c) 2024 Gaurav

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👤 Contact

**Gaurav**

- GitHub: [@gaurav1Nn](https://github.com/gaurav1Nn)
- Email: your.email@example.com
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)

**Project Link**: [https://github.com/gaurav1Nn/CleanFanatics](https://github.com/gaurav1Nn/CleanFanatics)

---

## 🙏 Acknowledgments

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Express.js](https://expressjs.com)
- [Vite](https://vitejs.dev)
- Icons by [Heroicons](https://heroicons.com)
- Inspiration from modern SaaS platforms

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/gaurav1Nn/CleanFanatics?style=social)
![GitHub forks](https://img.shields.io/github/forks/gaurav1Nn/CleanFanatics?style=social)
![GitHub issues](https://img.shields.io/github/issues/gaurav1Nn/CleanFanatics)
![GitHub last commit](https://img.shields.io/github/last-commit/gaurav1Nn/CleanFanatics)

---

<p align="center">
  <b>Made with ❤️ by Gaurav</b>
</p>

<p align="center">
  ⭐ Star this repo if you find it helpful!
</p>

<p align="center">
  <a href="#cleanfanatics---home-services-booking-platform-">Back to Top ⬆️</a>
</p>
