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
  selector: 'app-teacher-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FormsModule
  ],
  templateUrl: './teacher-layout.html',
  styleUrl: './teacher-layout.scss'
})
export class TeacherLayout implements OnInit {

  sidebarOpen = true;

  teacherName = '';
  teacherEmail = '';
  teacherRole = '';

  searchTerm = '';
  notificationOpen = false;
  messageOpen = false;
  profileOpen = false;

  notificationCount = 3;
  messageCount = 1;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  get teacherInitial(): string {

    if (!this.teacherName) {
      return 'T';
    }

    return this.teacherName
      .charAt(0)
      .toUpperCase();
  }

  toggleSidebar(): void {
    this.sidebarOpen =
      !this.sidebarOpen;
  }

  private loadCurrentUser(): void {

    this.authService
      .getCurrentUser()
      .subscribe({

        next: user => {

          this.teacherName =
            user.fullName;

          this.teacherEmail =
            user.email;

          this.teacherRole =
            user.role;
        },

        error: error => {

          console.error(
            'Error loading current user:',
            error
          );

          this.teacherName =
            'Teacher';

          this.teacherEmail =
            this.authService.getEmail() ?? '';

          this.teacherRole =
            this.authService.getRole() ?? '';
        }

      });
  }

  search(): void {

    const value =
      this.searchTerm
        .trim()
        .toLowerCase();

    if (!value) {
      return;
    }

    /*
     * Pour le moment la recherche redirige
     * vers les modules Teacher existants.
     *
     * Plus tard on pourra remplacer ceci
     * par une vraie recherche backend.
     */

    if (
      value.includes('assignment') ||
      value.includes('assignments')
    ) {
      this.router.navigate([
        '/teacher/assignments'
      ]);

      return;
    }


    if (
      value.includes('schedule') ||
      value.includes('class') ||
      value.includes('classes')
    ) {
      this.router.navigate([
        '/teacher/schedule'
      ]);

      return;
    }


    if (
      value.includes('attendance') ||
      value.includes('absence')
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
      value.includes('report card')
    ) {
      this.router.navigate([
        '/report-cards'
      ]);

      return;
    }

    console.log(
      'Search:',
      this.searchTerm
    );
  }


  clearSearch(): void {
    this.searchTerm = '';
  }

  toggleNotifications(): void {

    this.notificationOpen =
      !this.notificationOpen;

    this.messageOpen = false;
    this.profileOpen = false;
  }


  toggleMessages(): void {

    this.messageOpen =
      !this.messageOpen;

    this.notificationOpen = false;
    this.profileOpen = false;
  }


  toggleProfile(): void {

    this.profileOpen =
      !this.profileOpen;

    this.notificationOpen = false;
    this.messageOpen = false;
  }


  openProfile(): void {

    this.profileOpen = false;

    // Page profile à implémenter plus tard
    console.log('Open teacher profile');
  }


  openSettings(): void {

    this.notificationOpen = false;
    this.messageOpen = false;
    this.profileOpen = false;

    // Page settings à implémenter plus tard
    console.log('Open teacher settings');
  }

  logout(): void {

    this.authService.logout();

    this.router.navigate([
      '/login'
    ]);
  }
}