import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import ServiceIcon from '../../components/common/ServiceIcon';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MyBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [cancellingId, setCancellingId] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, [filter]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const status = filter === 'all' ? undefined : filter;
            const response = await bookingAPI.getMyBookings(status);
            setBookings(response.data.data);
        } catch (err) {
            console.error('Failed to fetch bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;

        setCancellingId(id);
        try {
            await bookingAPI.cancel(id, 'Cancelled by customer');
            fetchBookings();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to cancel booking');
        } finally {
            setCancellingId(null);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const filterOptions = [
        { value: 'all', label: 'All Bookings', icon: '📚' },
        { value: 'pending', label: 'Pending', icon: '⏳' },
        { value: 'assigned', label: 'Assigned', icon: '👤' },
        { value: 'accepted', label: 'Accepted', icon: '✅' },
        { value: 'in-progress', label: 'In Progress', icon: '🔧' },
        { value: 'completed', label: 'Completed', icon: '🎉' },
        { value: 'cancelled', label: 'Cancelled', icon: '❌' }
    ];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                        My Bookings
                    </h1>
                    <p className="text-gray-400 text-sm lg:text-base">
                        Track and manage your service requests
                    </p>
                </div>
                <Link
                    to="/bookings/new"
                    className="btn-primary inline-flex items-center justify-center gap-2 whitespace-nowrap"
                >
                    <span>➕</span>
                    <span>New Booking</span>
                </Link>
            </div>

            {/* Filter Tabs */}
            <div
                className="p-4 lg:p-5 rounded-2xl"
                style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.5) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
            >
                <div className="flex flex-wrap gap-2 lg:gap-3">
                    {filterOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setFilter(option.value)}
                            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${filter === option.value
                                    ? 'text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            style={filter === option.value ? {
                                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)'
                            } : {
                                background: 'rgba(255, 255, 255, 0.03)'
                            }}
                        >
                            <span>{option.icon}</span>
                            <span>{option.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <LoadingSpinner text="Loading bookings..." />
            ) : bookings.length === 0 ? (
                /* Empty State */
                <div
                    className="p-12 lg:p-16 rounded-2xl text-center"
                    style={{
                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.4) 100%)',
                        border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}
                >
                    <span
                        className="text-6xl lg:text-7xl mb-6 block"
                        style={{
                            animation: 'float 3s ease-in-out infinite',
                            filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3))'
                        }}
                    >
                        📋
                    </span>
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">
                        No bookings found
                    </h3>
                    <p className="text-gray-400 mb-8 text-base lg:text-lg max-w-md mx-auto">
                        {filter === 'all'
                            ? "You haven't made any bookings yet. Create your first booking to get started!"
                            : `No ${filter} bookings found.`}
                    </p>
                    <Link to="/bookings/new" className="btn-primary inline-flex items-center gap-2">
                        <span>➕</span>
                        <span>Create Your First Booking</span>
                    </Link>
                    <style>{`
                        @keyframes float {
                            0%, 100% { transform: translateY(0); }
                            50% { transform: translateY(-12px); }
                        }
                    `}</style>
                </div>
            ) : (
                /* Bookings List */
                <div className="space-y-4 lg:space-y-5">
                    {bookings.map((booking, index) => (
                        <div
                            key={booking._id}
                            className="p-5 lg:p-6 rounded-2xl transition-all duration-300 hover:translate-y-[-2px]"
                            style={{
                                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.6) 100%)',
                                border: '1px solid rgba(255, 255, 255, 0.06)',
                                animationDelay: `${index * 0.05}s`
                            }}
                        >
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                {/* Booking Info */}
                                <div className="flex items-start gap-4 lg:gap-5">
                                    <ServiceIcon type={booking.serviceType} size="lg" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-3 mb-3">
                                            <h3 className="text-lg lg:text-xl font-bold capitalize text-white">
                                                {booking.serviceType} Service
                                            </h3>
                                            <StatusBadge status={booking.status} />
                                        </div>
                                        <div className="space-y-2 text-sm lg:text-base">
                                            <p className="flex items-center gap-2 text-gray-300">
                                                <span>📅</span>
                                                <span>{formatDate(booking.scheduledDate)} at {booking.scheduledTime}</span>
                                            </p>
                                            <p className="flex items-center gap-2 text-gray-300">
                                                <span>📍</span>
                                                <span className="truncate">{booking.address}</span>
                                            </p>
                                            {booking.providerName && (
                                                <p className="flex items-center gap-2 text-gray-300">
                                                    <span>👤</span>
                                                    <span>Provider: <span className="text-white font-medium">{booking.providerName}</span></span>
                                                </p>
                                            )}
                                            {booking.description && (
                                                <p className="flex items-center gap-2 text-gray-500 mt-2">
                                                    <span>💬</span>
                                                    <span className="italic truncate">{booking.description}</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                {!['completed', 'cancelled'].includes(booking.status) && (
                                    <div className="flex-shrink-0">
                                        <button
                                            onClick={() => handleCancel(booking._id)}
                                            disabled={cancellingId === booking._id}
                                            className="btn-danger text-sm px-5 py-2.5 w-full lg:w-auto"
                                        >
                                            {cancellingId === booking._id ? 'Cancelling...' : 'Cancel'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Status History */}
                            {booking.statusHistory && booking.statusHistory.length > 1 && (
                                <div
                                    className="mt-5 pt-5"
                                    style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}
                                >
                                    <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">
                                        Recent Activity
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {booking.statusHistory.slice(-3).map((history, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg text-gray-400"
                                                style={{
                                                    background: 'rgba(255, 255, 255, 0.04)',
                                                    border: '1px solid rgba(255, 255, 255, 0.06)'
                                                }}
                                            >
                                                <span className="capitalize">{history.status}</span>
                                                <span className="text-gray-600">•</span>
                                                <span className="text-gray-500">
                                                    {new Date(history.changedAt).toLocaleString()}
                                                </span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookingsPage;
