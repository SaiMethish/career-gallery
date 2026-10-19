import { AuthProvider, Role } from './auth.model';

export interface AdminUserDTO {
  userId: string;
  email: string;
  role: Role;
  authProvider: AuthProvider;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStatsDTO {
  totalUsers: number;
  candidateCount: number;
  recruiterCount: number;
  adminCount: number;
  totalJobs: number;
  openJobs: number;
  totalApplications: number;
}
