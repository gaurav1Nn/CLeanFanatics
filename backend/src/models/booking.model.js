const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
    status: {
        type: String,
        required: true
    },
    changedAt: {
        type: Date,
        default: Date.now
    },
    changedBy: {
        type: String
    },
    note: String
}, { _id: false });

const bookingSchema = new mongoose.Schema({
    customer: {
        type: String,
        required: [true, 'Customer is required']
    },
    provider: {
        type: String,
        default: null
    },
    serviceType: {
        type: String,
        required: [true, 'Service type is required'],
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'assigned', 'accepted', 'in-progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    scheduledDate: {
        type: Date,
        required: [true, 'Scheduled date is required']
    },
    scheduledTime: {
        type: String,
        required: [true, 'Scheduled time is required']
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    // Assignment retry tracking
    assignmentAttempts: {
        type: Number,
        default: 0
    },
    maxAssignmentAttempts: {
        type: Number,
        default: 3
    },
    // Cancellation details
    cancellationReason: String,
    cancelledBy: {
        type: String,
        enum: ['customer', 'provider', 'admin', 'system', null],
        default: null
    },
    // Status change history for observability
    statusHistory: [statusHistorySchema]
}, {
    timestamps: true
});

// Indexes for common queries
bookingSchema.index({ customer: 1, status: 1 });
bookingSchema.index({ provider: 1, status: 1 });
bookingSchema.index({ status: 1, createdAt: -1 });

// Add initial status to history on create
bookingSchema.pre('save', function (next) {
    if (this.isNew) {
        this.statusHistory.push({
            status: 'pending',
            changedAt: new Date(),
            note: 'Booking created'
        });
    }
    next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
