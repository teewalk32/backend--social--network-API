const connection = require('../config/connection');
const { User, Thought } = require('../models');

connection.on('error', (err) => err);