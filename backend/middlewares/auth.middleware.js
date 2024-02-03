const httpStatus = require("http-status");
const jwt = require('jsonwebtoken')
const useragent = require('useragent')
const requestIp = require('request-ip');
const sendResponse = require('../helpers/sendResponse');

const auth = {}

auth.authentication = async(req, res, next)=>{
    try{
        let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization || req.headers.token;
        if(token && token.length){
            token = token.replace('Bearer ', '');
            const d = await jwt.verify(token, 'Mike22-11')
            req.user = d;
            //check loginlog
            let passed = await loginLogSchema.findOne({ token, is_active: true });
            if(passed){
                return next();
            }
            return sendResponse(res, httpStatus.UNAUTHORIZED, false, null, null, 'Session Expired', null);
        }
        return sendResponse(res, httpStatus.UNAUTHORIZED, false, null, token, 'token not found', null);
    }catch(err){
        next(err);
    }
}

auth.authorization = async(req, res, next)=>{
    try{

    }catch(err){
        next(err);
    }
}

auth.getClientInfo = async(req, res, next)=>{
    let info = {};
    let agent = useragent.parse(req.headers['user-agent']);
    info.browser = agent.toAgent().toString();
    info.device = agent.os.toString();

    info.ip = requestIp.getClientIp(req);
    req.client_info = info;
    return next();
}

module.exports = auth;