import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  login(): void {
    this.errorMessage = '';

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: response => {
        this.authService.saveAuth(response);

        if (response.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else if (response.role === 'TEACHER') {
          this.router.navigate(['/teacher/dashboard']);
        } else {
          this.router.navigate(['/student/dashboard']);
        }
      },
      error: () => {
        this.errorMessage = 'Invalid email or password';
      }
    });
  }
}
