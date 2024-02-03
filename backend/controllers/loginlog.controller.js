const loginlogController = {}
const jwt = require('jsonwebtoken')
const loginLog = require('../models/loginlog.model')

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

module.exports = loginlogController