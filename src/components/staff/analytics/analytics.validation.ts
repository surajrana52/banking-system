import Joi from "@hapi/joi";

export const receivable = {
    params: Joi.object({
        groupBy: Joi.string().valid("day", "week", "month").required()
    })
}
