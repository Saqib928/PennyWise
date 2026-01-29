import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import {
  createGroup,
  getGroups,
  getGroupById,
  getGroupSettlement,
    settleGroup,
  deleteGroup
} from "./group.controller";

const router = Router();

router.post("/", requireAuth, createGroup);
router.get("/", requireAuth, getGroups);
router.get("/:id", requireAuth, getGroupById);
router.post("/:id/settle", requireAuth, settleGroup);

// NEW
router.get("/:id/settlement", requireAuth, getGroupSettlement);
router.delete("/:id", requireAuth, deleteGroup); 

export default router;
