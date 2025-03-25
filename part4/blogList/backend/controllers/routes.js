const Blog = require('../models/post');
const blogRouter = require('express').Router();
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')
const { userExtractor } = require('../utils/authMiddleware');
const user = require('../models/user');

blogRouter.get('/', async(request, response, next) => {
    try{
    const blogs = await Blog.find({}).populate('user')
        
    
    response.status(200).json(blogs)
    } catch (error){
        next(error)
    }
})
  
blogRouter.post('/', userExtractor, async(request, response, next) => {
    try{
    
    const blog = new Blog({...request.body, user: user._id})
    
    const blogs = await blog.save()
    request.user.blogs = request.user.blogs.concat(blogs._id)
    await request.user.save()

    response.status(201).json(blogs)
    } catch (error){
        next(error)
    }
})

blogRouter.delete('/:id',userExtractor, async(request, response, next) => {
    try{
    const blog = await Blog.findById(request.params.id)
    if (!blog){
        return response.status(404).json({error: "Blog not found"});

    }
    // console.log(`User ID: ${request.user._id}, Blog User ID: ${blog.user}, blog : ${blog}`);
    if(blog.user.toString() !== request.user._id.toString()){
        return response.status(403).json({error: "UnAuthorized: User is not the Owner of the Blog."})
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
    } catch (error){
        // console.error("Error deleting blog:", error); 
        next(error)
    }
})

blogRouter.put('/:id', async(request, response, next) => {
    
    try{
        updatedBlog = await Blog.findById(request.params.id)
        if (!updatedBlog){
            return response.status(404).json({ error: 'blog not found' })
        }
        updatedBlog.title = request.body.title
        updatedBlog.author = request.body.author
        updatedBlog.url = request.body.url
        updatedBlog.likes = request.body.likes
        updatedBlog = await updatedBlog.save()
        response.status(200).json(updatedBlog)
    } catch (error){
        next(error)
        
    }
})

module.exports = blogRouter