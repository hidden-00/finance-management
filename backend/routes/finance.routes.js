const express = require('express')
const auth = require('../middlewares/auth.middleware')
const FinanceController = require('../controllers/finance.controller')
const router = express.Router()

router.get('/', auth.authentication, FinanceController.getList);
router.post('/', auth.authentication, FinanceController.createOne);
router.post('/delete/:id', auth.authentication, FinanceController.delete);
router.get('/month/:id_group', auth.authentication, FinanceController.chartMonth);
router.get('/all/:id_group', auth.authentication, FinanceController.chart);

module.exports = router