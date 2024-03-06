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
            select:"name",
            match:{is_deleted: false}
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

groupController.deleteGroup = async(req, res, next)=>{
    try{
        const id = req.params.id;
        const group = await groupModel.findById(id);
        if(!group){
            return sendResponse(res, httpStatus.OK, false, null, null, 'Can not found Group!', null);
        }
        if(req.user._id!==group.leader) return sendResponse(res, httpStatus.UNAUTHORIZED, false, null, null, 'UNAUTHORIZED', null);
        group.is_deleted = true;
        await group.save();
        return sendResponse(res, httpStatus.OK, true, group, null, 'Group has been deleted successfully!', null);

    }catch(err){
        next(err);
    }
}

module.exports = groupController;