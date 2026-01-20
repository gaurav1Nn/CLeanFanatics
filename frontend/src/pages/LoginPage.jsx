import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const LoginPage = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            redirectBasedOnRole(user.role);
        }
        fetchUsers();
    }, [isAuthenticated]);

    const fetchUsers = async () => {
        try {
            const response = await authAPI.getDemoUsers();
            setUsers(response.data.data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        }
    };

    const redirectBasedOnRole = (role) => {
        switch (role) {
            case 'customer': navigate('/bookings'); break;
            case 'provider': navigate('/provider'); break;
            case 'admin': navigate('/admin'); break;
            default: navigate('/');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!selectedUser) {
            setError('Please select a user');
            return;
        }

        setLoading(true);
        setError('');

        const result = await login(selectedUser);

        if (result.success) {
            const selectedUserData = users.find(u => u._id === selectedUser);
            redirectBasedOnRole(selectedUserData.role);
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    const groupedUsers = {
        customer: users.filter(u => u.role === 'customer'),
        provider: users.filter(u => u.role === 'provider'),
        admin: users.filter(u => u.role === 'admin')
    };

    const selectedUserData = users.find(u => u._id === selectedUser);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-blue-50 rounded-full">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-gray-500 text-sm mt-2">Sign in to CleanFanatics</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Demo User
                        </label>
                        <div className="relative">
                            <select
                                value={selectedUser}
                                onChange={(e) => {
                                    setSelectedUser(e.target.value);
                                    setError('');
                                }}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
                            >
                                <option value="">Choose a user...</option>
                                <optgroup label="Customers">
                                    {groupedUsers.customer.map(u => (
                                        <option key={u._id} value={u._id}>{u.name}</option>
                                    ))}
                                </optgroup>
                                <optgroup label="Providers">
                                    {groupedUsers.provider.map(u => (
                                        <option key={u._id} value={u._id}>
                                            {u.name} • {u.serviceCategories?.join(', ')}
                                        </option>
                                    ))}
                                </optgroup>
                                <optgroup label="Admins">
                                    {groupedUsers.admin.map(u => (
                                        <option key={u._id} value={u._id}>{u.name}</option>
                                    ))}
                                </optgroup>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {selectedUserData && (
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                                {selectedUserData.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{selectedUserData.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{selectedUserData.role}</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !selectedUser}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center text-xs text-gray-400">
                    <p>Demo Mode • No password required</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;