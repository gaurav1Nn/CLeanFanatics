const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-14 h-14'
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4 py-12">
            <div className="relative">
                {/* Outer glow ring */}
                <div
                    className={`${sizeClasses[size]} rounded-full absolute`}
                    style={{
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)',
                        filter: 'blur(8px)',
                        animation: 'pulse 2s ease-in-out infinite'
                    }}
                />
                {/* Spinner */}
                <div
                    className={`${sizeClasses[size]} rounded-full relative`}
                    style={{
                        border: '3px solid rgba(99, 102, 241, 0.2)',
                        borderTopColor: '#6366f1',
                        borderRightColor: '#8b5cf6',
                        animation: 'spin 0.8s linear infinite'
                    }}
                />
            </div>
            {text && (
                <p
                    className="text-gray-400 text-sm font-medium"
                    style={{ letterSpacing: '0.05em' }}
                >
                    {text}
                </p>
            )}
            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default LoadingSpinner;
