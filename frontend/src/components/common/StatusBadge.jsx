const StatusBadge = ({ status }) => {
    const statusConfig = {
        pending: { label: 'Pending', class: 'status-pending', icon: '⏳' },
        assigned: { label: 'Assigned', class: 'status-assigned', icon: '👤' },
        accepted: { label: 'Accepted', class: 'status-accepted', icon: '✅' },
        'in-progress': { label: 'In Progress', class: 'status-in-progress', icon: '🔧' },
        completed: { label: 'Completed', class: 'status-completed', icon: '🎉' },
        cancelled: { label: 'Cancelled', class: 'status-cancelled', icon: '❌' }
    };

    const config = statusConfig[status] || { label: status, class: '', icon: '❓' };

    return (
        <span
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold text-white ${config.class}`}
            style={{
                textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                letterSpacing: '0.025em'
            }}
        >
            <span className="text-base">{config.icon}</span>
            <span>{config.label}</span>
        </span>
    );
};

export default StatusBadge;
