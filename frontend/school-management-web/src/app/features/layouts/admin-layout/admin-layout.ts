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
  selector: 'app-admin-layout',

  standalone: true,

  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FormsModule
  ],

  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss'
})
export class AdminLayout implements OnInit {

  /* ========================================
     SIDEBAR
  ======================================== */

  sidebarOpen = true;


  /* ========================================
     SEARCH
  ======================================== */

  searchTerm = '';


  /* ========================================
     DROPDOWNS
  ======================================== */

  notificationOpen = false;
  messageOpen = false;
  profileOpen = false;


  /* ========================================
     COUNTERS
     Backend later
  ======================================== */

  notificationCount = 3;
  messageCount = 1;


  /* ========================================
     CURRENT ADMIN
  ======================================== */

  adminName = '';
  adminEmail = '';
  adminRole = '';


  constructor(
    private authService: AuthService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.loadCurrentUser();
  }


  /* ========================================
     ADMIN INITIAL
  ======================================== */

  get adminInitial(): string {

    if (!this.adminName) {
      return 'A';
    }

    return this.adminName
      .charAt(0)
      .toUpperCase();
  }


  /* ========================================
     SIDEBAR
  ======================================== */

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }


  /* ========================================
     SEARCH
  ======================================== */

  search(): void {

    const value =
      this.searchTerm
        .trim()
        .toLowerCase();


    if (!value) {
      return;
    }


    if (
      value.includes('student') ||
      value.includes('students')
    ) {

      this.router.navigate([
        '/students'
      ]);

      return;
    }


    if (
      value.includes('teacher') ||
      value.includes('teachers')
    ) {

      this.router.navigate([
        '/teachers'
      ]);

      return;
    }


    if (
      value.includes('subject') ||
      value.includes('subjects')
    ) {

      this.router.navigate([
        '/subjects'
      ]);

      return;
    }


    if (
      value.includes('classroom') ||
      value.includes('classrooms') ||
      value === 'class' ||
      value === 'classes'
    ) {

      this.router.navigate([
        '/classrooms'
      ]);

      return;
    }


    if (
      value.includes('academic') ||
      value.includes('year')
    ) {

      this.router.navigate([
        '/academic-years'
      ]);

      return;
    }


    if (
      value.includes('enrollment') ||
      value.includes('enrollments')
    ) {

      this.router.navigate([
        '/enrollments'
      ]);

      return;
    }


    if (
      value.includes('assignment') ||
      value.includes('assignments')
    ) {

      this.router.navigate([
        '/teacher-assignments'
      ]);

      return;
    }


    if (
      value.includes('schedule') ||
      value.includes('schedules')
    ) {

      this.router.navigate([
        '/schedules'
      ]);

      return;
    }


    if (
      value.includes('attendance') ||
      value.includes('attendances')
    ) {

      this.router.navigate([
        '/attendances'
      ]);

      return;
    }


    if (
      value.includes('grade') ||
      value.includes('grades')
    ) {

      this.router.navigate([
        '/grades'
      ]);

      return;
    }


    if (
      value.includes('report') ||
      value.includes('reports')
    ) {

      this.router.navigate([
        '/report-cards'
      ]);

      return;
    }
  }


  clearSearch(): void {
    this.searchTerm = '';
  }


  /* ========================================
     NOTIFICATIONS
  ======================================== */

  toggleNotifications(): void {

    this.notificationOpen =
      !this.notificationOpen;

    this.messageOpen = false;
    this.profileOpen = false;
  }


  /* ========================================
     MESSAGES
  ======================================== */

  toggleMessages(): void {

    this.messageOpen =
      !this.messageOpen;

    this.notificationOpen = false;
    this.profileOpen = false;
  }


  /* ========================================
     PROFILE
  ======================================== */

  toggleProfile(): void {

    this.profileOpen =
      !this.profileOpen;

    this.notificationOpen = false;
    this.messageOpen = false;
  }


  openProfile(): void {

    this.profileOpen = false;

    // Backend / page profile later
    console.log('Open admin profile');
  }


  /* ========================================
     SETTINGS
  ======================================== */

  openSettings(): void {

    this.notificationOpen = false;
    this.messageOpen = false;
    this.profileOpen = false;

    // Settings page later
    console.log('Open admin settings');
  }


  /* ========================================
     CURRENT USER
  ======================================== */

  private loadCurrentUser(): void {

    this.authService
      .getCurrentUser()
      .subscribe({

        next: user => {

          console.log('CURRENT ADMIN =', user);

          this.adminName =
            user.fullName;

          this.adminEmail =
            user.email;

          this.adminRole =
            user.role;
        },

        error: error => {

          console.error(
            'Error loading current admin:',
            error
          );

          this.adminName = 'Admin';

          this.adminEmail =
            this.authService.getEmail() ?? '';

          this.adminRole =
            this.authService.getRole() ?? 'ADMIN';
        }

      });
  }


  /* ========================================
     LOGOUT
  ======================================== */

  logout(): void {

    this.authService.logout();

    this.router.navigate([
      '/login'
    ]);
  }
}