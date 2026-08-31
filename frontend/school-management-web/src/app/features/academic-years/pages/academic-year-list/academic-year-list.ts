import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AcademicYear } from '../../models/academic-year.model';
import { AcademicYearService } from '../../services/academic-year.service';

@Component({
  selector: 'app-academic-year-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './academic-year-list.html',
  styleUrl: './academic-year-list.scss'
})
export class AcademicYearList implements OnInit {

  academicYears = signal<AcademicYear[]>([]);

  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private academicYearService: AcademicYearService
  ) { }

  ngOnInit(): void {
    this.loadAcademicYears();
  }

  loadAcademicYears(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.academicYearService.getAll().subscribe({
      next: (academicYears) => {
        this.academicYears.set(academicYears);
        this.loading.set(false);
      },

      error: (error) => {
        console.error(
          'Error loading academic years:',
          error
        );

        this.errorMessage.set(
          'Unable to load academic years'
        );

        this.loading.set(false);
      }
    });
  }

  deleteAcademicYear(id: number): void {
    const confirmed = confirm(
      'Are you sure you want to delete this academic year?'
    );

    if (!confirmed) {
      return;
    }

    this.academicYearService.delete(id).subscribe({
      next: () => {
        this.loadAcademicYears();
      },

      error: (error) => {
        console.error(
          'Error deleting academic year:',
          error
        );

        this.errorMessage.set(
          error?.error?.message ??
          'Unable to delete academic year'
        );
      }
    });
  }
}