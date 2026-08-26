export interface ExperienceDTO {
  jobDesignation: string;
  companyName: string;
  workType: string;
  dateFrom: string;
  dateTo: string;
  summary: string[];
}

export interface EducationDTO {
  institution: string;
  degree: string;
  dateFrom: string;
  dateTo: string;
}

export interface CertificationDTO {
  name: string;
  issuedDate: string;
  expirationDate: string;
}

/** Candidate profile response — mirrors backend CandidateProfileResponseDTO */
export interface CandidateProfileResponseDTO {
  id: string;
  fullName: string;
  phone: string;
  location: string;
  experienceYears: number;
  skills: string[];
  about: string;
  experience: ExperienceDTO[];
  education: EducationDTO[];
  certifications: CertificationDTO[];
  resumeUrl: string;
}

/** Candidate profile update request — mirrors backend CandidateProfileRequestDTO */
export interface CandidateProfileRequestDTO {
  fullName: string;
  phone: string;
  location: string;
  experienceYears: number;
  skills: string[];
  about: string;
  experience: ExperienceDTO[];
  education: EducationDTO[];
  certifications: CertificationDTO[];
}

/** Parsed resume data returned by /candidate/profile/resume and /resume/preview */
export interface ParsedResumeData {
  fullName?: string;
  phone?: string;
  location?: string;
  experienceYears?: number;
  skills?: string[];
  rawText?: string;
}

/** Partial update DTO for applying parsed resume data */
export interface CandidateProfileUpdateDTO {
  fullName?: string;
  phone?: string;
  location?: string;
  experienceYears?: number;
  skills?: string[];
}
