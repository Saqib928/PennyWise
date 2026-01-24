import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import {
  createGroup,
  getGroups,
  getGroupById,
  getGroupSettlement,
} from "./group.controller";

const router = Router();

router.post("/", requireAuth, createGroup);
router.get("/", requireAuth, getGroups);
router.get("/:id", requireAuth, getGroupById);

// NEW
router.get("/:id/settlement", requireAuth, getGroupSettlement);

export default router;
