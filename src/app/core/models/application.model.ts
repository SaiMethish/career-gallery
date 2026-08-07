/** Job application status — mirrors backend JobApplicationStatus enum */
export enum JobApplicationStatus {
  APPLIED = 'APPLIED',
  SHORTLISTED = 'SHORTLISTED',
  INTERVIEW = 'INTERVIEW',
  OFFERED = 'OFFERED',
  HIRED = 'HIRED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

/** Response for candidate's own applications — mirrors backend ApplicationResponseDTO */
export interface ApplicationResponseDTO {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  status: JobApplicationStatus;
  appliedAt: string;
}

/** Response for recruiter viewing applicants — mirrors backend ApplicantResponseDTO */
export interface ApplicantResponseDTO {
  id: string;
  candidateProfileId: string;
  candidateName: string;
  candidateEmail: string;
  experienceYears: number;
  skills: string[];
  resumeUrl: string;
  status: JobApplicationStatus;
  appliedAt: string;
}

/** Request to apply to a job */
export interface ApplicationRequestDTO {
  coverLetter?: string;
}

/** Request to update application status (recruiter side) */
export interface ApplicationStatusUpdateDTO {
  status: JobApplicationStatus;
}
