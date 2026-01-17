import { Router } from "express";
import { createGroup, getGroups, getGroupById } from "./group.controller";
import { requireAuth } from "../../middleware/auth";

const router = Router();

router.post("/", requireAuth, createGroup);
router.get("/", requireAuth, getGroups);
router.get("/:id", requireAuth, getGroupById);

export default router;
