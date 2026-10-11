
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-my-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './my-settings.html',
  styleUrl: './my-settings.scss'
})
export class MySettings implements OnInit {

  loading = true;
  savingPassword = false;

  loadError = '';
  passwordError = '';
  passwordSuccess = '';

  fullName = '';
  email = '';
  role = '';

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.loading = true;
    this.loadError = '';

    this.authService.getCurrentUser().subscribe({
      next: user => {
        this.fullName = user.fullName;
        this.email = user.email;
        this.role = user.role;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Settings loading error:', error);
        this.loadError = 'Unable to load your account information.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get roleLabel(): string {
    if (!this.role) {
      return '';
    }

    return this.role === 'ADMIN'
      ? 'Administrator'
      : this.role.charAt(0) + this.role.slice(1).toLowerCase();
  }

  get initials(): string {
    const names = this.fullName.trim().split(/\s+/);

    if (!this.fullName.trim()) {
      return 'U';
    }

    return names.length === 1
      ? names[0].charAt(0).toUpperCase()
      : (
        names[0].charAt(0) +
        names[names.length - 1].charAt(0)
      ).toUpperCase();
  }

  savePassword(): void {
    if (this.savingPassword) {
      return;
    }

    this.passwordError = '';
    this.passwordSuccess = '';

    if (
      !this.currentPassword ||
      !this.newPassword ||
      !this.confirmPassword
    ) {
      this.passwordError = 'All password fields are required.';
      return;
    }

    if (this.newPassword.length < 8) {
      this.passwordError =
        'New password must contain at least 8 characters.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'Passwords do not match.';
      return;
    }

    if (this.currentPassword === this.newPassword) {
      this.passwordError =
        'New password must be different from current password.';
      return;
    }

    this.savingPassword = true;

    this.authService.changePassword({
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    }).subscribe({
      next: () => {
        this.savingPassword = false;

        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';

        this.showCurrentPassword = false;
        this.showNewPassword = false;
        this.showConfirmPassword = false;

        this.passwordSuccess = 'Password changed successfully.';
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Password update error:', error);

        this.savingPassword = false;
        this.passwordError =
          error.error?.message ||
          'Unable to change your password.';

        this.cdr.detectChanges();
      }
    });
  }
}
