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


mongoose.connect(config.MONGODB_URI).then(() => {
  logger.info('connected to MongoDB')
}).catch((error) => {
  logger.error('error connection to MongoDB:', error.message)
})

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogRouter);
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
app.use(express.static('public'));

module.exports = app