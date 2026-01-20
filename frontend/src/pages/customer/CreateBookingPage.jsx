import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingAPI } from '../../services/api';
import ServiceIcon from '../../components/common/ServiceIcon';

const CreateBookingPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        serviceType: '',
        scheduledDate: '',
        scheduledTime: '',
        address: '',
        description: ''
    });

    const serviceTypes = [
        { value: 'cleaning', label: 'House Cleaning', icon: '🧹', description: 'Professional home cleaning services' },
        { value: 'plumbing', label: 'Plumbing', icon: '🔧', description: 'Fix leaks, pipes, and drainage' },
        { value: 'electrical', label: 'Electrical', icon: '⚡', description: 'Wiring, fixtures, and repairs' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await bookingAPI.create(formData);
            setSuccess('Booking created successfully!');
            setTimeout(() => navigate('/bookings'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create booking');
        } finally {
            setLoading(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="max-w-2xl mx-auto">
            <div
                className="p-6 lg:p-10 rounded-2xl"
                style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.7) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
            >
                {/* Header */}
                <div className="mb-8 lg:mb-10">
                    <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                        Create New Booking
                    </h1>
                    <p className="text-gray-400">Fill in the details below to request a service</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Service Type Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-4">
                            Select Service Type
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {serviceTypes.map((service) => (
                                <button
                                    type="button"
                                    key={service.value}
                                    onClick={() => setFormData(prev => ({ ...prev, serviceType: service.value }))}
                                    className={`p-5 rounded-2xl border-2 transition-all duration-300 text-center ${formData.serviceType === service.value
                                            ? 'border-indigo-500'
                                            : 'border-transparent hover:border-white/10'
                                        }`}
                                    style={formData.serviceType === service.value ? {
                                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.15) 100%)',
                                        boxShadow: '0 8px 25px rgba(99, 102, 241, 0.2)'
                                    } : {
                                        background: 'rgba(255, 255, 255, 0.03)'
                                    }}
                                >
                                    <div className="flex justify-center mb-3">
                                        <ServiceIcon type={service.value} size="md" />
                                    </div>
                                    <p className="font-semibold text-white mb-1">{service.label}</p>
                                    <p className="text-xs text-gray-400 leading-relaxed">{service.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-3">
                                📅 Preferred Date
                            </label>
                            <input
                                type="date"
                                name="scheduledDate"
                                value={formData.scheduledDate}
                                onChange={handleChange}
                                min={today}
                                required
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-3">
                                🕐 Preferred Time
                            </label>
                            <select
                                name="scheduledTime"
                                value={formData.scheduledTime}
                                onChange={handleChange}
                                required
                                className="select-field"
                            >
                                <option value="">Select time...</option>
                                <option value="09:00 AM">09:00 AM</option>
                                <option value="10:00 AM">10:00 AM</option>
                                <option value="11:00 AM">11:00 AM</option>
                                <option value="12:00 PM">12:00 PM</option>
                                <option value="02:00 PM">02:00 PM</option>
                                <option value="03:00 PM">03:00 PM</option>
                                <option value="04:00 PM">04:00 PM</option>
                                <option value="05:00 PM">05:00 PM</option>
                            </select>
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-3">
                            📍 Service Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter your full address"
                            required
                            className="input-field"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-3">
                            💬 Description (Optional)
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the issue or any special requirements..."
                            rows={4}
                            className="input-field resize-none"
                        />
                    </div>

                    {/* Messages */}
                    {error && (
                        <div
                            className="p-4 rounded-xl text-sm flex items-center gap-2"
                            style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                color: '#f87171'
                            }}
                        >
                            <span>❌</span> {error}
                        </div>
                    )}

                    {success && (
                        <div
                            className="p-4 rounded-xl text-sm flex items-center gap-2"
                            style={{
                                background: 'rgba(16, 185, 129, 0.1)',
                                border: '1px solid rgba(16, 185, 129, 0.2)',
                                color: '#34d399'
                            }}
                        >
                            <span>✅</span> {success}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/bookings')}
                            className="btn-secondary flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !formData.serviceType}
                            className="btn-primary flex-1 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>⏳ Creating...</>
                            ) : (
                                <>📅 Create Booking</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBookingPage;
