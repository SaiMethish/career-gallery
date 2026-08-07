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
