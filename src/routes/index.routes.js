import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { choiceObject, pollObject } from "../schema/validate.schema.js";
import { getChoice, getPoll, getResult,
postChoice, postPoll, postVote } from "../controllers/index.controller.js";

const router = Router()

router.post("/poll", validateSchema(pollObject), postPoll)
router.get("/poll", getPoll)

router.post("/choice", validateSchema(choiceObject), postChoice)
router.get("/poll/:id/choice", getChoice)

router.post("/choice/:id/vote", postVote)
router.get("/poll/:id/result", getResult)

export default router