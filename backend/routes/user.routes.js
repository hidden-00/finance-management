const express = require('express')
const UserController = require('../controllers/user.controller')
const auth = require('../middlewares/auth.middleware')
const validateUser = require('../validation/user');
const loginlogController = require('../controllers/loginlog.controller');
const router = express.Router();

router.post('/', validateUser.sanitizeRegister, validateUser.validateRegisterInput, UserController.createOne)
// router.get('/get_id', auth.authentication, UserController.getIdByEmail);
router.get('/info', auth.authentication, UserController.getMe);
router.get('/logs', auth.authentication, loginlogController.getAll);
router.get('/', auth.authentication, UserController.getAll)
router.post('/login', validateUser.sanitizeLogin, validateUser.validateLoginInput, auth.getClientInfo, UserController.login);
router.post('/logout', auth.authentication, UserController.logout);
router.post('/remove_token', auth.authentication, loginlogController.logout);

module.exports = router