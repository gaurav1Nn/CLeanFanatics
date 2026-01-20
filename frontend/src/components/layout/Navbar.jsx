import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout, isCustomer, isProvider, isAdmin } = useAuth();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 font-semibold text-lg text-gray-900">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>CleanFanatics</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {/* Nav Links */}
                        <div className="flex items-center gap-6">
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
                                <div className="flex items-center gap-3">
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

                    {/* Mobile Menu Button (for customers only) */}
                    {isCustomer && (
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    )}

                    {/* Non-customer mobile user info */}
                    {(isProvider || isAdmin) && (
                        <div className="md:hidden flex items-center gap-3">
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

            {/* Mobile Menu (customers only) */}
            {isCustomer && mobileMenuOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white">
                    <div className="px-4 py-3 space-y-1">
                        {/* Nav Links */}
                        {navLinks().map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={closeMobileMenu}
                                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${isActive(link.path)
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* User Info */}
                        {user && (
                            <>
                                <div className="px-4 py-3 mt-2 border-t border-gray-100">
                                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500 capitalize mt-0.5">{user.role}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        closeMobileMenu();
                                        logout();
                                    }}
                                    className="w-full px-4 py-3 text-left text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;