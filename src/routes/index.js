const express = require('express');
const rootRoute = express.Router()

const authRoute = require("./authRoute.js")
const itemRoute = require("./itemRoute.js")

rootRoute.use("/auth", authRoute)
rootRoute.use("/item", itemRoute)

module.exports = rootRoute;