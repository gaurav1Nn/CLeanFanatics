import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingAPI } from '../../services/api';

const CreateBookingPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        serviceType: 'cleaning',
        scheduledDate: '',
        scheduledTime: '',
        address: '',
        description: ''
    });

    const services = [
        {
            id: 'cleaning',
            name: 'Home Cleaning',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ),
            desc: 'Regular home cleaning service'
        },
        {
            id: 'plumbing',
            name: 'Plumbing',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
            ),
            desc: 'Pipe repairs and installation'
        },
        {
            id: 'electrical',
            name: 'Electrical',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            desc: 'Wiring and appliance repair'
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
                    <p className="text-gray-500 text-sm mt-1">Fill in the details to schedule your appointment.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 bg-white p-5 sm:p-8 rounded-xl border border-gray-200 shadow-lg">

                    {/* Service Type */}
                    <section>
                        <label className="block text-sm font-semibold text-gray-900 mb-4">Select Service Type</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                            {services.map((service) => (
                                <button
                                    key={service.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, serviceType: service.id })}
                                    className={`
                                    relative p-4 sm:p-4 rounded-xl border-2 text-left transition-all min-h-[100px] sm:min-h-0 shadow-sm hover:shadow-md
                                    ${formData.serviceType === service.id
                                            ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600'
                                        }
                                `}
                                >
                                    <div className={`mb-3 ${formData.serviceType === service.id ? 'text-blue-600' : 'text-gray-400'}`}>
                                        {service.icon}
                                    </div>
                                    <h3 className="font-semibold text-sm sm:text-base">{service.name}</h3>
                                    <p className="text-xs mt-1 opacity-75">{service.desc}</p>
                                </button>
                            ))}
                        </div>
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
