import Joi from "joi";
import { generalFields } from "../../Middlewares/validation.js";

export const createCouponValidation = Joi.object({
    code: Joi.string().min(4).max(10).alphanum().required(),
    amount: Joi.number().required(),
    fromDate: Joi.date().greater(Date.now()).required(),
    toDate: Joi.date().greater(Date.now()).required(),
    usagePerUser: Joi.array().items(Joi.object({
            userId: generalFields._id,
            maxUsage: Joi.number().integer().positive().required()
        }).required()
    ).required()
}).required()

export const updateCouponValidation = Joi.object({
    code: Joi.string().min(4).max(10).alphanum().optional(),
    amount: Joi.number().optional(),
    fromDate: Joi.string().optional(),
    toDate: Joi.string().optional(),
    couponId: generalFields._id
}).required()