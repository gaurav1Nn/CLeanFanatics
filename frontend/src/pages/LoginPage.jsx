// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { authAPI } from '../services/api';

// const LoginPage = () => {
//     const [users, setUsers] = useState([]);
//     const [selectedUser, setSelectedUser] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const { login, isAuthenticated, user } = useAuth();
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (isAuthenticated) {
//             redirectBasedOnRole(user.role);
//         }
//         fetchUsers();
//     }, [isAuthenticated]);

//     const fetchUsers = async () => {
//         try {
//             const response = await authAPI.getDemoUsers();
//             setUsers(response.data.data);
//         } catch (err) {
//             console.error('Failed to fetch users:', err);
//         }
//     };

//     const redirectBasedOnRole = (role) => {
//         switch (role) {
//             case 'customer': navigate('/bookings'); break;
//             case 'provider': navigate('/provider'); break;
//             case 'admin': navigate('/admin'); break;
//             default: navigate('/');
//         }
//     };

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         if (!selectedUser) {
//             setError('Please select a user');
//             return;
//         }

//         setLoading(true);
//         setError('');

//         const result = await login(selectedUser);

//         if (result.success) {
//             const selectedUserData = users.find(u => u._id === selectedUser);
//             redirectBasedOnRole(selectedUserData.role);
//         } else {
//             setError(result.error);
//         }

//         setLoading(false);
//     };

//     const groupedUsers = {
//         customer: users.filter(u => u.role === 'customer'),
//         provider: users.filter(u => u.role === 'provider'),
//         admin: users.filter(u => u.role === 'admin')
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center px-6 py-12">
//             {/* Background decorations */}
//             <div
//                 className="fixed top-20 left-20 w-72 h-72 rounded-full opacity-20 pointer-events-none"
//                 style={{
//                     background: 'radial-gradient(circle, rgba(99, 102, 241, 0.5) 0%, transparent 70%)',
//                     filter: 'blur(60px)'
//                 }}
//             />
//             <div
//                 className="fixed bottom-20 right-20 w-96 h-96 rounded-full opacity-15 pointer-events-none"
//                 style={{
//                     background: 'radial-gradient(circle, rgba(16, 185, 129, 0.5) 0%, transparent 70%)',
//                     filter: 'blur(80px)'
//                 }}
//             />

//             <div
//                 className="p-8 lg:p-10 w-full max-w-md rounded-2xl relative z-10 animate-fade-in"
//                 style={{
//                     background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.85) 100%)',
//                     border: '1px solid rgba(255, 255, 255, 0.08)',
//                     boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
//                 }}
//             >
//                 {/* Logo & Title */}
//                 <div className="text-center mb-10">
//                     <span
//                         className="text-6xl lg:text-7xl mb-5 block"
//                         style={{
//                             animation: 'float 3s ease-in-out infinite',
//                             filter: 'drop-shadow(0 8px 20px rgba(99, 102, 241, 0.4))'
//                         }}
//                     >
//                         🧹
//                     </span>
//                     <h1
//                         className="text-3xl lg:text-4xl font-bold mb-2"
//                         style={{
//                             background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 40%, #a78bfa 100%)',
//                             WebkitBackgroundClip: 'text',
//                             WebkitTextFillColor: 'transparent',
//                             backgroundClip: 'text'
//                         }}
//                     >
//                         CleanFanatics
//                     </h1>
//                     <p className="text-gray-400 text-base lg:text-lg">Home Services Booking Platform</p>
//                 </div>

//                 <form onSubmit={handleLogin} className="space-y-6">
//                     <div>
//                         <label className="block text-sm font-semibold text-gray-300 mb-3">
//                             Select Demo User
//                         </label>
//                         <select
//                             value={selectedUser}
//                             onChange={(e) => setSelectedUser(e.target.value)}
//                             className="select-field"
//                         >
//                             <option value="">Choose a user...</option>

//                             <optgroup label="👤 Customers">
//                                 {groupedUsers.customer.map(user => (
//                                     <option key={user._id} value={user._id}>
//                                         {user.name} ({user.email})
//                                     </option>
//                                 ))}
//                             </optgroup>

//                             <optgroup label="🔧 Providers">
//                                 {groupedUsers.provider.map(user => (
//                                     <option key={user._id} value={user._id}>
//                                         {user.name} - {user.serviceCategories?.join(', ')}
//                                     </option>
//                                 ))}
//                             </optgroup>

//                             <optgroup label="👨‍💼 Admins">
//                                 {groupedUsers.admin.map(user => (
//                                     <option key={user._id} value={user._id}>
//                                         {user.name} ({user.email})
//                                     </option>
//                                 ))}
//                             </optgroup>
//                         </select>
//                     </div>

//                     {error && (
//                         <div
//                             className="p-4 rounded-xl text-sm"
//                             style={{
//                                 background: 'rgba(239, 68, 68, 0.1)',
//                                 border: '1px solid rgba(239, 68, 68, 0.2)',
//                                 color: '#f87171'
//                             }}
//                         >
//                             {error}
//                         </div>
//                     )}

//                     <button
//                         type="submit"
//                         disabled={loading || !selectedUser}
//                         className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-base"
//                     >
//                         {loading ? (
//                             <>⏳ Logging in...</>
//                         ) : (
//                             <>🚀 Login</>
//                         )}
//                     </button>
//                 </form>

//                 {/* Demo Mode Info */}
//                 <div
//                     className="mt-8 p-5 rounded-xl"
//                     style={{
//                         background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.06) 100%)',
//                         border: '1px solid rgba(99, 102, 241, 0.12)'
//                     }}
//                 >
//                     <div className="flex items-center gap-2 mb-3">
//                         <span className="text-lg">💡</span>
//                         <h3 className="text-sm font-semibold text-indigo-300">Demo Mode</h3>
//                     </div>
//                     <p className="text-sm text-gray-400 leading-relaxed">
//                         This is a demo application. Select any user above to explore different roles:
//                         <span className="text-green-400 font-medium"> Customer</span>,
//                         <span className="text-blue-400 font-medium"> Provider</span>, or
//                         <span className="text-red-400 font-medium"> Admin</span>.
//                     </p>
//                 </div>
//             </div>

//             <style>{`
//                 @keyframes float {
//                     0%, 100% { transform: translateY(0); }
//                     50% { transform: translateY(-12px); }
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default LoginPage;


