import { Request, Response } from "express";
import { User } from "../users/user.model";
import { hashPassword, comparePassword } from "../../utils/hash";
import { signToken } from "../../utils/jwt";

export async function register(req: Request, res: Response) {
  try {
    let { name, email, password, country, username } = req.body;

    email = email?.toLowerCase().trim();
    username = username?.toLowerCase().trim();

    if (!email || !password || !username) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [emailExists, usernameExists] = await Promise.all([
      User.findOne({ email }),
      User.findOne({ username }),
    ]);

    if (emailExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    if (usernameExists) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const passwordHash = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      passwordHash,
      country,
      username,
    });

    const token = signToken({
      id: user._id,
      email: user.email,
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.json({ user });

  } catch (err: any) {

    if (err.code === 11000) {
      if (err.keyPattern?.email) {
        return res.status(400).json({ message: "Email already registered" });
      }
      if (err.keyPattern?.username) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    res.status(500).json({ message: "Registration failed" });
  }
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
