'use strict';

// User model goes here

const mongoose = require('mongoose');
const Schema = new mongoose.Schema ({
  username: {
    type: String, 
    required: true, 
    lowercase: true,
    trim: true,
    unique: true
  },
  passwordHash: {
    type: String, 
    required: true
  }
});

module.exports = mongoose.model('User', Schema);
