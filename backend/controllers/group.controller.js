const httpStatus = require("http-status");
const sendResponse = require("../helpers/sendResponse");
const groupModel = require("../models/group.model");

const groupController = {}

groupController.createOne = async(req, res, next)=>{
    try{
        const {name, description} = req.body;
        const id = req.user._id;
        const new_group = new groupModel({name, description, leader:id});
        const save = await new_group.save();
        return sendResponse(res, httpStatus.OK, true, save, null, 'Create Group Success', null);
    }catch(err){
        next(err);
    }
}

module.exports = groupController;