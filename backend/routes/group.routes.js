const express = require('express')
const auth = require('../middlewares/auth.middleware')
const groupController = require('../controllers/group.controller')
const router = express.Router()

router.post('/', auth.authentication, groupController.createOne);
router.get('/list_name', auth.authentication, groupController.getNameList);
router.get('/:id', auth.authentication, groupController.getFinance);
router.post('/add', auth.authentication, groupController.addMember);
router.post('/delete/:id', auth.authentication, groupController.deleteGroup);
router.post('/update', auth.authentication, groupController.edit);

module.exports = router