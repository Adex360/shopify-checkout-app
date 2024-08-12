import express from "express";
import { errorHandler } from "../middleware/index.js";
import * as CustomFieldsController from "../controllers/index.js";

const router = express.Router();

router.post("/create", errorHandler(CustomFieldsController.createCustomFields));
router.get("/", errorHandler(CustomFieldsController.getAllCustomFields));
router.get("/:id", errorHandler(CustomFieldsController.getByIdCustomFields));
router.put("/:id", errorHandler(CustomFieldsController.updateCustomFields));
router.delete("/:id", errorHandler(CustomFieldsController.deleteFields));

export const customFieldsRoutes = router;
