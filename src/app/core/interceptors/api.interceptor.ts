// apiInterceptor (core/interceptors/api.interceptor.ts): Intercepts outgoing requests to attach tokens and automatically refreshes tokens on 401 Unauthorized responses.
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';
import { catchError, switchMap, filter, take, throwError, BehaviorSubject } from 'rxjs';

// Mutex flags to handle concurrent 401 requests safely
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<boolean | null>(null);

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // 1. Safely retrieve token without TS error
  const authServiceAny = authService as any;
  const token = typeof authServiceAny.getToken === 'function' ? authServiceAny.getToken() : null;

  let authReq = req.clone({
    withCredentials: true
  });

  if (token && !req.headers.has('Authorization')) {
    authReq = authReq.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // 1. If error is NOT 401 or is coming directly from /auth/refresh, fail fast
      if (error.status !== 401 || req.url.includes('/auth/refresh')) {
        if (req.url.includes('/auth/refresh')) {
          authService.logout();
        }
        return throwError(() => error);
      }

      // 2. If a refresh is ALREADY in progress, queue this request
      if (isRefreshing) {
        return refreshTokenSubject.pipe(
          filter((result) => result !== null), // Wait until refresh completes (true/false)
          take(1),
          switchMap((isSuccess) => {
            if (isSuccess) {
              return next(authReq.clone());
            }
            return throwError(() => error);
          })
        );
      }

      // 3. First 401 request triggers the refresh pipeline
      isRefreshing = true;
      refreshTokenSubject.next(null); // Lock waiting requests

      return authService.refreshToken().pipe(
        switchMap(() => {
          isRefreshing = false;
          refreshTokenSubject.next(true); // Unlock and notify queued requests

          console.log('Refresh successful! Retrying request...');
          return next(authReq.clone());
        }),
        catchError((refreshError) => {
          isRefreshing = false;
          refreshTokenSubject.next(false); // Unlock with failure state
          authService.logout();
          return throwError(() => refreshError);
        })
      );
    })
  );
};