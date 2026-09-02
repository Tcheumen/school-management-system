import {
  Component,
  signal
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  Enrollment
} from '../../../enrollments/models/enrollment.model';

import {
  EnrollmentService
} from '../../../enrollments/services/enrollment.service';

import {
  ReportCard
} from '../../models/report-card.model';

import {
  ReportCardService
} from '../../services/report-card.service';

@Component({
  selector: 'app-report-card-view',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './report-card-view.html',
  styleUrl: './report-card-view.scss'
})
export class ReportCardView {

  enrollmentId: number | null = null;
  term = 'TERM_1';

  enrollments =
    signal<Enrollment[]>([]);

  reportCard =
    signal<ReportCard | null>(null);

  loading = signal(false);
  loadingEnrollments = signal(false);
  errorMessage = signal('');

  readonly terms = [
    {
      value: 'TERM_1',
      label: 'Term 1'
    },
    {
      value: 'TERM_2',
      label: 'Term 2'
    },
    {
      value: 'TERM_3',
      label: 'Term 3'
    }
  ];

  constructor(
    private enrollmentService:
      EnrollmentService,
    private reportCardService:
      ReportCardService
  ) {
    this.loadEnrollments();
  }

  loadEnrollments(): void {

    this.loadingEnrollments.set(true);
    this.errorMessage.set('');

    this.enrollmentService
      .getAll()
      .subscribe({

        next: (enrollments) => {

          this.enrollments.set(
            enrollments
          );

          this.loadingEnrollments.set(false);
        },

        error: (error) => {

          console.error(
            'Error loading enrollments:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to load enrollments'
          );

          this.loadingEnrollments.set(false);
        }
      });
  }

  loadReportCard(): void {

    this.errorMessage.set('');
    this.reportCard.set(null);

    if (
      this.enrollmentId === null ||
      !this.term
    ) {

      this.errorMessage.set(
        'Student enrollment and term are required'
      );

      return;
    }

    this.loading.set(true);

    this.reportCardService
      .getByEnrollment(
        this.enrollmentId,
        this.term
      )
      .subscribe({

        next: (reportCard) => {

          this.reportCard.set(
            reportCard
          );

          this.loading.set(false);
        },

        error: (error) => {

          console.error(
            'Error loading report card:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to load report card'
          );

          this.loading.set(false);
        }
      });
  }

  formatAverage(
    average: number
  ): string {

    if (
      average === null ||
      average === undefined
    ) {
      return '-';
    }

    return average.toFixed(2);
  }

  getAverageClass(
    average: number
  ): string {

    if (average >= 14) {
      return 'average-good';
    }

    if (average >= 10) {
      return 'average-medium';
    }

    return 'average-low';
  }
}