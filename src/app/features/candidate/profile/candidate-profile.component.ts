import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { CandidateService } from '../../../core/services/candidate.service';
import { ToastService } from '../../../core/services/toast.service';
import { CandidateProfileResponseDTO, ParsedResumeData, ExperienceDTO, EducationDTO, CertificationDTO } from '../../../core/models/candidate.model';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { ChipModule} from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';

/** Candidate profile + resume upload — matches Stitch "My Profile" + "Resume Upload" screens */
@Component({
  selector: 'app-candidate-profile',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, TextareaModule, ButtonModule, ChipModule, DialogModule, DatePipe, TitleCasePipe],
  templateUrl: './candidate-profile.component.html',
  styleUrl: './candidate-profile.component.css'
})
export class CandidateProfileComponent implements OnInit {
  private readonly candidateService = inject(CandidateService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  readonly profile = signal<CandidateProfileResponseDTO | null>(null);
  readonly parsedResume = signal<ParsedResumeData | null>(null);
  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly isDragging = signal(false);

  profileForm!: FormGroup;
  experienceForm!: FormGroup;
  educationForm!: FormGroup;
  certificationForm!: FormGroup;

  showExperienceDialog = signal(false);
  showEducationDialog = signal(false);
  showCertificationDialog = signal(false);

  editingExperienceIndex = signal<number | null>(null);
  editingEducationIndex = signal<number | null>(null);
  editingCertificationIndex = signal<number | null>(null);

  /** Controls whether the end-date field is hidden in the experience dialog */
  isCurrentlyWorking = signal(false);

  /** Controls click-to-edit mode on the About section */
  editingAbout = signal(false);

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: [''],
      location: [''],
      experienceYears: [0, [Validators.min(0)]],
      skills: [[]],
      about: [''],
      experience: [[]],
      education: [[]],
      certifications: [[]],
    });

    this.experienceForm = this.fb.group({
      jobDesignation: ['', Validators.required],
      companyName: ['', Validators.required],
      workType: ['FULL_TIME'],
      dateFrom: ['', Validators.required],
      dateTo: [''],
      summary: [[]]
    });

    this.educationForm = this.fb.group({
      institution: ['', Validators.required],
      degree: ['', Validators.required],
      dateFrom: ['', Validators.required],
      dateTo: ['']
    });

    this.certificationForm = this.fb.group({
      name: ['', Validators.required],
      issuedDate: ['', Validators.required],
      expirationDate: ['']
    });

    this.loadProfile();
  }

  loadProfile(): void {
    this.candidateService.getProfile().subscribe({
      next: (p) => {
        this.profile.set(p);
        this.profileForm.patchValue({
          fullName: p.fullName || '',
          phone: p.phone || '',
          location: p.location || '',
          experienceYears: p.experienceYears || 0,
          skills: p.skills || [],
          about: p.about || '',
          experience: p.experience || [],
          education: p.education || [],
          certifications: p.certifications || []
        });
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  onSave(): void {
    if (this.profileForm.invalid) return;
    this.isSaving.set(true);
    this.candidateService.updateProfile(this.profileForm.value).subscribe({
      next: (p) => {
        this.profile.set(p);
        this.profileForm.patchValue({ ...p });
        this.isSaving.set(false);
        this.toast.success('Saved', 'Profile updated successfully.');
      },
      error: () => { this.isSaving.set(false); this.toast.error('Error', 'Failed to save profile.'); },
    });
  }

  // Experience Dialog
  openExperienceDialog(index: number | null = null): void {
    this.editingExperienceIndex.set(index);
    if (index !== null) {
      const exp = this.profileForm.value.experience[index];
      this.experienceForm.patchValue(exp);
      // Determine if this entry is currently active (no end date)
      const currentlyWorking = !exp.dateTo;
      this.isCurrentlyWorking.set(currentlyWorking);
      if (currentlyWorking) {
        this.experienceForm.get('dateTo')?.disable();
      } else {
        this.experienceForm.get('dateTo')?.enable();
      }
    } else {
      this.experienceForm.reset({ workType: 'FULL_TIME', summary: [] });
      this.isCurrentlyWorking.set(false);
      this.experienceForm.get('dateTo')?.enable();
    }
    this.showExperienceDialog.set(true);
  }

  /** Toggle the "currently working" checkbox — disables/clears the end date field */
  toggleCurrentlyWorking(checked: boolean): void {
    this.isCurrentlyWorking.set(checked);
    const dateToCtrl = this.experienceForm.get('dateTo');
    if (checked) {
      dateToCtrl?.setValue(null);
      dateToCtrl?.disable();
    } else {
      dateToCtrl?.enable();
    }
  }

  saveExperience(): void {
    if (this.experienceForm.invalid) return;
    const raw = this.experienceForm.getRawValue(); // getRawValue includes disabled controls
    const expList = [...this.profileForm.value.experience];
    const index = this.editingExperienceIndex();
    // Ensure dateTo is null when currently working
    if (this.isCurrentlyWorking()) { raw.dateTo = null; }
    if (index !== null) {
      expList[index] = raw;
    } else {
      expList.push(raw);
    }
    this.profileForm.patchValue({ experience: expList });
    this.profileForm.markAsDirty();
    this.showExperienceDialog.set(false);
    this.onSave();
  }

  deleteExperience(index: number): void {
    const expList = [...this.profileForm.value.experience];
    expList.splice(index, 1);
    this.profileForm.patchValue({ experience: expList });
    this.profileForm.markAsDirty();
    this.onSave();
  }

  addExperienceSummary(input: HTMLInputElement): void {
    const value = input.value.trim();
    if (value) {
      const summaries = this.experienceForm.value.summary || [];
      this.experienceForm.patchValue({ summary: [...summaries, value] });
    }
    input.value = '';
  }

  removeExperienceSummary(index: number): void {
    const summaries = [...this.experienceForm.value.summary];
    summaries.splice(index, 1);
    this.experienceForm.patchValue({ summary: summaries });
  }

  // Education Dialog
  openEducationDialog(index: number | null = null): void {
    this.editingEducationIndex.set(index);
    if (index !== null) {
      const edu = this.profileForm.value.education[index];
      this.educationForm.patchValue(edu);
    } else {
      this.educationForm.reset();
    }
    this.showEducationDialog.set(true);
  }

  saveEducation(): void {
    if (this.educationForm.invalid) return;
    const eduList = [...this.profileForm.value.education];
    const index = this.editingEducationIndex();
    if (index !== null) {
      eduList[index] = this.educationForm.value;
    } else {
      eduList.push(this.educationForm.value);
    }
    this.profileForm.patchValue({ education: eduList });
    this.profileForm.markAsDirty();
    this.showEducationDialog.set(false);
    this.onSave();
  }

  deleteEducation(index: number): void {
    const eduList = [...this.profileForm.value.education];
    eduList.splice(index, 1);
    this.profileForm.patchValue({ education: eduList });
    this.profileForm.markAsDirty();
    this.onSave();
  }

  // Certification Dialog
  openCertificationDialog(index: number | null = null): void {
    this.editingCertificationIndex.set(index);
    if (index !== null) {
      const cert = this.profileForm.value.certifications[index];
      this.certificationForm.patchValue(cert);
    } else {
      this.certificationForm.reset();
    }
    this.showCertificationDialog.set(true);
  }

  saveCertification(): void {
    if (this.certificationForm.invalid) return;
    const certList = [...this.profileForm.value.certifications];
    const index = this.editingCertificationIndex();
    if (index !== null) {
      certList[index] = this.certificationForm.value;
    } else {
      certList.push(this.certificationForm.value);
    }
    this.profileForm.patchValue({ certifications: certList });
    this.profileForm.markAsDirty();
    this.showCertificationDialog.set(false);
    this.onSave();
  }

  deleteCertification(index: number): void {
    const certList = [...this.profileForm.value.certifications];
    certList.splice(index, 1);
    this.profileForm.patchValue({ certifications: certList });
    this.profileForm.markAsDirty();
    this.onSave();
  }

  // Resume Upload Logic
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.uploadResume(file);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.uploadResume(file);
  }

  applyParsedResume(): void {
    const parsed = this.parsedResume();
    if (!parsed) return;
    this.candidateService.applyParsedResume(parsed).subscribe({
      next: () => {
        this.parsedResume.set(null);
        this.toast.success('Applied', 'Resume data applied to your profile.');
        this.loadProfile();
      },
    });
  }

  private uploadResume(file: File): void {
    this.toast.info('Uploading', 'Parsing your resume...');
    this.candidateService.uploadResume(file).subscribe({
      next: (parsed) => {
        this.parsedResume.set(parsed);
        this.toast.success('Parsed', 'Resume uploaded and parsed successfully.');
      },
      error: () => this.toast.error('Error', 'Failed to upload resume.'),
    });
  }

  addSkill(input: HTMLInputElement): void {
    const value = input.value.trim().replace(/,$/, '');
    if (value) {
      const skills = this.profileForm.get('skills')?.value || [];
      if (!skills.includes(value)) {
        this.profileForm.patchValue({ skills: [...skills, value] });
        this.profileForm.get('skills')?.markAsDirty();
        this.onSave();
      }
    }
    input.value = '';
  }

  removeSkill(index: number): void {
    const skills = [...(this.profileForm.get('skills')?.value || [])];
    skills.splice(index, 1);
    this.profileForm.patchValue({ skills });
    this.profileForm.get('skills')?.markAsDirty();
    this.onSave();
  }

  getResumeDownloadUrl(): string {
    return this.candidateService.getResumeDownloadUrl(this.profile()?.resumeUrl);
  }

  getResumeFileName(): string {
    const url = this.profile()?.resumeUrl;
    if (!url) return 'resume.pdf';
    return url.split('/').pop()?.split('\\').pop() || 'resume.pdf';
  }
}
