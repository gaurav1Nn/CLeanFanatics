import { useState, useEffect } from 'react';
import { providerAPI } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import ServiceIcon from '../../components/common/ServiceIcon';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ProviderDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, [filter]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const status = filter === 'all' ? undefined : filter;
            const response = await providerAPI.getAssignedBookings(status);
            setBookings(response.data.data);
        } catch (err) {
            console.error('Failed to fetch bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action, bookingId) => {
        setActionLoading(`${action}-${bookingId}`);
        try {
            switch (action) {
                case 'accept':
                    await providerAPI.accept(bookingId);
                    break;
                case 'reject':
                    const reason = prompt('Please provide a reason for rejection:');
                    if (!reason) { setActionLoading(null); return; }
                    await providerAPI.reject(bookingId, reason);
                    break;
                case 'start':
                    await providerAPI.start(bookingId);
                    break;
                case 'complete':
                    const notes = prompt('Any completion notes? (optional)');
                    await providerAPI.complete(bookingId, notes);
                    break;
                case 'cancel':
                    const cancelReason = prompt('Please provide a reason for cancellation:');
                    if (!cancelReason) { setActionLoading(null); return; }
                    await providerAPI.cancel(bookingId, cancelReason);
                    break;
            }
            fetchBookings();
        } catch (err) {
            alert(err.response?.data?.message || `Failed to ${action} booking`);
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const getActionButtons = (booking) => {
        const isLoading = (action) => actionLoading === `${action}-${booking._id}`;

        switch (booking.status) {
            case 'assigned':
                return (
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleAction('accept', booking._id)}
                            disabled={isLoading('accept')}
                            className="btn-success text-sm px-4 py-2"
                        >
                            {isLoading('accept') ? '...' : '✅ Accept'}
                        </button>
                        <button
                            onClick={() => handleAction('reject', booking._id)}
                            disabled={isLoading('reject')}
                            className="btn-danger text-sm px-4 py-2"
                        >
                            {isLoading('reject') ? '...' : '❌ Reject'}
                        </button>
                    </div>
                );
            case 'accepted':
                return (
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleAction('start', booking._id)}
                            disabled={isLoading('start')}
                            className="btn-primary text-sm px-4 py-2"
                        >
                            {isLoading('start') ? '...' : '▶️ Start Service'}
                        </button>
                        <button
                            onClick={() => handleAction('cancel', booking._id)}
                            disabled={isLoading('cancel')}
                            className="btn-secondary text-sm px-4 py-2"
                        >
                            Cancel
                        </button>
                    </div>
                );
            case 'in-progress':
                return (
                    <button
                        onClick={() => handleAction('complete', booking._id)}
                        disabled={isLoading('complete')}
                        className="btn-success text-sm px-4 py-2"
                    >
                        {isLoading('complete') ? '...' : '🎉 Complete'}
                    </button>
                );
            default:
                return null;
        }
    };

    const filterOptions = [
        { value: 'all', label: 'All Jobs', icon: '📚' },
        { value: 'assigned', label: 'New', icon: '🆕' },
        { value: 'accepted', label: 'Accepted', icon: '✅' },
        { value: 'in-progress', label: 'In Progress', icon: '🔧' },
        { value: 'completed', label: 'Completed', icon: '🎉' }
    ];

    const stats = {
        assigned: bookings.filter(b => b.status === 'assigned').length,
        accepted: bookings.filter(b => b.status === 'accepted').length,
        inProgress: bookings.filter(b => b.status === 'in-progress').length,
        completed: bookings.filter(b => b.status === 'completed').length
    };

    const statCards = [
        { label: 'New Jobs', value: stats.assigned, color: '#3b82f6', icon: '🆕' },
        { label: 'Accepted', value: stats.accepted, color: '#8b5cf6', icon: '✅' },
        { label: 'In Progress', value: stats.inProgress, color: '#06b6d4', icon: '🔧' },
        { label: 'Completed', value: stats.completed, color: '#10b981', icon: '🎉' }
    ];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    Provider Dashboard
                </h1>
                <p className="text-gray-400">Manage your assigned jobs</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                {statCards.map((stat) => (
                    <div
                        key={stat.label}
                        className="p-5 rounded-2xl text-center"
                        style={{
                            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.6) 100%)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            borderLeft: `4px solid ${stat.color}`
                        }}
                    >
                        <div className="text-2xl mb-2">{stat.icon}</div>
                        <p className="text-3xl lg:text-4xl font-bold text-white mb-1">{stat.value}</p>
                        <p className="text-sm text-gray-400">{stat.label}</p>
                    </div>
                ))}
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

            {/* Jobs List */}
            {loading ? (
                <LoadingSpinner text="Loading jobs..." />
            ) : bookings.length === 0 ? (
                <div
                    className="p-12 lg:p-16 rounded-2xl text-center"
                    style={{
                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.4) 100%)',
                        border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}
                >
                    <span className="text-6xl lg:text-7xl mb-6 block">🔧</span>
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">No jobs found</h3>
                    <p className="text-gray-400 text-lg">
                        {filter === 'all' ? "You don't have any assigned jobs yet" : `No ${filter} jobs`}
                    </p>
                </div>
            ) : (
                <div className="space-y-4 lg:space-y-5">
                    {bookings.map((booking) => (
                        <div
                            key={booking._id}
                            className="p-5 lg:p-6 rounded-2xl transition-all duration-300 hover:translate-y-[-2px]"
                            style={{
                                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.6) 100%)',
                                border: '1px solid rgba(255, 255, 255, 0.06)'
                            }}
                        >
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                <div className="flex items-start gap-4 lg:gap-5">
                                    <ServiceIcon type={booking.serviceType} size="lg" />
                                    <div>
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
                                                <span>{booking.address}</span>
                                            </p>
                                            <p className="flex items-center gap-2 text-gray-300">
                                                <span>👤</span>
                                                <span>Customer: <span className="text-white font-medium">{booking.customerName || 'N/A'}</span></span>
                                            </p>
                                            {booking.customerPhone && (
                                                <p className="flex items-center gap-2 text-gray-300">
                                                    <span>📞</span>
                                                    <span>{booking.customerPhone}</span>
                                                </p>
                                            )}
                                            {booking.description && (
                                                <p className="flex items-center gap-2 text-gray-500 mt-2">
                                                    <span>💬</span>
                                                    <span className="italic">{booking.description}</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    {getActionButtons(booking)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProviderDashboard;
