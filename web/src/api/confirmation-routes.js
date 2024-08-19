import express from "express";
import { errorHandler } from "../middleware/index.js";
import * as ConfirmationController from "../controllers/index.js";

const router = new express.Router();

router.get(
  "/plan-confirmation/:shop_name/:plan_type",
  errorHandler(ConfirmationController.planConfirmation)
);

export const confirmationRoutes = router;
