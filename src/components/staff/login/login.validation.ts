import Joi from "@hapi/joi";

export const schema = {

    body: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    })

}
