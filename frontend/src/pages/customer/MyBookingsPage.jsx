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
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const filterOptions = [
        { value: 'all', label: 'All Bookings' },
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
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
                <p className="text-gray-500 mt-1">Manage all your service appointments.</p>
            </div>

            {/* Filters */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex gap-6">
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
            ) : displayBookings.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new service request.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {displayBookings.map((booking) => (
                        <div key={booking._id} className="card p-6 transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="space-y-4 flex-grow">
                                    <div className="flex items-start justify-between md:justify-start gap-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 capitalize">
                                                {booking.serviceType} Service
                                            </h3>
                                            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {formatDate(booking.scheduledDate)} • {booking.scheduledTime}
                                            </p>
                                        </div>
                                        <div className="md:hidden">
                                            <StatusBadge status={booking.status} />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                        <div className="flex gap-3">
                                            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="text-gray-600">{booking.address}</span>
                                        </div>

                                        <div className="flex gap-3">
                                            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="text-gray-600">
                                                Provider: <span className="font-medium text-gray-900">{booking.provider ? booking.provider.name : 'Pending Assignment'}</span>
                                            </span>
                                        </div>
                                    </div>

                                    {booking.description && (
                                        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                                            <p>{booking.description}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 min-w-[140px]">
                                    <div className="hidden md:block">
                                        <StatusBadge status={booking.status} />
                                    </div>

                                    {['pending', 'assigned'].includes(booking.status) && (
                                        <button
                                            onClick={() => handleCancel(booking._id)}
                                            disabled={cancelLoading === booking._id}
                                            className="text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors w-full md:w-auto text-right"
                                        >
                                            {cancelLoading === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookingsPage;
