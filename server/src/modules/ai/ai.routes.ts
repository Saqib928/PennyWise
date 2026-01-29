import { Router } from "express";
import { voiceExpensePipeline } from "./ai.controller";
import { upload } from "../../middlewares/upload.middleware";
import { requireAuth } from "../../middlewares/auth";

const router = Router();

router.post(
  "/voice-expense",
  requireAuth,
  upload.single("audio"),
  voiceExpensePipeline
);

export default router;
