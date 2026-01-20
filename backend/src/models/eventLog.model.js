const mongoose = require('mongoose');

const eventLogSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    action: {
        type: String,
        required: true
    },
    performedBy: {
        type: String
    },
    performedByRole: {
        type: String,
        enum: ['customer', 'provider', 'admin', 'system']
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient log queries
eventLogSchema.index({ bookingId: 1, timestamp: -1 });
eventLogSchema.index({ timestamp: -1 });

const EventLog = mongoose.model('EventLog', eventLogSchema);

module.exports = EventLog;
