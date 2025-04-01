const jwt = require('jsonwebtoken')
const User = require('../models/user')
const logger = require('./logger')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('Authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }
  next()
}

const userExtractor = async (request, response, next) => {
  try {
    logger.info(request.token)
    if (!request.token) {
      return response.status(401).json({ error: 'token missing' })
    }
    
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    logger.info(decodedToken)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findById(decodedToken.id)
    logger.info(user)
    if (!user) {
      return response.status(401).json({ error: 'user not found' })
    }

    request.user = user
    next()
  } catch (error) {
    logger.error(error)
    next(error)
  }
}

module.exports = { tokenExtractor, userExtractor }
