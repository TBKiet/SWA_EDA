const mongoose = require('mongoose');
const config = require('../config/database');

mongoose.connect(config.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = mongoose;
