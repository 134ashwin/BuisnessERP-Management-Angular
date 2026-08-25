import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Error Handler Service - Centralized error handling
 * Usage: Inject ErrorHandlerService and handle global errors
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private errorSubject = new Subject<{ message: string; code?: string; timestamp: Date }>();
  public error$ = this.errorSubject.asObservable();

  handleError(message: string, code?: string): void {
    this.errorSubject.next({
      message,
      code,
      timestamp: new Date()
    });
  }

  clearError(): void {
    this.errorSubject.next({ message: '', timestamp: new Date() });
  }
}
