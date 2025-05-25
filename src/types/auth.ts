export interface SignupRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    created_at: string;
  };
  session?: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
}

export interface LogoutRequest {}

export interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  access_token: string;
}
