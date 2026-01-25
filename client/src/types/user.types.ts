export interface User {
  _id: string;
  id?: string;
  name: string;
  username: string;
  email: string;
  country: string;
}

export interface AppUser {
  id: string;
  name: string;
  username: string;
  email: string;
  country: string;
}