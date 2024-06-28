const bcrypt = require('bcrypt');

const {saltRounds, hashPassword, checkEmailUser, checkPasswordUser } = require('../utils');
const { handleResponseError, handleResponseSuccess } = require('../utils/responses.js');
const { generateAccessToken, sampleRefreshTokens, generateRefreshToken } = require('../middleware/auth.js');
const _ = require('lodash');

const users = [
    {email: 'user1@gmail.com', password: bcrypt.hashSync('user1', saltRounds), role: 'admin'},
    {email: 'user2@gmail.com', password: bcrypt.hashSync('user2', saltRounds), role: 'user'},
]

const register = async (req, res) => {
    const newUser = req.body
    //console.log({newUser})
    const { password } = newUser
    try {
    newUser.password = await hashPassword(password)
    users.push({...newUser, role: 'user'})
    const cloneNewUser = {...newUser, role: 'user'}
    delete cloneNewUser.password
    handleResponseSuccess(res, 201, "Register successfully", {...cloneNewUser})
    } catch (error) {
    handleResponseError(res, 500, "Internal Server Error")
    }
}

const login = async (req, res) => {
  const user = req.body
  const { email, password } = user
  console.log("Login attempt:", { email, password });
  try {
    const checkedEmailUser = checkEmailUser(users, email)
    console.log("Checked Email User:", checkedEmailUser);
    if (!checkedEmailUser) {
      handleResponseError(res, 401, "Email is incorrect")
      return
    }
    console.log("Stored hashed password:", checkedEmailUser.password);
    const checkedPasswordUser = await checkPasswordUser(password, checkedEmailUser.password)
    console.log("Password match:", checkedPasswordUser); 
    if (!checkedPasswordUser) {
      handleResponseError(res, 401, "Password is incorrect")
      return
    }
    const accessToken = generateAccessToken({
      email: checkedEmailUser.email,
      password: checkedPasswordUser.password,
      role: checkedPasswordUser.role
    })
    const refreshToken = generateRefreshToken({
      email: checkedEmailUser.email,
      password: checkedPasswordUser.password,
      role: checkedPasswordUser.role
    })
    sampleRefreshTokens.push(refreshToken)
    const cloneUser = { ...checkedEmailUser }
    delete cloneUser.password
    handleResponseSuccess(res, 200, "Login successfully", {
      ...cloneUser,
      accessToken,
      refreshToken,
    })
  } catch (error) {
    console.error("Internal Server Error:", error);
    handleResponseError(res, 500, "Internal server error")
  }
}

const handleRefreshToken = (req, res) => {
    const authorizationHeader = req.headers.authorization
    const refreshToken = _.lodash(authorizationHeader.split(''))
    console.log(res.locals.decodedData)
    const newAccessToken = generateAccessToken({
        ...req.locals.decodedData
    })
    console.log({newAccessToken})
    handleResponseSuccess(res, 200, "Refresh token successfully",{ newAccessToken })
}

const changePassword = async (req, res) => {
   const {email, password, newPassword} = req.body
try { 
    const checkedEmailUser = checkEmailUser(users, email)
if (!checkedEmailUser) {
    handleResponseError(res, 401, "Email is incorrect")
    return
}
const checkedPasswordUser = await checkPasswordUser(password, checkedEmailUser.password)
if (!checkedPasswordUser) {
    handleResponseError(res, 401, "Password is incorrect")
    return
}
checkEmailUser.password = await hashPassword(newPassword)

handleResponseSuccess(res, 200, "Change Password Successfully")
    } catch (error) {
    handleResponseError(res, 500, "Internal Server Error")
    }     
}

const forgotPassword = async (req, res) => {
    const { email, newPassword } = req.body
    try { 
        const checkedEmailUser = checkEmailUser(users, email)
    if (!checkedEmailUser) {
        handleResponseError(res, 401, "Email is incorrect")
        return
    }
    checkEmailUser.password = await hashPassword(newPassword)
    
    handleResponseSuccess(res, 200, "Reset Password Successfully")
        } catch (error) {
        handleResponseError(res, 500, "Internal Server Error")
        }    
}

const logout = (req, res) => {
    handleResponseSuccess(res, 200, "Logout Successfully")
}

module.exports = {
    register,
    login,
    handleRefreshToken,
    changePassword,
    forgotPassword,
    logout,
}