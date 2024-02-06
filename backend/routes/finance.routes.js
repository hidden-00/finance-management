const express = require('express')
const auth = require('../middlewares/auth.middleware')
const FinanceController = require('../controllers/finance.controller')
const router = express.Router()

router.get('/', auth.authentication, FinanceController.getList);
router.post('/', auth.authentication, FinanceController.createOne);

module.exports = router