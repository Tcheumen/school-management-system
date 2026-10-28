
import {
  Component,
  OnInit,
  computed,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';

import {
  Grade,
  GradeTerm
} from '../../models/grade.model';

import {
  GradeService
} from '../../services/grade.service';

import {
  AuthService
} from '../../../../core/services/auth.service';

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
  Subject
} from '../../../subjects/models/subject.model';

import {
  SubjectService
} from '../../../subjects/services/subject.service';

type IdFilter = number | 'ALL';
type TermFilter = GradeTerm | 'ALL';

interface FilterOption {
  id: number;
  name: string;
}

interface YearOption {
  id: number;
  name: string;
  active: boolean;
}

@Component({
  selector: 'app-grade-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './grade-list.html',
  styleUrl: './grade-list.scss'
})
export class GradeList implements OnInit {

  // =====================================
  // DATA
  // =====================================

  grades = signal<Grade[]>([]);
  academicYears = signal<AcademicYear[]>([]);
  classrooms = signal<Classroom[]>([]);
  subjects = signal<Subject[]>([]);

  // =====================================
  // STATES
  // =====================================

  loading = signal(false);
  deleting = signal(false);
  deletingId = signal<number | null>(null);
  errorMessage = signal('');

  // =====================================
  // USER ROLE
  // =====================================

  readonly role: string | null;
  readonly canManageGrades: boolean;

  // =====================================
  // FILTERS
  // =====================================

  selectedYearId = signal<number | null>(null);

  selectedClassroomId = signal<IdFilter>('ALL');
  selectedSubjectId = signal<IdFilter>('ALL');
  selectedTerm = signal<TermFilter>('ALL');
  searchTerm = signal('');

  // =====================================
  // DETAILS MODAL
  // =====================================

  selectedGrade = signal<Grade | null>(null);

  // =====================================
  // TERMS
  // =====================================

  readonly terms: {
    value: GradeTerm;
    label: string;
  }[] = [
      { value: 'TERM_1', label: 'Term 1' },
      { value: 'TERM_2', label: 'Term 2' },
      { value: 'TERM_3', label: 'Term 3' }
    ];

  constructor(
    private gradeService: GradeService,
    private authService: AuthService,
    private academicYearService: AcademicYearService,
    private classroomService: ClassroomService,
    private subjectService: SubjectService
  ) {
    this.role = this.authService.getRole();

    this.canManageGrades =
      this.role === 'ADMIN' ||
      this.role === 'TEACHER';
  }

  ngOnInit(): void {
    this.loadGrades();
  }

  // =====================================
  // LOAD GRADES AND REFERENCE DATA
  // =====================================

  loadGrades(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    // Read grades according to the connected user's role.
    const gradesRequest$ =
      this.role === 'TEACHER'
        ? this.gradeService.getMineForTeacher()
        : this.role === 'STUDENT'
          ? this.gradeService.getMineForStudent()
          : this.gradeService.getAll();

    // Reference data is loaded for ADMIN only.
    // Other roles derive their filter options
    // from their authorized grade records.
    const yearsRequest$ =
      this.role === 'ADMIN'
        ? this.academicYearService.getAll()
        : of([] as AcademicYear[]);

    const classroomsRequest$ =
      this.role === 'ADMIN'
        ? this.classroomService.getAll()
        : of([] as Classroom[]);

    const subjectsRequest$ =
      this.role === 'ADMIN'
        ? this.subjectService.getAll()
        : of([] as Subject[]);

    forkJoin({
      grades: gradesRequest$,
      years: yearsRequest$,
      classrooms: classroomsRequest$,
      subjects: subjectsRequest$
    }).subscribe({
      next: data => {

        this.grades.set(data.grades);
        this.academicYears.set(data.years);
        this.classrooms.set(data.classrooms);
        this.subjects.set(data.subjects);

        // Find years visible to the connected role.
        const availableYearIds = new Set<number>([
          ...data.years.map(year => year.id),
          ...data.grades.map(grade => grade.academicYearId)
        ]);

        const currentYearId = this.selectedYearId();

        const yearExists =
          currentYearId !== null &&
          availableYearIds.has(currentYearId);

        if (!yearExists) {

          // ADMIN: prefer the active academic year.
          const activeYear = data.years.find(
            year => year.active
          );

          const latestYear = [...data.years].sort(
            (a, b) =>
              b.startDate.localeCompare(a.startDate)
          )[0];

          // TEACHER / STUDENT fallback:
          // use the most recent year present in their grades.
          const latestGradeYear = [...data.grades].sort(
            (a, b) =>
              b.academicYearName.localeCompare(
                a.academicYearName
              )
          )[0];

          this.selectedYearId.set(
            activeYear?.id ??
            latestYear?.id ??
            latestGradeYear?.academicYearId ??
            null
          );

          this.resetOtherFilters();
        }

        // Keep only valid classroom and subject filters.
        const selectedYearId = this.selectedYearId();

        if (this.role === 'ADMIN') {

          const validClassroom =
            this.selectedClassroomId() === 'ALL' ||
            data.classrooms.some(
              classroom =>
                classroom.id === this.selectedClassroomId() &&
                classroom.academicYearId === selectedYearId
            );

          if (!validClassroom) {
            this.selectedClassroomId.set('ALL');
            this.selectedSubjectId.set('ALL');
          }

          const validSubject =
            this.selectedSubjectId() === 'ALL' ||
            data.subjects.some(
              subject =>
                subject.id === this.selectedSubjectId()
            );

          if (!validSubject) {
            this.selectedSubjectId.set('ALL');
          }

        } else {

          const visibleGrades = data.grades.filter(
            grade => grade.academicYearId === selectedYearId
          );

          if (
            this.selectedClassroomId() !== 'ALL' &&
            !visibleGrades.some(
              grade =>
                grade.classroomId === this.selectedClassroomId()
            )
          ) {
            this.selectedClassroomId.set('ALL');
            this.selectedSubjectId.set('ALL');
          }

          if (
            this.selectedSubjectId() !== 'ALL' &&
            !visibleGrades.some(
              grade =>
                grade.subjectId === this.selectedSubjectId()
            )
          ) {
            this.selectedSubjectId.set('ALL');
          }
        }

        // Refresh currently open details.
        const selected = this.selectedGrade();

        if (selected) {
          this.selectedGrade.set(
            data.grades.find(
              grade => grade.id === selected.id
            ) ?? null
          );
        }

        this.loading.set(false);
      },

      error: error => {
        console.error(
          'Error loading grades:',
          error
        );

        this.errorMessage.set(
          this.getErrorMessage(
            error,
            'Unable to load grades.'
          )
        );

        this.loading.set(false);
      }
    });
  }

