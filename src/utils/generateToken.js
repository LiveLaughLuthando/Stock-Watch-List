const jwt = require('jsonwebtoken');
const env = require('../config/env');

const generateToken = (id, role, email) => {
  return jwt.sign({ id, role, email }, env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

module.exports = generateToken;