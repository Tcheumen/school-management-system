import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  login(): void {

    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage =
        'Email and password are required';
      return;
    }

    this.loading = true;

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({

      next: (response) => {

        this.authService.saveAuth(response);

        if (response.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else if (response.role === 'TEACHER') {
          this.router.navigate(['/teacher/dashboard']);
        } else {
          this.router.navigate(['/student/dashboard']);
        }
      },

      error: (error) => {

        console.error(
          'Login error:',
          error
        );

        this.errorMessage =
          error?.error?.message ??
          'Invalid email or password';

        this.loading = false;
      }
    });
  }
}