import { useState, useEffect } from 'react';
import { bookingAPI } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MyBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [cancelLoading, setCancelLoading] = useState(null);

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

    const handleCancel = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;

        const reason = prompt('Please provide a reason for cancellation:');
        if (!reason) return;

        setCancelLoading(bookingId);
        try {
            await bookingAPI.cancel(bookingId, reason);
            fetchBookings();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to cancel booking');
        } finally {
            setCancelLoading(null);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const filterOptions = [
        { value: 'all', label: 'All' },
        { value: 'pending', label: 'Pending' },
        { value: 'active', label: 'Active' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
    ];

    // Helper to group active/in-progress/accepted/assigned under 'active'
    const getFilteredBookings = () => {
        if (filter === 'all') return bookings;
        if (filter === 'active') {
            return bookings.filter(b => ['assigned', 'accepted', 'in-progress'].includes(b.status));
        }
        return bookings.filter(b => b.status === filter);
    };

    const displayBookings = getFilteredBookings();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-6 sm:px-6 sm:py-8">
            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Bookings</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage all your service appointments.</p>
                </div>

                {/* Filters - Horizontal scroll on mobile */}
                <div className="border-b border-gray-200 -mx-4 px-4 sm:mx-0 sm:px-0">
                    <nav className="-mb-px flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide">
                        {filterOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setFilter(option.value)}
                                className={`whitespace-nowrap pb-3 sm:pb-4 px-1 border-b-2 font-medium text-sm transition-colors flex-shrink-0 ${filter === option.value
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
                ) : displayBookings.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new service request.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:gap-6">
                        {displayBookings.map((booking) => (
                            <div key={booking._id} className="card p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow">
                                {/* Mobile Layout */}
                                <div className="space-y-4">
                                    {/* Header with service name and status */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-grow min-w-0">
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 capitalize">
                                                {booking.serviceType} Service
                                            </h3>
                                            <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="truncate">{formatDate(booking.scheduledDate)} • {booking.scheduledTime}</span>
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <StatusBadge status={booking.status} />
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-3 text-sm">
                                        <div className="flex gap-3">
                                            <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="text-gray-600 flex-grow">{booking.address}</span>
                                        </div>

                                        <div className="flex gap-3">
                                            <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="text-gray-600 flex-grow">
                                                <span className="font-medium text-gray-900">
                                                    {booking.provider ? booking.provider.name : 'Pending Assignment'}
                                                </span>
                                            </span>
                                        </div>
                                    </div>

                                    {booking.description && (
                                        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                                            <p>{booking.description}</p>
                                        </div>
                                    )}

                                    {/* Action button */}
                                    {['pending', 'assigned'].includes(booking.status) && (
                                        <div className="pt-2">
                                            <button
                                                onClick={() => handleCancel(booking._id)}
                                                disabled={cancelLoading === booking._id}
                                                className="w-full sm:w-auto text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2.5 rounded-lg transition-colors border border-red-200"
                                            >
                                                {cancelLoading === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookingsPage;

