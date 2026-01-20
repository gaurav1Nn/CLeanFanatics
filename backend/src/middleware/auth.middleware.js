const { ApiError } = require('./errorHandler');

// Simple auth middleware - checks for user ID in headers
// In production, this would validate JWT tokens
const authenticate = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'];

    if (!userId || !userRole) {
        throw new ApiError(401, 'Authentication required. Please provide x-user-id and x-user-role headers');
    }

    req.user = {
        id: userId,
        role: userRole
    };

    next();
};

// Role-based authorization middleware
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, `Access denied. Required role: ${roles.join(' or ')}`);
        }
        next();
    };
};

module.exports = {
    authenticate,
    authorize
};
