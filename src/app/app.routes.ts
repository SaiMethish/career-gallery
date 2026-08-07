import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { guestGuard } from './core/guards/guest.guard';
import { Role } from './core/models/auth.model';

export const routes: Routes = [
  // Root redirect
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },

  // Auth pages (wrapped in AuthLayoutComponent)
  {
    path: 'auth',
    loadComponent: () =>
      import('./layout/auth-layout/auth-layout.component').then((m) => m.AuthLayoutComponent),
    canActivate: [guestGuard],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then((m) => m.LoginComponent),
        title: 'Sign In — Carbon Talent',
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
        title: 'Create Account — Carbon Talent',
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./features/auth/reset-password/reset-password.component').then((m) => m.ResetPasswordComponent),
        title: 'Reset Password — Carbon Talent',
      },
    ],
  },

  // OAuth callback (no shell)
  {
    path: 'oauth-callback',
    loadComponent: () =>
      import('./features/auth/oauth-callback/oauth-callback.component').then(
        (m) => m.OAuthCallbackComponent
      ),
  },

  // ── Candidate Routes ───────────────────────────────────────
  {
    path: 'candidate',
    loadComponent: () =>
      import('./layout/candidate-shell/candidate-shell.component').then(
        (m) => m.CandidateShellComponent
      ),
    canActivate: [authGuard, roleGuard],
    data: { roles: [Role.CANDIDATE] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/candidate/dashboard/candidate-dashboard.component').then(
            (m) => m.CandidateDashboardComponent
          ),
        title: 'Dashboard — Carbon Talent',
      },
      {
        path: 'jobs',
        loadComponent: () =>
          import('./features/candidate/job-search/job-search.component').then(
            (m) => m.JobSearchComponent
          ),
        title: 'Browse Jobs — Carbon Talent',
      },
      {
        path: 'jobs/:id',
        loadComponent: () =>
          import('./features/candidate/job-detail/job-detail.component').then(
            (m) => m.JobDetailComponent
          ),
        title: 'Job Details — Carbon Talent',
      },
      {
        path: 'applications',
        loadComponent: () =>
          import('./features/candidate/applications/my-applications.component').then(
            (m) => m.MyApplicationsComponent
          ),
        title: 'My Applications — Carbon Talent',
      },
      {
        path: 'saved-jobs',
        loadComponent: () =>
          import('./features/candidate/saved-jobs/saved-jobs.component').then(
            (m) => m.SavedJobsComponent
          ),
        title: 'Saved Jobs — Carbon Talent',
      },
      {
        path: 'recommendations',
        loadComponent: () =>
          import('./features/candidate/ai-recommendations/ai-recommendations.component').then(
            (m) => m.AiRecommendationsComponent
          ),
        title: 'AI Recommendations — Carbon Talent',
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/candidate/profile/candidate-profile.component').then(
            (m) => m.CandidateProfileComponent
          ),
        title: 'My Profile — Carbon Talent',
      },
    ],
  },

  // ── Recruiter Routes ───────────────────────────────────────
  {
    path: 'recruiter',
    loadComponent: () =>
      import('./layout/recruiter-shell/recruiter-shell.component').then(
        (m) => m.RecruiterShellComponent
      ),
    canActivate: [authGuard, roleGuard],
    data: { roles: [Role.RECRUITER] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/recruiter/dashboard/recruiter-dashboard.component').then(
            (m) => m.RecruiterDashboardComponent
          ),
        title: 'Recruiter Dashboard — Carbon Talent',
      },
      {
        path: 'jobs',
        loadComponent: () =>
          import('./features/recruiter/manage-jobs/manage-jobs.component').then(
            (m) => m.ManageJobsComponent
          ),
        title: 'Manage Jobs — Carbon Talent',
      },
      {
        path: 'jobs/new',
        loadComponent: () =>
          import('./features/recruiter/post-job/post-job.component').then(
            (m) => m.PostJobComponent
          ),
        title: 'Post a Job — Carbon Talent',
      },
      {
        path: 'jobs/:id/edit',
        loadComponent: () =>
          import('./features/recruiter/post-job/post-job.component').then(
            (m) => m.PostJobComponent
          ),
        title: 'Edit Job — Carbon Talent',
      },
      {
        path: 'jobs/:jobId/applicants',
        loadComponent: () =>
          import('./features/recruiter/applicants/applicants.component').then(
            (m) => m.ApplicantsComponent
          ),
        title: 'Applicants — Carbon Talent',
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/recruiter/company-profile/company-profile.component').then(
            (m) => m.CompanyProfileComponent
          ),
        title: 'Company Profile — Carbon Talent',
      },
    ],
  },

  // ── Shared Authenticated Routes ────────────────────────────
  {
    path: 'notifications',
    loadComponent: () =>
      import('./features/notifications/notifications.component').then(
        (m) => m.NotificationsComponent
      ),
    canActivate: [authGuard],
    title: 'Notifications — Carbon Talent',
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/settings.component').then((m) => m.SettingsComponent),
    canActivate: [authGuard],
    title: 'Settings — Carbon Talent',
  },

  // ── Error pages ────────────────────────────────────────────
  {
    path: 'not-authorized',
    loadComponent: () =>
      import('./features/not-authorized/not-authorized.component').then(
        (m) => m.NotAuthorizedComponent
      ),
    title: '403 — Carbon Talent',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: '404 — Carbon Talent',
  },
];