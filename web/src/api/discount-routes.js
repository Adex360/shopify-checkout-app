import express from "express";
import { errorHandler, planMiddleware } from "../middleware/index.js";
import { PLAN_OPTIONS } from "../constants/index.js";
import * as DiscountController from "../controllers/index.js";

const router = express.Router();

router.post(
  "/create",
  planMiddleware([PLAN_OPTIONS.ESSENTIAL]),
  errorHandler(DiscountController.createDiscount)
);
router.get(
  "/",
  planMiddleware([PLAN_OPTIONS.ESSENTIAL]),
  errorHandler(DiscountController.getAllDiscount)
);

router.get(
  "/:id",
  planMiddleware([PLAN_OPTIONS.ESSENTIAL]),
  errorHandler(DiscountController.getByIdDiscount)
);

router.put(
  "/:id",
  planMiddleware([PLAN_OPTIONS.ESSENTIAL]),
  errorHandler(DiscountController.updateDiscount)
);
router.delete(
  "/:id",
  planMiddleware([PLAN_OPTIONS.ESSENTIAL]),
  errorHandler(DiscountController.deleteDiscount)
);

export const discountRoutes = router;
