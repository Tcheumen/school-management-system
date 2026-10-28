
import {
  Component,
  OnInit,
  computed,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { SubjectService } from '../../services/subject.service';
import { Subject } from '../../models/subject.model';

import { AcademicYearService } from
  '../../../academic-years/services/academic-year.service';
import { AcademicYear } from
  '../../../academic-years/models/academic-year.model';

import { ClassroomService } from
  '../../../classrooms/services/classroom.service';
import { Classroom } from
  '../../../classrooms/models/classroom.model';

import { TeacherAssignmentService } from
  '../../../teacher-assignments/services/teacher-assignment.service';
import { TeacherAssignment } from
  '../../../teacher-assignments/models/teacher-assignment.model';

type SubjectView = 'CATALOG' | 'CLASSROOM';
type ClassroomFilter = number | 'ALL';

@Component({
  selector: 'app-subject-list',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './subject-list.html',
  styleUrl: './subject-list.scss'
})
export class SubjectList implements OnInit {

  // DATA

  subjects = signal<Subject[]>([]);
  academicYears = signal<AcademicYear[]>([]);
  classrooms = signal<Classroom[]>([]);
  assignments = signal<TeacherAssignment[]>([]);

  // STATES

  loading = signal(false);
  deleting = signal(false);
  deletingId = signal<number | null>(null);
  errorMessage = signal('');

  // FILTERS

  activeView = signal<SubjectView>('CATALOG');

  selectedYearId = signal<number | null>(null);
  selectedClassroomId: ClassroomFilter = 'ALL';

  searchTerm = '';

  constructor(
    private subjectService: SubjectService,
    private academicYearService: AcademicYearService,
    private classroomService: ClassroomService,
    private teacherAssignmentService: TeacherAssignmentService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  // ====================================
  // LOAD DATA
  // ====================================

  loadData(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    forkJoin({
      subjects: this.subjectService.getAll(),
      years: this.academicYearService.getAll(),
      classrooms: this.classroomService.getAll(),
      assignments: this.teacherAssignmentService.getAll()
    }).subscribe({

      next: data => {
        this.subjects.set(data.subjects);
        this.academicYears.set(data.years);
        this.classrooms.set(data.classrooms);
        this.assignments.set(data.assignments);

        const yearExists = data.years.some(
          year => year.id === this.selectedYearId()
        );

        if (!yearExists) {
          const activeYear = data.years.find(
            year => year.active
          );

          const latestYear = [...data.years].sort(
            (a, b) =>
              b.startDate.localeCompare(a.startDate)
          )[0];

          this.selectedYearId.set(
            activeYear?.id ?? latestYear?.id ?? null
          );

          this.selectedClassroomId = 'ALL';
        }

        this.loading.set(false);
      },

      error: error => {
        console.error('Error loading subjects:', error);

        this.errorMessage.set(
          'Unable to load subjects and teaching assignments.'
        );

        this.loading.set(false);
      }

    });
  }

  // ====================================
  // VIEW SWITCHING
  // ====================================

  changeView(view: SubjectView): void {
    this.activeView.set(view);
    this.searchTerm = '';
    this.errorMessage.set('');
  }

  // ====================================
  // ACADEMIC YEAR
  // ====================================

  get selectedYearLabel(): string {
    const year = this.academicYears().find(
      item => item.id === this.selectedYearId()
    );

    return year?.name ?? 'No academic year';
  }

  onYearChange(yearId: number): void {
    this.selectedYearId.set(yearId);
    this.selectedClassroomId = 'ALL';
  }

  // ====================================
  // CLASSROOMS FOR SELECTED YEAR
  // ====================================

  readonly availableClassrooms = computed(() => {
    const yearId = this.selectedYearId();

    if (yearId === null) {
      return [] as Classroom[];
    }

    return this.classrooms()
      .filter(classroom =>
        classroom.academicYearId === yearId
      )
      .sort((a, b) =>
        a.name.localeCompare(b.name)
      );
  });

  // ====================================
  // ASSIGNMENTS FOR SELECTED YEAR
  // ====================================

  readonly yearAssignments = computed(() => {
    const yearId = this.selectedYearId();

    if (yearId === null) {
      return [] as TeacherAssignment[];
    }

    const classroomIds = new Set(
      this.availableClassrooms().map(
        classroom => classroom.id
      )
    );

    return this.assignments().filter(assignment =>
      assignment.academicYearId === yearId &&
      classroomIds.has(assignment.classroomId)
    );
  });

  // ====================================
  // STATISTICS
  // ====================================

  get totalSubjects(): number {
    return this.subjects().length;
  }

  get totalClassrooms(): number {
    return this.availableClassrooms().length;
  }

  get totalAssignments(): number {
    return this.yearAssignments().length;
  }

  get assignedSubjectsCount(): number {
    return new Set(
      this.yearAssignments().map(
        assignment => assignment.subjectId
      )
    ).size;
  }

  // ====================================
  // SUBJECT CATALOG
  // ====================================

  get filteredSubjects(): Subject[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.subjects()
      .filter(subject => {
        return (
          subject.name.toLowerCase().includes(search) ||
          (subject.description ?? '')
            .toLowerCase()
            .includes(search)
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  // ====================================
  // SUBJECTS BY CLASSROOM
  // ====================================

  get filteredAssignments(): TeacherAssignment[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.yearAssignments()
      .filter(assignment => {

        const matchesClassroom =
          this.selectedClassroomId === 'ALL' ||
          assignment.classroomId ===
          this.selectedClassroomId;

        const searchableText = [
          assignment.subjectName,
          assignment.teacherFullName,
          assignment.classroomName
        ].join(' ').toLowerCase();

        return (
          matchesClassroom &&
          searchableText.includes(search)
        );
      })
      .sort((a, b) => {
        const classroomComparison =
          a.classroomName.localeCompare(b.classroomName);

        if (classroomComparison !== 0) {
          return classroomComparison;
        }

        return a.subjectName.localeCompare(
          b.subjectName
        );
      });
  }

  // ====================================
  // CLEAR FILTERS
  // ====================================

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedClassroomId = 'ALL';
  }

  // ====================================
  // DELETE SUBJECT
  // ====================================

  deleteSubject(id: number): void {
    if (this.deleting()) {
      return;
    }

    const subject = this.subjects().find(
      item => item.id === id
    );

    if (!subject) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${subject.name}"?`
    );

    if (!confirmed) {
      return;
    }

    this.deleting.set(true);
    this.deletingId.set(id);
    this.errorMessage.set('');

    this.subjectService.delete(id).subscribe({

      next: () => {
        this.deleting.set(false);
        this.deletingId.set(null);

        this.loadData();
      },

      error: error => {
        console.error('Error deleting subject:', error);

        const backendMessage =
          typeof error.error === 'string'
            ? error.error
            : error.error?.message;

        this.errorMessage.set(
          backendMessage ||
          'Unable to delete subject. It may be linked to existing assignments or grades.'
        );

        this.deleting.set(false);
        this.deletingId.set(null);
      }

    });
  }

  // ====================================
  // SUBJECT UTILITIES
  // ====================================

  isSubjectAssigned(subjectId: number): boolean {
    return this.assignments().some(
      assignment => assignment.subjectId === subjectId
    );
  }

  getClassroomLabel(classroomId: number): string {
    const classroom = this.classrooms().find(
      item => item.id === classroomId
    );

    if (!classroom) {
      return `Classroom #${classroomId}`;
    }

    return `${classroom.name} - ${classroom.level}`;
  }
}
