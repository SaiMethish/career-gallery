import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

/** Thin wrapper around PrimeNG MessageService for consistent toast notifications */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly messageService = inject(MessageService);

  success(summary: string, detail: string): void {
    this.messageService.add({ severity: 'success', summary, detail, life: 3000 });
  }

  error(summary: string, detail: string): void {
    this.messageService.add({ severity: 'error', summary, detail, life: 5000 });
  }

  warn(summary: string, detail: string): void {
    this.messageService.add({ severity: 'warn', summary, detail, life: 4000 });
  }

  info(summary: string, detail: string): void {
    this.messageService.add({ severity: 'info', summary, detail, life: 3000 });
  }
}
