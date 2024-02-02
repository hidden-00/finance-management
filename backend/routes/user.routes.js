const express = require('express')
const UserController = require('../controllers/user.controller')
const router = express.Router()

router.post('/', UserController.createOne)
router.get('/', UserController.getAll)

module.exports = router