
import {
  Component,
  OnInit,
  computed,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  Enrollment
} from '../../../enrollments/models/enrollment.model';

import {
  EnrollmentService
} from '../../../enrollments/services/enrollment.service';

import {
  AcademicYear
} from '../../../academic-years/models/academic-year.model';

import {
  AcademicYearService
} from '../../../academic-years/services/academic-year.service';

import {
  Classroom
} from '../../../classrooms/models/classroom.model';

import {
  ClassroomService
} from '../../../classrooms/services/classroom.service';

import {
  ReportCard
} from '../../models/report-card.model';

import {
  ReportCardService
} from '../../services/report-card.service';

import {
  AuthService
} from '../../../../core/services/auth.service';

import { forkJoin, of } from 'rxjs';

interface YearOption {
  id: number;
  name: string;
  active: boolean;
}

interface ClassroomOption {
  id: number;
  name: string;
  level: string;
}

type ClassroomFilter = number | null;

@Component({
  selector: 'app-report-card-view',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './report-card-view.html',
  styleUrl: './report-card-view.scss'
})
export class ReportCardView implements OnInit {

  readonly role: string | null;
  readonly isStudent: boolean;

  // DATA
  enrollments = signal<Enrollment[]>([]);
  academicYears = signal<AcademicYear[]>([]);
  classrooms = signal<Classroom[]>([]);

  // FILTERS
  selectedYearId = signal<number | null>(null);
  selectedClassroomId = signal<ClassroomFilter>(null);
  enrollmentId = signal<number | null>(null);
  term = signal('TERM_1');

  // REPORT
  reportCard = signal<ReportCard | null>(null);

  // STATES
  loading = signal(false);
  loadingEnrollments = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  // Prevent older HTTP responses from replacing newer results.
  private reportRequestVersion = 0;

  readonly terms = [
    { value: 'TERM_1', label: 'Term 1' },
    { value: 'TERM_2', label: 'Term 2' },
    { value: 'TERM_3', label: 'Term 3' }
  ];

  constructor(
    private enrollmentService: EnrollmentService,
    private reportCardService: ReportCardService,
    private authService: AuthService,
    private academicYearService: AcademicYearService,
    private classroomService: ClassroomService
  ) {
    this.role = this.authService.getRole();
    this.isStudent = this.role === 'STUDENT';
  }

  ngOnInit(): void {
    if (!this.isStudent) {
      this.loadEnrollments();
    }
  }

  // =====================================
  // LOAD REFERENCE DATA
  // =====================================

  loadEnrollments(): void {
    if (this.isStudent) {
      return;
    }

    this.loadingEnrollments.set(true);
    this.errorMessage.set('');

    const isAdmin = this.role === 'ADMIN';

    forkJoin({
      enrollments: isAdmin
        ? this.enrollmentService.getAll()
        : this.enrollmentService.getMineForTeacher(),

      years: isAdmin
        ? this.academicYearService.getAll()
        : of([] as AcademicYear[]),

      classrooms: isAdmin
        ? this.classroomService.getAll()
        : of([] as Classroom[])
    }).subscribe({
      next: data => {
        this.enrollments.set(data.enrollments);
        this.academicYears.set(data.years);
        this.classrooms.set(data.classrooms);

        const visibleYearIds = new Set<number>([
          ...data.years.map(year => year.id),
          ...data.enrollments.map(
            enrollment => enrollment.academicYearId
          )
        ]);

        const currentYearId = this.selectedYearId();

        if (
          currentYearId === null ||
          !visibleYearIds.has(currentYearId)
        ) {
          const activeYear = data.years.find(
            year => year.active
          );

          const latestYear = [...data.years]
            .sort((a, b) =>
              b.startDate.localeCompare(a.startDate)
            )[0];

          const latestEnrollment = [...data.enrollments]
            .sort((a, b) =>
              b.academicYearName.localeCompare(
                a.academicYearName
              )
            )[0];

          this.selectedYearId.set(
            activeYear?.id ??
            latestYear?.id ??
            latestEnrollment?.academicYearId ??
            null
          );

          this.selectedClassroomId.set(null);
          this.enrollmentId.set(null);
        }

        const classroomId = this.selectedClassroomId();

        if (
          classroomId !== null &&
          !data.enrollments.some(
            enrollment =>
              enrollment.academicYearId ===
              this.selectedYearId() &&
              enrollment.classroomId === classroomId
          ) &&
          !data.classrooms.some(
            classroom =>
              classroom.academicYearId ===
              this.selectedYearId() &&
              classroom.id === classroomId
          )
        ) {
          this.selectedClassroomId.set(null);
          this.enrollmentId.set(null);
        }

        const selectedEnrollmentId = this.enrollmentId();

        if (
          selectedEnrollmentId !== null &&
          !data.enrollments.some(
            enrollment =>
              enrollment.id === selectedEnrollmentId &&
              enrollment.academicYearId ===
              this.selectedYearId() &&
              (
                this.selectedClassroomId() === null ||
                enrollment.classroomId ===
                this.selectedClassroomId()
              )
          )
        ) {
          this.enrollmentId.set(null);
        }

        this.loadingEnrollments.set(false);
      },

      error: error => {
        console.error('Error loading report filters:', error);

        this.errorMessage.set(
          this.getErrorMessage(
            error,
            'Unable to load students and academic years.'
          )
        );

        this.loadingEnrollments.set(false);
      }
    });
  }

  // =====================================
  // ACADEMIC YEARS
  // =====================================

