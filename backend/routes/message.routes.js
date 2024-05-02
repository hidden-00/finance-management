const express = require('express')
const auth = require('../middlewares/auth.middleware')
const MessageController = require('../controllers/message.controller');
const router = express.Router()

router.get('/:user_id', auth.authentication, MessageController.getChat);

module.exports = router;