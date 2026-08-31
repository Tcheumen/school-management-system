import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  EnrollmentRequest
} from '../../models/enrollment.model';

import {
  EnrollmentService
} from '../../services/enrollment.service';

import {
  Student
} from '../../../students/models/student.model';

import {
  StudentService
} from '../../../students/services/student.service';

import {
  Classroom
} from '../../../classrooms/models/classroom.model';

import {
  ClassroomService
} from '../../../classrooms/services/classroom.service';

import {
  AcademicYear
} from '../../../academic-years/models/academic-year.model';

import {
  AcademicYearService
} from '../../../academic-years/services/academic-year.service';

@Component({
  selector: 'app-enrollment-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './enrollment-form.html',
  styleUrl: './enrollment-form.scss'
})
export class EnrollmentForm implements OnInit {

  studentId: number | null = null;
  classroomId: number | null = null;
  academicYearId: number | null = null;

  students = signal<Student[]>([]);
  classrooms = signal<Classroom[]>([]);
  academicYears = signal<AcademicYear[]>([]);

  loading = signal(false);
  loadingData = signal(false);
  errorMessage = signal('');

  isEditMode = false;

  private enrollmentId?: number;

  constructor(
    private enrollmentService: EnrollmentService,
    private studentService: StudentService,
    private classroomService: ClassroomService,
    private academicYearService: AcademicYearService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadReferenceData();

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.enrollmentId = Number(id);
      this.isEditMode = true;

      this.loadEnrollment(this.enrollmentId);
    }
  }

  loadReferenceData(): void {
    this.loadingData.set(true);
    this.errorMessage.set('');

    let studentsLoaded = false;
    let classroomsLoaded = false;
    let academicYearsLoaded = false;

    const checkLoadingComplete = () => {
      if (
        studentsLoaded &&
        classroomsLoaded &&
        academicYearsLoaded
      ) {
        this.loadingData.set(false);
      }
    };

    this.studentService.getAll().subscribe({
      next: (students) => {
        this.students.set(students);
        studentsLoaded = true;
        checkLoadingComplete();
      },

      error: (error) => {
        console.error(
          'Error loading students:',
          error
        );

        this.errorMessage.set(
          'Unable to load students'
        );

        studentsLoaded = true;
        checkLoadingComplete();
      }
    });

    this.classroomService.getAll().subscribe({
      next: (classrooms) => {
        this.classrooms.set(classrooms);
        classroomsLoaded = true;
        checkLoadingComplete();
      },

      error: (error) => {
        console.error(
          'Error loading classrooms:',
          error
        );

        this.errorMessage.set(
          'Unable to load classrooms'
        );

        classroomsLoaded = true;
        checkLoadingComplete();
      }
    });

    this.academicYearService.getAll().subscribe({
      next: (academicYears) => {
        this.academicYears.set(academicYears);
        academicYearsLoaded = true;
        checkLoadingComplete();
      },

      error: (error) => {
        console.error(
          'Error loading academic years:',
          error
        );

        this.errorMessage.set(
          'Unable to load academic years'
        );

        academicYearsLoaded = true;
        checkLoadingComplete();
      }
    });
  }

  loadEnrollment(id: number): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.enrollmentService.getById(id).subscribe({
      next: (enrollment) => {
        this.studentId = enrollment.studentId;
        this.classroomId = enrollment.classroomId;
        this.academicYearId =
          enrollment.academicYearId;

        this.loading.set(false);
      },

      error: (error) => {
        console.error(
          'Error loading enrollment:',
          error
        );

        this.errorMessage.set(
          this.getErrorMessage(
            error,
            'Unable to load enrollment'
          )
        );

        this.loading.set(false);
      }
    });
  }

  get filteredClassrooms(): Classroom[] {
    if (this.academicYearId === null) {
      return [];
    }

    return this.classrooms().filter(
      classroom =>
        classroom.academicYearId ===
        this.academicYearId
    );
  }

  onAcademicYearChange(): void {
    if (this.classroomId === null) {
      return;
    }

    const classroomStillValid =
      this.filteredClassrooms.some(
        classroom =>
          classroom.id === this.classroomId
      );

    if (!classroomStillValid) {
      this.classroomId = null;
    }
  }

  save(): void {
    this.errorMessage.set('');

    if (
      this.studentId === null ||
      this.classroomId === null ||
      this.academicYearId === null
    ) {
      this.errorMessage.set(
        'Student, classroom and academic year are required'
      );

      return;
    }

    const request: EnrollmentRequest = {
      studentId: this.studentId,
      classroomId: this.classroomId,
      academicYearId: this.academicYearId
    };

    if (
      this.isEditMode &&
      this.enrollmentId
    ) {
      this.updateEnrollment(request);
    } else {
      this.createEnrollment(request);
    }
  }

  createEnrollment(
    request: EnrollmentRequest
  ): void {
    this.loading.set(true);

    this.enrollmentService
      .create(request)
      .subscribe({
        next: () => {
          this.loading.set(false);

          this.router.navigate([
            '/enrollments'
          ]);
        },

        error: (error) => {
          console.error(
            'Error creating enrollment:',
            error
          );

          this.errorMessage.set(
            this.getErrorMessage(
              error,
              'Unable to create enrollment'
            )
          );

          this.loading.set(false);
        }
      });
  }

  updateEnrollment(
    request: EnrollmentRequest
  ): void {
    if (!this.enrollmentId) {
      return;
    }

    this.loading.set(true);

    this.enrollmentService
      .update(
        this.enrollmentId,
        request
      )
      .subscribe({
        next: () => {
          this.loading.set(false);

          this.router.navigate([
            '/enrollments'
          ]);
        },

        error: (error) => {
          console.error(
            'Error updating enrollment:',
            error
          );

          this.errorMessage.set(
            this.getErrorMessage(
              error,
              'Unable to update enrollment'
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
    return (
      error?.error?.message ??
      defaultMessage
    );
  }

  cancel(): void {
    this.router.navigate([
      '/enrollments'
    ]);
  }
}