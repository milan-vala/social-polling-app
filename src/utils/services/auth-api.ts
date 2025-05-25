import { ApiClient } from "../api-client";

export class AuthApi extends ApiClient {
  async login(email: string, password: string) {
    return this.request<
      { user: any; session: any },
      { email: string; password: string }
    >("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
  }

  async signup(email: string, password: string) {
    return this.request<any, { email: string; password: string }>(
      "/api/auth/signup",
      {
        method: "POST",
        body: { email, password },
      }
    );
  }

  async logout() {
    return this.request<null>("/api/auth/logout", {
      method: "POST",
    });
  }
}
