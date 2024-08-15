import express from "express";
import { errorHandler } from "../middleware/index.js";
import * as PaymentCustomizationController from "../controllers/index.js";

const router = express.Router();

router.post(
  "/create",
  errorHandler(PaymentCustomizationController.createPaymentCustomization)
);
router.get(
  "/",
  errorHandler(PaymentCustomizationController.getAllPaymentCustomization)
);
router.get(
  "/count",
  errorHandler(PaymentCustomizationController.countByTypesAndActive)
);
router.get(
  "/:id",
  errorHandler(PaymentCustomizationController.getByIdPaymentCustomization)
);

router.put(
  "/:id",
  errorHandler(PaymentCustomizationController.updatePaymentCustomization)
);
router.delete(
  "/:id",
  errorHandler(PaymentCustomizationController.deletePaymentCustomization)
);

export const paymentCustomizationRoutes = router;
