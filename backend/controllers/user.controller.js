const httpStatus = require('http-status');
const sendResponse = require('../helpers/sendResponse');
const User = require('../models/user.model');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const loginlogController = require('./loginlog.controller');
const loginlogModel = require('../models/loginlog.model');
const UserController = {}

UserController.createOne = async(req, res, next)=>{
    try{
        const {email, password, name} = req.body;
        let hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        const user = new User({email, password: hashPass, name});
        const save =  await User.create(user);
        return sendResponse(res, httpStatus.OK, true, save, null, 'register success', null)
    }catch(err){
        next(err);
    }
}

UserController.getAll = async(req, res, next)=>{
    try{
        const listUser = await User.find({},{password:0});
        return sendResponse(res, httpStatus.OK, true, listUser, null, 'get all user success', null);
    }catch(err){
        next(err)
    }
}

UserController.getMe = async(req, res, next)=>{
    try{
        const _id = req.user._id;
        const me = await User.findById(_id,{password:0});
        return sendResponse(res, httpStatus.OK, true, me, null, 'get me success', null);
    }catch(err){
        next(err);
    }
}

UserController.login = async(req, res, next)=>{
    try{
        let errors = {};
        const {email, password} = req.body;
        const user = await User.findOne({email: email.toLowerCase()})
        if(!user){
            errors.email = 'Email not found';
            return sendResponse(res, httpStatus.NOT_FOUND, false, null, errors, errors.email, null);
        }else{
            const isMatch = bcrypt.compareSync(password, user.password);
            if(isMatch){
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
                return sendResponse(res, httpStatus.OK, true, payload, null, null, token);
            }else{
                errors.password = 'Password incorrect';
                return sendResponse(res, httpStatus.BAD_REQUEST, false, null, errors, errors.password, null);
            }
        }
    }catch(err){
        next(err)
    }
}

UserController.logout = async(req, res, next)=>{
    try{
        let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization || req.headers.token;
        token = token.replace('Bearer ', '');
        let inactiveLog = await loginlogModel.findOneAndUpdate({token}, {$set:{is_active: false, logout_date: Date.now()}});
        if(inactiveLog){
            return sendResponse(res, httpStatus.OK, true, null, null, 'Logged out', null);
        }else{
            return sendResponse(res, httpStatus.OK, false, null, null, 'Logged out', null);
        }
    }catch(err){
        next(err)
    }
}

module.exports = UserController