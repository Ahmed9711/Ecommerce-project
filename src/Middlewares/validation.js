import joi from 'joi'
import { Types } from 'mongoose'

const validateObjectId = (value, helper) => {
    return Types.ObjectId.isValid(value) ? true : helper.message('Enter a valid Id')
}

export const generalFields = {
    email: joi.string().email({
        minDomainSegments: 2,
        maxDomainSegments: 4,
        tlds: { allow: ['com', 'net',] }
    }).required(),
    password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
    cPassword: joi.string().valid(joi.ref('password')).required(),
    _id: joi.string().custom(validateObjectId).required(),
    file: joi.object({
        size: joi.number().positive().required(),
        path: joi.string().required(),
        filename: joi.string().required(),
        destination: joi.string().required(),
        mimetype: joi.string().required(),
        encoding: joi.string().required(),
        originalname: joi.string().required(),
        fieldname: joi.string().required()
    })
}

export const validation = (schema, isHeader = false) => {
    return (req, res, next) => {
        let reqData = {
            ...req.body,
            ...req.params,
            ...req.query
            //...req.headers
        }
        if(req.file || req.files) reqData.file = req.file || req.files
        if(req.headers?.authorization && isHeader) reqData = {authorization: req.headers.authorization} 
        const validationResult = schema.validate(reqData,{abortEarly: false});
        if(validationResult?.error?.details){
            return res.status(400).json({message: "Validation Error", Error: validationResult.error.details});
        }
        next();
    }
}