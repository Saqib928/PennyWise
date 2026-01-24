import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { searchUsers } from "./user.controller";

const router = Router();

router.get("/search", requireAuth, searchUsers);

export default router;
