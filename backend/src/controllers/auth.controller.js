const { User } = require('../models');
const { asyncHandler, ApiError } = require('../middleware');

// Hardcoded users for demo purposes
const DEMO_USERS = {
  customer1: {
    _id: 'customer1',
    name: 'John Customer',
    email: 'john@example.com',
    role: 'customer',
    phone: '9876543210'
  },
  // CLEANERS - Multiple providers with different distances
  provider1: {
    _id: 'provider1',
    name: 'Mike Cleaner',
    email: 'mike@example.com',
    role: 'provider',
    phone: '9876543211',
    serviceCategories: ['sofa-cleaning', 'window-wash', 'floor-cleaning', 'deep-cleaning'],
    isAvailable: true,
    mockDistance: 1.5 // km - CLOSEST cleaner
  },
  provider4: {
    _id: 'provider4',
    name: 'Sarah Sparkle',
    email: 'sarah@example.com',
    role: 'provider',
    phone: '9876543214',
    serviceCategories: ['sofa-cleaning', 'window-wash', 'deep-cleaning'],
    isAvailable: true,
    mockDistance: 2.8 // km - Second closest cleaner
  },
  provider5: {
    _id: 'provider5',
    name: 'Tom Tidy',
    email: 'tom@example.com',
    role: 'provider',
    phone: '9876543215',
    serviceCategories: ['floor-cleaning', 'deep-cleaning', 'window-wash'],
    isAvailable: true,
    mockDistance: 5.2 // km - Third closest cleaner
  },
  // PLUMBER
  provider2: {
    _id: 'provider2',
    name: 'Sam Plumber',
    email: 'sam@example.com',
    role: 'provider',
    phone: '9876543212',
    serviceCategories: ['leaking-tap', 'pipe-repair', 'drain-cleaning', 'bathroom-fitting'],
    isAvailable: true,
    mockDistance: 3.8 // km - medium distance
  },
  // ELECTRICIANS - Multiple providers with different distances
  provider3: {
    _id: 'provider3',
    name: 'Alex Electrician',
    email: 'alex@example.com',
    role: 'provider',
    phone: '9876543213',
    serviceCategories: ['wiring-repair', 'appliance-repair', 'switch-installation'],
    isAvailable: true,
    mockDistance: 7.2 // km - Fourth closest electrician
  },
  provider6: {
    _id: 'provider6',
    name: 'Emma Electric',
    email: 'emma@example.com',
    role: 'provider',
    phone: '9876543216',
    serviceCategories: ['wiring-repair', 'appliance-repair', 'switch-installation'],
    isAvailable: true,
    mockDistance: 0.8 // km - CLOSEST electrician
  },
  provider7: {
    _id: 'provider7',
    name: 'David Wires',
    email: 'david@example.com',
    role: 'provider',
    phone: '9876543217',
    serviceCategories: ['switch-installation', 'appliance-repair'],
    isAvailable: true,
    mockDistance: 4.5 // km - Second closest electrician
  },
  admin1: {
    _id: 'admin1',
    name: 'Admin User',
    email: 'admin@cleanfanatics.com',
    role: 'admin',
    phone: '9876543200'
  }
};

// Simple login - just return user based on role selection
const login = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId || !DEMO_USERS[userId]) {
    throw new ApiError(400, 'Invalid user ID. Use: customer1, provider1-7, or admin1');
  }

  const user = DEMO_USERS[userId];

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user,
      // These headers should be sent with subsequent requests
      headers: {
        'x-user-id': user._id,
        'x-user-role': user.role
      }
    }
  });
});

// Get current user info
const getMe = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // First try demo users
  if (DEMO_USERS[userId]) {
    return res.json({
      success: true,
      data: DEMO_USERS[userId]
    });
  }

  // Then try database
  const user = await User.findById(userId).select('-__v');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.json({
    success: true,
    data: user
  });
});

// Get all demo users (for frontend dropdown)
const getDemoUsers = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: Object.values(DEMO_USERS)
  });
});

// Get all providers (for admin assignment)
const getProviders = asyncHandler(async (req, res) => {
  const { serviceType } = req.query;

  let providers = Object.values(DEMO_USERS).filter(u => u.role === 'provider');

  if (serviceType) {
    providers = providers.filter(p => p.serviceCategories.includes(serviceType));
  }

  res.json({
    success: true,
    data: providers
  });
});

module.exports = {
  login,
  getMe,
  getDemoUsers,
  getProviders,
  DEMO_USERS
};
