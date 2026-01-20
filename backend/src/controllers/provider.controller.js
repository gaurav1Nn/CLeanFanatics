const { Booking } = require('../models');
const { asyncHandler, ApiError } = require('../middleware');
const { handleProviderRejection, logBookingEvent } = require('../services');
const { DEMO_USERS } = require('./auth.controller');

// Get provider's assigned bookings
const getAssignedBookings = asyncHandler(async (req, res) => {
    const providerId = req.user.id;
    const { status } = req.query;

    const query = { provider: providerId };
    if (status) {
        query.status = status;
    }

    const bookings = await Booking.find(query)
        .sort({ scheduledDate: 1 })
        .lean();

    // Attach customer names
    const bookingsWithCustomers = bookings.map(booking => {
        if (booking.customer && DEMO_USERS[booking.customer]) {
            booking.customerName = DEMO_USERS[booking.customer].name;
            booking.customerPhone = DEMO_USERS[booking.customer].phone;
        }
        return booking;
    });

    res.json({
        success: true,
        count: bookings.length,
        data: bookingsWithCustomers
    });
});

// Accept a booking
const acceptBooking = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const providerId = req.user.id;

    const booking = await Booking.findById(id);

    if (!booking) {
        throw new ApiError(404, 'Booking not found');
    }

    if (booking.provider !== providerId) {
        throw new ApiError(403, 'This booking is not assigned to you');
    }

    if (booking.status !== 'assigned') {
        throw new ApiError(400, `Cannot accept a booking with status: ${booking.status}`);
    }

    // Update status
    booking.status = 'accepted';
    booking.statusHistory.push({
        status: 'accepted',
        changedAt: new Date(),
        changedBy: providerId,
        note: 'Provider accepted the booking'
    });
    await booking.save();

    // Log event
    await logBookingEvent(booking._id, 'BOOKING_ACCEPTED', providerId, 'provider', {
        providerName: DEMO_USERS[providerId]?.name
    });

    res.json({
        success: true,
        message: 'Booking accepted successfully',
        data: booking
    });
});

// Reject a booking (will trigger reassignment)
const rejectBooking = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    const providerId = req.user.id;

    const booking = await Booking.findById(id);

    if (!booking) {
        throw new ApiError(404, 'Booking not found');
    }

    if (booking.provider !== providerId) {
        throw new ApiError(403, 'This booking is not assigned to you');
    }

    if (booking.status !== 'assigned') {
        throw new ApiError(400, `Cannot reject a booking with status: ${booking.status}`);
    }

    // Handle rejection and attempt reassignment
    const result = await handleProviderRejection(id, providerId, reason);

    res.json({
        success: true,
        message: result.success
            ? 'Booking rejected and reassigned to another provider'
            : 'Booking rejected. ' + (result.reason === 'max_attempts_reached'
                ? 'Booking cancelled due to no available providers'
                : 'Waiting for next available provider'),
        data: await Booking.findById(id)
    });
});

// Start service (in-progress)
const startService = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const providerId = req.user.id;

    const booking = await Booking.findById(id);

    if (!booking) {
        throw new ApiError(404, 'Booking not found');
    }

    if (booking.provider !== providerId) {
        throw new ApiError(403, 'This booking is not assigned to you');
    }

    if (booking.status !== 'accepted') {
        throw new ApiError(400, `Cannot start a booking with status: ${booking.status}. Must be 'accepted' first.`);
    }

    // Update status
    booking.status = 'in-progress';
    booking.statusHistory.push({
        status: 'in-progress',
        changedAt: new Date(),
        changedBy: providerId,
        note: 'Service started'
    });
    await booking.save();

    // Log event
    await logBookingEvent(booking._id, 'SERVICE_STARTED', providerId, 'provider');

    res.json({
        success: true,
        message: 'Service started',
        data: booking
    });
});

// Complete service
const completeService = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { notes } = req.body;
    const providerId = req.user.id;

    const booking = await Booking.findById(id);

    if (!booking) {
        throw new ApiError(404, 'Booking not found');
    }

    if (booking.provider !== providerId) {
        throw new ApiError(403, 'This booking is not assigned to you');
    }

    if (booking.status !== 'in-progress') {
        throw new ApiError(400, `Cannot complete a booking with status: ${booking.status}. Must be 'in-progress' first.`);
    }

    // Update status
    booking.status = 'completed';
    booking.statusHistory.push({
        status: 'completed',
        changedAt: new Date(),
        changedBy: providerId,
        note: notes || 'Service completed successfully'
    });
    await booking.save();

    // Log event
    await logBookingEvent(booking._id, 'SERVICE_COMPLETED', providerId, 'provider', { notes });

    res.json({
        success: true,
        message: 'Service completed successfully',
        data: booking
    });
});

// Cancel booking by provider
const cancelByProvider = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    const providerId = req.user.id;

    const booking = await Booking.findById(id);

    if (!booking) {
        throw new ApiError(404, 'Booking not found');
    }

    if (booking.provider !== providerId) {
        throw new ApiError(403, 'This booking is not assigned to you');
    }

    if (['completed', 'cancelled'].includes(booking.status)) {
        throw new ApiError(400, `Cannot cancel a ${booking.status} booking`);
    }

    // Update status
    booking.status = 'cancelled';
    booking.cancelledBy = 'provider';
    booking.cancellationReason = reason || 'Cancelled by provider';
    booking.statusHistory.push({
        status: 'cancelled',
        changedAt: new Date(),
        changedBy: providerId,
        note: reason || 'Cancelled by provider'
    });
    await booking.save();

    // Log event
    await logBookingEvent(booking._id, 'BOOKING_CANCELLED', providerId, 'provider', { reason });

    res.json({
        success: true,
        message: 'Booking cancelled',
        data: booking
    });
});

module.exports = {
    getAssignedBookings,
    acceptBooking,
    rejectBooking,
    startService,
    completeService,
    cancelByProvider
};
