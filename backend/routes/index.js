const express = require('express')
const router = express.Router()

const userRoutes = require('./user.routes');
router.use('/user', userRoutes);

const financeRoutes = require('./finance.routes');
router.use('/finance', financeRoutes);

const groupRoutes = require('./group.routes')
router.use('/group', groupRoutes);

const messageRoutes = require('./message.routes');
router.use('/chat', messageRoutes);

module.exports = router