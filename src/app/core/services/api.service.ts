
// ApiService (core/services/api.service.ts): Generic HTTP wrapper (get, post, put, delete). It does NOT manage user session state, tokens, or login status.
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://localhost:7098/api'; // Single source of truth for API base URL

  // Global HTTP options required for HttpOnly Cookie authentication
  private readonly defaultOptions = {
    withCredentials: true // MANDATORY: Ensures browser automatically attaches and receives HttpOnly cookies
  };

  get<T>(url: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${url}`, { ...this.defaultOptions, params });
  }

  post<T>(url: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${url}`, body, this.defaultOptions);
  }

  put<T>(url: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${url}`, body, this.defaultOptions);
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${url}`, this.defaultOptions);
  }
}