import { type User } from "./user.types.ts";

export interface Group {
  _id?: string;
  id?: string;
  name: string;
  members?: User[];
  createdBy?: string;
  createdAt?: string;
}

export interface SettlementBalance {
  userId: string;
  name: string;
  email: string;
  balance: number;
  status: "gets" | "owes";
}
