import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  log(message: string, data?: any): void {
    console.log(message, data);
  }

  info(message: string, data?: any): void {
    console.info(message, data);
  }

  warn(message: string, data?: any): void {
    console.warn(message, data);
  }

  error(message: string, error?: any): void {
    console.error(message, error);
  }
}