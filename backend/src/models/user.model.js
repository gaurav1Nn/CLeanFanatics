const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        enum: ['customer', 'provider', 'admin'],
        default: 'customer'
    },
    // Provider-specific fields
    serviceCategories: [{
        type: String,
        enum: ['cleaning', 'plumbing', 'electrical']
    }],
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for faster provider queries
userSchema.index({ role: 1, isAvailable: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
