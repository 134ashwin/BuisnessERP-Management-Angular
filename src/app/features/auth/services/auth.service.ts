// AuthService (features/auth/services/auth.service.ts): Manages user session state, stores tokens, handles login(), logout(), and calls the /auth/refresh endpoint.
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse
} from '../models/auth.model'; // Imported from feature models folder!
import { HttpClient, HttpBackend } from '@angular/common/http';
import { Router } from '@angular/router';
import {environment}  from '../../../../environments/environment'; // Import environment for baseUrl

  
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = inject(ApiService);
  private httpBackend = inject(HttpBackend);
  private router = inject(Router);

  // Create a clean HttpClient that bypasses all interceptors
  private rawHttp = new HttpClient(this.httpBackend);
  private baseUrl = environment.apiUrl;

  // In-memory Signal for auth state
  currentUser = signal<string | null>(null);

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.api.post<LoginResponse>('auth/login', credentials).pipe(
      tap(response => this.currentUser.set(response.email))
    );
  }

  refreshToken(): Observable<{ message: string }> {
    // Calling rawHttp ensures this call NEVER triggers apiInterceptor again!
    return this.rawHttp.post<{ message: string }>(
      `${this.baseUrl}/auth/refresh`,
      {},
      { withCredentials: true } // REQUIRED to send HttpOnly cookies
    );
  }

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.api.post<RegisterResponse>('auth/register', data);
  }

  // Session Rehydration: Called on page refresh to populate signal
  checkAuth(): Observable<LoginResponse> {
    return this.api.get<LoginResponse>('auth/me').pipe(
      tap({
        next: (user) => this.currentUser.set(user.email),
        error: () => this.currentUser.set(null)
      })
    );
  }

  logout(): Observable<void> {
    return this.api.post<void>('auth/logout', {}).pipe(
      tap(() => this.currentUser.set(null)),
      tap(() => this.router.navigate(['/login']))
    );
  }
}