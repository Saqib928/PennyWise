import { Request, Response } from "express";
import { User } from "../users/user.model";

export async function updateProfile(req: Request, res: Response) {
  const userId = req.user!.id;
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username required" });
  }

  const exists = await User.findOne({ username });
  if (exists) {
    return res.status(400).json({ message: "Username already taken" });
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { username },
    { new: true }
  ).select("_id name email username country");

  res.json({ success: true, data: user });
}

export async function getAllUsers(req: Request, res: Response) {
  const users = await User.find()
    .select("_id name email username country")
    .limit(20);

  res.json({ success: true, data: users });
}

export async function searchUsers(req: Request, res: Response) {
  const q = req.query.q as string;

  if (!q || q.length < 2) {
    return res.json({ success: true, data: [] });
  }

  const users = await User.find({
    $or: [
      { username: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
      { name: { $regex: q, $options: "i" } },
    ],
  })
    .select("_id name email username country")
    .limit(10);

  res.json({ success: true, data: users });
}



