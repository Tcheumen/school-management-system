import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.scss'
})
export class StudentDashboard {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}