import { Role } from '../models/auth.model';

/** Strongly typed role constants — use instead of raw strings */
export const ROLES = Role;

/** Application route path constants — single source of truth for all navigation */
export const APP_ROUTES = {
  AUTH: {
    ROOT: 'auth',
    LOGIN: 'auth/login',
    REGISTER: 'auth/register',
  },
  OAUTH_CALLBACK: 'oauth-callback',
  CANDIDATE: {
    ROOT: 'candidate',
    DASHBOARD: 'candidate/dashboard',
    JOBS: 'candidate/jobs',
    JOB_DETAIL: (id: string) => `candidate/jobs/${id}`,
    APPLICATIONS: 'candidate/applications',
    SAVED_JOBS: 'candidate/saved-jobs',
    RECOMMENDATIONS: 'candidate/recommendations',
    PROFILE: 'candidate/profile',
  },
  RECRUITER: {
    ROOT: 'recruiter',
    DASHBOARD: 'recruiter/dashboard',
    JOBS: 'recruiter/jobs',
    POST_JOB: 'recruiter/jobs/new',
    EDIT_JOB: (id: string) => `recruiter/jobs/${id}/edit`,
    APPLICANTS: (jobId: string) => `recruiter/jobs/${jobId}/applicants`,
    PROFILE: 'recruiter/profile',
  },
  NOTIFICATIONS: 'notifications',
  SETTINGS: 'settings',
  NOT_AUTHORIZED: 'not-authorized',
  NOT_FOUND: '**',
} as const;
