export interface AdminUser {
  id: number;
  email: string;
  role: string;
  isActive: boolean;
}

export interface AuthResponse {
  tokenType: string;
  expiresAt: string;
  user: AdminUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}
