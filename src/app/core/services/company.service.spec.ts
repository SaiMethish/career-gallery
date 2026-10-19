import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { CompanyService } from './company.service';
import { environment } from '../../../environments/environment';

describe('CompanyService', () => {
  let service: CompanyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CompanyService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(CompanyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch company details by ID', () => {
    const mockId = '123e4567-e89b-12d3-a456-426614174000';
    const mockCompany = {
      id: mockId,
      companyName: 'Quantum Dynamics',
      industry: 'AI & Robotics',
      openJobs: [],
      totalJobsCount: 0,
    };

    service.getCompanyById(mockId).subscribe((data) => {
      expect(data.companyName).toBe('Quantum Dynamics');
      expect(data.industry).toBe('AI & Robotics');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/companies/${mockId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCompany);
    httpMock.verify();
  });
});
