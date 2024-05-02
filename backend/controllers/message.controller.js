const MessageModel = require('../models/message.model');
const sendResponse = require('../helpers/sendResponse');
const httpStatus = require('http-status');
const MessageController = {}

MessageController.getChat = async(req, res, next)=>{
    try{
        const {user_id} = req.params;
        const me_id = req.user._id;
        const messages = await MessageModel.find({
            $or:[
                {
                    $and:[{sender: user_id},{receiver: me_id}]
                },
                {
                    $and:[{sender: me_id}, {receiver: user_id}]
                }
            ]
        }).populate('sender receiver');
        return sendResponse(res, httpStatus.OK, true, messages, null, 'Get Messages Success', null);
    }catch(err){
        next(err);
    }
}

module.exports = MessageController;