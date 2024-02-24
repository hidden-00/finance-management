const express = require('express')
const auth = require('../middlewares/auth.middleware')
const groupController = require('../controllers/group.controller')
const router = express.Router()

router.post('/', auth.authentication, groupController.createOne);

module.exports = router