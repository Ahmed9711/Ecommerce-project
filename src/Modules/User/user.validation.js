import Joi from "joi";

export const updateUserValidation = {
    body: Joi.object().required().keys({
        firstname: Joi.string().min(3).max(20).required().messages({
            "string.min":"First name must be at least 3 characters"
        }),
        lastname: Joi.string().min(3).max(20).required().messages({
            "string.min":"First name must be at least 3 characters"
        })
    })
}