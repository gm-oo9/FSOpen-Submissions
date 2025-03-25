const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config({path:"../.env"})
const Blog = require('./models/post')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const blogRouter = require('./controllers/routes')
const middleware = require('./utils/middleware')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const {tokenExtractor} = require('./utils/authMiddleware')


mongoose.connect(config.MONGODB_URI).then(() => {
  logger.info('connected to MongoDB')
}).catch((error) => {
  logger.error('error connection to MongoDB:', error.message)
})


app.use(cors());
app.use(tokenExtractor);
app.use(express.json());
app.use(middleware.requestLogger);
app.use('/api/login', loginRouter);
app.use('/api/users', userRouter);
app.use('/api/blogs', blogRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);
app.use(express.static('public'));

module.exports = app