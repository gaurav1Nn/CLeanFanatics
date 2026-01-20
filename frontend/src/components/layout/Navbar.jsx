import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout, isCustomer, isProvider, isAdmin } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navLinks = () => {
        if (isCustomer) {
            return [
                { path: '/bookings/new', label: 'New Booking', icon: '➕', shortLabel: 'New' },
                { path: '/bookings', label: 'My Bookings', icon: '📋', shortLabel: 'Bookings' }
            ];
        }
        if (isProvider) {
            return [
                { path: '/provider', label: 'My Jobs', icon: '🔧', shortLabel: 'Jobs' }
            ];
        }
        if (isAdmin) {
            return [
                { path: '/admin', label: 'Dashboard', icon: '📊', shortLabel: 'Dashboard' },
                { path: '/admin/logs', label: 'Event Logs', icon: '📜', shortLabel: 'Logs' }
            ];
        }
        return [];
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin': return 'from-red-500 to-pink-600';
            case 'provider': return 'from-blue-500 to-cyan-600';
            case 'customer': return 'from-green-500 to-emerald-600';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    return (
        <nav className="flex items-center justify-between gap-4 w-full">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <span
                    className="text-2xl sm:text-3xl transition-transform duration-300 hover:scale-110 hover:rotate-12"
                    style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))' }}
                >
                    🧹
                </span>
                <span
                    className="text-lg sm:text-xl font-bold hidden sm:inline"
                    style={{
                        background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 40%, #a78bfa 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}
                >
                    CleanFanatics
                </span>
            </Link>

            {/* Navigation Links & User */}
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto flex-shrink min-w-0">
                {navLinks().map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap ${isActive(link.path)
                                ? 'text-white'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        style={isActive(link.path) ? {
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.2) 100%)',
                            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.2)'
                        } : {}}
                    >
                        <span className="text-sm sm:text-base">{link.icon}</span>
                        <span className="hidden sm:inline">{link.label}</span>
                        <span className="sm:hidden">{link.shortLabel}</span>
                    </Link>
                ))}

                {/* User Info */}
                {user && (
                    <div className="flex items-center gap-2 sm:gap-4 ml-2 sm:ml-4 pl-2 sm:pl-4 border-l border-white/10 flex-shrink-0">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-white truncate max-w-[120px]">{user.name}</p>
                            <span
                                className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium text-white bg-gradient-to-r ${getRoleBadgeColor(user.role)}`}
                                style={{ textTransform: 'capitalize' }}
                            >
                                {user.role}
                            </span>
                        </div>
                        <button
                            onClick={logout}
                            className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 whitespace-nowrap"
                            style={{
                                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.1) 100%)',
                                color: '#f87171',
                                border: '1px solid rgba(239, 68, 68, 0.2)'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
