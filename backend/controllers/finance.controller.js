const { OK } = require("http-status");
const sendResponse = require("../helpers/sendResponse");
const financeModel = require("../models/finance.model");
const httpStatus = require("http-status");

const FinanceController = {}

FinanceController.createOne = async(req, res, next)=>{
    try{
        const data = req.body
        data.user = req.user._id;
        const newFinance = new financeModel(data);
        const newF = await financeModel.create(newFinance);
        return sendResponse(res, httpStatus.OK, true, newF, null, 'create success', null);
    }catch(err){
        next(err);
    }
}

FinanceController.getList = async(req, res, next)=>{
    try{
        const list_finance = await financeModel.find({user:req.user._id, is_deleted: false});
        return sendResponse(res, httpStatus.OK, true, list_finance, null, 'get list success', null);
    }catch(err){
        next(err)
    }
}

FinanceController.delete = async(req, res, next)=>{
    try{
        const id = req.params.id;
        const finance = await financeModel.findOne({user: req.user.id, _id: id, is_deleted: false});
        if(finance){
            const newFinance = await financeModel.findByIdAndUpdate(id, {$set:{is_deleted: true}}, {new: true});
            return sendResponse(res, httpStatus.OK, true, newFinance, null, 'Update success', null);
        }else return sendResponse(res, httpStatus.OK, false, null, null, 'not found finance', null);
    }catch(err){
        next(err);
    }
}

module.exports = FinanceController;