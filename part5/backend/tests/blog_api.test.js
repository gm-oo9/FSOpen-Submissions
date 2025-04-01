const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user');
const Blog = require('../models/post');
const api = supertest(app);
const assert = require('assert');
const { initialBlogs } = require('./blogtest_helper');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { test, beforeEach, after } = require('node:test');
let token = null

beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('password', 10);
    const user = new User({
      username: 'root',
      name: 'Superuser',
      passwordHash
    })
    const savedUser = await user.save();

    const userForToken = {
      username: savedUser.username,
      id: savedUser._id,
    }

    token = jwt.sign(userForToken, process.env.SECRET)
    const blogObjects = initialBlogs.map((blog) =>({...blog, user: savedUser._id}));
    await Blog.insertMany(blogObjects);
  });
  

test('Blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('There are three blogs', async () => {
  const response = await api.get('/api/blogs');
  // console.log(response.body);

  assert.strictEqual(response.body.length, 3, 'There are three blogs');
});

test('The unique identifier of a blog post is named id instead of _id', async () => {
        const response = await api.get('/api/blogs');
        assert.ok(response.body[0].blogId, 'Id is defined');
        assert.strictEqual(response.body[0]._id, undefined, 'Id is undefined');
      }    
)

test('POST /api/blogs creates a new blog', async () => {
  const newBlog = {
    title: 'Blog 4',
    author: 'Author 4',
    url: 'http://example.com/4', 
    likes: 4
  };
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    assert.strictEqual(response.body.length, 4, 'There are four blogs');
});

test('Likes value is set to 0 when a blog is created', async () => {
  const newBlog = {
    title: 'Blog 4',
    author: 'Author 4',
    url: 'http://example.com/4'
  };
  const response = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog);
  assert.strictEqual(response.body.likes, 0, 'Likes value is set to 0');
});

test('Validation fails with proper statuscode and message if title or url is missing', async () => {
  const newBlog = {
    author: 'Author 4',
    likes: 4
  };
  const response = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(400);
  assert.strictEqual(response.status, 400);
  assert.ok(response.body.error.includes('title'), 'Title is missing');
  assert.ok(response.body.error.includes('url'), 'Url is missing');
});

test('DELETE api/blogs/:id deletes a blog', async () => {
  let response = await api.get('/api/blogs');
  const id = response.body[0].blogId;
  await api.delete(`/api/blogs/${id}`).set('Authorization', `Bearer ${token}`).expect(204);
  response = await api.get('/api/blogs');

  assert.strictEqual(response.body.length, 2, 'There are two blogs left');
});

test('PUT api/blogs/:id updates a blog', async () => {
  let response = await api.get('/api/blogs');
  const id = response.body[1].blogId;
  const newBlog = {
    title: 'Blog 4',
    author: 'Author 4',
    url: 'http://example.com/4',
    likes: 4
  };
  await api.put(`/api/blogs/${id}`).set('Authorization', `Bearer ${token}`).send(newBlog).expect(200);
  response = await api.get('/api/blogs');
  assert.strictEqual(response.body[1].likes,4, "Likes have been updated")

});
// test()

after(async () => {
  await mongoose.connection.close();
});
