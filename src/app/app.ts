import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Button } from 'primeng/button';
import { Layout } from "./components/layout/layout";

@Component({
  selector: 'app-root',
  imports: [ Layout],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  
}
