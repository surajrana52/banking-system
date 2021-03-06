import Joi from "@hapi/joi";

export const schema = {

    body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
        accountType: Joi.number().valid(1, 2).required(),
    })

}

export const verifyEmailSchema = {

    body: Joi.object({
        email: Joi.string().required(),
        otp: Joi.string().required(),
    })

}
