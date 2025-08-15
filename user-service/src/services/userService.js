// userService.js
const { User } = require('../models/user');

async function createUser({ username, email, password, phone, deviceToken }) {
  console.log('🔍 createUser service called with data:', { username, email, phone, deviceToken });
  return await User.create({ username, email, password, phone, deviceToken });
}

async function authenticateUser(email, password) {
  const user = await User.findOne({ where: { email } });
  if (!user || !(await user.validatePassword(password))) {
    throw new Error('Invalid email or password');
  }
  return user;
}

module.exports = { createUser, authenticateUser };
