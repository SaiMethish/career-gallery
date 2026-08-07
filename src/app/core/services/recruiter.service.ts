import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RecruiterProfileResponseDTO, RecruiterProfileRequestDTO } from '../models/recruiter.model';
import { JobResponseDTO, JobRequestDTO } from '../models/job.model';
import { ApplicantResponseDTO, ApplicationStatusUpdateDTO, JobApplicationStatus } from '../models/application.model';
import { PageResponse } from '../models/job.model';

/** Wraps all HTTP calls for recruiter profile, job management, and applicant review */
@Injectable({ providedIn: 'root' })
export class RecruiterService {
  private readonly http = inject(HttpClient);
  private readonly profileBase = `${environment.apiUrl}/recruiter`;

  // ── Profile ────────────────────────────────────────────────
  getProfile(): Observable<RecruiterProfileResponseDTO> {
    return this.http.get<RecruiterProfileResponseDTO>(`${this.profileBase}/profile/me`);
  }

  updateProfile(dto: RecruiterProfileRequestDTO): Observable<RecruiterProfileResponseDTO> {
    return this.http.put<RecruiterProfileResponseDTO>(`${this.profileBase}/profile/me`, dto);
  }

  // ── Jobs ───────────────────────────────────────────────────
  getMyJobs(): Observable<JobResponseDTO[]> {
    return this.http.get<JobResponseDTO[]>(`${this.profileBase}/jobs`);
  }

  createJob(dto: JobRequestDTO): Observable<JobResponseDTO> {
    return this.http.post<JobResponseDTO>(`${this.profileBase}/jobs`, dto);
  }

  updateJob(jobId: string, dto: JobRequestDTO): Observable<JobResponseDTO> {
    return this.http.put<JobResponseDTO>(`${this.profileBase}/jobs/${jobId}`, dto);
  }

  closeJob(jobId: string): Observable<JobResponseDTO> {
    return this.http.patch<JobResponseDTO>(`${this.profileBase}/jobs/${jobId}/close`, {});
  }

  // ── Applicants ─────────────────────────────────────────────
  getJobApplicants(
    jobId: string,
    page = 0,
    size = 10
  ): Observable<PageResponse<ApplicantResponseDTO>> {
    return this.http.get<PageResponse<ApplicantResponseDTO>>(
      `${this.profileBase}/jobs/${jobId}/applications`,
      { params: { page, size } }
    );
  }

  updateApplicationStatus(
    applicationId: string,
    status: JobApplicationStatus
  ): Observable<ApplicantResponseDTO> {
    return this.http.patch<ApplicantResponseDTO>(
      `${this.profileBase}/applications/${applicationId}/status`,
      { status }
    );
  }
}
