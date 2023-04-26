import Joi from "joi";
import { generalFields } from "../../Middlewares/validation.js";


export const createOrderValidation = Joi.object({
    address: Joi.string().required(),
    phone: Joi.array().items(
        Joi.string().regex(/^(002|\+2)01?[0125][0-9]{8}$/).required()
    ).required(),
    couponCode: Joi.string().optional(),
    products: Joi.array().items(
        Joi.object({
            productId: generalFields._id,
            quantity: Joi.number().integer().positive().required()
        }).required()
    ).optional()
}).required()

export const cancelOrder = Joi.object({
    reason: Joi.string().required(),
    orderId: generalFields._id,
}).required()