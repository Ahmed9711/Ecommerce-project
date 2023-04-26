import Joi from "joi";
import { generalFields } from "../../Middlewares/validation.js";

export const createSubCategoryValidation = Joi.object({
    name: Joi.string().min(4).max(14).required(),
    file: generalFields.file.required(),
    categoryId: Joi.string().required()
}).required()

export const updateSubCategoryValidation = Joi.object({
    name: Joi.string().min(4).max(14).optional(),
    file: generalFields.file.optional(),
    subCategoryId: Joi.string().required()
}).required()
    