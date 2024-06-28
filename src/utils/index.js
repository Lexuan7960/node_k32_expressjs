const bcrypt = require('bcrypt')

const saltRounds = 10

const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds)
}

const checkPasswordUser = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword)
}

const checkEmailUser = (users, email) => {
  return users.find(user => user.email === email)
}

const checkItem = (items, id) => {
  return items.find(item => item.id === id)
}

module.exports = {
  saltRounds,
  hashPassword,
  checkPasswordUser,
  checkEmailUser,
  checkItem,
}