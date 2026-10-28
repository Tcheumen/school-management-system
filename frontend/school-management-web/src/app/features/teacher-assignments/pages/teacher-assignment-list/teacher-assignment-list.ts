
import {
  Component,
  OnInit,
  computed,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import {
  TeacherAssignment
} from '../../models/teacher-assignment.model';

import {
  TeacherAssignmentService
} from '../../services/teacher-assignment.service';

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

type SelectFilter = number | 'ALL';

@Component({
  selector: 'app-teacher-assignment-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './teacher-assignment-list.html',
  styleUrl: './teacher-assignment-list.scss'
})
export class TeacherAssignmentList implements OnInit {

  assignments = signal<TeacherAssignment[]>([]);
  academicYears = signal<AcademicYear[]>([]);
  classrooms = signal<Classroom[]>([]);
  subjects = signal<Subject[]>([]);

  loading = signal(false);
  deleting = signal(false);
  deletingId = signal<number | null>(null);

  errorMessage = signal('');

  selectedYearId = signal<number | null>(null);
  selectedClassroomId: SelectFilter = 'ALL';
  selectedSubjectId: SelectFilter = 'ALL';
  searchTerm = '';

  selectedAssignment = signal<TeacherAssignment | null>(null);

  constructor(
    private teacherAssignmentService: TeacherAssignmentService,
    private academicYearService: AcademicYearService,
    private classroomService: ClassroomService,
    private subjectService: SubjectService
  ) { }

  ngOnInit(): void {
    this.loadAssignments();
  }

  // LOAD DATA

  loadAssignments(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    forkJoin({
      assignments: this.teacherAssignmentService.getAll(),
      years: this.academicYearService.getAll(),
      classrooms: this.classroomService.getAll(),
      subjects: this.subjectService.getAll()
    }).subscribe({
      next: data => {
        this.assignments.set(data.assignments);
        this.academicYears.set(data.years);
        this.classrooms.set(data.classrooms);
        this.subjects.set(data.subjects);

        const currentYearExists = data.years.some(
          year => year.id === this.selectedYearId()
        );

        if (!currentYearExists) {
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

        // Reset invalid filters after refreshing.
        if (
          typeof this.selectedClassroomId === 'number' &&
          !data.classrooms.some(
            classroom =>
              classroom.id === this.selectedClassroomId &&
              classroom.academicYearId === this.selectedYearId()
          )
        ) {
          this.selectedClassroomId = 'ALL';
        }

        if (
          typeof this.selectedSubjectId === 'number' &&
          !data.subjects.some(
            subject => subject.id === this.selectedSubjectId
          )
        ) {
          this.selectedSubjectId = 'ALL';
        }

        const selected = this.selectedAssignment();

        if (selected) {
          this.selectedAssignment.set(
            data.assignments.find(
              assignment => assignment.id === selected.id
            ) ?? null
          );
        }

        this.loading.set(false);
      },

      error: error => {
        console.error(
          'Error loading teacher assignments:',
          error
        );

        this.errorMessage.set(
          typeof error.error === 'string'
            ? error.error
            : error.error?.message ||
            'Unable to load teacher assignments.'
        );

        this.loading.set(false);
      }
    });
  }

  // ACADEMIC YEAR

  get selectedYearLabel(): string {
    return this.academicYears().find(
      year => year.id === this.selectedYearId()
    )?.name ?? 'No academic year';
  }

  onYearChange(yearId: number | null): void {
    this.selectedYearId.set(yearId);
    this.selectedClassroomId = 'ALL';
    this.selectedSubjectId = 'ALL';
    this.selectedAssignment.set(null);
  }

  // CLASSROOMS IN SELECTED YEAR

  readonly availableClassrooms = computed<Classroom[]>(() => {
    const yearId = this.selectedYearId();

    if (yearId === null) {
      return [];
    }

    return this.classrooms()
      .filter(classroom =>
        classroom.academicYearId === yearId
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  // SUBJECTS ASSIGNED IN SELECTED YEAR

  readonly availableSubjects = computed<Subject[]>(() => {
    const yearId = this.selectedYearId();

    if (yearId === null) {
      return [];
    }

    const subjectIds = new Set(
      this.assignments()
        .filter(assignment =>
          assignment.academicYearId === yearId
        )
        .map(assignment => assignment.subjectId)
    );

    return this.subjects()
      .filter(subject => subjectIds.has(subject.id))
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  // ASSIGNMENTS FOR SELECTED YEAR

  readonly yearAssignments = computed(() => {
    const yearId = this.selectedYearId();

    if (yearId === null) {
      return [] as TeacherAssignment[];
    }

    return this.assignments().filter(
      assignment => assignment.academicYearId === yearId
    );
  });

  // STATISTICS FOR SELECTED YEAR

  get totalAssignments(): number {
    return this.yearAssignments().length;
  }

  get totalTeachers(): number {
    return new Set(
      this.yearAssignments().map(
        assignment => assignment.teacherId
      )
    ).size;
  }

  get totalSubjects(): number {
    return new Set(
      this.yearAssignments().map(
        assignment => assignment.subjectId
      )
    ).size;
  }

  get totalClassrooms(): number {
    return new Set(
      this.yearAssignments().map(
        assignment => assignment.classroomId
      )
    ).size;
  }

  // FILTERS

  get filteredAssignments(): TeacherAssignment[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.yearAssignments()
      .filter(assignment => {
        const matchesClassroom =
          this.selectedClassroomId === 'ALL' ||
          assignment.classroomId === this.selectedClassroomId;

        const matchesSubject =
          this.selectedSubjectId === 'ALL' ||
          assignment.subjectId === this.selectedSubjectId;

        const searchableText = [
          assignment.teacherFullName,
          assignment.subjectName,
          assignment.classroomName
        ].join(' ').toLowerCase();

        return (
          matchesClassroom &&
          matchesSubject &&
          searchableText.includes(search)
        );
      })
      .sort((a, b) => {
        const classroomOrder =
          a.classroomName.localeCompare(b.classroomName);

        if (classroomOrder !== 0) {
          return classroomOrder;
        }

        return a.teacherFullName.localeCompare(
          b.teacherFullName
        );
      });
  }

  clearFilters(): void {
    this.selectedClassroomId = 'ALL';
    this.selectedSubjectId = 'ALL';
    this.searchTerm = '';
  }

  // DETAILS

  viewAssignment(assignment: TeacherAssignment): void {
    this.selectedAssignment.set(assignment);
  }

  closeDetails(): void {
    this.selectedAssignment.set(null);
  }

  // DELETE

  deleteAssignment(id: number): void {
    if (this.deleting()) {
      return;
    }

    const assignment = this.assignments().find(
      item => item.id === id
    );

    if (!assignment) {
      return;
    }

    const confirmed = window.confirm(
      `Delete the assignment of "${assignment.teacherFullName}" ` +
      `to "${assignment.subjectName}" in "${assignment.classroomName}"?`
    );

    if (!confirmed) {
      return;
    }

    this.deleting.set(true);
    this.deletingId.set(id);
    this.errorMessage.set('');

    this.teacherAssignmentService.delete(id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.deletingId.set(null);
        this.selectedAssignment.set(null);
        this.loadAssignments();
      },

      error: error => {
        console.error(
          'Error deleting teacher assignment:',
          error
        );

        this.errorMessage.set(
          typeof error.error === 'string'
            ? error.error
            : error.error?.message ||
            'Unable to delete teacher assignment.'
        );

        this.deleting.set(false);
        this.deletingId.set(null);
      }
    });
  }
}
