import { ApiResponse } from "@/types/api";

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

    const config: RequestInit = {
      method: options.method,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
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
