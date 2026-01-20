const { Booking, EventLog } = require('../models');
const { asyncHandler, ApiError } = require('../middleware');
const { logBookingEvent } = require('../services');
const { DEMO_USERS } = require('./auth.controller');

// Get all bookings with filters
const getAllBookings = asyncHandler(async (req, res) => {
    const { status, serviceType, customerId, providerId, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (serviceType) query.serviceType = serviceType;
    if (customerId) query.customer = customerId;
    if (providerId) query.provider = providerId;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [bookings, total] = await Promise.all([
        Booking.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean(),
        Booking.countDocuments(query)
    ]);

    // Attach names
    const bookingsWithNames = bookings.map(booking => {
        if (booking.customer && DEMO_USERS[booking.customer]) {
            booking.customerName = DEMO_USERS[booking.customer].name;
        }
        if (booking.provider && DEMO_USERS[booking.provider]) {
            booking.providerName = DEMO_USERS[booking.provider].name;
        }
        return booking;
    });

    res.json({
        success: true,
        count: bookings.length,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        data: bookingsWithNames
    });
});

// Override booking status (admin only)
const overrideStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, reason } = req.body;
    const adminId = req.user.id;

    const validStatuses = ['pending', 'assigned', 'accepted', 'in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
        throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const booking = await Booking.findById(id);

    if (!booking) {
        throw new ApiError(404, 'Booking not found');
    }

    const oldStatus = booking.status;

    // Update status
    booking.status = status;
    if (status === 'cancelled') {
        booking.cancelledBy = 'admin';
        booking.cancellationReason = reason || 'Cancelled by admin';
    }
    booking.statusHistory.push({
        status,
        changedAt: new Date(),
        changedBy: adminId,
        note: `Admin override: ${reason || 'No reason provided'}`
    });
    await booking.save();

    // Log event
    await logBookingEvent(booking._id, 'STATUS_OVERRIDE', adminId, 'admin', {
        oldStatus,
        newStatus: status,
        reason
    });

    res.json({
        success: true,
        message: `Status changed from ${oldStatus} to ${status}`,
        data: booking
    });
});

// Manual provider assignment (admin only)
const assignProvider = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { providerId } = req.body;
    const adminId = req.user.id;

    if (!providerId) {
        throw new ApiError(400, 'Provider ID is required');
    }

    // Validate provider exists
    const provider = DEMO_USERS[providerId];
    if (!provider || provider.role !== 'provider') {
        throw new ApiError(400, 'Invalid provider ID');
    }

    const booking = await Booking.findById(id);

    if (!booking) {
        throw new ApiError(404, 'Booking not found');
    }

    if (!['pending', 'assigned'].includes(booking.status)) {
        throw new ApiError(400, `Cannot assign provider to a ${booking.status} booking`);
    }

    // Assign provider
    const oldProvider = booking.provider;
    booking.provider = providerId;
    booking.status = 'assigned';
    booking.statusHistory.push({
        status: 'assigned',
        changedAt: new Date(),
        changedBy: adminId,
        note: `Admin assigned provider: ${provider.name}`
    });
    await booking.save();

    // Log event
    await logBookingEvent(booking._id, 'MANUAL_ASSIGNMENT', adminId, 'admin', {
        oldProvider,
        newProvider: providerId,
        providerName: provider.name
    });

    res.json({
        success: true,
        message: `Provider ${provider.name} assigned successfully`,
        data: booking
    });
});

// Mark as no-show (admin only)
const markNoShow = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { type } = req.body; // 'provider' or 'customer'
    const adminId = req.user.id;

    const booking = await Booking.findById(id);

    if (!booking) {
        throw new ApiError(404, 'Booking not found');
    }

    if (!['assigned', 'accepted'].includes(booking.status)) {
        throw new ApiError(400, `Cannot mark no-show for a ${booking.status} booking`);
    }

    // Update status
    booking.status = 'cancelled';
    booking.cancelledBy = 'system';
    booking.cancellationReason = `${type || 'Provider'} no-show`;
    booking.statusHistory.push({
        status: 'cancelled',
        changedAt: new Date(),
        changedBy: adminId,
        note: `No-show: ${type || 'provider'}`
    });
    await booking.save();

    // Log event
    await logBookingEvent(booking._id, 'NO_SHOW', adminId, 'admin', {
        type: type || 'provider'
    });

    res.json({
        success: true,
        message: 'Booking marked as no-show and cancelled',
        data: booking
    });
});

// Get event logs
const getEventLogs = asyncHandler(async (req, res) => {
    const { bookingId, action, page = 1, limit = 50 } = req.query;

    const query = {};
    if (bookingId) query.bookingId = bookingId;
    if (action) query.action = action;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
        EventLog.find(query)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean(),
        EventLog.countDocuments(query)
    ]);

    // Add performer names
    const logsWithNames = logs.map(log => {
        if (log.performedBy && DEMO_USERS[log.performedBy]) {
            log.performedByName = DEMO_USERS[log.performedBy].name;
        }
        return log;
    });

    res.json({
        success: true,
        count: logs.length,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        data: logsWithNames
    });
});

// Get dashboard stats
const getDashboardStats = asyncHandler(async (req, res) => {
    const [
        totalBookings,
        pendingCount,
        assignedCount,
        inProgressCount,
        completedCount,
        cancelledCount
    ] = await Promise.all([
        Booking.countDocuments(),
        Booking.countDocuments({ status: 'pending' }),
        Booking.countDocuments({ status: 'assigned' }),
        Booking.countDocuments({ status: 'in-progress' }),
        Booking.countDocuments({ status: 'completed' }),
        Booking.countDocuments({ status: 'cancelled' })
    ]);

    res.json({
        success: true,
        data: {
            total: totalBookings,
            pending: pendingCount,
            assigned: assignedCount,
            accepted: await Booking.countDocuments({ status: 'accepted' }),
            inProgress: inProgressCount,
            completed: completedCount,
            cancelled: cancelledCount
        }
    });
});

module.exports = {
    getAllBookings,
    overrideStatus,
    assignProvider,
    markNoShow,
    getEventLogs,
    getDashboardStats
};
