import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AdminService } from './admin.service';
import { environment } from '../../../environments/environment';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdminService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch platform metrics', () => {
    const mockStats = {
      totalUsers: 15,
      candidateCount: 10,
      recruiterCount: 4,
      adminCount: 1,
      totalJobs: 8,
      openJobs: 6,
      totalApplications: 12,
    };

    service.getStats().subscribe((stats) => {
      expect(stats.totalUsers).toBe(15);
      expect(stats.candidateCount).toBe(10);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/admin/stats`);
    expect(req.request.method).toBe('GET');
    req.flush(mockStats);
    httpMock.verify();
  });

  it('should toggle user verification', () => {
    const userId = 'user-uuid-123';
    const mockUser = {
      userId,
      email: 'test@example.com',
      role: 'CANDIDATE',
      authProvider: 'LOCAL',
      isVerified: true,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-02',
    };

    service.toggleUserVerification(userId).subscribe((res) => {
      expect(res.isVerified).toBe(true);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/admin/users/${userId}/toggle-verify`);
    expect(req.request.method).toBe('PATCH');
    req.flush(mockUser);
    httpMock.verify();
  });
});
