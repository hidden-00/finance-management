const httpStatus = require("http-status");
const sendResponse = require("../helpers/sendResponse");
const groupModel = require("../models/group.model");
const userModel = require("../models/user.model");

const groupController = {}

groupController.createOne = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const id = req.user._id;
        const new_group = new groupModel({ name, description, leader: id });
        new_group.members.push(id);
        const save = await new_group.save();
        await userModel.findByIdAndUpdate(id, { $push: { "groups": save._id } });
        return sendResponse(res, httpStatus.OK, true, save, null, 'Create Group Success', null);
    } catch (err) {
        next(err);
    }
}

groupController.getNameList = async (req, res, next) => {
    try {
        const id = req.user._id;
        const list_name = await userModel.findById(id, { groups: 1 }).populate({
            path: "groups",
            select: ["name", "members", "description"],
            match: { is_deleted: false },
            populate: {
                path: "members",
                select: ['name', 'email']
            }
        });
        if(!list_name) return sendResponse(res, httpStatus.OK, false, null, null, 'No Group', null);
        return sendResponse(res, httpStatus.OK, true, list_name, null, 'Get List Success', null);
    } catch (err) {
        next(err);
    }
}

groupController.edit = async(req, res, next)=>{
    try {
        const { name, description, _id } = req.body;
        const id = req.user._id;
        const group = await groupModel.findById(_id);
        if(!group) return sendResponse(res, httpStatus.OK, false, null, null, 'Not found Group', null);
        if(group.leader.toString()!==id) return sendResponse(res, httpStatus.OK, false, null, null, 'You not Leader', null);
        group.name = name;
        group.description = description;
        await group.save();
        return sendResponse(res, httpStatus.OK, true, group, null, 'Update Group Success', null);
    } catch (err) {
        next(err);
    }
}

groupController.getFinance = async (req, res, next) => {
    try {
        const id = req.params.id;
        const group = await groupModel.findOne({ _id: id, members: req.user._id, is_deleted: false }).populate([
            { path: "finances", match: { is_deleted: false }, populate: { path: 'user', select: "name" } },
            { path: "members", select: "email name" },
        ]);
        if (group) group.finances.reverse();
        else return sendResponse(res, httpStatus.OK, false, null, null, 'Not Found', null);
        return sendResponse(res, httpStatus.OK, true, group, null, 'Get finance of Group success');
    } catch (err) {
        next(err);
    }
}

groupController.deleteGroup = async (req, res, next) => {
    try {
        const id = req.params.id;
        const group = await groupModel.findById(id);
        if (!group) {
            return sendResponse(res, httpStatus.OK, false, null, null, 'Can not found Group!', null);
        }
        if (req.user._id !== group.leader.toString()) return sendResponse(res, httpStatus.UNAUTHORIZED, false, null, null, 'UNAUTHORIZED', null);
        group.is_deleted = true;
        await group.save();
        return sendResponse(res, httpStatus.OK, true, group, null, 'Group has been deleted successfully!', null);

    } catch (err) {
        next(err);
    }
}

groupController.removeMember = async(req, res, next)=>{
    try{
        const {user_id, group_id} = req.body;
        const my_id = req.user._id;
        if(user_id===my_id) return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, null, null, 'Cannot remove me', null);
        const group = await groupModel.findOne({_id: group_id, leader: my_id});
        if(!group){
            return sendResponse(res, httpStatus.UNAUTHORIZED, false, null, null, 'Cannot found Group or You are not leader', null);
        }
        group.members = group.members.filter((e)=> e.toString()!==user_id);
        await group.save();
        return sendResponse(res, httpStatus.OK, true, group, null, 'Remove success', null);
    }catch(err){
        next(err);
    }
}

groupController.addMember = async (req, res, next) => {
    try {
        const { email, group_id } = req.body;
        const user = await userModel.findOne({ email: email });
        if (!user) {
            return sendResponse(res, httpStatus.OK, false, null, null, 'Not found user from email!', null)
        } else {
            const group = await groupModel.findById(group_id);
            if(group){
                if(group.members.includes(user._id)){
                    return sendResponse(res, httpStatus.OK, false, null, null, 'Thanh Vien Da Ton Tai', null);
                }else{
                    group.members.push(user._id);
                    await group.save();
                    user.groups.push(group._id);
                    await user.save();
                    return sendResponse(res, httpStatus.OK, true, group, null, 'Add members success', null);
                }
            }else{
                return sendResponse(res, httpStatus.OK, false, null, null, 'Not found group', null);
            }
        }
    } catch (err) {
        next(err);
    }
}

module.exports = groupController;