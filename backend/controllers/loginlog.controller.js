const loginlogController = {}
const jwt = require('jsonwebtoken')
const loginLog = require('../models/loginlog.model')
const sendResponse = require("../helpers/sendResponse");
const httpStatus = require('http-status');

loginlogController.insertOne = async(req, token, next)=>{
    try{
        let jwtpayload = await jwt.verify(token, 'Mike22-11');
		let expires_in = new Date(jwtpayload.exp * 1000);
		let user_id = jwtpayload._id;
		const newLog = new loginLog({user_id, expires_in, ip_address: req.client_info.ip, device_info: req.client_info.device, browser_info: req.client_info.browser, token});
		return newLog.save();
    }catch(err){
        next(err)
    }
}

loginlogController.logout = async(req, res, next)=>{
    try{
        const {id} = req.body;
        const user_id = req.user._id;
        const save = await loginLog.findOneAndUpdate({_id:id, user_id, is_active: true}, {$set:{is_active: false}}, {new: true});
        console.log(save)
        return sendResponse(res, httpStatus.OK, save?true: false, save, null, 'Logout success', null);
    }catch(err){
        next(err);
    }
}

loginlogController.getAll = async(req, res, next)=>{
    try{
        const user_id = req.user._id;
        const list_log = await loginLog.find({user_id});
        if(list_log) list_log.reverse();
        return sendResponse(res, httpStatus.OK, true, list_log, null, 'Get Logs Success', null);
    }catch(err){
        next(err);
    }
}

module.exports = loginlogController