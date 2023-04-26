import Joi from "joi";
import { generalFields } from "../../Middlewares/validation.js";

export const addBrandValidation = Joi.object({
    name: Joi.string().min(4).max(14).required(),
    file: generalFields.file.required()
}).required()