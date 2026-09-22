
// ApiService (core/services/api.service.ts): Generic HTTP wrapper (get, post, put, delete). It does NOT manage user session state, tokens, or login status.
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; // Import environment for baseUrl

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl; // Single source of truth for API base URL

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



//About Api Service 

// Where it lives: src/app/core/services/api.service.ts
// Why it exists: It is a single, reusable wrapper around Angular's HttpClient. It attaches the base URL (environment.apiUrl) 
// and default headers to every single HTTP call in your entire app.
// What problem it solves: Stops you from repeating https://... and error-handling code in 20 different service files.