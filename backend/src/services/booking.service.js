const { Booking, EventLog } = require('../models');

/**
 * Log a booking event for observability
 */
const logBookingEvent = async (bookingId, action, userId, userRole, details = {}) => {
    return await EventLog.create({
        bookingId,
        action,
        performedBy: userId,
        performedByRole: userRole,
        details
    });
};

/**
 * Update booking status with history tracking
 */
const updateBookingStatus = async (booking, newStatus, userId, note = '') => {
    const oldStatus = booking.status;
    booking.status = newStatus;
    booking.statusHistory.push({
        status: newStatus,
        changedAt: new Date(),
        changedBy: userId,
        note
    });
    await booking.save();

    return { oldStatus, newStatus };
};

/**
 * Get valid status transitions
 */
const getValidTransitions = (currentStatus, userRole) => {
    const transitions = {
        pending: {
            customer: ['cancelled'],
            provider: [],
            admin: ['cancelled', 'assigned']
        },
        assigned: {
            customer: ['cancelled'],
            provider: ['accepted'],
            admin: ['cancelled', 'pending', 'accepted']
        },
        accepted: {
            customer: ['cancelled'],
            provider: ['in-progress', 'cancelled'],
            admin: ['cancelled', 'pending', 'in-progress']
        },
        'in-progress': {
            customer: [],
            provider: ['completed'],
            admin: ['cancelled', 'completed']
        },
        completed: {
            customer: [],
            provider: [],
            admin: [] // Final state
        },
        cancelled: {
            customer: [],
            provider: [],
            admin: ['pending'] // Admin can reopen
        }
    };

    return transitions[currentStatus]?.[userRole] || [];
};

/**
 * Check if a status transition is valid
 */
const isValidTransition = (currentStatus, newStatus, userRole) => {
    const validTransitions = getValidTransitions(currentStatus, userRole);
    return validTransitions.includes(newStatus);
};

module.exports = {
    logBookingEvent,
    updateBookingStatus,
    getValidTransitions,
    isValidTransition
};
