const express = require('express');
const { register, login, handleRefreshToken, changePassword, forgotPassword, logout } = require("../controller/authController.js");
const { checkRefreshToken } = require('../middleware/auth.js');
const authRoute = express.Router()

authRoute.post("/register", register)
authRoute.post("/login", login)

authRoute.post("/refresh-token", checkRefreshToken, handleRefreshToken)

authRoute.put("/change-password", changePassword)
authRoute.put("/forgot-password", forgotPassword)

module.exports = authRoute;