const express = require('express')
const router = express.Router()

const userRoutes = require('./user.routes');
router.use('/user', userRoutes);

const financeRoutes = require('./finance.routes');
router.use('/finance', financeRoutes);

module.exports = router