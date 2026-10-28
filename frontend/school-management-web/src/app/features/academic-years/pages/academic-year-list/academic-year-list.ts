
import {
  Component,
  OnInit,
  computed,
  signal
} from '@angular/core';

import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import {
  AcademicYear,
  AcademicYearRequest
} from '../../models/academic-year.model';

import {
  AcademicYearService
} from '../../services/academic-year.service';

import {
  Classroom
} from '../../../classrooms/models/classroom.model';

import {
  ClassroomService
} from '../../../classrooms/services/classroom.service';

import {
  Enrollment
} from '../../../enrollments/models/enrollment.model';

import {
  EnrollmentService
} from '../../../enrollments/services/enrollment.service';

import {
  TeacherAssignment
} from '../../../teacher-assignments/models/teacher-assignment.model';

import {
  TeacherAssignmentService
} from '../../../teacher-assignments/services/teacher-assignment.service';

interface AcademicYearStats {
  year: AcademicYear;
  classroomCount: number;
  studentCount: number;
  teacherCount: number;
}

@Component({
  selector: 'app-academic-year-list',
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule],
  templateUrl: './academic-year-list.html',
  styleUrl: './academic-year-list.scss'
})
export class AcademicYearList implements OnInit {

  academicYears = signal<AcademicYear[]>([]);
  classrooms = signal<Classroom[]>([]);
  enrollments = signal<Enrollment[]>([]);
  assignments = signal<TeacherAssignment[]>([]);

  loading = signal(false);
  processing = signal(false);
  processingId = signal<number | null>(null);
  errorMessage = signal('');
  successMessage = signal('');

  searchTerm = '';

  selectedYear = signal<AcademicYear | null>(null);

  constructor(
    private academicYearService: AcademicYearService,
    private classroomService: ClassroomService,
    private enrollmentService: EnrollmentService,
    private teacherAssignmentService: TeacherAssignmentService
  ) { }

  ngOnInit(): void {
    this.loadAcademicYears();
  }

  // =====================================
  // LOAD DATA
  // =====================================

  loadAcademicYears(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    forkJoin({
      years: this.academicYearService.getAll(),
      classrooms: this.classroomService.getAll(),
      enrollments: this.enrollmentService.getAll(),
      assignments: this.teacherAssignmentService.getAll()
    }).subscribe({
      next: data => {
        this.academicYears.set(data.years);
        this.classrooms.set(data.classrooms);
        this.enrollments.set(data.enrollments);
        this.assignments.set(data.assignments);

        const selected = this.selectedYear();

        if (selected) {
          const updated = data.years.find(
            year => year.id === selected.id
          );

          this.selectedYear.set(updated ?? null);
        }

        this.loading.set(false);
      },

      error: error => {
        console.error(
          'Error loading academic years:',
          error
        );

        this.errorMessage.set(
          'Unable to load academic years and related data.'
        );

        this.loading.set(false);
      }
    });
  }

  // =====================================
  // ACADEMIC YEAR STATS
  // =====================================

  readonly activeYear = computed(() =>
    this.academicYears().find(year => year.active) ?? null
  );

  readonly activeYearsCount = computed(() =>
    this.academicYears().filter(year => year.active).length
  );

  readonly inactiveYearsCount = computed(() =>
    this.academicYears().filter(year => !year.active).length
  );

  get totalYears(): number {
    return this.academicYears().length;
  }

  // =====================================
  // RELATION HELPERS
  // =====================================

  getYearClassrooms(yearId: number): Classroom[] {
    return this.classrooms().filter(
      classroom => classroom.academicYearId === yearId
    );
  }

  getYearEnrollments(yearId: number): Enrollment[] {
    return this.enrollments().filter(
      enrollment => enrollment.academicYearId === yearId
    );
  }

  getYearAssignments(
    yearId: number
  ): TeacherAssignment[] {
    return this.assignments().filter(
      assignment => assignment.academicYearId === yearId
    );
  }

  getClassroomCount(yearId: number): number {
    return this.getYearClassrooms(yearId).length;
  }

  getStudentCount(yearId: number): number {
    return new Set(
      this.getYearEnrollments(yearId).map(
        enrollment => enrollment.studentId
      )
    ).size;
  }

  getTeacherCount(yearId: number): number {
    return new Set(
      this.getYearAssignments(yearId).map(
        assignment => assignment.teacherId
      )
    ).size;
  }

  getSubjectCount(yearId: number): number {
    return new Set(
      this.getYearAssignments(yearId).map(
        assignment => assignment.subjectId
      )
    ).size;
  }

