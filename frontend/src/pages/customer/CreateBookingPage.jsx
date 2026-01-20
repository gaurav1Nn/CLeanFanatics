import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingAPI } from '../../services/api';

const CreateBookingPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        serviceType: 'sofa-cleaning',
        scheduledDate: '',
        scheduledTime: '',
        address: '',
        description: ''
    });

    const services = [
        {
            category: 'Cleaning',
            options: [
                { id: 'sofa-cleaning', name: 'Sofa Cleaning', icon: '🛋️' },
                { id: 'window-wash', name: 'Window Wash', icon: '🪟' },
                { id: 'floor-cleaning', name: 'Floor Cleaning', icon: '🧹' },
                { id: 'deep-cleaning', name: 'Deep Cleaning', icon: '✨' }
            ]
        },
        {
            category: 'Plumbing',
            options: [
                { id: 'leaking-tap', name: 'Leaking Tap', icon: '🚰' },
                { id: 'pipe-repair', name: 'Pipe Repair', icon: '🔧' },
                { id: 'drain-cleaning', name: 'Drain Cleaning', icon: '🚿' },
                { id: 'bathroom-fitting', name: 'Bathroom Fitting', icon: '🚽' }
            ]
        },
        {
            category: 'Electrical',
            options: [
                { id: 'wiring-repair', name: 'Wiring Repair', icon: '⚡' },
                { id: 'appliance-repair', name: 'Appliance Repair', icon: '🔌' },
                { id: 'switch-installation', name: 'Switch Installation', icon: '💡' }
            ]
        }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await bookingAPI.create(formData);
            navigate('/bookings');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create booking');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-4 sm:py-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Book a Service</h1>
                    <p className="text-gray-500 text-sm mt-1">Select your specific service need.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 bg-white p-5 sm:p-8 rounded-xl border border-gray-200 shadow-lg">

                    {/* Service Type - Dropdown */}
                    <section>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">Select Service Type</label>
                        <select
                            value={formData.serviceType}
                            onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                            className="w-full px-4 py-3.5 sm:py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                        >
                            {services.map((category) => (
                                <optgroup key={category.category} label={category.category}>
                                    {category.options.map((service) => (
                                        <option key={service.id} value={service.id}>
                                            {service.icon} {service.name}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-2">We'll match you with the nearest expert for this service</p>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Date & Time */}
                    <section>
                        <h2 className="text-sm font-semibold text-gray-900 mb-4">Date & Time</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                <input
                                    type="date"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    value={formData.scheduledDate}
                                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                    className="input-field h-12 text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                                <input
                                    type="time"
                                    required
                                    value={formData.scheduledTime}
                                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                                    className="input-field h-12 text-base"
                                />
                            </div>
                        </div>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Location */}
                    <section>
                        <h2 className="text-sm font-semibold text-gray-900 mb-4">Location Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                                <textarea
                                    required
                                    rows="3"
                                    placeholder="Street address, City, State..."
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="input-field resize-none text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes (Optional)</label>
                                <textarea
                                    rows="2"
                                    placeholder="Any specific instructions..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input-field resize-none text-base"
                                />
                            </div>
                        </div>
                    </section>

                    <div className="pt-2 sm:pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-4 sm:py-3 text-base font-semibold shadow-md hover:shadow-lg transition-all"
                        >
                            {loading ? 'Confirming...' : 'Confirm Booking'}
                        </button>
                        <p className="text-center text-xs text-gray-400 mt-4">
                            You can cancel or reschedule later from your bookings page.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBookingPage;
