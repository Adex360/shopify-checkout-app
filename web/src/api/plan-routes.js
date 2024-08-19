import express from "express";

import { errorHandler } from "../middleware/index.js";
import * as PlanController from "../controllers/index.js";

const router = new express.Router();

router.get("/", errorHandler(PlanController.getAllPlans));

router.post("/subscribe", errorHandler(PlanController.subscribeToPlan));

// router.post(
//   '/subscribe/extra-emails',
//   errorHandler(PlanController.topUpEmails)
// );

export const planRoutes = router;
