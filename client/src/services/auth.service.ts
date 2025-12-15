import { api } from "./api";

export class AuthService {
  static login(data: { email: string; password: string }) {
    return api.post("/auth/login", data);
  }

  static register(data: {
    name: string;
    age: string;
    locality: string;
    email: string;
    password: string;
  }) {
    return api.post("/auth/register", data);
  }

  static me() {
    return api.get("/auth/me");
  }

  static logout() {
    return api.post("/auth/logout");
  }
}
