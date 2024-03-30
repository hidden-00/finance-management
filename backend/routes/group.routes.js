const express = require('express')
const auth = require('../middlewares/auth.middleware')
const groupController = require('../controllers/group.controller')
const router = express.Router()
const validateGroup = require('../validation/group');

router.post('/', auth.authentication, validateGroup.sanitizePost, validateGroup.validatePost, groupController.createOne);
router.get('/list_name', auth.authentication, groupController.getNameList);
router.get('/:id', auth.authentication, groupController.getFinance);
router.post('/add', auth.authentication, validateGroup.sanitizeEmail, validateGroup.validateEmail,groupController.addMember);
router.post('/delete/:id', auth.authentication, groupController.deleteGroup);
router.post('/update', auth.authentication,validateGroup.sanitizePost, validateGroup.validatePost, groupController.edit);
router.post('/remove_member', auth.authentication, groupController.removeMember);

module.exports = router