  // =====================================
  // ROWS
  // =====================================

  readonly yearRows = computed<AcademicYearStats[]>(() => {
    return [...this.academicYears()]
      .sort(
        (a, b) => b.startDate.localeCompare(a.startDate)
      )
      .map(year => ({
        year,
        classroomCount: this.getClassroomCount(year.id),
        studentCount: this.getStudentCount(year.id),
        teacherCount: this.getTeacherCount(year.id)
      }));
  });

  get filteredRows(): AcademicYearStats[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.yearRows().filter(
      row => row.year.name.toLowerCase().includes(search)
    );
  }

  clearFilters(): void {
    this.searchTerm = '';
  }

  // =====================================
  // VIEW DETAILS
  // =====================================

  viewYear(year: AcademicYear): void {
    this.selectedYear.set(year);
  }

  closeDetails(): void {
    this.selectedYear.set(null);
  }

  readonly selectedClassrooms = computed(() => {
    const year = this.selectedYear();

    if (!year) {
      return [];
    }

    return this.getYearClassrooms(year.id)
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  readonly selectedAssignments = computed(() => {
    const year = this.selectedYear();

    if (!year) {
      return [];
    }

    return this.getYearAssignments(year.id)
      .sort((a, b) =>
        a.classroomName.localeCompare(b.classroomName)
      );
  });

  // =====================================
  // ACTIVATE YEAR
  // =====================================

  setActiveYear(year: AcademicYear): void {
    if (this.processing() || year.active) {
      return;
    }

    const confirmed = window.confirm(
      `Set "${year.name}" as the active academic year?`
    );

    if (!confirmed) {
      return;
    }

    this.processing.set(true);
    this.processingId.set(year.id);
    this.errorMessage.set('');
    this.successMessage.set('');

    const request: AcademicYearRequest = {
      name: year.name,
      startDate: year.startDate,
      endDate: year.endDate,
      active: true
    };

    this.academicYearService.update(
      year.id,
      request
    ).subscribe({
      next: () => {
        this.academicYearService.getAll().subscribe({
          next: years => {
            this.academicYears.set(years);

            const activeYears = years.filter(
              item => item.active
            );

            if (
              activeYears.length === 1 &&
              activeYears[0].id === year.id
            ) {
              this.successMessage.set(
                `"${year.name}" is now the active academic year.`
              );
            } else {
              this.errorMessage.set(
                'The update completed, but the active-year state is not valid. ' +
                'Spring Boot must ensure that exactly one academic year is active.'
              );
            }

            this.processing.set(false);
            this.processingId.set(null);
          },

          error: error => {
            console.error(
              'Error verifying active year:',
              error
            );

            this.errorMessage.set(
              'Academic year updated, but its status could not be verified.'
            );

            this.processing.set(false);
            this.processingId.set(null);
          }
        });
      },

      error: error => {
        console.error(
          'Error activating academic year:',
          error
        );

        this.errorMessage.set(
          typeof error.error === 'string'
            ? error.error
            : error.error?.message ||
            'Unable to activate academic year.'
        );

        this.processing.set(false);
        this.processingId.set(null);
      }
    });
  }

  // =====================================
  // DELETE
  // =====================================

  deleteAcademicYear(id: number): void {
    if (this.processing()) {
      return;
    }

    const year = this.academicYears().find(
      item => item.id === id
    );

    if (!year) {
      return;
    }

    if (year.active) {
      this.errorMessage.set(
        'The active academic year cannot be deleted.'
      );
      return;
    }

    const hasRelatedData =
      this.getYearClassrooms(id).length > 0 ||
      this.getYearEnrollments(id).length > 0 ||
      this.getYearAssignments(id).length > 0;

    if (hasRelatedData) {
      this.errorMessage.set(
        'This academic year has related school data and cannot be deleted.'
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${year.name}"?`
    );

    if (!confirmed) {
      return;
    }

    this.processing.set(true);
    this.processingId.set(id);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.academicYearService.delete(id).subscribe({
      next: () => {
        this.processing.set(false);
        this.processingId.set(null);

        this.successMessage.set(
          'Academic year deleted successfully.'
        );

        this.loadAcademicYears();
      },

      error: error => {
        console.error(
          'Error deleting academic year:',
          error
        );

        this.errorMessage.set(
          typeof error.error === 'string'
            ? error.error
            : error.error?.message ||
            'Unable to delete academic year.'
        );

        this.processing.set(false);
        this.processingId.set(null);
      }
    });
  }
}
