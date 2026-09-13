import { Component, signal } from '@angular/core';

import { RouterLink } from '@angular/router';

import { Grade } from '../../../grades/models/grade.model';

import { GradeService } from '../../../grades/services/grade.service';

@Component({
  selector: 'app-student-grades',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './student-grades.html',
  styleUrl: './student-grades.scss'
})
export class StudentGrades {

  grades =
    signal<Grade[]>([]);

  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private gradeService:
      GradeService
  ) {
    this.loadGrades();
  }

  loadGrades(): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.gradeService
      .getMineForStudent()
      .subscribe({

        next: (grades) => {

          this.grades.set(
            grades
          );

          this.loading.set(false);
        },

        error: (error) => {

          console.error(
            'Error loading student grades:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to load your grades'
          );

          this.loading.set(false);
        }
      });
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

  getGradeClass(
    value: number
  ): string {

    if (value >= 14) {
      return 'grade-good';
    }

    if (value >= 10) {
      return 'grade-average';
    }

    return 'grade-low';
  }
}