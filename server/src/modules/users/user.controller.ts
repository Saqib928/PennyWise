import { Request, Response } from "express";
import { User } from "./user.model";

export async function searchUsers(req: Request, res: Response) {
  const q = req.query.q as string;

  if (!q || q.length < 2) {
    return res.json({ success: true, data: [] });
  }

  const users = await User.find({
    $or: [
      { email: { $regex: q, $options: "i" } },
      { name: { $regex: q, $options: "i" } },
    ],
  })
    .select("_id name email country")
    .limit(10);

  res.json({ success: true, data: users });
}
