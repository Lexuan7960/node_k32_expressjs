const express = require('express');
const { getItems, getItemById, getItemPagination, createNewItem, updateItem, deleteItem } = require("../controller/itemController.js")
const { checkAccessToken, checkRoleAdmin } = require("../middleware/auth.js");
const itemRoute = express.Router()

itemRoute.get("/", checkAccessToken, getItems)
itemRoute.get("/:id", checkAccessToken, getItemById)
itemRoute.get("/pagination", checkAccessToken, getItemPagination)

itemRoute.post("/", checkAccessToken, checkRoleAdmin, createNewItem)
itemRoute.put("/:id", checkAccessToken, checkRoleAdmin, updateItem)
itemRoute.delete("/:id", checkAccessToken, checkRoleAdmin, deleteItem)

module.exports = itemRoute;