  readonly availableYears = computed<YearOption[]>(() => {
    const yearMap = new Map<number, YearOption>();

    for (const year of this.academicYears()) {
      yearMap.set(year.id, {
        id: year.id,
        name: year.name,
        active: year.active
      });
    }

    for (const enrollment of this.enrollments()) {
      if (!yearMap.has(enrollment.academicYearId)) {
        yearMap.set(enrollment.academicYearId, {
          id: enrollment.academicYearId,
          name: enrollment.academicYearName,
          active: false
        });
      }
    }

    return [...yearMap.values()]
      .sort((a, b) => b.name.localeCompare(a.name));
  });

  get selectedYearLabel(): string {
    return this.availableYears().find(
      year => year.id === this.selectedYearId()
    )?.name ?? 'No academic year';
  }

  onYearChange(yearId: number | null): void {
    this.selectedYearId.set(yearId);
    this.selectedClassroomId.set(null);
    this.enrollmentId.set(null);
    this.resetReport();
  }

  // =====================================
  // CLASSROOMS
  // =====================================

  readonly availableClassrooms =
    computed<ClassroomOption[]>(() => {

      const yearId = this.selectedYearId();

      if (yearId === null) {
        return [];
      }

      const classroomMap =
        new Map<number, ClassroomOption>();

      // ADMIN: all classrooms in the selected year.
      if (this.role === 'ADMIN') {
        for (const classroom of this.classrooms()) {
          if (classroom.academicYearId === yearId) {
            classroomMap.set(classroom.id, {
              id: classroom.id,
              name: classroom.name,
              level: classroom.level
            });
          }
        }
      }

      // TEACHER: only classrooms represented
      // in their authorized enrollments.
      // Also preserves references if a classroom
      // is absent from the admin classroom catalog.
      for (const enrollment of this.enrollments()) {
        if (
          enrollment.academicYearId === yearId &&
          !classroomMap.has(enrollment.classroomId)
        ) {
          classroomMap.set(enrollment.classroomId, {
            id: enrollment.classroomId,
            name: enrollment.classroomName,
            level: ''
          });
        }
      }

      return [...classroomMap.values()]
        .sort((a, b) => a.name.localeCompare(b.name));
    });

  onClassroomChange(classroomId: number | null): void {
    this.selectedClassroomId.set(classroomId);
    this.enrollmentId.set(null);
    this.resetReport();
  }

  // =====================================
  // STUDENT ENROLLMENTS
  // =====================================

  readonly availableEnrollments = computed(() => {

    const yearId = this.selectedYearId();
    const classroomId = this.selectedClassroomId();

    if (yearId === null || classroomId === null) {
      return [];
    }

    return this.enrollments()
      .filter(enrollment =>
        enrollment.academicYearId === yearId &&
        enrollment.classroomId === classroomId
      )
      .sort((a, b) =>
        a.studentFullName.localeCompare(
          b.studentFullName
        )
      );
  });

  onEnrollmentChange(id: number | null): void {
    this.enrollmentId.set(id);
    this.resetReport();
  }

  onTermChange(term: string): void {
    this.term.set(term);
    this.resetReport();
  }

  // =====================================
  // RESET REPORT
  // =====================================

  resetReport(): void {
    this.reportRequestVersion++;
    this.reportCard.set(null);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.loading.set(false);
  }

  // =====================================
  // LOAD REPORT CARD
  // =====================================

  loadReportCard(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.reportCard.set(null);

    const selectedTerm = this.term();

    if (!selectedTerm) {
      this.errorMessage.set('Term is required.');
      return;
    }

    if (!this.isStudent && this.enrollmentId() === null) {
      this.errorMessage.set(
        'Please select an academic year, classroom and student.'
      );
      return;
    }

    const requestVersion = ++this.reportRequestVersion;

    this.loading.set(true);

    const request$ = this.isStudent
      ? this.reportCardService.getMine(selectedTerm)
      : this.reportCardService.getByEnrollment(
        this.enrollmentId()!,
        selectedTerm
      );

    request$.subscribe({
      next: report => {

        if (requestVersion !== this.reportRequestVersion) {
          return;
        }

        this.reportCard.set(report);
        this.loading.set(false);
      },

      error: error => {

        if (requestVersion !== this.reportRequestVersion) {
          return;
        }

        console.error('Error loading report card:', error);

        this.errorMessage.set(
          this.getErrorMessage(
            error,
            'Unable to load report card.'
          )
        );

        this.loading.set(false);
      }
    });
  }

  // =====================================
  // REPORT CARD HELPERS
  // =====================================

  formatAverage(value: number | null | undefined): string {
    if (
      value === null ||
      value === undefined ||
      !Number.isFinite(value)
    ) {
      return '—';
    }

    return value.toFixed(2);
  }

  getAverageClass(value: number): string {
    if (value >= 14) {
      return 'average-good';
    }

    if (value >= 10) {
      return 'average-medium';
    }

    return 'average-low';
  }

  formatTerm(term: string): string {
    const terms: Record<string, string> = {
      TERM_1: 'Term 1',
      TERM_2: 'Term 2',
      TERM_3: 'Term 3'
    };

    return terms[term] ?? term;
  }

  // =====================================
  // PRINT REPORT
  // =====================================

  printReport(): void {
    if (!this.reportCard()) {
      return;
    }

    window.print();
  }

  // =====================================
  // HTTP ERROR
  // =====================================

  private getErrorMessage(
    error: any,
    fallback: string
  ): string {
    if (typeof error?.error === 'string') {
      return error.error;
    }

    return error?.error?.message || fallback;
  }
}
