const express = require('express')
const UserController = require('../controllers/user.controller')
const auth = require('../middlewares/auth.middleware')
const router = express.Router()

router.post('/', UserController.createOne)
router.get('/', auth.authentication, UserController.getAll)
router.post('/login', auth.getClientInfo, UserController.login);
router.post('/logout', auth.authentication, UserController.logout);
router.get('/info', auth.authentication, UserController.getMe);

module.exports = router