/** Candidate profile response — mirrors backend CandidateProfileResponseDTO */
export interface CandidateProfileResponseDTO {
  id: string;
  fullName: string;
  phone: string;
  location: string;
  experienceYears: number;
  skills: string[];
  resumeUrl: string;
}

/** Candidate profile update request — mirrors backend CandidateProfileRequestDTO */
export interface CandidateProfileRequestDTO {
  fullName: string;
  phone: string;
  location: string;
  experienceYears: number;
  skills: string[];
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
