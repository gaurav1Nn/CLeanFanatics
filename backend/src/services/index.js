const assignmentService = require('./assignment.service');
const bookingService = require('./booking.service');

module.exports = {
    ...assignmentService,
    ...bookingService
};
