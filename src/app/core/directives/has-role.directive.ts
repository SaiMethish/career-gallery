import { Directive, Input, OnInit, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { selectUserRole } from '../auth/auth.selectors';
import { Role } from '../models/auth.model';

/**
 * Structural directive for role-based UI gating.
 * Usage: <div *appHasRole="['RECRUITER', 'ADMIN']">...</div>
 */
@Directive({
  selector: '[appHasRole]',
  standalone: true,
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: Role[] = [];

  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly store = inject(Store);

  ngOnInit(): void {
    this.store
      .select(selectUserRole)
      .pipe(takeUntilDestroyed())
      .subscribe((role) => {
        this.viewContainer.clear();
        if (role && this.appHasRole.includes(role)) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        }
      });
  }
}
