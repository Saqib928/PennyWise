import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import {
  getNotifications,
  markAsRead,
} from "./notification.controller";

const router = Router();

router.get("/", requireAuth, getNotifications);
router.patch("/:id/read", requireAuth, markAsRead);

export default router;
