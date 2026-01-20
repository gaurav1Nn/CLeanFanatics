import { useState, useEffect } from 'react';
import { adminAPI, authAPI } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [providers, setProviders] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({});
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchData();
    }, [filter]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [bookingsRes, statsRes, providersRes] = await Promise.all([
                adminAPI.getAllBookings(filter),
                adminAPI.getStats(),
                authAPI.getProviders()
            ]);
            setBookings(bookingsRes.data.data);
            setStats(statsRes.data.data);
            setProviders(providersRes.data.data);
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOverrideStatus = async (bookingId, newStatus) => {
        const reason = prompt('Reason for status override:');
        if (!reason) return;

        setActionLoading(`override-${bookingId}`);
        try {
            await adminAPI.overrideStatus(bookingId, newStatus, reason);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to override status');
        } finally {
            setActionLoading(null);
        }
    };

    const handleAssignProvider = async (bookingId) => {
        const booking = bookings.find(b => b._id === bookingId);
        const availableProviders = providers.filter(p =>
            p.serviceCategories?.includes(booking.serviceType)
        );

        if (availableProviders.length === 0) {
            alert('No providers available for this service type');
            return;
        }

        const providerOptions = availableProviders.map(p => `${p._id}: ${p.name}`).join('\n');
        const providerId = prompt(`Select provider ID:\n${providerOptions}`);
        if (!providerId) return;

        setActionLoading(`assign-${bookingId}`);
        try {
            await adminAPI.assignProvider(bookingId, providerId.split(':')[0].trim());
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to assign provider');
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const statusOptions = ['pending', 'assigned', 'accepted', 'in-progress', 'completed', 'cancelled'];

    const statCards = stats ? [
        { label: 'Total', value: stats.total, color: 'bg-indigo-50 text-indigo-700' },
        { label: 'Pending', value: stats.pending, color: 'bg-yellow-50 text-yellow-700' },
        { label: 'Assigned', value: stats.assigned, color: 'bg-blue-50 text-blue-700' },
        { label: 'In Progress', value: stats.inProgress, color: 'bg-sky-50 text-sky-700' },
        { label: 'Completed', value: stats.completed, color: 'bg-green-50 text-green-700' },
        { label: 'Cancelled', value: stats.cancelled, color: 'bg-red-50 text-red-700' }
    ] : [];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-1">Overview of system operations.</p>
                </div>
            </div>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {statCards.map((stat) => (
                        <div key={stat.label} className={`p-4 rounded-xl border border-transparent ${stat.color}`}>
                            <p className="text-2xl font-bold mb-1">{stat.value}</p>
                            <p className="text-xs font-bold uppercase tracking-wider opacity-80">{stat.label}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Main Content */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Filters */}
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap gap-4 items-center justify-between">
                    <h2 className="font-semibold text-gray-900">Bookings</h2>

                    <div className="flex flex-wrap gap-2">
                        <select
                            value={filter.status || ''}
                            onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value || undefined }))}
                            className="text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Statuses</option>
                            {statusOptions.map(status => (
                                <option key={status} value={status} className="capitalize">{status}</option>
                            ))}
                        </select>
                        <select
                            value={filter.serviceType || ''}
                            onChange={(e) => setFilter(prev => ({ ...prev, serviceType: e.target.value || undefined }))}
                            className="text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Services</option>
                            <option value="cleaning">Cleaning</option>
                            <option value="plumbing">Plumbing</option>
                            <option value="electrical">Electrical</option>
                        </select>
                        {/* <button
                            onClick={() => setFilter({})}
                            className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2"
                        >
                            Clear
                        </button> */}
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="py-12 flex justify-center">
                        <LoadingSpinner text="" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                    <th className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                                    <th className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {bookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900 capitalize">{booking.serviceType}</p>
                                            <p className="text-xs text-gray-400 font-mono mt-0.5">{booking._id.slice(-6)}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{booking.customerName || booking.customer}</p>
                                            <p className="text-xs text-gray-500 truncate max-w-[150px]">{booking.address}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {booking.providerName ? (
                                                <span className="text-gray-900">{booking.providerName}</span>
                                            ) : (
                                                <span className="text-gray-400 italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-gray-900">{formatDate(booking.scheduledDate)}</p>
                                            <p className="text-xs text-gray-500">{booking.scheduledTime}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={booking.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {booking.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleAssignProvider(booking._id)}
                                                        disabled={actionLoading === `assign-${booking._id}`}
                                                        className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded"
                                                    >
                                                        Assign
                                                    </button>
                                                )}
                                                <select
                                                    value=""
                                                    onChange={(e) => {
                                                        if (e.target.value) handleOverrideStatus(booking._id, e.target.value);
                                                    }}
                                                    className="text-xs border-gray-200 rounded px-2 py-1 bg-white focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                                                >
                                                    <option value="">Waitlist Action...</option>
                                                    {statusOptions.filter(s => s !== booking.status).map(status => (
                                                        <option key={status} value={status}>{status}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {bookings.length === 0 && (
                            <div className="py-12 text-center text-gray-500">
                                No bookings found
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
