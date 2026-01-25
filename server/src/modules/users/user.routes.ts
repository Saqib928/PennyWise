import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { searchUsers } from "./user.controller";
import { updateProfile } from "./user.controller";
import { getAllUsers } from "./user.controller";

const router = Router();

router.get("/search", requireAuth, searchUsers);
router.get("/users", requireAuth, getAllUsers); 
router.patch("/me", requireAuth, updateProfile);

export default router;
