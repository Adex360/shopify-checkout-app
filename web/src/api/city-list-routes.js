import express from "express";
import { errorHandler } from "../middleware/index.js";
import * as CityListController from "../controllers/index.js";

const router = express.Router();

router.post("/create", errorHandler(CityListController.createCityList));
router.get("/", errorHandler(CityListController.getAllCityList));
router.get("/:id", errorHandler(CityListController.getByIdCityList));
router.put("/:id", errorHandler(CityListController.updateCityList));
router.delete("/:id", errorHandler(CityListController.deleteCityList));

export const cityListRoutes = router;
