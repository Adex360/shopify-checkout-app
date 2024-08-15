import express from "express";

import * as AdminController from "../controllers/index.js";
import { errorHandler } from "../middleware/index.js";

const router = new express.Router();

// queue details
router.get("/queue/details", errorHandler(AdminController.getQueueDetails));

export const adminRoutes = router;
