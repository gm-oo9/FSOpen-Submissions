const Blog = require('../models/post');
const blogRouter = require('express').Router();


blogRouter.get('/', (request, response, next) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
      .catch(error => {
        next(error)
      })
  })
  
blogRouter.post('/', (request, response,next) => {
    const blog = new Blog(request.body)
  
    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
      .catch(error => {
        next(error)
      })
  })
module.exports = blogRouter