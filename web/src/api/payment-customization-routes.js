import express from "express";
import { errorHandler, planMiddleware } from "../middleware/index.js";
import { PLAN_OPTIONS } from "../constants/index.js";
import * as PaymentCustomizationController from "../controllers/index.js";

const router = express.Router();

router.post(
  "/create",
  planMiddleware([PLAN_OPTIONS.ESSENTIAL]),
  errorHandler(PaymentCustomizationController.createPaymentCustomization)
);
router.get(
  "/",
  planMiddleware([PLAN_OPTIONS.ESSENTIAL]),
  errorHandler(PaymentCustomizationController.getAllPaymentCustomization)
);

router.get(
  "/count",
  planMiddleware([PLAN_OPTIONS.ESSENTIAL]),
  errorHandler(PaymentCustomizationController.countByTypesAndActive)
);
router.get(
  "/:id",
  planMiddleware([PLAN_OPTIONS.ESSENTIAL]),
  errorHandler(PaymentCustomizationController.getByIdPaymentCustomization)
);

router.put(
  "/:id",
  planMiddleware([PLAN_OPTIONS.ESSENTIAL]),
  errorHandler(PaymentCustomizationController.updatePaymentCustomization)
);
router.delete(
  "/:id",
  planMiddleware([PLAN_OPTIONS.ESSENTIAL]),
  errorHandler(PaymentCustomizationController.deletePaymentCustomization)
);

export const paymentCustomizationRoutes = router;
