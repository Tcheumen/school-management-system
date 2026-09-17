import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Router,
  RouterLink
} from '@angular/router';

import {
  AuthService
} from '../../../../core/services/auth.service';

import {
  RegisterRequest
} from '../../../../core/models/register-request';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';

  role:
    'TEACHER' |
    'STUDENT' |
    '' = '';

  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  register(): void {

    this.errorMessage = '';

    if (
      !this.fullName ||
      !this.email ||
      !this.password ||
      !this.confirmPassword ||
      !this.role
    ) {

      this.errorMessage =
        'All fields are required';

      return;
    }

    if (
      this.password !==
      this.confirmPassword
    ) {

      this.errorMessage =
        'Passwords do not match';

      return;
    }

    const request:
      RegisterRequest = {

      fullName: this.fullName,
      email: this.email,
      password: this.password,
      role: this.role
    };

    this.loading = true;

    this.authService
      .register(request)
      .subscribe({

        next: (response) => {

          this.authService
            .saveAuth(response);

          this.router.navigate([
            this.authService
              .getDashboardRoute()
          ]);
        },

        error: (error) => {

          console.error(
            'Registration error:',
            error
          );

          this.errorMessage =
            error?.error?.message ??
            'Unable to create account';

          this.loading = false;
        }
      });
  }
}