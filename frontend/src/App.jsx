import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import CreateBookingPage from './pages/customer/CreateBookingPage';
import MyBookingsPage from './pages/customer/MyBookingsPage';
import ProviderDashboard from './pages/provider/ProviderDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import EventLogsPage from './pages/admin/EventLogsPage';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route element={<Layout />}>
            {/* Home - redirect based on role */}
            <Route path="/" element={<Navigate to="/bookings" replace />} />

            {/* Customer routes */}
            <Route path="/bookings" element={<MyBookingsPage />} />
            <Route path="/bookings/new" element={<CreateBookingPage />} />

            {/* Provider routes */}
            <Route path="/provider" element={<ProviderDashboard />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/logs" element={<EventLogsPage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
