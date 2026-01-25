import { api } from "./api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  country: string;
}

export interface AuthResponse {

  user?: {
    _id: string;
    name: string;
    email: string;
    country: string;
  };

}

export class AuthService {
  static login(data: LoginRequest) {
    return api.post<AuthResponse>("/auth/login", data);
  }

  static register(data: RegisterRequest) {
    return api.post<AuthResponse>("/auth/register", data);
  }

  static me() {
    return api.get<AuthResponse>("/auth/me");
  }

  static logout() {
    return api.post<AuthResponse>("/auth/logout");
  }

  static googleLogin() {
    // Redirect to Google OAuth endpoint
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  }
}
