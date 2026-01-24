import { Group } from "../modules/groups/group.model";

export async function verifyGroupAccess(groupId: string, userId: string) {
  const group = await Group.findById(groupId);
  if (!group) return null;

  const isMember = group.members.some(
    (m: any) => m.toString() === userId
  );

  if (!isMember) return null;
  return group;
}
