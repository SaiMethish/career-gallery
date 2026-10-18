import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JobResponseDTO } from '../models/job.model';

export interface JobRequestDTO {
  title: string;
  description: string;
  skills?: string;
  experienceMin?: number;
  experienceMax?: number;
  salaryMin?: number;
  salaryMax?: number;
  location?: string;
  jobType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
}

/** Wraps all HTTP calls for the recruiter job management resource */
@Injectable({ providedIn: 'root' })
export class RecruiterJobService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/recruiter/jobs`;

  /** POST /recruiter/jobs */
  createJob(job: JobRequestDTO): Observable<JobResponseDTO> {
    return this.http.post<JobResponseDTO>(this.base, job);
  }

  /** PUT /recruiter/jobs/{jobId} */
  updateJob(jobId: string, job: JobRequestDTO): Observable<JobResponseDTO> {
    return this.http.put<JobResponseDTO>(`${this.base}/${jobId}`, job);
  }

  /** PATCH /recruiter/jobs/{jobId}/close */
  closeJob(jobId: string): Observable<JobResponseDTO> {
    return this.http.patch<JobResponseDTO>(`${this.base}/${jobId}/close`, {});
  }

  /** GET /recruiter/jobs */
  getMyJobs(): Observable<JobResponseDTO[]> {
    return this.http.get<JobResponseDTO[]>(this.base);
  }
}
