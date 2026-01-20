import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout, isCustomer, isProvider, isAdmin } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navLinks = () => {
        if (isCustomer) {
            return [
                { path: '/bookings/new', label: 'New Booking' },
                { path: '/bookings', label: 'My Bookings' }
            ];
        }
        if (isProvider) {
            return [
                { path: '/provider', label: 'Dashboard' }
            ];
        }
        if (isAdmin) {
            return [
                { path: '/admin', label: 'Dashboard' },
                { path: '/admin/logs', label: 'Logs' }
            ];
        }
        return [];
    };

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 font-semibold text-lg text-gray-900">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>CleanFanatics</span>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center gap-8">
                        {/* Nav Links */}
                        <div className="hidden md:flex items-center gap-6">
                            {navLinks().map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`text-sm font-medium transition-colors ${isActive(link.path)
                                            ? 'text-blue-600'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* User Info */}
                        {user && (
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:flex items-center gap-3">
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={logout}
                                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;