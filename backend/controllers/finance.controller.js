const { OK } = require("http-status");
const sendResponse = require("../helpers/sendResponse");
const financeModel = require("../models/finance.model");
const httpStatus = require("http-status");

const FinanceController = {}

FinanceController.createOne = async (req, res, next) => {
    try {
        const data = req.body
        data.user = req.user._id;
        const newFinance = new financeModel(data);
        const newF = await financeModel.create(newFinance);
        return sendResponse(res, httpStatus.OK, true, newF, null, 'create success', null);
    } catch (err) {
        next(err);
    }
}

FinanceController.getList = async (req, res, next) => {
    try {
        const list_finance = await financeModel.find({ user: req.user._id, is_deleted: false });
        list_finance.reverse();
        return sendResponse(res, httpStatus.OK, true, list_finance, null, 'get list success', null);
    } catch (err) {
        next(err)
    }
}

FinanceController.delete = async (req, res, next) => {
    try {
        const id = req.params.id;
        const finance = await financeModel.findOne({ user: req.user._id, _id: id, is_deleted: false });
        if (finance) {
            const newFinance = await financeModel.findByIdAndUpdate(id, { $set: { is_deleted: true } }, { new: true });
            return sendResponse(res, httpStatus.OK, true, newFinance, null, 'Update success', null);
        } else return sendResponse(res, httpStatus.OK, false, null, null, 'not found finance', null);
    } catch (err) {
        next(err);
    }
}

FinanceController.chart = async (req, res, next) => {
    try {
        const list_finance_month = await financeModel.find({
            user: req.user._id, is_deleted: false
        })

        const tong_thu = list_finance_month.reduce((total, finance) => {
            if (finance.type === "Thu") {
                return total + finance.money;
            }
            return total;
        }, 0);
        const tong_chi = list_finance_month.reduce((total, finance) => {
            if (finance.type === "Chi") {
                return total + finance.money;
            }
            return total;
        }, 0);
        const tong_no = list_finance_month.reduce((total, finance) => {
            if (finance.type === "Nợ") {
                return total + finance.money;
            }
            return total;
        }, 0);
        const data = [
            { id: "Thu", value: tong_thu, label: `Tổng thu` },
            { id: "Chi", value: tong_chi, label: `Tổng chi` },
            { id: "Nợ", value: tong_no, label: `Tổng nợ` }
        ]
        return sendResponse(res, httpStatus.OK, true, data, null, 'Get Data Success', null);
    } catch (err) {
        next(err);
    }
}

FinanceController.chartMonth = async (req, res, next) => {
    try {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const list_finance_month = await financeModel.find({
            user: req.user._id, is_deleted: false, date: {
                $gte: startOfMonth,
                $lt: endOfMonth
            }
        })

        const tong_thu = list_finance_month.reduce((total, finance) => {
            if (finance.type === "Thu") {
                return total + finance.money;
            }
            return total;
        }, 0);
        const tong_chi = list_finance_month.reduce((total, finance) => {
            if (finance.type === "Chi") {
                return total + finance.money;
            }
            return total;
        }, 0);
        const tong_no = list_finance_month.reduce((total, finance) => {
            if (finance.type === "Nợ") {
                return total + finance.money;
            }
            return total;
        }, 0);
        const data = [
            { id: "Thu", value: tong_thu, label: `Tổng thu tháng ${currentDate.getMonth() + 1}` },
            { id: "Chi", value: tong_chi, label: `Tổng chi tháng ${currentDate.getMonth() + 1}` },
            { id: "Nợ", value: tong_no, label: `Tổng nợ tháng ${currentDate.getMonth() + 1}` }
        ]
        return sendResponse(res, httpStatus.OK, true, data, null, 'Get Data Success', null);
    } catch (err) {
        next(err);
    }
}

module.exports = FinanceController;