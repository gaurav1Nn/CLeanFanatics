const express = require('express');
const router = express.Router();
const {
    getAllBookings,
    overrideStatus,
    assignProvider,
    markNoShow,
    getEventLogs,
    getDashboardStats
} = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middleware');

// All routes require admin authentication
router.use(authenticate);
router.use(authorize('admin'));

// Admin routes
router.get('/bookings', getAllBookings);
router.get('/stats', getDashboardStats);
router.patch('/bookings/:id/override', overrideStatus);
router.patch('/bookings/:id/assign', assignProvider);
router.patch('/bookings/:id/no-show', markNoShow);
router.get('/logs', getEventLogs);

module.exports = router;