  // =====================================
  // ACADEMIC YEAR OPTIONS
  // =====================================

  readonly availableYears = computed<YearOption[]>(() => {

    const yearMap = new Map<number, YearOption>();

    // ADMIN sees all academic years.
    for (const year of this.academicYears()) {
      yearMap.set(year.id, {
        id: year.id,
        name: year.name,
        active: year.active
      });
    }

    // Add years present in authorized grade records.
    for (const grade of this.grades()) {
      if (!yearMap.has(grade.academicYearId)) {
        yearMap.set(grade.academicYearId, {
          id: grade.academicYearId,
          name: grade.academicYearName,
          active: false
        });
      }
    }

    return [...yearMap.values()].sort(
      (a, b) => b.name.localeCompare(a.name)
    );
  });

  get selectedYearLabel(): string {
    return this.availableYears().find(
      year => year.id === this.selectedYearId()
    )?.name ?? 'No academic year';
  }

  onYearChange(yearId: number | null): void {
    this.selectedYearId.set(yearId);
    this.resetOtherFilters();
    this.selectedGrade.set(null);
  }

  // =====================================
  // GRADES FOR SELECTED YEAR
  // =====================================

  readonly yearGrades = computed<Grade[]>(() => {
    const yearId = this.selectedYearId();

    if (yearId === null) {
      return [];
    }

    return this.grades().filter(
      grade => grade.academicYearId === yearId
    );
  });

  // =====================================
  // CLASSROOM OPTIONS
  // =====================================

