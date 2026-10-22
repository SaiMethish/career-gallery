<div align="center">

# 🚀 JobOrbit
### AI-Powered Job Portal — Full-Stack Production App

[![Live Demo](https://img.shields.io/badge/Live%20Demo-joborbit.vercel.app-6929c4?style=for-the-badge&logo=vercel)](https://career-gallery.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-0f62fe?style=for-the-badge&logo=render)](https://jobportal-26gu.onrender.com)
[![Angular](https://img.shields.io/badge/Angular-17-DD0031?style=for-the-badge&logo=angular)](https://angular.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**JobOrbit** is a production-grade AI-powered job portal that aggregates real job listings from companies using the [Greenhouse ATS](https://www.greenhouse.io/) and combines them with recruiter-posted jobs — all ranked by AI compatibility against your uploaded resume.

*Your skills in orbit. Your career in motion.*

[🔗 Live App](https://career-gallery.vercel.app) &nbsp;·&nbsp; [📦 Backend Repo](https://github.com/SaiMethish/jobPortal)

</div>

---

## ✨ Features

### For Candidates
- 🔍 **Job Search** — Filter by title, location, skills, job type, experience range
- 🤖 **AI Recommendations** — Jobs ranked 10–100% by resume match using NLP cosine similarity, sorted highest → lowest
- 📄 **Resume Upload** — PDF upload → parsed to extract skills, experience, education
- 📌 **Application Tracker** — Track status of all submitted applications in one place
- 💾 **Saved Jobs** — Bookmark jobs for later review
- 🏢 **Company Profiles** — View recruiter company pages

### For Recruiters
- 📝 **Post Jobs** — Create and manage job listings with skill tags, experience range, salary
- 👥 **Applicant Review** — View, filter, and update applicants by status (shortlisted, rejected, offered)
- 🗂️ **Dashboard** — Overview of active jobs and total applicant counts

### For Admins
- 👤 **User Management** — View and moderate candidate/recruiter accounts
- 🔄 **ATS Sync Controls** — Trigger Greenhouse sync on demand
- 📊 **Job Moderation** — Review and manage all platform listings

### Platform-Wide
- 🏗️ **Greenhouse ATS Integration** — Live job sync from 35+ Indian tech companies
- ⏱️ **Daily Auto-Refresh** — Cron job syncs fresh listings and removes expired ones every 24h
- 🔐 **JWT Auth** — Silent refresh, role-based guards, session expiry, secure cross-origin cookies
- 📱 **Responsive Design** — Works across desktop and mobile

---

## 🏢 Integrated Companies (via Greenhouse ATS)

| Category | Companies |
|----------|-----------|
| **Product / Unicorns** | Groww, InMobi, HackerRank, HighRadius, Zenoti, Slice, 6sense, Druva, CommerceIQ, Observe.ai, Apollo.io, Samsara, Pure Storage |
| **Global Tech (India Office)** | MongoDB, Okta, Stripe, GitLab, Datadog, Elastic, Twilio, Rubrik, Coinbase, Airbnb, Figma |
| **Services / Consultancies** | Thoughtworks, Turing, Kaseya, Valtech, Dept Agency |

---

## 🧠 AI Recommendation Engine

1. **Resume Upload** → PDF stored in Supabase Storage, text extracted and saved to profile
2. **Profile Build** → Skills, experience, education, location extracted into structured form
3. **Job Scoring** → Every active job (up to 200) scored against candidate text using:
   - **Primary:** Cosine similarity via FastAPI/NLP microservice
   - **Fallback:** Skill-overlap heuristic matcher with title-word boosting
4. **Ranking** → Jobs returned ranked highest → lowest (10% to 100%), color-coded by tier:
   - 🟢 **80–100% → Top Match**
   - 🔵 **60–79% → High Match**
   - 🟡 **40–59% → Good Match**
   - ⚪ **10–39% → Match**

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | Angular 17 (Standalone Components) |
| **State Management** | NgRx (Signals + Store) |
| **UI Components** | PrimeNG + Custom CSS Design System |
| **Auth** | JWT with silent refresh & role-based guards |
| **Backend** | Spring Boot 3 (Java 17) |
| **Database** | PostgreSQL (via Render) |
| **Cache** | Redis |
| **File Storage** | Supabase Storage (PDF resumes) |
| **AI Service** | FastAPI + Sentence Transformers (NLP) |
| **ATS Integration** | Greenhouse Public API |
| **Frontend Hosting** | Vercel |
| **Backend Hosting** | Render |

---

## 📁 Project Structure

```
src/app/
  core/           # Singleton services, guards, interceptors, models
    auth/
    interceptors/
    guards/
    models/
    services/
  shared/         # Reusable dumb/presentational components
    components/
    directives/
    pipes/
  layout/         # Role-specific shells (candidate, recruiter, admin)
  features/
    auth/         # Login, Register, Forgot/Reset Password
    candidate/    # Profile, Job Search, AI Recommendations, Applications
    recruiter/    # Job Posting, Applicant Review, Dashboard
    admin/        # User Management, Job Moderation
  state/          # NgRx root store setup
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- Angular CLI 17+
- Backend running locally — see [jobPortal backend repo](https://github.com/SaiMethish/jobPortal)

### Setup

```bash
# Clone the repository
git clone https://github.com/SaiMethish/career-gallery.git
cd career-gallery

# Install dependencies
npm install

# Start dev server (points to localhost backend by default)
npm start
```

The app runs at `http://localhost:4200`.

### Environment Configuration

```typescript
// src/environments/environment.ts  (development)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
};

// src/environments/environment.prod.ts  (production)
export const environment = {
  production: true,
  apiUrl: 'https://jobportal-26gu.onrender.com',
};
```

---

## 🌐 Live Deployment

| Service | URL |
|---------|-----|
| Frontend (Vercel) | https://career-gallery.vercel.app |
| Backend API (Render) | https://jobportal-26gu.onrender.com |
| API Health Check | https://jobportal-26gu.onrender.com/actuator/health |

> ⚠️ **Note:** The backend is on a Render free tier. It may take ~60 seconds to wake up after a period of inactivity. The frontend handles this gracefully with loading states.

---

## 📄 License

MIT License © 2026 [SaiMethish](https://github.com/SaiMethish)

---

<div align="center">
  Built with ❤️ by <a href="https://github.com/SaiMethish">SaiMethish</a>
</div>
