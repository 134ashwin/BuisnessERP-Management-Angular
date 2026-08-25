import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

/**
 * Auth Guard - Protects routes that require authentication
 * Usage: Add to route guards: canActivate: [AuthGuard]
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isAuthenticated = this.checkAuth(); // Implement based on auth service

    if (!isAuthenticated) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    return true;
  }

  private checkAuth(): boolean {
    // TODO: Implement actual authentication check
    return false; // Initially false - integrate with AuthService
  }
}
