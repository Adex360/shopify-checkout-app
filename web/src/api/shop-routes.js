import express from "express";
import { errorHandler } from "../middleware/index.js";
import * as ShopController from "../controllers/index.js";

const router = new express.Router();

router.get("/", errorHandler(ShopController.getShop));
export const shopRoutes = router;
