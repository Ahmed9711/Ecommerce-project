import Joi from "joi";
import { generalFields } from "../../Middlewares/validation.js";

export const authHeaderValidation = Joi.object({
    authorization: Joi.string().required()
}).required()

export const addProductValidation = Joi.object({
    name: Joi.string().min(4).max(13).required(),
    description: Joi.string().min(20).max(130000).alphanum().optional(),
    stock: Joi.number().integer().positive().optional(),
    price: Joi.number().positive().required(),
    discount: Joi.number().positive().optional(),
    colors: Joi.array().items(Joi.string().required()).optional(),
    size: Joi.array().items(Joi.string().required()).optional(),
    categoryId: generalFields._id,
    subCategoryId: generalFields._id,
    brandId: generalFields._id,
    file: Joi.object({
        mainImage: Joi.array().items(generalFields.file.required()).required(),
        subImages: Joi.array().items(generalFields.file.required()).optional(),
    }).required()
}).required()

export const updateProductValidation = Joi.object({
    name: Joi.string().min(4).max(13).optional(),
    description: Joi.string().min(20).max(130000).alphanum().optional(),
    stock: Joi.number().integer().positive().optional(),
    price: Joi.number().positive().optional(),
    discount: Joi.number().positive().optional(),
    colors: Joi.array().items(Joi.string().required()).optional(),
    size: Joi.array().items(Joi.string().required()).optional(),
    file: Joi.object({
        mainImage: Joi.array().items(generalFields.file.required()).optional(),
        subImages: Joi.array().items(generalFields.file.required()).optional(),
    }).optional(),
    productId: generalFields._id
}).required()

export const updateProductSchema = Joi.object({
    id: generalFields._id.required(),
    stock: Joi.number().integer().positive().required()
}).required()