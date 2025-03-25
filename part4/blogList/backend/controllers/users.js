const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const User = require('../models/user');
const Blog = require('../models/post');
const jwt = require('jsonwebtoken');

userRouter.post('/', async(request, response, next) => {

    try{
        const {username,name,password} = request.body;
        if (!password || password.length < 3) {
            return response.status(400).json({error: 'password must be at least 3 characters long'});
        }
        if (!username || username.length < 3) {
            return response.status(400).json({error: 'username must be at least 3 characters long'});
        }
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password,saltRounds);0
        const blogs = [] 
        // // console.log(blogs);
        const randomBlog = blogs.length > 0 ? blogs[Math.floor(Math.random() * blogs.length)]._id.toString() : null;

        
        const user = new User({
            username,
            name,
            passwordHash,
            blogs: randomBlog ? [randomBlog] : []
        })
        const savedUser = await user.save();

        response.status(201).json(savedUser);
    } catch(error){
        next(error)
    }
})

userRouter.get('/', async(request, response, next) => {
    try{
        const users = await User.find({}).populate('blogs');
        response.json(users);
    } catch(error){
        next(error)
    }
})

// userRouter.delete('/:id', async(request,response,next)=> {
//     try{
//         await User.findByIdAndDelete(request.params.id)
//         response.status(204).end();

//     }catch(error){
//         next(error)
//     }
// })
module.exports = userRouter;