import {
  Component,
  signal
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  RouterLink
} from '@angular/router';

import {
  ReportCard
} from '../../../report-cards/models/report-card.model';

import {
  ReportCardService
} from '../../../report-cards/services/report-card.service';

@Component({
  selector: 'app-student-report-card',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './student-report-card.html',
  styleUrl: './student-report-card.scss'
})
export class StudentReportCard {

  term = 'TERM_1';

  reportCard =
    signal<ReportCard | null>(null);

  loading = signal(false);
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
    private reportCardService:
      ReportCardService
  ) { }



  loadReportCard(): void {

   

    this.errorMessage.set('');
    this.reportCard.set(null);

    if (!this.term) {

      this.errorMessage.set(
        'Term is required'
      );

      return;
    }

    this.loading.set(true);

    this.reportCardService
      .getMine(this.term)
      .subscribe({

        next: (reportCard) => {


          this.reportCard.set(
            reportCard
          );

          this.loading.set(false);
        },

        error: (error) => {

          

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to load your report card'
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

  formatTerm(
    term: string
  ): string {

    switch (term) {
      case 'TERM_1':
        return 'Term 1';

      case 'TERM_2':
        return 'Term 2';

      case 'TERM_3':
        return 'Term 3';

      default:
        return term;
    }
  }
}