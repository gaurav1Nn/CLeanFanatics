const { User, Booking, EventLog } = require('../models');

/**
 * Auto-assign a provider to a booking based on service type
 * Uses first-available strategy with retry tracking
 */
const autoAssignProvider = async (booking) => {
    // Find available provider matching service type
    const provider = await User.findOne({
        role: 'provider',
        isAvailable: true,
        serviceCategories: booking.serviceType
    }).sort({ createdAt: 1 }); // First available (oldest account)

    return provider;
};

/**
 * Attempt to assign a provider with retry logic
 * Returns true if assigned, false if max attempts reached
 */
const attemptAssignment = async (bookingId, excludeProviders = []) => {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new Error('Booking not found');
    }

    // Check if max attempts reached
    if (booking.assignmentAttempts >= booking.maxAssignmentAttempts) {
        // Auto-cancel due to no available providers
        booking.status = 'cancelled';
        booking.cancelledBy = 'system';
        booking.cancellationReason = 'No available providers after maximum attempts';
        booking.statusHistory.push({
            status: 'cancelled',
            changedAt: new Date(),
            note: `Auto-cancelled: max ${booking.maxAssignmentAttempts} assignment attempts reached`
        });
        await booking.save();

        // Log the event
        await EventLog.create({
            bookingId: booking._id,
            action: 'AUTO_CANCELLED',
            performedByRole: 'system',
            details: {
                reason: 'max_assignment_attempts',
                attempts: booking.assignmentAttempts
            }
        });

        return { success: false, reason: 'max_attempts_reached' };
    }

    // Find available provider (excluding rejected ones)
    const query = {
        role: 'provider',
        isAvailable: true,
        serviceCategories: booking.serviceType
    };

    if (excludeProviders.length > 0) {
        query._id = { $nin: excludeProviders };
    }

    const provider = await User.findOne(query).sort({ createdAt: 1 });

    if (!provider) {
        booking.assignmentAttempts += 1;
        await booking.save();

        return { success: false, reason: 'no_available_providers' };
    }

    // Assign provider
    booking.provider = provider._id;
    booking.status = 'assigned';
    booking.assignmentAttempts += 1;
    booking.statusHistory.push({
        status: 'assigned',
        changedAt: new Date(),
        changedBy: provider._id,
        note: `Assigned to provider: ${provider.name}`
    });
    await booking.save();

    // Log the assignment
    await EventLog.create({
        bookingId: booking._id,
        action: 'PROVIDER_ASSIGNED',
        performedByRole: 'system',
        details: {
            providerId: provider._id,
            providerName: provider.name,
            attempt: booking.assignmentAttempts
        }
    });

    return { success: true, provider };
};

/**
 * Handle provider rejection - reassign to next available
 */
const handleProviderRejection = async (bookingId, providerId, reason) => {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new Error('Booking not found');
    }

    // Update booking status back to pending
    booking.status = 'pending';
    booking.provider = null;
    booking.statusHistory.push({
        status: 'pending',
        changedAt: new Date(),
        changedBy: providerId,
        note: `Provider rejected: ${reason || 'No reason provided'}`
    });
    await booking.save();

    // Log the rejection
    await EventLog.create({
        bookingId: booking._id,
        action: 'PROVIDER_REJECTED',
        performedBy: providerId,
        performedByRole: 'provider',
        details: { reason }
    });

    // Attempt to reassign
    return await attemptAssignment(bookingId, [providerId]);
};

module.exports = {
    autoAssignProvider,
    attemptAssignment,
    handleProviderRejection
};
