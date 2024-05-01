const httpStatus = require('http-status');
const sendResponse = require('../helpers/sendResponse');
const User = require('../models/user.model');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const loginlogController = require('./loginlog.controller');
const loginlogModel = require('../models/loginlog.model');
const userModel = require('../models/user.model');
const inviteModel = require('../models/invite.model');
const groupModel = require('../models/group.model');
const UserController = {}

UserController.createOne = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        const checkuser = await User.findOne({ email: email });
        if (checkuser) {
            const errors = { email: 'Email already exists' };
            const data = { email: email };
            return sendResponse(res, httpStatus.CONFLICT, false, data, errors, errors.email, null);
        } else {
            let hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
            const invite = await inviteModel.findOne({ email_invited: email, status: 'accept' });
            if (!invite) {
                const user = new User({ email, password: hashPass, name });
                const save = await User.create(user);
                return sendResponse(res, httpStatus.OK, true, save, null, 'Resgister success!!', null)
            } else {
                await groupModel.findByIdAndUpdate(invite.group, { $push: { members: save._id } }, { new: true });
                const user = new User({ _id: invite.user_invited, email, password: hashPass, name });
                user.groups.push(invite.group)
                const save = await User.create(user);
                invite.status= 'done';
                await invite.save();
                return sendResponse(res, httpStatus.OK, true, save, null, 'Resgister success!!', null)
            }
        }
    } catch (err) {
        next(err);
    }
}

UserController.getAll = async (req, res, next) => {
    try {
        const listUser = await User.find({}, { password: 0 });
        return sendResponse(res, httpStatus.OK, true, listUser, null, 'get all user success', null);
    } catch (err) {
        next(err)
    }
}

UserController.getMe = async (req, res, next) => {
    try {
        const _id = req.user._id;
        const me = await User.findById(_id, { password: 0 });
        return sendResponse(res, httpStatus.OK, true, me, null, 'get me success', null);
    } catch (err) {
        next(err);
    }
}

UserController.login = async (req, res, next) => {
    try {
        let errors = {};
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() })
        if (!user) {
            errors.email = 'Email not found';
            return sendResponse(res, httpStatus.NOT_FOUND, false, null, errors, errors.email, null);
        } else {
            const isMatch = bcrypt.compareSync(password, user.password);
            if (isMatch) {
                const payload = {
                    _id: user._id,
                    email: user.email,
                    name: user.name
                }
                let token = jwt.sign(payload, 'Mike22-11', {
                    expiresIn: 360000
                })
                //save loginlog
                await loginlogController.insertOne(req, token, next);
                token = `Bearer ${token}`
                return sendResponse(res, httpStatus.OK, true, payload, null, "Login success", token);
            } else {
                errors.password = 'Password incorrect';
                return sendResponse(res, httpStatus.BAD_REQUEST, false, null, errors, errors.password, null);
            }
        }
    } catch (err) {
        next(err)
    }
}

UserController.logout = async (req, res, next) => {
    try {
        let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization || req.headers.token;
        token = token.replace('Bearer ', '');
        let inactiveLog = await loginlogModel.findOneAndUpdate({ token }, { $set: { is_active: false, logout_date: Date.now() } });
        if (inactiveLog) {
            return sendResponse(res, httpStatus.OK, true, null, null, 'Logged out', null);
        } else {
            return sendResponse(res, httpStatus.OK, false, null, null, 'Logged out', null);
        }
    } catch (err) {
        next(err)
    }
}

UserController.changeInfo = async (req, res, next) => {
    try {
        const { email, name } = req.body;
        const id = req.user._id;
        const newMe = await userModel.findByIdAndUpdate(id, { $set: { email, name } }, { new: true });
        return sendResponse(res, httpStatus.OK, true, newMe, null, 'Change success', null);
    } catch (err) {
        next(err);
    }
}

UserController.changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const id = req.user._id;
        const me = await userModel.findById(id);
        if (!me) return sendResponse(res, httpStatus.NOT_FOUND, false, null, null, 'Cannot found me', null);
        const match = await bcrypt.compare(oldPassword, me.password);
        if (match) {
            const password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
            me.password = password;
            await me.save();
            return sendResponse(res, httpStatus.OK, true, me, null, 'Change password success', null);
        } else {
            return sendResponse(res, httpStatus.UNAUTHORIZED, false, null, null, 'Old Password Not Correct');
        }
    } catch (err) {
        next(err);
    }
}

module.exports = UserController