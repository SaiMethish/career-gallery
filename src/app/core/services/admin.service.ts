import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminStatsDTO, AdminUserDTO } from '../models/admin.model';
import { JobResponseDTO, PageResponse } from '../models/job.model';
import { Role } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/admin`;

  /** Aggregates core platform metrics for dashboard KPIs */
  getStats(): Observable<AdminStatsDTO> {
    return this.http.get<AdminStatsDTO>(`${this.baseUrl}/stats`);
  }

  /** Paged and filtered user directory query */
  getUsers(role?: Role | string, search?: string, page = 0, size = 10): Observable<PageResponse<AdminUserDTO>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (role && role !== 'ALL') {
      params = params.set('role', role);
    }
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<PageResponse<AdminUserDTO>>(`${this.baseUrl}/users`, { params });
  }

  /** Enable/disable user verification */
  toggleUserVerification(userId: string): Observable<AdminUserDTO> {
    return this.http.patch<AdminUserDTO>(`${this.baseUrl}/users/${userId}/toggle-verify`, {});
  }

  /** Paged list of all jobs across the platform for moderation */
  getAllJobs(page = 0, size = 10): Observable<PageResponse<JobResponseDTO>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse<JobResponseDTO>>(`${this.baseUrl}/jobs`, { params });
  }

  /** Delete or remove fraudulent job listing */
  deleteJob(jobId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/jobs/${jobId}`);
  }
}
