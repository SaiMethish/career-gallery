import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  JobResponseDTO,
  JobSearchFilters,
  PageResponse,
  RecommendedJobDTO,
} from '../models/job.model';

/** Wraps all HTTP calls for the public job search resource */
@Injectable({ providedIn: 'root' })
export class JobService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/jobs`;

  /** GET /jobs/search with optional filter params */
  searchJobs(
    filters: JobSearchFilters,
    page = 0,
    size = 10
  ): Observable<PageResponse<JobResponseDTO>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (filters.title) params = params.set('title', filters.title);
    if (filters.skills) params = params.set('skills', filters.skills);
    if (filters.location) params = params.set('location', filters.location);
    if (filters.experienceMin !== undefined) params = params.set('experienceMin', filters.experienceMin);
    if (filters.experienceMax !== undefined) params = params.set('experienceMax', filters.experienceMax);
    if (filters.salaryMin !== undefined) params = params.set('salaryMin', filters.salaryMin);
    if (filters.salaryMax !== undefined) params = params.set('salaryMax', filters.salaryMax);
    if (filters.jobType) params = params.set('jobType', filters.jobType);
    if (filters.source) params = params.set('source', filters.source);
    if (filters.companyCategory) params = params.set('companyCategory', filters.companyCategory);
    if (filters.companyName) params = params.set('companyName', filters.companyName);
    return this.http.get<PageResponse<JobResponseDTO>>(`${this.base}/search`, { params });
  }

  /** GET /jobs/{jobId} */
  getJobById(jobId: string): Observable<JobResponseDTO> {
    return this.http.get<JobResponseDTO>(`${this.base}/${jobId}`);
  }

  /** GET /jobs/cities — distinct active Indian cities */
  getCities(): Observable<string[]> {
    return this.http.get<string[]>(`${this.base}/cities`);
  }

  /** GET /jobs/companies — distinct employers */
  getCompanies(): Observable<string[]> {
    return this.http.get<string[]>(`${this.base}/companies`);
  }

  /** GET /candidate/jobs/{jobId}/match — AI resume match against job */
  getJobMatch(jobId: string): Observable<import('../models/job.model').JobMatchResponseDTO> {
    return this.http.get<import('../models/job.model').JobMatchResponseDTO>(
      `${environment.apiUrl}/candidate/jobs/${jobId}/match`
    );
  }

  /** POST /jobs/sync — on-demand ATS trigger */
  triggerAtsSync(): Observable<any> {
    return this.http.post<any>(`${this.base}/sync`, {});
  }

  /** GET /jobs/recommended (CANDIDATE role required) */
  getRecommendations(): Observable<RecommendedJobDTO[]> {
    return this.http.get<RecommendedJobDTO[]>(`${this.base}/recommended`);
  }
}
