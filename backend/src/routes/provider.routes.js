const express = require('express');
const router = express.Router();
const {
    getAssignedBookings,
    acceptBooking,
    rejectBooking,
    startService,
    completeService,
    cancelByProvider
} = require('../controllers/provider.controller');
const { authenticate, authorize } = require('../middleware');

// All routes require provider authentication
router.use(authenticate);
router.use(authorize('provider'));

// Provider booking routes
router.get('/bookings', getAssignedBookings);
router.patch('/bookings/:id/accept', acceptBooking);
router.patch('/bookings/:id/reject', rejectBooking);
router.patch('/bookings/:id/start', startService);
router.patch('/bookings/:id/complete', completeService);
router.patch('/bookings/:id/cancel', cancelByProvider);

module.exports = router;
