import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import {
  getNotifications,
  markAsRead,
  acceptGroupInvite,
  rejectGroupInvite
} from "./notification.controller";

const router = Router();

router.get("/", requireAuth, getNotifications);
router.patch("/:id/read", requireAuth, markAsRead);
router.post("/:notificationId/accept", requireAuth, acceptGroupInvite);
router.post("/:notificationId/reject", requireAuth, rejectGroupInvite);


export default router;
