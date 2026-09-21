import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FormsModule
  ],
  templateUrl: './student-layout.html',
  styleUrl: './student-layout.scss'
})
export class StudentLayout implements OnInit {

  sidebarOpen = true;

  searchTerm = '';

  notificationOpen = false;
  messageOpen = false;
  profileOpen = false;

  // Backend plus tard
  notificationCount = 3;
  messageCount = 1;

  studentName = '';
  studentEmail = '';
  studentRole = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  get studentInitial(): string {
    if (!this.studentName) {
      return 'S';
    }

    return this.studentName
      .charAt(0)
      .toUpperCase();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  search(): void {
    const value = this.searchTerm.trim().toLowerCase();

    if (!value) {
      return;
    }

    if (
      value.includes('schedule') ||
      value.includes('class') ||
      value.includes('classes')
    ) {
      this.router.navigate(['/student/schedule']);
      return;
    }

    if (
      value.includes('attendance') ||
      value.includes('absence')
    ) {
      this.router.navigate(['/student/attendance']);
      return;
    }

    if (
      value.includes('grade') ||
      value.includes('grades')
    ) {
      this.router.navigate(['/student/grades']);
      return;
    }

    if (
      value.includes('report') ||
      value.includes('card') ||
      value.includes('result')
    ) {
      this.router.navigate(['/student/report-card']);
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
  }

  toggleNotifications(): void {
    this.notificationOpen = !this.notificationOpen;
    this.messageOpen = false;
    this.profileOpen = false;
  }

  toggleMessages(): void {
    this.messageOpen = !this.messageOpen;
    this.notificationOpen = false;
    this.profileOpen = false;
  }

  toggleProfile(): void {
    this.profileOpen = !this.profileOpen;
    this.notificationOpen = false;
    this.messageOpen = false;
  }

  openProfile(): void {
    this.profileOpen = false;

    // Page Profile plus tard
    console.log('Open student profile');
  }

  openSettings(): void {
    this.notificationOpen = false;
    this.messageOpen = false;
    this.profileOpen = false;

    // Page Settings plus tard
    console.log('Open student settings');
  }

  private loadCurrentUser(): void {
    this.authService.getCurrentUser().subscribe({
      next: user => {
        this.studentName = user.fullName;
        this.studentEmail = user.email;
        this.studentRole = user.role;
      },

      error: error => {
        console.error(
          'Error loading current student:',
          error
        );

        this.studentName = 'Student';
        this.studentEmail =
          this.authService.getEmail() ?? '';

        this.studentRole =
          this.authService.getRole() ?? 'STUDENT';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}