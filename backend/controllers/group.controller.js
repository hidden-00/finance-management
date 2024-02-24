const httpStatus = require("http-status");
const sendResponse = require("../helpers/sendResponse");
const groupModel = require("../models/group.model");
const userModel = require("../models/user.model");

const groupController = {}

groupController.createOne = async(req, res, next)=>{
    try{
        const {name, description} = req.body;
        const id = req.user._id;
        const new_group = new groupModel({name, description, leader:id});
        new_group.members.push(id);
        const save = await new_group.save();
        const update = await userModel.findByIdAndUpdate(id, {$push:{"groups":save._id}});
        return sendResponse(res, httpStatus.OK, true, save, null, 'Create Group Success', null);
    }catch(err){
        next(err);
    }
}

groupController.getNameList = async(req, res, next)=>{
    try{
        const id = req.user._id;
        const list_name = await userModel.findById(id, {groups:1}).populate({
            path:"groups",
            select:"name"
        });
        return sendResponse(res, httpStatus.OK, true, list_name, null, 'Get List Success', null);
    }catch(err){
        next(err);
    }
}

groupController.getFinance = async(req, res, next)=>{
    try{
        const id = req.params.id;
        const group = await groupModel.findOne({_id: id, leader: req.user._id}).populate([
            {path:"finances"},
            {path:"members", select:"email name"}
        ]);
        return sendResponse(res, httpStatus.OK, true, group, null, 'Get finance of Group success');
    }catch(err){
        next(err);
    }
}

module.exports = groupController;