
import {
  Component,
  OnInit,
  computed,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { Enrollment } from '../../models/enrollment.model';
import { EnrollmentService } from '../../services/enrollment.service';

import { AcademicYear } from '../../../academic-years/models/academic-year.model';
import { AcademicYearService } from '../../../academic-years/services/academic-year.service';

import { Classroom } from '../../../classrooms/models/classroom.model';
import { ClassroomService } from '../../../classrooms/services/classroom.service';

type ClassroomFilter = number | 'ALL';

@Component({
  selector: 'app-enrollment-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './enrollment-list.html',
  styleUrl: './enrollment-list.scss'
})
export class EnrollmentList implements OnInit {

  // DATA
  enrollments = signal<Enrollment[]>([]);
  academicYears = signal<AcademicYear[]>([]);
  classrooms = signal<Classroom[]>([]);

  // STATES
  loading = signal(false);
  deleting = signal(false);
  deletingId = signal<number | null>(null);

  errorMessage = signal('');

  // FILTERS
  selectedYearId = signal<number | null>(null);
  selectedClassroomId: ClassroomFilter = 'ALL';
  searchTerm = '';

  // DETAILS MODAL
  selectedEnrollment = signal<Enrollment | null>(null);

  constructor(
    private enrollmentService: EnrollmentService,
    private academicYearService: AcademicYearService,
    private classroomService: ClassroomService
  ) { }

  ngOnInit(): void {
    this.loadEnrollments();
  }

  // ========================================
  // LOAD DATA
  // ========================================

  loadEnrollments(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    forkJoin({
      enrollments: this.enrollmentService.getAll(),
      years: this.academicYearService.getAll(),
      classrooms: this.classroomService.getAll()
    }).subscribe({
      next: data => {
        this.enrollments.set(data.enrollments);
        this.academicYears.set(data.years);
        this.classrooms.set(data.classrooms);

        const yearExists = data.years.some(
          year => year.id === this.selectedYearId()
        );

        if (!yearExists) {
          const activeYear = data.years.find(
            year => year.active
          );

          const latestYear = [...data.years].sort(
            (a, b) => b.startDate.localeCompare(a.startDate)
          )[0];

          this.selectedYearId.set(
            activeYear?.id ?? latestYear?.id ?? null
          );
        }

        // Reset classroom when current selection
        // does not belong to selected academic year.
        const currentClassroom = this.selectedClassroomId;

        if (
          typeof currentClassroom === 'number' &&
          !data.classrooms.some(
            classroom =>
              classroom.id === currentClassroom &&
              classroom.academicYearId === this.selectedYearId()
          )
        ) {
          this.selectedClassroomId = 'ALL';
        }

        const selected = this.selectedEnrollment();

        if (selected) {
          this.selectedEnrollment.set(
            data.enrollments.find(
              enrollment => enrollment.id === selected.id
            ) ?? null
          );
        }

        this.loading.set(false);
      },

      error: error => {
        console.error('Error loading enrollments:', error);

        this.errorMessage.set(
          'Unable to load enrollments, academic years or classrooms.'
        );

        this.loading.set(false);
      }
    });
  }

  // ========================================
  // ACADEMIC YEAR
  // ========================================

  get selectedYearLabel(): string {
    return this.academicYears().find(
      year => year.id === this.selectedYearId()
    )?.name ?? 'No academic year';
  }

  onYearChange(yearId: number | null): void {
    this.selectedYearId.set(yearId);
    this.selectedClassroomId = 'ALL';
    this.selectedEnrollment.set(null);
  }

  // ========================================
  // CLASSROOMS FOR YEAR
  // ========================================

  readonly availableClassrooms = computed(() => {
    const yearId = this.selectedYearId();

    if (yearId === null) {
      return [] as Classroom[];
    }

    return this.classrooms()
      .filter(classroom =>
        classroom.academicYearId === yearId
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  // ========================================
  // ENROLLMENTS FOR YEAR
  // ========================================

  readonly yearEnrollments = computed(() => {
    const yearId = this.selectedYearId();

    if (yearId === null) {
      return [] as Enrollment[];
    }

    return this.enrollments().filter(
      enrollment => enrollment.academicYearId === yearId
    );
  });

  // ========================================
  // STATS FOR SELECTED YEAR
  // ========================================

  get totalEnrollments(): number {
    return this.yearEnrollments().length;
  }

  get totalStudents(): number {
    return new Set(
      this.yearEnrollments().map(
        enrollment => enrollment.studentId
      )
    ).size;
  }

  get totalClassrooms(): number {
    return new Set(
      this.yearEnrollments().map(
        enrollment => enrollment.classroomId
      )
    ).size;
  }

  get unassignedClassrooms(): number {
    const enrolledClassrooms = new Set(
      this.yearEnrollments().map(
        enrollment => enrollment.classroomId
      )
    );

    return this.availableClassrooms().filter(
      classroom => !enrolledClassrooms.has(classroom.id)
    ).length;
  }

  // ========================================
  // FILTERS
  // ========================================

  get filteredEnrollments(): Enrollment[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.yearEnrollments()
      .filter(enrollment => {
        const matchesClassroom =
          this.selectedClassroomId === 'ALL' ||
          enrollment.classroomId === this.selectedClassroomId;

        const matchesSearch =
          enrollment.studentFullName.toLowerCase().includes(search) ||
          enrollment.classroomName.toLowerCase().includes(search);

        return matchesClassroom && matchesSearch;
      })
      .sort((a, b) => {
        const classroomComparison =
          a.classroomName.localeCompare(b.classroomName);

        if (classroomComparison !== 0) {
          return classroomComparison;
        }

        return a.studentFullName.localeCompare(
          b.studentFullName
        );
      });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedClassroomId = 'ALL';
  }

  // ========================================
  // VIEW DETAILS
  // ========================================

  viewEnrollment(enrollment: Enrollment): void {
    this.selectedEnrollment.set(enrollment);
  }

  closeDetails(): void {
    this.selectedEnrollment.set(null);
  }

  // ========================================
  // DELETE
  // ========================================

  deleteEnrollment(id: number): void {
    if (this.deleting()) {
      return;
    }

    const enrollment = this.enrollments().find(
      item => item.id === id
    );

    if (!enrollment) {
      return;
    }

    const confirmed = window.confirm(
      `Delete the enrollment of "${enrollment.studentFullName}" ` +
      `in "${enrollment.classroomName}"?`
    );

    if (!confirmed) {
      return;
    }

    this.deleting.set(true);
    this.deletingId.set(id);
    this.errorMessage.set('');

    this.enrollmentService.delete(id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.deletingId.set(null);
        this.selectedEnrollment.set(null);

        this.loadEnrollments();
      },

      error: error => {
        console.error('Error deleting enrollment:', error);

        const backendMessage =
          typeof error.error === 'string'
            ? error.error
            : error.error?.message;

        this.errorMessage.set(
          backendMessage || 'Unable to delete enrollment.'
        );

        this.deleting.set(false);
        this.deletingId.set(null);
      }
    });
  }
}
