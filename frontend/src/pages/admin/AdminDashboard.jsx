import { useState, useEffect } from 'react';
import { adminAPI, authAPI } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import ServiceIcon from '../../components/common/ServiceIcon';
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

    const handleMarkNoShow = async (bookingId, type) => {
        if (!window.confirm(`Mark this booking as ${type} no-show?`)) return;

        setActionLoading(`noshow-${bookingId}`);
        try {
            await adminAPI.markNoShow(bookingId, type);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to mark no-show');
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
        { label: 'Total', value: stats.total, color: '#6366f1', icon: '📊' },
        { label: 'Pending', value: stats.pending, color: '#f59e0b', icon: '⏳' },
        { label: 'Assigned', value: stats.assigned, color: '#3b82f6', icon: '👤' },
        { label: 'In Progress', value: stats.inProgress, color: '#06b6d4', icon: '🔧' },
        { label: 'Completed', value: stats.completed, color: '#10b981', icon: '🎉' },
        { label: 'Cancelled', value: stats.cancelled, color: '#ef4444', icon: '❌' }
    ] : [];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    Admin Dashboard
                </h1>
                <p className="text-gray-400">Manage all bookings and operations</p>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {statCards.map((stat) => (
                        <div
                            key={stat.label}
                            className="p-4 lg:p-5 rounded-2xl text-center"
                            style={{
                                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.6) 100%)',
                                border: '1px solid rgba(255, 255, 255, 0.06)',
                                borderLeft: `4px solid ${stat.color}`
                            }}
                        >
                            <div className="text-xl mb-1">{stat.icon}</div>
                            <p className="text-2xl lg:text-3xl font-bold mb-1" style={{ color: stat.color }}>
                                {stat.value}
                            </p>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Filters */}
            <div
                className="p-4 lg:p-5 rounded-2xl"
                style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.5) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
            >
                <div className="flex flex-wrap gap-3 items-center">
                    <select
                        value={filter.status || ''}
                        onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value || undefined }))}
                        className="select-field"
                        style={{ width: 'auto', minWidth: '160px' }}
                    >
                        <option value="">All Statuses</option>
                        {statusOptions.map(status => (
                            <option key={status} value={status} className="capitalize">{status}</option>
                        ))}
                    </select>
                    <select
                        value={filter.serviceType || ''}
                        onChange={(e) => setFilter(prev => ({ ...prev, serviceType: e.target.value || undefined }))}
                        className="select-field"
                        style={{ width: 'auto', minWidth: '160px' }}
                    >
                        <option value="">All Services</option>
                        <option value="cleaning">🧹 Cleaning</option>
                        <option value="plumbing">🔧 Plumbing</option>
                        <option value="electrical">⚡ Electrical</option>
                    </select>
                    <button
                        onClick={() => setFilter({})}
                        className="btn-secondary text-sm"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Bookings Table */}
            {loading ? (
                <LoadingSpinner text="Loading bookings..." />
            ) : (
                <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.6) 100%)',
                        border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}
                >
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead>
                                <tr style={{
                                    background: 'rgba(15, 23, 42, 0.8)',
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                                }}>
                                    <th className="text-left p-4 lg:p-5 text-sm font-semibold text-gray-300 uppercase tracking-wider">Service</th>
                                    <th className="text-left p-4 lg:p-5 text-sm font-semibold text-gray-300 uppercase tracking-wider">Customer</th>
                                    <th className="text-left p-4 lg:p-5 text-sm font-semibold text-gray-300 uppercase tracking-wider">Provider</th>
                                    <th className="text-left p-4 lg:p-5 text-sm font-semibold text-gray-300 uppercase tracking-wider">Schedule</th>
                                    <th className="text-left p-4 lg:p-5 text-sm font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                                    <th className="text-right p-4 lg:p-5 text-sm font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking) => (
                                    <tr
                                        key={booking._id}
                                        className="transition-all duration-200 hover:bg-white/3"
                                        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}
                                    >
                                        <td className="p-4 lg:p-5">
                                            <div className="flex items-center gap-3">
                                                <ServiceIcon type={booking.serviceType} size="sm" />
                                                <span className="capitalize font-medium text-white">{booking.serviceType}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 lg:p-5 text-sm text-gray-300">
                                            {booking.customerName || booking.customer}
                                        </td>
                                        <td className="p-4 lg:p-5 text-sm text-gray-300">
                                            {booking.providerName || (booking.provider ? booking.provider :
                                                <span className="text-gray-500 italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="p-4 lg:p-5 text-sm">
                                            <div className="text-gray-300">{formatDate(booking.scheduledDate)}</div>
                                            <div className="text-xs text-gray-500 mt-1">{booking.scheduledTime}</div>
                                        </td>
                                        <td className="p-4 lg:p-5">
                                            <StatusBadge status={booking.status} />
                                        </td>
                                        <td className="p-4 lg:p-5 text-right">
                                            <div className="flex flex-wrap gap-2 justify-end">
                                                {booking.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleAssignProvider(booking._id)}
                                                        disabled={actionLoading === `assign-${booking._id}`}
                                                        className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:scale-105"
                                                        style={{
                                                            background: 'rgba(59, 130, 246, 0.15)',
                                                            color: '#60a5fa',
                                                            border: '1px solid rgba(59, 130, 246, 0.25)'
                                                        }}
                                                    >
                                                        Assign
                                                    </button>
                                                )}
                                                {['assigned', 'accepted'].includes(booking.status) && (
                                                    <button
                                                        onClick={() => handleMarkNoShow(booking._id, 'provider')}
                                                        disabled={actionLoading === `noshow-${booking._id}`}
                                                        className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:scale-105"
                                                        style={{
                                                            background: 'rgba(249, 115, 22, 0.15)',
                                                            color: '#fb923c',
                                                            border: '1px solid rgba(249, 115, 22, 0.25)'
                                                        }}
                                                    >
                                                        No-Show
                                                    </button>
                                                )}
                                                <select
                                                    value=""
                                                    onChange={(e) => {
                                                        if (e.target.value) handleOverrideStatus(booking._id, e.target.value);
                                                    }}
                                                    className="text-xs px-3 py-1.5 rounded-lg cursor-pointer font-medium"
                                                    style={{
                                                        background: 'rgba(255, 255, 255, 0.08)',
                                                        color: 'white',
                                                        border: '1px solid rgba(255, 255, 255, 0.12)'
                                                    }}
                                                >
                                                    <option value="">Override...</option>
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
                    </div>

                    {bookings.length === 0 && (
                        <div className="p-12 lg:p-16 text-center">
                            <span className="text-5xl mb-4 block">📋</span>
                            <p className="text-gray-400 text-lg">No bookings found</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
