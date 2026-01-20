import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';

const Layout = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="relative mb-6">
                        <span
                            className="text-6xl block"
                            style={{
                                animation: 'float 2s ease-in-out infinite',
                                filter: 'drop-shadow(0 8px 16px rgba(99, 102, 241, 0.4))'
                            }}
                        >
                            🧹
                        </span>
                    </div>
                    <div
                        className="text-2xl font-bold mb-4"
                        style={{
                            background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 40%, #a78bfa 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}
                    >
                        CleanFanatics
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <div
                            className="w-2 h-2 rounded-full bg-indigo-500"
                            style={{ animation: 'bounce 1s ease-in-out infinite' }}
                        />
                        <div
                            className="w-2 h-2 rounded-full bg-purple-500"
                            style={{ animation: 'bounce 1s ease-in-out infinite 0.1s' }}
                        />
                        <div
                            className="w-2 h-2 rounded-full bg-indigo-400"
                            style={{ animation: 'bounce 1s ease-in-out infinite 0.2s' }}
                        />
                    </div>
                </div>
                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-15px); }
                    }
                    @keyframes bounce {
                        0%, 100% { transform: translateY(0); opacity: 1; }
                        50% { transform: translateY(-8px); opacity: 0.5; }
                    }
                `}</style>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen w-full overflow-x-hidden">
            {/* Full-width navbar container */}
            <div
                className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-4"
                style={{
                    background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(15, 23, 42, 0.95) 100%)',
                    backdropFilter: 'blur(20px)'
                }}
            >
                <div className="w-full max-w-7xl mx-auto">
                    <Navbar />
                </div>
            </div>

            {/* Main content with proper padding */}
            <main className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-8">
                <div className="w-full max-w-7xl mx-auto animate-fade-in">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;