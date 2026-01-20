const StatusBadge = ({ status }) => {
    const getStatusClass = (status) => {
        const classes = {
            pending: 'status-pending',
            assigned: 'status-assigned',
            accepted: 'status-accepted',
            'in-progress': 'status-in-progress',
            completed: 'status-completed',
            cancelled: 'status-cancelled'
        };
        return classes[status] || 'bg-gray-100 text-gray-800';
    };

    const getLabel = (status) => {
        return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <span className={`status-badge ${getStatusClass(status)}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
            {getLabel(status)}
        </span>
    );
};

export default StatusBadge;
