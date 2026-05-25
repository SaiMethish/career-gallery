import { Component, Inject, inject, OnInit } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { CommonService } from '../../service/common-service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, tap } from 'rxjs';

@Component({
  selector: 'app-layout',
  imports: [Navbar, RouterOutlet, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout implements OnInit {

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map(() => {
          let route = this.router.routerState.root;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route.snapshot.data['showNavbar'] ?? true;
        })
      )
      .subscribe((val) => {
        this.cs.setNavbarVisibility(val);
      })
  }
  cs = inject(CommonService);
  router = inject(Router);
  activatedRoute = Inject(ActivatedRoute);

}
