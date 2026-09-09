import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { UserProfile } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private api = inject(ApiService);

  // Calls the protected API endpoint: GET https://localhost:7123/api/user/profile
  getUserProfile(): Observable<UserProfile> {
    return this.api.get<UserProfile>('user/profile');
  }
}