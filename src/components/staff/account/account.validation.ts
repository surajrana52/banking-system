import Joi from "@hapi/joi";

export const schema = {}

export const acceptApplication = {
    params: Joi.object({
        status: Joi.string().valid("0", "1").required(),
        userId: Joi.string().required()
    })
}

export const getAccountByUserId = {
    params: Joi.object({
        userId: Joi.string().required()
    })
}

export const getAccountByNumber = {
    params: Joi.object({
        accountNo: Joi.string().required()
    })
}

export const deleteAccount = {
    params: Joi.object({
        userId: Joi.string().required()
    })
}

export const makeDeposit = {
    body: Joi.object({
        amount: Joi.number().required(),
        userId: Joi.number().required()
    })
}
