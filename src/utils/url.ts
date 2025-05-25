export function getBaseUrl(): string {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return process.env.DEV_URL || "http://localhost:3000";
}

export function getApiUrl(endpoint: string): string {
  return `${getBaseUrl()}${endpoint}`;
}
