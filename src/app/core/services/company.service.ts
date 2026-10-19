import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CompanyDetailDTO } from '../models/recruiter.model';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/companies`;

  /** Fetch public company profile along with all active job postings */
  getCompanyById(id: string): Observable<CompanyDetailDTO> {
    return this.http.get<CompanyDetailDTO>(`${this.baseUrl}/${id}`);
  }
}
