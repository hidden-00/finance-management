const httpStatus = require('http-status');
const sanitizeHelper = require('../helpers/sanitize');
const sendResponse = require('../helpers/sendResponse');
const validateHelper = require('../helpers/validate');
const isEmpty = require('./isEmpty');

const validations = {};

validations.sanitizePost = (req, res, next)=>{
    const sanitizeArray = [
        {
            field: 'name',
            sanitize: {
                trim: true
            }
        },
        {
            field: 'description',
            sanitize: {
                trim: true,
            },
        }
    ];
    sanitizeHelper.sanitize(req, sanitizeArray);
    next();
}

validations.sanitizeEmail = (req, res, next)=>{
    const sanitizeArray = [
        {
            field: 'email',
            sanitize: {
                trim: true
            }
        },
    ];
    sanitizeHelper.sanitize(req, sanitizeArray);
    next();
}

validations.validateEmail = (req, res, next)=>{
    const data = req.body;
    const validateArray = [
        {
            field: 'email',
            validate: [
                {
                    condition: 'IsEmpty',
                    msg: 'This field is required',
                },
                {
                    condition: 'IsEmail',
                    msg: 'Please enter Valid Email',
                },
            ],
        },
        
    ];
    const errors = validateHelper.validation(data, validateArray);
    if (!isEmpty(errors)) {
        return sendResponse(res, httpStatus.BAD_REQUEST, false, null, errors, errors[Object.keys(errors)[0]], null);
    } else {
        next();
    }
}

validations.validatePost = (req, res, next)=>{
    const data = req.body;
    const validateArray = [
        {
            field: 'name',
            validate: [
                {
                    condition: 'IsEmpty',
                    msg: 'Name Group is required',
                },
                {
                    condition: 'IsLength',
                    msg: 'Name should be between 2 to 100',
                    option: { min: 2, max:  100},
                },
            ],
        },
        {
            field: 'description',
            validate: [
                {
                    condition: 'IsEmpty',
                    msg: 'Description is required',
                },
                {
                    condition: 'IsLength',
                    msg: 'Description should be between 2 to 100',
                    option: { min: 2, max: 100 },
                },
            ],
        },
    ];
    const errors = validateHelper.validation(data, validateArray);
    if (!isEmpty(errors)) {
        return sendResponse(res, httpStatus.BAD_REQUEST, false, null, errors, errors[Object.keys(errors)[0]], null);
    } else {
        next();
    }
}
module.exports = validations;