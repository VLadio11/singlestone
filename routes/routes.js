const express = require('express')
const { getUsers, createUser, deleteUser, getOneUser, updateUser, getCallList} = require("../controllers/userOperations")
const router = express.Router()

router.get('/contacts/call-list', getCallList) 
router.post('/contacts', createUser)
router.get('/contacts', getUsers)
router.get('/contacts/:id', getOneUser)
router.delete('/contacts/:id',deleteUser)
router.put('/contacts/:id', updateUser)

module.exports = router