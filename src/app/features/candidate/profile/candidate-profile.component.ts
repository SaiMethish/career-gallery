import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CandidateService } from '../../../core/services/candidate.service';
import { ToastService } from '../../../core/services/toast.service';
import { CandidateProfileResponseDTO } from '../../../core/models/candidate.model';
import { ParsedResumeData } from '../../../core/models/candidate.model';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ChipModule} from 'primeng/chip';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

/** Candidate profile + resume upload — matches Stitch "My Profile" + "Resume Upload" screens */
@Component({
  selector: 'app-candidate-profile',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, ChipModule, EmptyStateComponent],
  templateUrl: './candidate-profile.component.html',
  styleUrl: './candidate-profile.component.css'})
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

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: [''],
      location: [''],
      experienceYears: [0, [Validators.min(0)]],
      skills: [[]],
    });

    this.candidateService.getProfile().subscribe({
      next: (p) => {
        this.profile.set(p);
        this.profileForm.patchValue({ ...p });
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
        this.isSaving.set(false);
        this.toast.success('Saved', 'Profile updated successfully.');
      },
      error: () => { this.isSaving.set(false); this.toast.error('Error', 'Failed to save profile.'); },
    });
  }

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
      }
    }
    input.value = '';
  }

  removeSkill(index: number): void {
    const skills = [...(this.profileForm.get('skills')?.value || [])];
    skills.splice(index, 1);
    this.profileForm.patchValue({ skills });
    this.profileForm.get('skills')?.markAsDirty();
  }
}
