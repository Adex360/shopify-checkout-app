import express from "express";

import { errorHandler } from "../middleware/index.js";
import * as CustomFieldController from "../controllers/index.js";

const router = new express.Router();

router.get(
  "/custom-fields/all",
  errorHandler(CustomFieldController.getAllCustomFields)
);
export const publicRoutes = router;
