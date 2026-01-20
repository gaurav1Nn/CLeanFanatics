const { Booking, EventLog } = require('../models');
const { asyncHandler, ApiError } = require('../middleware');
const { attemptAssignment, logBookingEvent } = require('../services');
const { DEMO_USERS } = require('./auth.controller');

// Create a new booking (Customer)
const createBooking = asyncHandler(async (req, res) => {
    const { serviceType, scheduledDate, scheduledTime, address, description } = req.body;
    const customerId = req.user.id;

    // Validate required fields
    if (!serviceType || !scheduledDate || !scheduledTime || !address) {
        throw new ApiError(400, 'Please provide serviceType, scheduledDate, scheduledTime, and address');
    }

    // Create booking
    const booking = await Booking.create({
        customer: customerId,
        serviceType,
        scheduledDate: new Date(scheduledDate),
        scheduledTime,
        address,
        description: description || ''
    });

    // Log event
    await logBookingEvent(booking._id, 'BOOKING_CREATED', customerId, 'customer', {
        serviceType,
        scheduledDate,
        address
    });

    // Attempt auto-assignment
    const assignmentResult = await attemptAssignment(booking._id);

    // Fetch updated booking with provider info
    const updatedBooking = await Booking.findById(booking._id);

    res.status(201).json({
        success: true,
        message: assignmentResult.success
            ? 'Booking created and provider assigned'
            : 'Booking created, waiting for provider assignment',
        data: {
            booking: updatedBooking,
            assignmentStatus: assignmentResult
        }
    });
});

// Get customer's bookings
const getMyBookings = asyncHandler(async (req, res) => {
    const customerId = req.user.id;
    const { status } = req.query;

    const query = { customer: customerId };
    if (status) {
        query.status = status;
    }

    const bookings = await Booking.find(query)
        .sort({ createdAt: -1 })
        .lean();

    // Attach full provider objects from demo users (including mockDistance)
    const bookingsWithProviders = bookings.map(booking => {
        if (booking.provider && DEMO_USERS[booking.provider]) {
            booking.provider = DEMO_USERS[booking.provider];
        }
        return booking;
    });

    res.json({
        success: true,
        count: bookings.length,
        data: bookingsWithProviders
    });
});

// Get single booking details
const getBooking = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const booking = await Booking.findById(id).lean();

    if (!booking) {
        throw new ApiError(404, 'Booking not found');
    }

    // Check authorization
    if (userRole === 'customer' && booking.customer !== userId) {
        throw new ApiError(403, 'Not authorized to view this booking');
    }
    if (userRole === 'provider' && booking.provider !== userId) {
        throw new ApiError(403, 'Not authorized to view this booking');
    }

    // Attach names
    if (booking.customer && DEMO_USERS[booking.customer]) {
        booking.customerName = DEMO_USERS[booking.customer].name;
    }
    if (booking.provider && DEMO_USERS[booking.provider]) {
        booking.providerName = DEMO_USERS[booking.provider].name;
    }

    res.json({
        success: true,
        data: booking
    });
});

// Cancel booking (Customer)
const cancelBooking = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    const booking = await Booking.findById(id);

    if (!booking) {
        throw new ApiError(404, 'Booking not found');
    }

    // Only customer who created booking can cancel
    if (booking.customer !== userId) {
        throw new ApiError(403, 'Not authorized to cancel this booking');
    }

    // Can only cancel if not completed or already cancelled
    if (['completed', 'cancelled'].includes(booking.status)) {
        throw new ApiError(400, `Cannot cancel a ${booking.status} booking`);
    }

    // Update booking
    booking.status = 'cancelled';
    booking.cancelledBy = 'customer';
    booking.cancellationReason = reason || 'Cancelled by customer';
    booking.statusHistory.push({
        status: 'cancelled',
        changedAt: new Date(),
        changedBy: userId,
        note: reason || 'Cancelled by customer'
    });
    await booking.save();

    // Log event
    await logBookingEvent(booking._id, 'BOOKING_CANCELLED', userId, 'customer', {
        reason: reason || 'Cancelled by customer',
        previousStatus: booking.statusHistory[booking.statusHistory.length - 2]?.status
    });

    res.json({
        success: true,
        message: 'Booking cancelled successfully',
        data: booking
    });
});

// Get booking history/events
const getBookingHistory = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
        throw new ApiError(404, 'Booking not found');
    }

    const events = await EventLog.find({ bookingId: id })
        .sort({ timestamp: -1 })
        .lean();

    res.json({
        success: true,
        data: {
            statusHistory: booking.statusHistory,
            events
        }
    });
});

module.exports = {
    createBooking,
    getMyBookings,
    getBooking,
    cancelBooking,
    getBookingHistory
};
