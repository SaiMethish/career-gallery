import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';

/** Root application component — renders the global toast and the router outlet */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Toast],
  template: `
    <p-toast position="top-right" />
    <router-outlet />
  `,
})
export class App {}
