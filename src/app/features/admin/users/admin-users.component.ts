import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { AdminUserDTO } from '../../../core/models/admin.model';
import { Role } from '../../../core/models/auth.model';
import { ToastService } from '../../../core/services/toast.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [FormsModule, DatePipe, EmptyStateComponent],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css',
})
export class AdminUsersComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly toast = inject(ToastService);

  readonly users = signal<AdminUserDTO[]>([]);
  readonly loading = signal(true);
  readonly selectedRole = signal<string>('ALL');
  readonly searchQuery = signal<string>('');
  readonly currentPage = signal<number>(0);
  readonly totalPages = signal<number>(1);
  readonly totalElements = signal<number>(0);
  readonly togglingId = signal<string | null>(null);

  readonly roles = ['ALL', Role.CANDIDATE, Role.RECRUITER, Role.ADMIN];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(page = 0): void {
    this.loading.set(true);
    this.currentPage.set(page);

    const role = this.selectedRole() === 'ALL' ? undefined : this.selectedRole();
    const search = this.searchQuery();

    this.adminService.getUsers(role, search, page, 10).subscribe({
      next: (res) => {
        this.users.set(res.content);
        this.totalPages.set(res.totalPages || 1);
        this.totalElements.set(res.totalElements || 0);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toast.error('Load Error', 'Unable to load user directory.');
      },
    });
  }

  onRoleChange(role: string): void {
    this.selectedRole.set(role);
    this.loadUsers(0);
  }

  onSearch(): void {
    this.loadUsers(0);
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }

  toggleVerification(user: AdminUserDTO): void {
    this.togglingId.set(user.userId);
    this.adminService.toggleUserVerification(user.userId).subscribe({
      next: (updated) => {
        this.togglingId.set(null);
        this.users.update((list) =>
          list.map((u) => (u.userId === updated.userId ? updated : u))
        );
        const status = updated.isVerified ? 'verified' : 'unverified';
        this.toast.success('Status Updated', `User ${updated.email} is now ${status}.`);
      },
      error: () => {
        this.togglingId.set(null);
        this.toast.error('Update Failed', 'Could not update user status.');
      },
    });
  }

  nextPage(): void {
    if (this.currentPage() + 1 < this.totalPages()) {
      this.loadUsers(this.currentPage() + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 0) {
      this.loadUsers(this.currentPage() - 1);
    }
  }
}
