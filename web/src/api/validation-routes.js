import express from "express";
import { errorHandler } from "../middleware/index.js";
import * as ValidationController from "../controllers/index.js";

const router = express.Router();

router.post("/create", errorHandler(ValidationController.createValidation));
router.get("/", errorHandler(ValidationController.getAllValidation));
router.get("/:id", errorHandler(ValidationController.getByIdValidation));
router.put("/:id", errorHandler(ValidationController.updateValidation));
router.delete("/:id", errorHandler(ValidationController.deleteValidation));

export const validationRoutes = router;
