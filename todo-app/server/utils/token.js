const jwt = require('jsonwebtoken');
require('dotenv').config();

const createToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '3d' });

module.exports = { createToken };
