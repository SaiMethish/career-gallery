import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CandidateProfileResponseDTO,
  CandidateProfileRequestDTO,
  ParsedResumeData,
  CandidateProfileUpdateDTO,
} from '../models/candidate.model';
import { JobResponseDTO } from '../models/job.model';
import { ApplicationResponseDTO, ApplicationRequestDTO } from '../models/application.model';
import { PageResponse } from '../models/job.model';

/** Wraps all HTTP calls for candidate profile, applications, saved jobs, and resume */
@Injectable({ providedIn: 'root' })
export class CandidateService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/candidate`;

  // ── Profile ────────────────────────────────────────────────
  getProfile(): Observable<CandidateProfileResponseDTO> {
    return this.http.get<CandidateProfileResponseDTO>(`${this.base}/profile/me`);
  }

  updateProfile(dto: CandidateProfileRequestDTO): Observable<CandidateProfileResponseDTO> {
    return this.http.put<CandidateProfileResponseDTO>(`${this.base}/profile/me`, dto);
  }

  // ── Resume ─────────────────────────────────────────────────
  uploadResume(file: File): Observable<ParsedResumeData> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<ParsedResumeData>(`${this.base}/profile/resume`, form);
  }

  getResumePreview(): Observable<ParsedResumeData> {
    return this.http.get<ParsedResumeData>(`${this.base}/profile/resume/preview`);
  }

  applyParsedResume(dto: CandidateProfileUpdateDTO): Observable<string> {
    return this.http.post(`${this.base}/profile/resume/apply`, dto, { responseType: 'text' });
  }

  // ── Applications ───────────────────────────────────────────
  getMyApplications(page = 0, size = 10): Observable<PageResponse<ApplicationResponseDTO>> {
    return this.http.get<PageResponse<ApplicationResponseDTO>>(
      `${environment.apiUrl}/candidate/applications`,
      { params: { page, size } }
    );
  }

  applyToJob(jobId: string, dto: ApplicationRequestDTO): Observable<ApplicationResponseDTO> {
    return this.http.post<ApplicationResponseDTO>(
      `${environment.apiUrl}/jobs/${jobId}/apply`,
      dto
    );
  }

  withdrawApplication(applicationId: string): Observable<void> {
    return this.http.patch<void>(
      `${environment.apiUrl}/candidate/applications/${applicationId}/withdraw`,
      {}
    );
  }

  // ── Saved Jobs ─────────────────────────────────────────────
  getSavedJobs(): Observable<JobResponseDTO[]> {
    return this.http.get<JobResponseDTO[]>(`${environment.apiUrl}/candidate/saved-jobs`);
  }

  saveJob(jobId: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/jobs/${jobId}/save`, {});
  }

  unsaveJob(jobId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/jobs/${jobId}/unsave`);
  }
}