  readonly availableClassrooms = computed<FilterOption[]>(() => {

    const yearId = this.selectedYearId();

    if (yearId === null) {
      return [];
    }

    // ADMIN: show ALL classrooms for the selected year,
    // even if they do not yet have grade records.
    if (this.role === 'ADMIN') {
      return this.classrooms()
        .filter(classroom =>
          classroom.academicYearId === yearId
        )
        .map(classroom => ({
          id: classroom.id,
          name: classroom.name
        }))
        .sort((a, b) =>
          a.name.localeCompare(b.name)
        );
    }

    // TEACHER / STUDENT: only classrooms
    // represented in their authorized grades.
    const classroomMap = new Map<number, string>();

    for (const grade of this.yearGrades()) {
      classroomMap.set(
        grade.classroomId,
        grade.classroomName
      );
    }

    return [...classroomMap.entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) =>
        a.name.localeCompare(b.name)
      );
  });

  onClassroomChange(classroomId: IdFilter): void {
    this.selectedClassroomId.set(classroomId);

    // Reset subject when the classroom changes.
    this.selectedSubjectId.set('ALL');
  }

  // =====================================
  // SUBJECT OPTIONS
  // =====================================

  readonly availableSubjects = computed<FilterOption[]>(() => {

    // ADMIN: show ALL subjects from the school catalog,
    // including those that have no grades yet.
    if (this.role === 'ADMIN') {
      return this.subjects()
        .map(subject => ({
          id: subject.id,
          name: subject.name
        }))
        .sort((a, b) =>
          a.name.localeCompare(b.name)
        );
    }

    // TEACHER / STUDENT:
    // only subjects present in visible grade records,
    // limited to the selected classroom when applicable.
    const classroomId = this.selectedClassroomId();

    const subjectMap = new Map<number, string>();

    for (const grade of this.yearGrades()) {

      if (
        classroomId !== 'ALL' &&
        grade.classroomId !== classroomId
      ) {
        continue;
      }

      subjectMap.set(
        grade.subjectId,
        grade.subjectName
      );
    }

    return [...subjectMap.entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) =>
        a.name.localeCompare(b.name)
      );
  });

  // =====================================
  // FILTERED GRADES
  // =====================================

  readonly filteredGrades = computed<Grade[]>(() => {

    const classroomId = this.selectedClassroomId();
    const subjectId = this.selectedSubjectId();
    const term = this.selectedTerm();

    const search =
      this.searchTerm().trim().toLowerCase();

    return this.yearGrades()
      .filter(grade => {

        const matchesClassroom =
          classroomId === 'ALL' ||
          grade.classroomId === classroomId;

        const matchesSubject =
          subjectId === 'ALL' ||
          grade.subjectId === subjectId;

        const matchesTerm =
          term === 'ALL' ||
          grade.term === term;

        const searchableText = [
          grade.studentFullName,
          grade.teacherFullName,
          grade.subjectName,
          grade.classroomName
        ].join(' ').toLowerCase();

        return (
          matchesClassroom &&
          matchesSubject &&
          matchesTerm &&
          searchableText.includes(search)
        );
      })
      .sort((a, b) => {

        const studentComparison =
          a.studentFullName.localeCompare(
            b.studentFullName
          );

        if (studentComparison !== 0) {
          return studentComparison;
        }

        return a.term.localeCompare(b.term);
      });
  });

  // =====================================
  // STATISTICS
  // =====================================

  readonly totalGrades = computed<number>(() =>
    this.filteredGrades().length
  );

  readonly totalStudents = computed<number>(() =>
    new Set(
      this.filteredGrades().map(
        grade => grade.studentId
      )
    ).size
  );

  readonly averageGrade = computed<number | null>(() => {

    const grades = this.filteredGrades();

    if (grades.length === 0) {
      return null;
    }

    const sum = grades.reduce(
      (total, grade) => total + grade.value,
      0
    );

    return sum / grades.length;
  });

  readonly belowAverageCount = computed<number>(() =>
    this.filteredGrades().filter(
      grade => grade.value < 10
    ).length
  );

  readonly highGradesCount = computed<number>(() =>
    this.filteredGrades().filter(
      grade => grade.value >= 14
    ).length
  );

  // =====================================
  // RESET FILTERS
  // =====================================

  resetOtherFilters(): void {
    this.selectedClassroomId.set('ALL');
    this.selectedSubjectId.set('ALL');
    this.selectedTerm.set('ALL');
    this.searchTerm.set('');
  }

  clearFilters(): void {
    this.resetOtherFilters();
  }

  // =====================================
  // UTILITIES
  // =====================================

  formatTerm(term: GradeTerm): string {

    const labels: Record<GradeTerm, string> = {
      TERM_1: 'Term 1',
      TERM_2: 'Term 2',
      TERM_3: 'Term 3'
    };

    return labels[term] ?? term;
  }

  getGradeLevel(value: number): string {
    if (value >= 14) {
      return 'Good';
    }

    if (value >= 10) {
      return 'Average';
    }

    return 'Needs Improvement';
  }

  private getErrorMessage(
    error: any,
    fallback: string
  ): string {

    if (typeof error?.error === 'string') {
      return error.error;
    }

    return error?.error?.message || fallback;
  }

  // =====================================
  // VIEW GRADE DETAILS
  // =====================================

  viewGrade(grade: Grade): void {
    this.selectedGrade.set(grade);
  }

  closeDetails(): void {
    this.selectedGrade.set(null);
  }

  // =====================================
  // DELETE GRADE
  // =====================================

  deleteGrade(id: number): void {

    if (!this.canManageGrades || this.deleting()) {
      return;
    }

    const grade = this.grades().find(
      item => item.id === id
    );

    if (!grade) {
      return;
    }

    const confirmed = window.confirm(
      `Delete the grade of "${grade.studentFullName}" ` +
      `in "${grade.subjectName}" ` +
      `(${this.formatTerm(grade.term)})?`
    );

    if (!confirmed) {
      return;
    }

    this.deleting.set(true);
    this.deletingId.set(id);
    this.errorMessage.set('');

    this.gradeService.delete(id).subscribe({

      next: () => {
        this.deleting.set(false);
        this.deletingId.set(null);
        this.selectedGrade.set(null);

        this.loadGrades();
      },

      error: error => {
        console.error(
          'Error deleting grade:',
          error
        );

        this.errorMessage.set(
          this.getErrorMessage(
            error,
            'Unable to delete grade.'
          )
        );

        this.deleting.set(false);
        this.deletingId.set(null);
      }
    });
  }
}
