const ServiceIcon = ({ type, size = 'md' }) => {
    const icons = {
        cleaning: { emoji: '🧹', label: 'Cleaning', color: 'from-emerald-400 via-green-500 to-teal-600' },
        plumbing: { emoji: '🔧', label: 'Plumbing', color: 'from-blue-400 via-cyan-500 to-blue-600' },
        electrical: { emoji: '⚡', label: 'Electrical', color: 'from-amber-400 via-yellow-500 to-orange-600' }
    };

    const sizeClasses = {
        sm: 'w-10 h-10 text-xl',
        md: 'w-14 h-14 text-2xl',
        lg: 'w-18 h-18 text-4xl'
    };

    const config = icons[type] || { emoji: '❓', label: type, color: 'from-gray-400 via-gray-500 to-gray-600' };

    return (
        <div
            className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br ${config.color} flex items-center justify-center`}
            style={{
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                transform: 'translateZ(0)',
                minWidth: size === 'lg' ? '4.5rem' : size === 'md' ? '3.5rem' : '2.5rem',
                minHeight: size === 'lg' ? '4.5rem' : size === 'md' ? '3.5rem' : '2.5rem'
            }}
        >
            <span style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{config.emoji}</span>
        </div>
    );
};

export default ServiceIcon;
