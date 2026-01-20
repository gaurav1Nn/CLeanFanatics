const express = require('express');
const router = express.Router();
const {
    createBooking,
    getMyBookings,
    getBooking,
    cancelBooking,
    getBookingHistory
} = require('../controllers/booking.controller');
const { authenticate, authorize } = require('../middleware');

// All routes require authentication
router.use(authenticate);

// Customer booking routes
router.post('/', authorize('customer'), createBooking);
router.get('/my', authorize('customer'), getMyBookings);
router.get('/:id', getBooking);
router.patch('/:id/cancel', authorize('customer'), cancelBooking);
router.get('/:id/history', getBookingHistory);

module.exports = router;
