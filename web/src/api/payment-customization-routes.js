import express from "express";
import { errorHandler } from "../middleware/index.js";
import * as PaymentCustomizationController from "../controllers/index.js";

const router = express.Router();

router.get(
  "/:id",
  errorHandler(PaymentCustomizationController.getPaymentCustomizationById)
);

// reOrder/hide routes
router.post(
  "/re-order/create",
  errorHandler(PaymentCustomizationController.createReorderPaymentCustomization)
);
router.get(
  "/re-order/all",
  errorHandler(PaymentCustomizationController.getAllReorderPaymentCustomization)
);
router.get(
  "/re-order/:id",
  errorHandler(
    PaymentCustomizationController.getReorderByIdPaymentCustomization
  )
);
router.put(
  "/re-order/:id",
  errorHandler(PaymentCustomizationController.updateReorderPaymentCustomization)
);

export const paymentCustomizationRoutes = router;
