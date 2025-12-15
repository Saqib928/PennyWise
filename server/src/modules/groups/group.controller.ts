import { Request, Response } from "express";
import { Group } from "./group.model";

export async function createGroup(req: Request, res: Response) {
  const { name, memberIds } = req.body;
  const userId = (req as any).user.id;

  const group = await Group.create({
    name,
    members: [...memberIds, userId],
    createdBy: userId,
  });

  res.status(201).json({ group });
}

export async function getGroups(req: Request, res: Response) {
  const userId = (req as any).user.id;
  const groups = await Group.find({ members: userId }).populate("members", "name email country");
  res.json({ groups });
}

export async function getGroupById(req: Request, res: Response) {
  const { id } = req.params;
  const group = await Group.findById(id).populate("members", "name email country");
  if (!group) return res.status(404).json({ message: "Group not found" });
  res.json({ group });
}
