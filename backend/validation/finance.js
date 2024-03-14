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

validations.validatePost = (req, res, next)=>{
    const data = req.body;
    const validateArray = [
        {
            field: 'name',
            validate: [
                {
                    condition: 'IsEmpty',
                    msg: 'This field is required',
                },
                {
                    condition: 'IsLength',
                    msg: 'This field should be between 2 to 100',
                    option: { min: 2, max: 30 },
                },
            ],
        },
        {
            field: 'mon_hang',
            validate: [
                {
                    condition: 'IsEmpty',
                    msg: 'This field is required',
                },
                {
                    condition: 'IsLength',
                    msg: 'This field should be between 2 to 100',
                    option: { min: 2, max: 30 },
                },
            ],
        },
        {
            field: 'money',
            validate:[
                {
                    condition: 'IsNumeric',
                    msg: 'This field is Number',
                },
                {
                    condition: 'IsEmpty',
                    msg: 'This field is required'
                }
            ]
        },
        {
            field: 'place',
            validate: [
                {
                    condition: 'IsEmpty',
                    msg: 'This field is required',
                },
                {
                    condition: 'IsLength',
                    msg: 'This field should be between 2 to 100',
                    option: { min: 2, max: 30 },
                },
            ],
        },
    ];
    const errors = validateHelper.validation(data, validateArray);
    if (!isEmpty(errors)) {
        return sendResponse(res, httpStatus.BAD_REQUEST, false, null, errors, 'invalid input', null);
    } else {
        next();
    }
}
module.exports = validations;