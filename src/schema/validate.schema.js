import joi from "joi";

export const pollObject = joi.object({
    title: joi.string().required(),
    expireAt: joi.string().allow("").required()
  })

export const choiceObject = joi.object({
    title: joi.string().required(),
    pollId: joi.string().required()
  })