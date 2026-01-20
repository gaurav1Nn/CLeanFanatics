import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EventLogsPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({});
    const [pagination, setPagination] = useState({ page: 1, pages: 1 });

    useEffect(() => {
        fetchLogs();
    }, [filter, pagination.page]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await adminAPI.getEventLogs({ ...filter, page: pagination.page });
            setLogs(response.data.data);
            setPagination({
                page: response.data.page,
                pages: response.data.pages
            });
        } catch (err) {
            console.error('Failed to fetch logs:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatTimestamp = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getActionConfig = (action) => {
        const configs = {
            BOOKING_CREATED: { color: '#34d399', bg: 'rgba(16, 185, 129, 0.12)', icon: '✨' },
            BOOKING_CANCELLED: { color: '#f87171', bg: 'rgba(239, 68, 68, 0.12)', icon: '❌' },
            BOOKING_ACCEPTED: { color: '#a78bfa', bg: 'rgba(139, 92, 246, 0.12)', icon: '✅' },
            PROVIDER_ASSIGNED: { color: '#60a5fa', bg: 'rgba(59, 130, 246, 0.12)', icon: '👤' },
            PROVIDER_REJECTED: { color: '#fb923c', bg: 'rgba(249, 115, 22, 0.12)', icon: '🚫' },
            SERVICE_STARTED: { color: '#22d3ee', bg: 'rgba(6, 182, 212, 0.12)', icon: '▶️' },
            SERVICE_COMPLETED: { color: '#34d399', bg: 'rgba(16, 185, 129, 0.12)', icon: '🎉' },
            STATUS_OVERRIDE: { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.12)', icon: '⚡' },
            MANUAL_ASSIGNMENT: { color: '#818cf8', bg: 'rgba(99, 102, 241, 0.12)', icon: '👆' },
            NO_SHOW: { color: '#f87171', bg: 'rgba(239, 68, 68, 0.12)', icon: '👻' },
            AUTO_CANCELLED: { color: '#f87171', bg: 'rgba(239, 68, 68, 0.12)', icon: '⏰' }
        };
        return configs[action] || { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.12)', icon: '📝' };
    };

    const actionOptions = [
        'BOOKING_CREATED',
        'BOOKING_CANCELLED',
        'BOOKING_ACCEPTED',
        'PROVIDER_ASSIGNED',
        'PROVIDER_REJECTED',
        'SERVICE_STARTED',
        'SERVICE_COMPLETED',
        'STATUS_OVERRIDE',
        'MANUAL_ASSIGNMENT',
        'NO_SHOW'
    ];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    Event Logs
                </h1>
                <p className="text-gray-400">View all booking events and audit trail</p>
            </div>

            {/* Filters */}
            <div
                className="p-4 lg:p-5 rounded-2xl"
                style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.5) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
            >
                <div className="flex flex-wrap gap-3 items-center">
                    <input
                        type="text"
                        placeholder="🔍 Search by Booking ID..."
                        value={filter.bookingId || ''}
                        onChange={(e) => setFilter(prev => ({ ...prev, bookingId: e.target.value || undefined }))}
                        className="input-field"
                        style={{ width: 'auto', minWidth: '240px' }}
                    />
                    <select
                        value={filter.action || ''}
                        onChange={(e) => setFilter(prev => ({ ...prev, action: e.target.value || undefined }))}
                        className="select-field"
                        style={{ width: 'auto', minWidth: '180px' }}
                    >
                        <option value="">All Actions</option>
                        {actionOptions.map(action => (
                            <option key={action} value={action}>{action.replace(/_/g, ' ')}</option>
                        ))}
                    </select>
                    <button onClick={() => setFilter({})} className="btn-secondary text-sm">
                        Clear
                    </button>
                    <button onClick={fetchLogs} className="btn-primary text-sm inline-flex items-center gap-2">
                        <span>🔄</span> Refresh
                    </button>
                </div>
            </div>

            {/* Logs List */}
            {loading ? (
                <LoadingSpinner text="Loading logs..." />
            ) : logs.length === 0 ? (
                <div
                    className="p-12 lg:p-16 rounded-2xl text-center"
                    style={{
                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.4) 100%)',
                        border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}
                >
                    <span className="text-6xl lg:text-7xl mb-6 block">📜</span>
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">No logs found</h3>
                    <p className="text-gray-400 text-lg">Event logs will appear here as actions are performed</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {logs.map((log) => {
                        const config = getActionConfig(log.action);
                        return (
                            <div
                                key={log._id}
                                className="p-5 lg:p-6 rounded-2xl transition-all duration-300 hover:translate-y-[-2px]"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.6) 100%)',
                                    border: '1px solid rgba(255, 255, 255, 0.06)'
                                }}
                            >
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                        {/* Action Badge */}
                                        <div
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold self-start"
                                            style={{
                                                background: config.bg,
                                                color: config.color,
                                                border: `1px solid ${config.color}25`
                                            }}
                                        >
                                            <span>{config.icon}</span>
                                            <span>{log.action.replace(/_/g, ' ')}</span>
                                        </div>

                                        {/* Details */}
                                        <div>
                                            <p className="text-sm mb-2">
                                                <span className="text-gray-400">Booking:</span>{' '}
                                                <span
                                                    className="font-mono text-xs px-3 py-1 rounded-lg"
                                                    style={{
                                                        background: 'rgba(255, 255, 255, 0.06)',
                                                        border: '1px solid rgba(255, 255, 255, 0.08)'
                                                    }}
                                                >
                                                    {log.bookingId}
                                                </span>
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                By: <span className="text-white font-medium">{log.performedByName || log.performedBy || log.performedByRole}</span>
                                                <span
                                                    className="ml-2 text-xs px-2 py-0.5 rounded-md"
                                                    style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#818cf8' }}
                                                >
                                                    {log.performedByRole}
                                                </span>
                                            </p>
                                            {log.details && Object.keys(log.details).length > 0 && (
                                                <div
                                                    className="mt-3 text-xs rounded-xl overflow-hidden"
                                                    style={{
                                                        background: 'rgba(0, 0, 0, 0.2)',
                                                        border: '1px solid rgba(255, 255, 255, 0.04)'
                                                    }}
                                                >
                                                    <pre className="p-3 overflow-x-auto text-gray-400">
                                                        {JSON.stringify(log.details, null, 2)}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Timestamp */}
                                    <div
                                        className="text-sm px-4 py-2 rounded-lg self-start"
                                        style={{ background: 'rgba(255, 255, 255, 0.04)', color: '#94a3b8' }}
                                    >
                                        🕐 {formatTimestamp(log.timestamp)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div
                            className="flex flex-wrap justify-center items-center gap-4 mt-8 p-4 rounded-xl"
                            style={{ background: 'rgba(255, 255, 255, 0.02)' }}
                        >
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                                disabled={pagination.page === 1}
                                className="btn-secondary text-sm"
                                style={{ opacity: pagination.page === 1 ? 0.5 : 1 }}
                            >
                                ← Previous
                            </button>
                            <span
                                className="px-4 py-2 rounded-lg text-sm"
                                style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc' }}
                            >
                                Page {pagination.page} of {pagination.pages}
                            </span>
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                                disabled={pagination.page === pagination.pages}
                                className="btn-secondary text-sm"
                                style={{ opacity: pagination.page === pagination.pages ? 0.5 : 1 }}
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EventLogsPage;
