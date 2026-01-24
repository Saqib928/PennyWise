import { Request, Response } from "express";
import { User } from "../users/user.model";
import { hashPassword, comparePassword } from "../../utils/hash";
import { signToken } from "../../utils/jwt";

export async function register(req: Request, res: Response) {
  const { name, email, password, country } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "Email already registered" });

  const passwordHash = await hashPassword(password);
  const user = await User.create({ name, email, passwordHash, country });

  const token = signToken({ id: user._id, email });
  res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
  res.json({ user });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const valid = await comparePassword(password, user.passwordHash as string);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken({ id: user._id, email });
  res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
  res.json({ user });
}

export async function me(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  const user = await User.findById(userId);
  res.json({ user });
}

export async function logout(req: Request, res: Response) {
  res.clearCookie("token");
  req.logout(() => {});
  res.json({ message: "Logged out successfully" });
}

export function googleCallback(req: Request, res: Response) {
  const user = req.user as any;
  const token = signToken({ id: user._id, email: user.email });
  res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
  res.redirect(process.env.CLIENT_URL || "http://localhost:5173/dashboard");
}
