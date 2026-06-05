const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');
const Watchlist = require('../models/Watchlist');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;  // added name

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('An account with that email already exists');
  }

  const user = await User.create({
    name,                                              // added name
    email,
    password,
    role: role === 'analyst' ? 'analyst' : 'viewer'
  });

  await Watchlist.create({ userId: user._id, stocks: [] });

  res.status(201).json({
    _id: user._id,
    name: user.name,                                   // added name
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role, user.email)
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.comparePassword(password))) {
    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role, user.email)
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
});

module.exports = { registerUser, loginUser, getProfile };