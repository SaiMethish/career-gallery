/** Job types — mirrors backend JobType enum */
export enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
}

/** Job status — mirrors backend JobStatus enum */
export enum JobStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  EXPIRED = 'EXPIRED',
}

/** Shape returned by /jobs/search, /jobs/{id}, /recruiter/jobs */
export interface JobResponseDTO {
  id: string;
  recruiterProfileId?: string;
  companyName: string;
  title: string;
  description: string;
  skills: string;
  experienceMin: number;
  experienceMax: number;
  salaryMin: number;
  salaryMax: number;
  location: string;
  jobType: JobType;
  status: JobStatus;
  applicationCount: number;
  source?: string; // 'INTERNAL' | 'GREENHOUSE' | 'LEVER'
  externalId?: string;
  applicationUrl?: string;
  companyCategory?: string; // 'PRODUCT' | 'SERVICE'
  city?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

/** Request body for POST /recruiter/jobs and PUT /recruiter/jobs/{id} */
export interface JobRequestDTO {
  title: string;
  description: string;
  skills?: string;
  experienceMin: number;
  experienceMax: number;
  salaryMin?: number;
  salaryMax?: number;
  location?: string;
  jobType: JobType;
}

/** Pagination wrapper returned by Spring Data Page */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

/** Job search filter parameters */
export interface JobSearchFilters {
  title?: string;
  skills?: string;
  location?: string;
  experienceMin?: number;
  experienceMax?: number;
  salaryMin?: number;
  salaryMax?: number;
  jobType?: JobType;
  source?: string;
  companyCategory?: string;
  companyName?: string;
}

/** AI recommendation — wraps JobResponseDTO with a match score */
export interface RecommendedJobDTO {
  job: JobResponseDTO;
  score: number;
}

/** AI Resume-to-Job match comparison response */
export interface JobMatchResponseDTO {
  jobId: string;
  jobTitle: string;
  companyName: string;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  summary: string;
  hasResume: boolean;
  applicationUrl?: string;
}
