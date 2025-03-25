const { initialUsers } = require('./usertest_helper');
const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const api = supertest(app);
const jwt = require('jsonwebtoken');
const assert = require('assert');

const { describe, test, beforeEach, after } = require('node:test');

let token = '';

beforeEach(async () => {
  await User.deleteMany({});

  // Hash passwords and create initial users
  // console.log(initialUsers)
  const users = await Promise.all(
    initialUsers.map(async (user) => {
      const passwordHash = await bcrypt.hash(user.password, 10);
      return{
      username: user.username,
      name: user.name,
      passwordHash: passwordHash,
    }}));
  // console.log(users)
  await User.insertMany(users);

  // Generate a token for one test user
  const testUser = await User.findOne({ username: initialUsers[0].username });
  const userForToken = { username: testUser.username, id: testUser._id };
  token = jwt.sign(userForToken, process.env.SECRET);
});

describe('GET /api/users', () => {
  test('Users are returned as JSON', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
});

describe.only('POST /api/users', () => {
  test('creates a new user', async () => {
    const newUser = {
      username: 'test1',
      name: 'Test User1',
      password: 'password'
    };
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  });

  test('fails with status 400 if username or password is missing', async () => {
    const userWithoutPassword = {
      username: 'test1',
      name: 'Test User1'
    };

    await api
      .post('/api/users')
      .send(userWithoutPassword)
      .expect(400);

    const userWithoutUsername = {
      name: 'Test User2',
      password: 'securepassword'
    };

    await api
      .post('/api/users')
      .send(userWithoutUsername)
      .expect(400);
  });
});

describe('POST /api/login', () => {
  test('returns a valid token for correct credentials', async () => {
    const loginDetails = {
      username: initialUsers[0].username,
      password: initialUsers[0].password,
    };

    const response = await api
      .post('/api/login')
      .send(loginDetails)
      .expect(200);

    assert(response.body.token); //if the value is undefined,0,null,"" then it will fail
  });

  test('fails with status 401 for invalid credentials', async () => {
    const wrongLogin = {
      username: initialUsers[0].username,
      password: 'wrongpassword',
    };

    await api.post('/api/login').send(wrongLogin).expect(401);
  });
});

after(async () => {
  await mongoose.connection.close();
});
