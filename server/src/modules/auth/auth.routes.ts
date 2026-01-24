import { Router } from "express";
import passport from "passport";
import { login, register, me, logout, googleCallback } from "./auth.controller";
import { requireAuth } from "../../middlewares/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, me);
router.post("/logout", requireAuth, logout);

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  googleCallback
);

export default router;
