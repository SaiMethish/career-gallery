import { JobResponseDTO } from './job.model';

/** Recruiter profile response — mirrors backend RecruiterProfileResponseDTO */
export interface RecruiterProfileResponseDTO {
  id: string;
  userId: string;
  companyName: string;
  companyWebsite: string;
  companyDescription: string;
  industry: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

/** Recruiter profile update request — mirrors backend RecruiterProfileRequestDTO */
export interface RecruiterProfileRequestDTO {
  companyName: string;
  companyWebsite?: string;
  companyDescription?: string;
  industry?: string;
  location?: string;
}

/** Full public company detail with open job listings */
export interface CompanyDetailDTO {
  id: string;
  userId?: string;
  companyName: string;
  companyWebsite?: string;
  companyDescription?: string;
  industry?: string;
  location?: string;
  openJobs: JobResponseDTO[];
  totalJobsCount: number;
  createdAt?: string;
  updatedAt?: string;
}

