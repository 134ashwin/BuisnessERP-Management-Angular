import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, timeout, retry } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HTTP_CONFIG } from '../../config/http.config';
import { LoggerService } from './logger.service';

/**
 * Base HTTP Service
 * Extends HttpClient with common functionality like timeout, retry, error handling
 * Use this as a base for all API services
 */
@Injectable({
  providedIn: 'root'
})
export class BaseHttpService {
  constructor(
    private http: HttpClient,
    private logger: LoggerService
  ) {}

  /**
   * GET request wrapper
   */
  get<T>(url: string, options?: {params:HttpParams;}): Observable<T> { //here I used HttpParms to give fix response that only HttpParams will be accepted
    this.logger.info(`GET ${url}`, options);
    return this.http
      .get<T>(url, options)
      .pipe(
        timeout(HTTP_CONFIG.TIMEOUT),
        retry(HTTP_CONFIG.RETRY.MAX_ATTEMPTS),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * POST request wrapper
   */
  post<T>(url: string, body: any, options?: {params:HttpParams;}): Observable<T> {
    this.logger.info(`POST ${url}`, body);
    return this.http
      .post<T>(url, body, options)
      .pipe(
        timeout(HTTP_CONFIG.TIMEOUT),
        retry(HTTP_CONFIG.RETRY.MAX_ATTEMPTS),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * PUT request wrapper
   */
  put<T>(url: string, body: any, options?: {params:HttpParams;}): Observable<T> {
    this.logger.info(`PUT ${url}`, body);
    return this.http
      .put<T>(url, body, options)
      .pipe(
        timeout(HTTP_CONFIG.TIMEOUT),
        retry(HTTP_CONFIG.RETRY.MAX_ATTEMPTS),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * PATCH request wrapper
   */
  patch<T>(url: string, body: any, options?: {params:HttpParams;}): Observable<T> {
    this.logger.info(`PATCH ${url}`, body);
    return this.http
      .patch<T>(url, body, options)
      .pipe(
        timeout(HTTP_CONFIG.TIMEOUT),
        retry(HTTP_CONFIG.RETRY.MAX_ATTEMPTS),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * DELETE request wrapper
   */
  delete<T>(url: string, options?: {params:HttpParams;}): Observable<T> {
    this.logger.info(`DELETE ${url}`);
    return this.http
      .delete<T>(url, options)
      .pipe(
        timeout(HTTP_CONFIG.TIMEOUT),
        retry(HTTP_CONFIG.RETRY.MAX_ATTEMPTS),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Create query string from object
   */
  buildParams(params: any): HttpParams {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key]);
      }
    });
    return httpParams;
  }

  /**
   * Global error handler
   */
  private handleError(error: any) {
    this.logger.error('HTTP Error', error);
    return throwError(() => error);
  }
}
