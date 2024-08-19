import express from "express";
import { errorHandler, planMiddleware } from "../middleware/index.js";
import { PLAN_OPTIONS } from "../constants/index.js";
import * as CityListController from "../controllers/index.js";

const router = express.Router();

router.post(
  "/create",
  planMiddleware([PLAN_OPTIONS.ESSENTIAL]),
  errorHandler(CityListController.createCityList)
);
router.get(
  "/",
  planMiddleware([PLAN_OPTIONS.ESSENTIAL]),
  errorHandler(CityListController.getAllCityList)
);
router.get(
  "/:id",
  planMiddleware([PLAN_OPTIONS.ESSENTIAL]),
  errorHandler(CityListController.getByIdCityList)
);
router.put(
  "/:id",
  planMiddleware([PLAN_OPTIONS.ESSENTIAL]),
  errorHandler(CityListController.updateCityList)
);
router.delete(
  "/:id",
  planMiddleware([PLAN_OPTIONS.ESSENTIAL]),
  errorHandler(CityListController.deleteCityList)
);

export const cityListRoutes = router;
