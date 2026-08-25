import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../shared/constants/app.constants';
import { ILoginRequest, IAuthResponse, IForgotPasswordRequest } from '../../shared/models/auth.model';

/**
 * Authentication Service
 * Handles all authentication-related API calls and token management
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(credentials: ILoginRequest): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
  }

  logout(): Observable<any> {
    return this.http.post(API_ENDPOINTS.AUTH.LOGOUT, {});
  }

  forgotPassword(request: IForgotPasswordRequest): Observable<any> {
    return this.http.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, request);
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // TODO: Implement JWT token validation
    return true;
  }

  getToken(): string | null {
    // TODO: Retrieve from secure storage
    return null;
  }

  setToken(token: string): void {
    // TODO: Store in secure storage
  }

  clearToken(): void {
    // TODO: Clear from secure storage
  }
}
