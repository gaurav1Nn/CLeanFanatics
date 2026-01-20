import { useState, useEffect } from 'react';
import { providerAPI } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
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
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleAction('accept', booking._id)}
                            disabled={isLoading('accept')}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                            {isLoading('accept') ? '...' : 'Accept Job'}
                        </button>
                        <button
                            onClick={() => handleAction('reject', booking._id)}
                            disabled={isLoading('reject')}
                            className="bg-white text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                        >
                            {isLoading('reject') ? '...' : 'Reject'}
                        </button>
                    </div>
                );
            case 'accepted':
                return (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleAction('start', booking._id)}
                            disabled={isLoading('start')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            {isLoading('start') ? '...' : 'Start Job'}
                        </button>
                        <button
                            onClick={() => handleAction('cancel', booking._id)}
                            disabled={isLoading('cancel')}
                            className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm"
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
                        className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors w-full md:w-auto"
                    >
                        {isLoading('complete') ? '...' : 'Mark Complete'}
                    </button>
                );
            default:
                return null;
        }
    };

    const filterOptions = [
        { value: 'all', label: 'All Jobs' },
        { value: 'assigned', label: 'New' },
        { value: 'accepted', label: 'Accepted' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' }
    ];

    const stats = {
        assigned: bookings.filter(b => b.status === 'assigned').length,
        accepted: bookings.filter(b => b.status === 'accepted').length,
        inProgress: bookings.filter(b => b.status === 'in-progress').length,
        completed: bookings.filter(b => b.status === 'completed').length
    };

    const statCards = [
        { label: 'New Jobs', value: stats.assigned, color: 'bg-blue-50 text-blue-700' },
        { label: 'To Do', value: stats.accepted, color: 'bg-purple-50 text-purple-700' },
        { label: 'In Progress', value: stats.inProgress, color: 'bg-indigo-50 text-indigo-700' },
        { label: 'Completed', value: stats.completed, color: 'bg-green-50 text-green-700' }
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
                    <p className="text-gray-500 mt-1">Manage your jobs and tasks.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statCards.map((stat) => (
                    <div key={stat.label} className={`p-4 rounded-xl border border-transparent ${stat.color}`}>
                        <p className="text-3xl font-bold mb-1">{stat.value}</p>
                        <p className="text-sm font-medium opacity-80">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="border-b border-gray-200 overflow-x-auto">
                <nav className="-mb-px flex gap-6 min-w-max">
                    {filterOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setFilter(option.value)}
                            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${filter === option.value
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* List */}
            {loading ? (
                <div className="py-12 flex justify-center">
                    <LoadingSpinner text="" />
                </div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500">No jobs found.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="card p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-grow space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-semibold text-lg text-gray-900 capitalize">
                                                {booking.serviceType}
                                            </h3>
                                            <StatusBadge status={booking.status} />
                                        </div>
                                        <span className="text-xs font-mono text-gray-400">ID: {booking._id.slice(-6)}</span>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                                        <div className="space-y-1">
                                            <p className="font-medium text-gray-900">Schedule</p>
                                            <p>{formatDate(booking.scheduledDate)} at {booking.scheduledTime}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium text-gray-900">Location</p>
                                            <p>{booking.address}</p>
                                        </div>
                                    </div>

                                    {booking.description && (
                                        <div className="p-3 bg-gray-50 rounded text-sm text-gray-600">
                                            {booking.description}
                                        </div>
                                    )}

                                    {booking.customerName && (
                                        <div className="flex items-center gap-2 text-sm text-gray-500 border-t border-gray-100 pt-3">
                                            <span className="font-medium text-gray-900">Customer:</span>
                                            <span>{booking.customerName}</span>
                                            {booking.customerPhone && (
                                                <span className="text-gray-300">|</span>
                                            )}
                                            {booking.customerPhone && (
                                                <span className="font-mono">{booking.customerPhone}</span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-start md:items-center">
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
