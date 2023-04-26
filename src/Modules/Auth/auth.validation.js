import Joi from "joi";
import { generalFields } from "../../Middlewares/validation.js";

export const signUpValidation = Joi.object({
    userName: Joi.string().min(2).max(20).required(),
    email: generalFields.email,
    password: generalFields.password,
    cpassword: generalFields.cPassword,
    phone: Joi.string().optional()
}).required()

export const loginValidation = Joi.object({
    email: generalFields.email,
    password: generalFields.password
})