import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import {
  sendInvite,
  acceptInvite,
  rejectInvite,
  getMyInvites,
} from "./invite.controller";

const router = Router();

router.get("/", requireAuth, getMyInvites);
router.post("/:inviteId/accept", requireAuth, acceptInvite);
router.post("/:inviteId/reject", requireAuth, rejectInvite);

export default router;
