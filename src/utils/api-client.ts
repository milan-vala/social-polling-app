import { ApiResponse } from "@/types/api";
import { authUtils } from "./auth";

interface ApiOptions<T = any> {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: T;
  headers?: Record<string, string>;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl;
  }

  async request<TResponse, TBody = any>(
    endpoint: string,
    options: ApiOptions<TBody> = {}
  ): Promise<ApiResponse<TResponse>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const token = authUtils.getAccessToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method: options.method || "GET",
      headers,
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        data: null,
        message: "Network error occurred",
        success: false,
      };
    }
  }
}
