# CleanFanatics - Home Services Booking Platform 🧹

CleanFanatics is a modern, full-stack MERN application designed to streamline the home services booking process. It connects customers with service providers (cleaners, plumbers, electricians) through a seamless, responsive, and professional interface.

## 🚀 Features

### 👤 Customer Portal
- **Dashboard**: View all bookings with status tracking.
- **Service Booking**: Easy multi-step booking wizard for Cleaning, Plumbing, and Electrical services.
- **Real-time Status**: Track bookings from Pending → Assigned → Accepted → In Progress → Completed.
- **Cancellation**: Ability to cancel bookings before they are started.

### 🔧 Provider Dashboard
- **Job Management**: View assigned jobs in a kanban-style or list view.
- **Workflow Actions**: Accept, Start, and Complete jobs with one click.
- **Communication**: View customer details and location.

### 👨‍💼 Admin Dashboard
- **System Overview**: High-level stats on bookings and provider performance.
- **Operations**: Manual provider assignment and status overrides.
- **Logs**: event logs for all system activities.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS (Custom Design System)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: Role-based Auth (Customer/Provider/Admin) - *Demo Mode enabled*

## 🏁 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas URI)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gaurav1Nn/CleanFanatics.git
   cd CleanFanatics
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create a .env file with your MONGODB_URI and PORT=5000
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the App**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🔑 Demo Credentials

The application runs in **Demo Mode**, so no registration is required. You can instantly login as:

- **Customer**: `John Customer`
- **Provider**: `Mike Cleaner`, `Sam Plumber`, `Alex Electrician`
- **Admin**: `Admin User`

## 🎨 Design

The UI is built with a focus on:
- **Professionalism**: Clean whites, grays, and brand colors (Blue/Indigo).
- **Responsiveness**: Fully optimized for mobile and desktop.
- **UX**: Clear visual feedback, loading states, and intuitive navigation.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
