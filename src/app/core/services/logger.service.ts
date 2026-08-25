import { Injectable } from '@angular/core';

/**
 * Logger Service - Centralized logging utility
 * Usage: Inject LoggerService and call log(), info(), warn(), error()
 */
@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private isDevelopment = true; // Set based on environment

  log(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.log(`[LOG] ${message}`, data);
    }
  }

  info(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, data);
    }
  }

  warn(message: string, data?: any): void {
    console.warn(`[WARN] ${message}`, data);
  }

  error(message: string, error?: any): void {
    console.error(`[ERROR] ${message}`, error);
  }
}
