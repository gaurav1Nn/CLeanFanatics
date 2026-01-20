const authController = require('./auth.controller');
const bookingController = require('./booking.controller');
const providerController = require('./provider.controller');
const adminController = require('./admin.controller');

module.exports = {
    ...authController,
    ...bookingController,
    ...providerController,
    ...adminController
};
