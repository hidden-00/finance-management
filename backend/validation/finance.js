const httpStatus = require('http-status');
const sanitizeHelper = require('../helpers/sanitize');
const sendResponse = require('../helpers/sendResponse');
const validateHelper = require('../helpers/validate');
const isEmpty = require('./isEmpty');

const validations = {};

validations.sanitizePost = (req, res, next) => {
    const sanitizeArray = [
        {
            field: 'name',
            sanitize: {
                trim: true
            }
        },
        {
            field: 'mon_hang',
            sanitize: {
                trim: true,
            },
        },
        {
            field: 'money',
            sanitize: {
                trim: true,
            },
        },
        {
            field: 'place',
            sanitize: {
                trim: true,
            },
        }
    ];
    sanitizeHelper.sanitize(req, sanitizeArray);
    next();
}

validations.validatePost = (req, res, next) => {
    const data = req.body;
    const validateArray = [
        {
            field: 'name',
            validate: [
                {
                    condition: 'IsEmpty',
                    msg: 'Name is required',
                },
                {
                    condition: 'IsLength',
                    msg: 'Name should be between 2 to 100',
                    option: { min: 2, max: 30 },
                },
            ],
        },
        {
            field: 'mon_hang',
            validate: [
                {
                    condition: 'IsEmpty',
                    msg: 'Name Product is required',
                },
                {
                    condition: 'IsLength',
                    msg: 'Name Product should be between 2 to 100',
                    option: { min: 2, max: 30 },
                },
            ],
        },
        {
            field: 'money',
            validate: [
                {
                    condition: 'IsEmpty',
                    msg: 'Price is required'
                },
                {
                    condition: 'IsInt',
                    msg: 'Price is Number',
                    option: { min: 0, max: 100000000 }
                }
            ]
        },
        {
            field: 'place',
            validate: [
                {
                    condition: 'IsEmpty',
                    msg: 'Place is required',
                },
                {
                    condition: 'IsLength',
                    msg: 'Place should be between 2 to 100',
                    option: { min: 2, max: 30 },
                },
            ],
        },
        {
            field: 'group',
            validate: [
                {
                    condition: 'IsEmpty',
                    msg: 'Group ID is required'
                },
                {
                    condition: 'IsMongoId',
                    msg: 'Group Id should is MongoId'
                }
            ]
        },
        {
            field: 'type',
            validate: [
                {
                    condition: 'IsEmpty',
                    msg: 'Type is required'
                },
                {
                    condition: 'IsIn',
                    msg: 'Please enter Valid Type',
                    option: ['Nợ', 'Thu', 'Chi']
                }
            ]
        },
        {
            field: 'method',
            validate: [
                {
                    condition: 'IsEmpty',
                    msg: 'Method is required'
                },
                {
                    condition: 'IsIn',
                    msg: 'Please enter Valid Method',
                    option: ['Tiền mặt', 'Vietcombank', 'Timo', 'Momo']
                }
            ]
        }
    ];
    const errors = validateHelper.validation(data, validateArray);
    if (!isEmpty(errors)) {
        return sendResponse(res, httpStatus.BAD_REQUEST, false, null, errors, errors[Object.keys(errors)[0]], null);
    } else {
        next();
    }
}
module.exports = validations;