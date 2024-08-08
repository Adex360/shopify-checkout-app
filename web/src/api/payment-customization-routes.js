import express from "express";
import { errorHandler } from "../middleware/index.js";
import * as PaymentCustomizationController from "../controllers/index.js";

const router = express.Router();

router.post(
  "/create",
  errorHandler(PaymentCustomizationController.createPaymentCustomization)
);
router.get(
  "/all",
  errorHandler(PaymentCustomizationController.getAllPaymentCustomization)
);
router.get(
  "/:id",
  errorHandler(PaymentCustomizationController.getByIdPaymentCustomization)
);
router.put(
  "/:id",
  errorHandler(PaymentCustomizationController.updatePaymentCustomization)
);

export const paymentCustomizationRoutes = router;
