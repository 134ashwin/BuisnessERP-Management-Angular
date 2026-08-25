import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * HTTP Request Interceptor - Adds common headers to all HTTP requests
 * Usage: Automatically applied to all HTTP calls
 */
@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Add authorization header if token exists
    const token = this.getToken();
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Add common headers
    req = req.clone({
      setHeaders: {
        'Content-Type': 'application/json'
      }
    });

    return next.handle(req);
  }

  private getToken(): string | null {
    // TODO: Get token from auth service or local storage
    return null;
  }
}
