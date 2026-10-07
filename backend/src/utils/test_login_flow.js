const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const User = require('../models/User');
const { registerUser, loginUser } = require('../controllers/authController');

async function testAuth() {
  await connectDB();

  console.log('\n--- TESTING REGISTER ---');
  const reqReg = {
    body: {
      name: 'Test Student',
      email: 'teststudent@gmail.com',
      password: 'studentpassword123',
    },
  };

  let resData = null;
  const resReg = {
    status: (code) => ({
      json: (data) => {
        console.log(`Register status ${code}:`, data);
        resData = data;
      },
    }),
    json: (data) => console.log('Register json:', data),
  };

  await registerUser(reqReg, resReg);

  console.log('\n--- TESTING LOGIN WITH NEW USER ---');
  const reqLogin = {
    body: {
      email: 'teststudent@gmail.com',
      password: 'studentpassword123',
    },
  };

  const resLogin = {
    status: (code) => ({
      json: (data) => console.log(`Login status ${code}:`, data),
    }),
    json: (data) => console.log('Login json:', data),
  };

  await loginUser(reqLogin, resLogin);

  console.log('\n--- TESTING LOGIN WITH DEMO SEEDED USER ---');
  const reqDemo = {
    body: {
      email: 'keerthi@gmail.com',
      password: 'userpassword123',
    },
  };

  await loginUser(reqDemo, resLogin);

  console.log('\n--- TESTING LOGIN WITH WRONG PASSWORD ---');
  const reqWrong = {
    body: {
      email: 'keerthi@gmail.com',
      password: 'wrongpassword',
    },
  };

  await loginUser(reqWrong, resLogin);

  process.exit(0);
}

testAuth();
