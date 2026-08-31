import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  ClassroomRequest
} from '../../models/classroom.model';

import {
  ClassroomService
} from '../../services/classroom.service';

import {
  AcademicYear
} from '../../../academic-years/models/academic-year.model';

import {
  AcademicYearService
} from '../../../academic-years/services/academic-year.service';

@Component({
  selector: 'app-classroom-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './classroom-form.html',
  styleUrl: './classroom-form.scss'
})
export class ClassroomForm implements OnInit {

  name = '';
  level = '';

  academicYearId: number | null = null;

  academicYears = signal<AcademicYear[]>([]);

  loading = signal(false);
  loadingAcademicYears = signal(false);
  errorMessage = signal('');

  isEditMode = false;

  private classroomId?: number;

  constructor(
    private classroomService: ClassroomService,
    private academicYearService: AcademicYearService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAcademicYears();

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.classroomId = Number(id);
      this.isEditMode = true;

      this.loadClassroom(this.classroomId);
    }
  }

  loadAcademicYears(): void {
    this.loadingAcademicYears.set(true);

    this.academicYearService.getAll().subscribe({
      next: (academicYears) => {
        this.academicYears.set(academicYears);
        this.loadingAcademicYears.set(false);
      },

      error: (error) => {
        console.error(
          'Error loading academic years:',
          error
        );

        this.errorMessage.set(
          'Unable to load academic years'
        );

        this.loadingAcademicYears.set(false);
      }
    });
  }

  loadClassroom(id: number): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.classroomService.getById(id).subscribe({
      next: (classroom) => {
        this.name = classroom.name;
        this.level = classroom.level;
        this.academicYearId =
          classroom.academicYearId;

        this.loading.set(false);
      },

      error: (error) => {
        console.error(
          'Error loading classroom:',
          error
        );

        this.errorMessage.set(
          'Unable to load classroom'
        );

        this.loading.set(false);
      }
    });
  }

  save(): void {
    this.errorMessage.set('');

    if (this.academicYearId === null) {
      this.errorMessage.set(
        'Please select an academic year'
      );

      return;
    }

    const request: ClassroomRequest = {
      name: this.name,
      level: this.level,
      academicYearId: this.academicYearId
    };

    if (
      this.isEditMode &&
      this.classroomId
    ) {
      this.updateClassroom(request);
    } else {
      this.createClassroom(request);
    }
  }

  createClassroom(
    request: ClassroomRequest
  ): void {

    this.loading.set(true);

    this.classroomService
      .create(request)
      .subscribe({

        next: () => {
          this.loading.set(false);

          this.router.navigate([
            '/classrooms'
          ]);
        },

        error: (error) => {
          console.error(
            'Error creating classroom:',
            error
          );

          this.errorMessage.set(
            this.getErrorMessage(
              error,
              'Unable to create classroom'
            )
          );

          this.loading.set(false);
        }
      });
  }

  updateClassroom(
    request: ClassroomRequest
  ): void {

    if (!this.classroomId) {
      return;
    }

    this.loading.set(true);

    this.classroomService
      .update(
        this.classroomId,
        request
      )
      .subscribe({

        next: () => {
          this.loading.set(false);

          this.router.navigate([
            '/classrooms'
          ]);
        },

        error: (error) => {
          console.error(
            'Error updating classroom:',
            error
          );

          this.errorMessage.set(
            this.getErrorMessage(
              error,
              'Unable to update classroom'
            )
          );

          this.loading.set(false);
        }
      });
  }

  private getErrorMessage(
    error: any,
    defaultMessage: string
  ): string {

    if (error?.error?.message) {
      return error.error.message;
    }

    return defaultMessage;
  }

  cancel(): void {
    this.router.navigate([
      '/classrooms'
    ]);
  }
}