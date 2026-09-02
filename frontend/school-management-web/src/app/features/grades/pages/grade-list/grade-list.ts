import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  Grade
} from '../../models/grade.model';

import {
  GradeService
} from '../../services/grade.service';

@Component({
  selector: 'app-grade-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './grade-list.html',
  styleUrl: './grade-list.scss'
})
export class GradeList implements OnInit {

  grades = signal<Grade[]>([]);

  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private gradeService: GradeService
  ) { }

  ngOnInit(): void {
    this.loadGrades();
  }

  loadGrades(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.gradeService
      .getAll()
      .subscribe({

        next: (grades) => {
          this.grades.set(grades);
          this.loading.set(false);
        },

        error: (error) => {
          console.error(
            'Error loading grades:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to load grades'
          );

          this.loading.set(false);
        }
      });
  }

  deleteGrade(
    id: number
  ): void {

    const confirmed = confirm(
      'Are you sure you want to delete this grade?'
    );

    if (!confirmed) {
      return;
    }

    this.gradeService
      .delete(id)
      .subscribe({

        next: () => {
          this.loadGrades();
        },

        error: (error) => {
          console.error(
            'Error deleting grade:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to delete grade'
          );
        }
      });
  }

  formatTerm(
    term: string
  ): string {

    const terms: Record<string, string> = {
      TERM_1: 'Term 1',
      TERM_2: 'Term 2',
      TERM_3: 'Term 3'
    };

    return terms[term] ?? term;
  }
}