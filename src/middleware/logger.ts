import { NextRequest, NextResponse } from "next/server";

export interface LogData {
  method: string;
  url: string;
  timestamp: string;
  status?: number;
  error?: string;
}

export class Logger {
  static logRequest(request: NextRequest): LogData {
    const logData: LogData = {
      method: request.method,
      url: request.url,
      timestamp: new Date().toISOString(),
    };

    console.log(`[${logData.timestamp}] ${logData.method} ${logData.url}`);
    return logData;
  }

  static logResponse(logData: LogData, response: NextResponse) {
    const status = response.status;

    console.log(
      `[${new Date().toISOString()}] ${logData.method} ${
        logData.url
      } - ${status}`
    );

    return {
      ...logData,
      status,
    };
  }

  static logError(logData: LogData, error: Error) {
    console.error(
      `[${new Date().toISOString()}] ERROR - ${logData.method} ${logData.url}`,
      {
        error: error.message,
        stack: error.stack,
        ...logData,
      }
    );

    return {
      ...logData,
      error: error.message,
    };
  }

  static info(message: string, data?: any) {
    console.log(`[${new Date().toISOString()}] INFO - ${message}`, data || "");
  }

  static warn(message: string, data?: any) {
    console.warn(`[${new Date().toISOString()}] WARN - ${message}`, data || "");
  }

  static error(message: string, error?: Error) {
    console.error(`[${new Date().toISOString()}] ERROR - ${message}`, {
      error: error?.message,
      stack: error?.stack,
    });
  }
}
