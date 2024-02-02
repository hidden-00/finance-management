const httpStatus = require('http-status');
const sendResponse = require('../helpers/sendResponse');
const User = require('../models/user.model');
const bcrypt = require('bcrypt')
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
        const listUser = await User.find();
        return sendResponse(res, httpStatus.OK, true, listUser, null, 'get all user success', null);
    }catch(err){
        next(err)
    }
}

module.exports = UserController