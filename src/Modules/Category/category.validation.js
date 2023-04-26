import Joi from "joi";
import { generalFields } from "../../Middlewares/validation.js";

export const createCategoryValidation = Joi.object({
    name: Joi.string().min(4).max(14).required(),
    file: generalFields.file.required()
}).required()

export const updateCategoryValidation = Joi.object({
    name: Joi.string().min(4).max(14).optional(),
    file: generalFields.file.optional(),
    categoryId: Joi.string().required()
}).required()