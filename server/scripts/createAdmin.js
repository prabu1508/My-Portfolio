#!/usr/bin/env node
/*
  One-time script to create an admin user.
  Usage (PowerShell):
    cd d:\\Portfolio\\server
    node scripts\\createAdmin.js

  The script reads MONGODB_URI from environment or defaults to mongodb://localhost:27017/portfolio
  It will not create a duplicate user if the email already exists.
  After running successfully you may delete this file if you want.
*/

require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');

const ADMIN = {
  username: 'prabu',
  email: 'prabu@gmail.com',
  password: 'Kettavan@04'
};

const run = async () => {
  try {
    await connectDB();

    const existing = await User.findOne({ email: String(ADMIN.email).trim().toLowerCase() });
    if (existing) {
      console.log('Admin user already exists:', existing.email);
      process.exit(0);
    }

    const user = new User({
      username: ADMIN.username,
      email: ADMIN.email,
      password: ADMIN.password
    });

    await user.save();
    console.log('Admin user created:', user.email);
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin user:', err.message);
    process.exit(1);
  }
};

run();
