const jwt = require('jsonwebtoken')
const { handleResponseError } = require('../utils/responses.js')
const _ = require('lodash')

let sampleRefreshTokens = []

const SECRET_KEY_ACCESS_TOKEN = 'abc'
const SECRET_KEY_REFRESH_TOKEN = '123'

const generateAccessToken = (userInfo) => {

  return jwt.sign({ ...userInfo }, SECRET_KEY_ACCESS_TOKEN, { expiresIn: '1h' })
}

const generateRefreshToken = (userInfo) => {

  return jwt.sign({ ...userInfo }, SECRET_KEY_REFRESH_TOKEN, { expiresIn: '7d' })
}

const checkAccessToken = (req, res, next) => {
  const authorizationHeader = req.headers.authorization
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    handleResponseError(res, 401, 'Unauthorized. Invalid token')
    return
  }
  const accessToken = _.last(authorizationHeader.split(' '))
  jwt.verify(accessToken, SECRET_KEY_ACCESS_TOKEN, (err, decodedData) => { 
    if (err) {
      handleResponseError(res, 401, 'Unauthorized. Invalid token')
      return
    }
    next()
  })
}

const checkRefreshToken = (req, res, next) => {
  const authorizationHeader = req.headers.authorization
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    handleResponseError(res, 401, 'Unauthorized. Invalid refresh token')
    return
  }
  const refreshToken = _.last(authorizationHeader.split(' '))
  if (!refreshToken || !sampleRefreshTokens.includes(refreshToken)) {
    handleResponseError(res, 401, 'Unauthorized. Invalid refresh token')
    return
  }
  jwt.verify(accessToken, SECRET_KEY_REFRESH_TOKEN, (err, decodedData) => {
    if (err) {
      handleResponseError(res, 401, 'Unauthorized. Invalid refresh token')
      return
    }
    res.locals.decodedData = decodedData;
    next()
  })
}

const checkRoleAdmin = (req, res, next) => {
  const authorizationHeader = req.headers.authorization
  const accessToken = _.last(authorizationHeader.split(" "))
  jwt.verify(accessToken, SECRET_KEY_ACCESS_TOKEN, (err, decodedData) => {
    if (decodedData.role !== "admin") {
      handleResponseError(res, 403, 'Forbidden')
      return
    }
    next()
  })
}

module.exports = {
  SECRET_KEY_REFRESH_TOKEN,
  sampleRefreshTokens,
  generateAccessToken,
  generateRefreshToken,
  checkAccessToken,
  checkRefreshToken,
  checkRoleAdmin,
}
