import express from "express";
import { errorHandler } from "../middleware/index.js";
import * as CustomFieldsController from "../controllers/index.js";

const router = express.Router();

router.post(
  "/create",
  errorHandler(CustomFieldsController.createPaymentCustomization)
);
router.get(
  "/",
  errorHandler(CustomFieldsController.getAllPaymentCustomization)
);
router.get(
  "/:id",
  errorHandler(CustomFieldsController.getByIdPaymentCustomization)
);
router.put(
  "/:id",
  errorHandler(CustomFieldsController.updatePaymentCustomization)
);
router.delete(
  "/:id",
  errorHandler(CustomFieldsController.deletePaymentCustomization)
);

export const customFieldsRoutes = router;
