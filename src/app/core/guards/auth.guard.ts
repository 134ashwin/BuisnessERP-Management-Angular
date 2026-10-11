import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../app/features/auth/services/auth.service';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('--- AuthGuard Triggered ---');
  console.log('In-memory isLoggedIn status:', authService.isLoggedin());

  // 1. If already authenticated in memory, let user through immediately/
  if (authService.isLoggedin()) {
    return true;
  }

  // 2. On browser refresh (in-memory state lost), try refreshing token via HttpOnly cookie
  return authService.refreshToken().pipe(
    map(() => {
      console.log('Token refresh successful -> Allowing route access');
      return true;
    }),
    catchError((error) => {
      console.warn('Refresh failed/expired -> Redirecting to login', error);
      return of(router.createUrlTree(['/auth/login'], {
        queryParams: { returnUrl: state.url }
      }));
    })
  );
};