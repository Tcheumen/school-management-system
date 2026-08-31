import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  AcademicYearRequest
} from '../../models/academic-year.model';

import {
  AcademicYearService
} from '../../services/academic-year.service';

@Component({
  selector: 'app-academic-year-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './academic-year-form.html',
  styleUrl: './academic-year-form.scss'
})
export class AcademicYearForm implements OnInit {

  name = '';
  startDate = '';
  endDate = '';
  active = false;

  loading = signal(false);
  errorMessage = signal('');

  isEditMode = false;

  private academicYearId?: number;

  constructor(
    private academicYearService: AcademicYearService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.academicYearId = Number(id);
      this.isEditMode = true;

      this.loadAcademicYear(this.academicYearId);
    }
  }

  loadAcademicYear(id: number): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.academicYearService.getById(id).subscribe({
      next: (academicYear) => {
        this.name = academicYear.name;
        this.startDate = academicYear.startDate;
        this.endDate = academicYear.endDate;
        this.active = academicYear.active;

        this.loading.set(false);
      },

      error: (error) => {
        console.error(
          'Error loading academic year:',
          error
        );

        this.errorMessage.set(
          this.getErrorMessage(
            error,
            'Unable to load academic year'
          )
        );

        this.loading.set(false);
      }
    });
  }

  save(): void {
    this.errorMessage.set('');

    if (!this.validateDates()) {
      return;
    }

    const request: AcademicYearRequest = {
      name: this.name.trim(),
      startDate: this.startDate,
      endDate: this.endDate,
      active: this.active
    };

    if (
      this.isEditMode &&
      this.academicYearId
    ) {
      this.updateAcademicYear(request);
    } else {
      this.createAcademicYear(request);
    }
  }

  createAcademicYear(
    request: AcademicYearRequest
  ): void {
    this.loading.set(true);

    this.academicYearService
      .create(request)
      .subscribe({
        next: () => {
          this.loading.set(false);

          this.router.navigate([
            '/academic-years'
          ]);
        },

        error: (error) => {
          console.error(
            'Error creating academic year:',
            error
          );

          this.errorMessage.set(
            this.getErrorMessage(
              error,
              'Unable to create academic year'
            )
          );

          this.loading.set(false);
        }
      });
  }

  updateAcademicYear(
    request: AcademicYearRequest
  ): void {
    if (!this.academicYearId) {
      return;
    }

    this.loading.set(true);

    this.academicYearService
      .update(
        this.academicYearId,
        request
      )
      .subscribe({
        next: () => {
          this.loading.set(false);

          this.router.navigate([
            '/academic-years'
          ]);
        },

        error: (error) => {
          console.error(
            'Error updating academic year:',
            error
          );

          this.errorMessage.set(
            this.getErrorMessage(
              error,
              'Unable to update academic year'
            )
          );

          this.loading.set(false);
        }
      });
  }

  private validateDates(): boolean {
    if (!this.startDate || !this.endDate) {
      this.errorMessage.set(
        'Start date and end date are required'
      );

      return false;
    }

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    if (start >= end) {
      this.errorMessage.set(
        'End date must be after start date'
      );

      return false;
    }

    return true;
  }

  private getErrorMessage(
    error: any,
    defaultMessage: string
  ): string {
    return (
      error?.error?.message ??
      defaultMessage
    );
  }

  cancel(): void {
    this.router.navigate([
      '/academic-years'
    ]);
  }
}