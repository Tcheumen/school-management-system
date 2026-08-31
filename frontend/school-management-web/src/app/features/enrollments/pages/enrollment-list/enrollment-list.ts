import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  Enrollment
} from '../../models/enrollment.model';

import {
  EnrollmentService
} from '../../services/enrollment.service';

@Component({
  selector: 'app-enrollment-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './enrollment-list.html',
  styleUrl: './enrollment-list.scss'
})
export class EnrollmentList implements OnInit {

  enrollments = signal<Enrollment[]>([]);

  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private enrollmentService: EnrollmentService
  ) { }

  ngOnInit(): void {
    this.loadEnrollments();
  }

  loadEnrollments(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.enrollmentService.getAll().subscribe({
      next: (enrollments) => {
        this.enrollments.set(enrollments);
        this.loading.set(false);
      },

      error: (error) => {
        console.error(
          'Error loading enrollments:',
          error
        );

        this.errorMessage.set(
          'Unable to load enrollments'
        );

        this.loading.set(false);
      }
    });
  }

  deleteEnrollment(id: number): void {
    const confirmed = confirm(
      'Are you sure you want to delete this enrollment?'
    );

    if (!confirmed) {
      return;
    }

    this.enrollmentService.delete(id).subscribe({
      next: () => {
        this.loadEnrollments();
      },

      error: (error) => {
        console.error(
          'Error deleting enrollment:',
          error
        );

        this.errorMessage.set(
          error?.error?.message ??
          'Unable to delete enrollment'
        );
      }
    });
  }
}