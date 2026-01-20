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
        <div className="space-y-10">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    Event Logs
                </h1>
                <p className="text-gray-400 text-lg">View all booking events and audit trail</p>
            </div>

            {/* Filters */}
            <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
                <div className="flex flex-wrap gap-4 items-center">
                    <input
                        type="text"
                        placeholder="🔍 Search by Booking ID..."
                        value={filter.bookingId || ''}
                        onChange={(e) => setFilter(prev => ({ ...prev, bookingId: e.target.value || undefined }))}
                        className="input-field py-3"
                        style={{ width: 'auto', minWidth: '280px' }}
                    />
                    <select
                        value={filter.action || ''}
                        onChange={(e) => setFilter(prev => ({ ...prev, action: e.target.value || undefined }))}
                        className="select-field py-3"
                        style={{ width: 'auto', minWidth: '220px' }}
                    >
                        <option value="">All Actions</option>
                        {actionOptions.map(action => (
                            <option key={action} value={action}>{action.replace(/_/g, ' ')}</option>
                        ))}
                    </select>
                    {/* <button onClick={() => setFilter({})} className="btn-secondary text-sm py-3 px-5">
                        Clear
                    </button> */}
                    <button onClick={fetchLogs} className="btn-primary text-sm inline-flex items-center gap-2 py-3 px-5">
                        <span>🔄</span> Refresh
                    </button>
                </div>
            </div>

            {/* Logs List */}
            {loading ? (
                <div className="py-20">
                    <LoadingSpinner text="Loading logs..." />
                </div>
            ) : logs.length === 0 ? (
                <div
                    className="p-20 lg:p-24 rounded-3xl text-center border-2 border-dashed border-white/5"
                    style={{ background: 'rgba(15, 23, 42, 0.3)' }}
                >
                    <span className="text-7xl mb-6 block opacity-50">📜</span>
                    <h3 className="text-2xl font-bold text-white mb-3">No logs found</h3>
                    <p className="text-gray-400 text-lg">Event logs will appear here as actions are performed</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {logs.map((log) => {
                        const config = getActionConfig(log.action);
                        return (
                            <div
                                key={log._id}
                                className="p-6 lg:p-8 rounded-3xl transition-all duration-300 hover:translate-y-[-2px]"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.5) 100%)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    boxShadow: '0 4px 20px -5px rgba(0, 0, 0, 0.3)'
                                }}
                            >
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                                        {/* Action Badge */}
                                        <div
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold self-start whitespace-nowrap"
                                            style={{
                                                background: config.bg,
                                                color: config.color,
                                                border: `1px solid ${config.color}25`
                                            }}
                                        >
                                            <span className="text-lg">{config.icon}</span>
                                            <span>{log.action.replace(/_/g, ' ')}</span>
                                        </div>

                                        {/* Details */}
                                        <div className="flex-grow">
                                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                                <span className="text-gray-400 text-sm">Booking:</span>
                                                <span
                                                    className="font-mono text-sm px-3 py-1 rounded-lg text-indigo-300 bg-indigo-500/10 border border-indigo-500/20"
                                                >
                                                    {log.bookingId}
                                                </span>
                                            </div>

                                            <div className="text-sm text-gray-300 mb-4">
                                                <span className="text-gray-500">Performed by:</span>
                                                <span className="text-white font-medium ml-2">{log.performedByName || log.performedBy || log.performedByRole}</span>
                                                <span
                                                    className="ml-2 text-xs px-2 py-0.5 rounded-md font-medium uppercase tracking-wider"
                                                    style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#cbd5e1' }}
                                                >
                                                    {log.performedByRole}
                                                </span>
                                            </div>

                                            {log.details && Object.keys(log.details).length > 0 && (
                                                <div className="rounded-xl overflow-hidden border border-white/5 bg-black/20">
                                                    <pre className="p-4 overflow-x-auto text-xs text-gray-400 font-mono leading-relaxed">
                                                        {JSON.stringify(log.details, null, 2)}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Timestamp */}
                                    <div
                                        className="text-sm px-4 py-2 rounded-lg text-gray-400 bg-white/5 border border-white/5 whitespace-nowrap self-start"
                                    >
                                        <span className="mr-2">🕒</span>
                                        {formatTimestamp(log.timestamp)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div
                            className="flex flex-wrap justify-center items-center gap-4 mt-12 p-4 rounded-xl border border-white/5"
                            style={{ background: 'rgba(15, 23, 42, 0.4)' }}
                        >
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                                disabled={pagination.page === 1}
                                className="btn-secondary text-sm px-6 py-2.5"
                                style={{ opacity: pagination.page === 1 ? 0.5 : 1 }}
                            >
                                ← Previous
                            </button>
                            <span
                                className="px-6 py-2.5 rounded-xl text-sm font-medium border border-indigo-500/30 text-indigo-300 bg-indigo-500/10"
                            >
                                Page {pagination.page} of {pagination.pages}
                            </span>
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                                disabled={pagination.page === pagination.pages}
                                className="btn-secondary text-sm px-6 py-2.5"
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
