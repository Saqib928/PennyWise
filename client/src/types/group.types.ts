import { type User } from "./user.types.ts";

export interface Group {
  id: string;
  name: string;
  members: User[];
  createdBy: string;
  createdAt: string;
}
