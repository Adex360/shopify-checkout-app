import express from "express";

import * as PaymentCustomizationController from "../controllers/index.js";

const router = express.Router();

router.get("/:id", PaymentCustomizationController.getPaymentCustomizationById);

export const paymentCustomizationRoutes = router;
