const { handleResponseSuccess, checkItem } = require("../utils")

const items = [
    { id: 1, name: 'item 1', description: 'item 1 description' },
    { id: 2, name: 'item 2', description: 'item 2 description' },
    { id: 3, name: 'item 3', description: 'item 3 description' },
    { id: 4, name: 'item 4', description: 'item 4 description' },
    { id: 5, name: 'item 5', description: 'item 5 description' },
    { id: 6, name: 'item 6', description: 'item 6 description' },
    { id: 7, name: 'item 7', description: 'item 7 description' },
    { id: 8, name: 'item 8', description: 'item 8 description' },
    { id: 9, name: 'item 9', description: 'item 9 description' },
    { id: 10, name: 'item 10', description: 'item 10 description' },
    { id: 11, name: 'item 11', description: 'item 11 description' },
    { id: 12, name: 'item 12', description: 'item 12 description' },
    { id: 13, name: 'item 13', description: 'item 13 description' },
  ]

  const getItems = (req, res) => {
    handleResponseSuccess(res, 200, "Get item successfully", { items })
  }

  const getItemById = (req, res) => {
    const { id } = req.params
    const checkedItem = checkItem(items, id)
    if(!checkItem) {
      handleResponseError(res, 404, "Item not found")
      return
    } 
    handleResponseSuccess(res, 200, "Get item successfully", { ...checkedItem })
  }

  const getItemPagination = (req, res) => {
    const { pageIndex, limit } = req.query
    const startIndex = (pageIndex - 1) * limit
    const endIndex = startIndex + limit -1
    let result ={
      data: items.slice(startIndex, endIndex + 1),
      itemsPerPage: limit,
      currentPage: pageIndex,
      totalPages: Math.ceil(items.length/limit)
    }
    handleResponseSuccess(res, 200, "Get item pagination successfully", {...result})
  }

  const createNewItem = (req, res) => {
    const { name, description } = req.body
    if(!name) {
      handleResponseError(res, 400, "Name is required")
      return
    }
    if(!description) {
      handleResponseError(res, 400, "Description is required")
      return
    }
    const newItem = {
      id: items.length + 1,
      name,
      description,
    }
    items.push(newItem)
    handleResponseSuccess(res, 201, "Create new item successfully", {...newItem})
  }

  const updateItem = (req, res) => {
    const { id } = req.params
    const { name, description } = req.body
    const checkedItem = checkItem(items, id)
    if(!checkItem) {
      handleResponseError(res, 404, "Item not found")
      return
    }
    if(!name) {
      handleResponseError(res, 400, "Name is required")
      return
    }
    if(!description) {
      handleResponseError(res, 400, "Description is required")
      return
    }
    checkedItem = { ...description, name, description }
   handleResponseSuccess(res, 200, "Update item successfully", {...checkedItem})
  }

  const deleteItem = (req, res) => {
    const { id } = req.params
    const checkedItemIndex = items.findIndex(item => item.id === parseInt(id))
    if(checkedItemIndex === -1) {
      handleResponseError(res, 404, "Item not found")
      return
    }
    items.splice(checkedItemIndex, 1)
    handleResponseSuccess(res, 200, "Delete item successfully")
  }
   
  module.exports = {
    getItems,
    getItemById,
    getItemPagination,
    createNewItem,
    updateItem,
    deleteItem,
  }