
import {
  Component,
  OnInit,
  computed,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

import { TeacherService } from '../../services/teacher.service';
import { Teacher } from '../../models/teacher.model';

import { AcademicYearService } from
  '../../../academic-years/services/academic-year.service';
import { AcademicYear } from
  '../../../academic-years/models/academic-year.model';

import { ClassroomService } from
  '../../../classrooms/services/classroom.service';
import { Classroom } from
  '../../../classrooms/models/classroom.model';

// Adapt this interface to your TeacherAssignment model.
interface TeacherAssignmentSummary {
  id: number;
  teacherId: number;
  classroomId: number;
}

type ClassroomFilter = number | 'ALL' | 'UNASSIGNED';

interface TeacherRow {
  teacher: Teacher;
  classroomNames: string[];
  classroomIds: number[];
  assigned: boolean;
}

@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './teacher-list.html',
  styleUrl: './teacher-list.scss'
})
export class TeacherList implements OnInit {

  teachers = signal<Teacher[]>([]);
  academicYears = signal<AcademicYear[]>([]);
  classrooms = signal<Classroom[]>([]);
  assignments = signal<TeacherAssignmentSummary[]>([]);

  loading = signal(false);
  deleting = signal(false);
  deletingId = signal<number | null>(null);
  errorMessage = signal('');

  selectedYearId = signal<number | null>(null);
  selectedClassroomId: ClassroomFilter = 'ALL';
  searchTerm = '';

  // Check against your backend controller.
  private readonly assignmentApi =
    'http://localhost:8080/api/teacher-assignments';

  constructor(
    private teacherService: TeacherService,
    private academicYearService: AcademicYearService,
    private classroomService: ClassroomService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  // =====================================
  // LOAD DATA
  // =====================================

  loadData(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    forkJoin({
      teachers: this.teacherService.getAll(),
      years: this.academicYearService.getAll(),
      classrooms: this.classroomService.getAll(),
      assignments:
        this.http.get<TeacherAssignmentSummary[]>(
          this.assignmentApi
        )
    }).subscribe({
      next: data => {
        this.teachers.set(data.teachers);
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
            (a, b) => b.startDate.localeCompare(a.startDate)
          )[0];

          this.selectedYearId.set(
            activeYear?.id ?? latestYear?.id ?? null
          );
        }

        this.selectedClassroomId = 'ALL';
        this.loading.set(false);
      },

      error: error => {
        console.error('Error loading teacher data:', error);

        this.errorMessage.set(
          error.error?.message ||
          'Unable to load teachers and assignments.'
        );

        this.loading.set(false);
      }
    });
  }

  // =====================================
  // ACADEMIC YEAR
  // =====================================

  get selectedYearLabel(): string {
    const year = this.academicYears().find(
      item => item.id === this.selectedYearId()
    );

    return year?.name ?? 'No academic year';
  }

  onYearChange(yearId: number | null): void {
    this.selectedYearId.set(yearId);
    this.selectedClassroomId = 'ALL';
  }

  // =====================================
  // CLASSROOMS IN SELECTED YEAR
  // =====================================

  readonly availableClassrooms = computed(() => {
    const yearId = this.selectedYearId();

    if (yearId === null) {
      return [];
    }

    return this.classrooms()
      .filter(classroom =>
        classroom.academicYearId === yearId
      )
      .sort((a, b) =>
        a.name.localeCompare(b.name)
      );
  });

  // =====================================
  // ASSIGNMENTS IN SELECTED YEAR
  // =====================================

  readonly yearAssignments = computed(() => {
    const validClassroomIds = new Set(
      this.availableClassrooms().map(
        classroom => classroom.id
      )
    );

    return this.assignments().filter(
      assignment =>
        validClassroomIds.has(assignment.classroomId)
    );
  });

  // =====================================
  // GROUP TEACHERS WITH CLASSROOMS
  // =====================================

  readonly teacherRows = computed<TeacherRow[]>(() => {
    const assignments = this.yearAssignments();
    const classrooms = this.availableClassrooms();

    return this.teachers().map(teacher => {

      const teacherAssignments = assignments.filter(
        assignment => assignment.teacherId === teacher.id
      );

      const classroomIds = [
        ...new Set(
          teacherAssignments.map(
            assignment => assignment.classroomId
          )
        )
      ];

      const classroomNames = classroomIds.map(id => {
        const classroom = classrooms.find(
          item => item.id === id
        );

        return classroom?.name ?? `Classroom #${id}`;
      });

      return {
        teacher,
        classroomIds,
        classroomNames,
        assigned: classroomIds.length > 0
      };
    });
  });

  // =====================================
  // STATISTICS
  // =====================================

  get assignedCount(): number {
    return this.teacherRows().filter(
      row => row.assigned
    ).length;
  }

  get unassignedCount(): number {
    return this.teacherRows().filter(
      row => !row.assigned
    ).length;
  }

  get classroomCount(): number {
    return this.availableClassrooms().length;
  }

  // =====================================
  // FILTER TEACHERS
  // =====================================

  get filteredRows(): TeacherRow[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.teacherRows().filter(row => {
      if (
        this.selectedClassroomId === 'ALL' &&
        !row.assigned
      ) {
        return false;
      }

      if (
        this.selectedClassroomId === 'UNASSIGNED' &&
        row.assigned
      ) {
        return false;
      }

      if (
        typeof this.selectedClassroomId === 'number' &&
        !row.classroomIds.includes(this.selectedClassroomId)
      ) {
        return false;
      }

      const teacher = row.teacher;

      const searchableText = [
        teacher.firstName,
        teacher.lastName,
        teacher.email,
        teacher.specialty
      ].join(' ').toLowerCase();

      return searchableText.includes(search);
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedClassroomId = 'ALL';
  }

  // =====================================
  // DELETE TEACHER
  // =====================================

  deleteTeacher(id: number): void {
    if (this.deleting()) {
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete this teacher?'
    );

    if (!confirmed) {
      return;
    }

    this.deleting.set(true);
    this.deletingId.set(id);
    this.errorMessage.set('');

    this.teacherService.delete(id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.deletingId.set(null);
        this.loadData();
      },

      error: error => {
        console.error('Error deleting teacher:', error);

        this.errorMessage.set(
          error.error?.message ||
          'Unable to delete teacher.'
        );

        this.deleting.set(false);
        this.deletingId.set(null);
      }
    });
  }
}
