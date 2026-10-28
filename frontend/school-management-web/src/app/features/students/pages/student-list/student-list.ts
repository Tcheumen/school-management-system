
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
  StudentService
} from '../../services/student.service';

import {
  Student
} from '../../models/student.model';

import {
  AcademicYearService
} from '../../../academic-years/services/academic-year.service';

import {
  AcademicYear
} from '../../../academic-years/models/academic-year.model';

import {
  ClassroomService
} from '../../../classrooms/services/classroom.service';

import {
  Classroom
} from '../../../classrooms/models/classroom.model';

import {
  EnrollmentService
} from '../../../enrollments/services/enrollment.service';

import {
  Enrollment
} from '../../../enrollments/models/enrollment.model';

type ClassroomFilter = number | 'ALL' | 'UNASSIGNED';

interface StudentRow {
  student: Student;
  classroomId: number | null;
  classroomName: string;
  enrolled: boolean;
}

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './student-list.html',
  styleUrl: './student-list.scss'
})
export class StudentList implements OnInit {

  students = signal<Student[]>([]);
  academicYears = signal<AcademicYear[]>([]);
  classrooms = signal<Classroom[]>([]);
  enrollments = signal<Enrollment[]>([]);

  loading = signal(false);
  deleting = signal(false);
  deletingId = signal<number | null>(null);
  errorMessage = signal('');

  selectedYearId = signal<number | null>(null);
  selectedClassroomId: ClassroomFilter = 'ALL';
  searchTerm = '';

  constructor(
    private studentService: StudentService,
    private academicYearService: AcademicYearService,
    private classroomService: ClassroomService,
    private enrollmentService: EnrollmentService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  // LOAD ALL DATA

  loadData(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    forkJoin({
      students: this.studentService.getAll(),
      academicYears: this.academicYearService.getAll(),
      classrooms: this.classroomService.getAll(),
      enrollments: this.enrollmentService.getAll()
    }).subscribe({
      next: data => {
        this.students.set(data.students);
        this.academicYears.set(data.academicYears);
        this.classrooms.set(data.classrooms);
        this.enrollments.set(data.enrollments);

        const currentYearExists = data.academicYears.some(
          year => year.id === this.selectedYearId()
        );

        if (!currentYearExists) {
          const activeYear = data.academicYears.find(
            year => year.active
          );

          const latestYear = [...data.academicYears].sort(
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
        console.error('Error loading student data:', error);

        this.errorMessage.set(
          'Unable to load school data.'
        );

        this.loading.set(false);
      }
    });
  }

  // ACADEMIC YEAR

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

  // CLASSROOMS FOR SELECTED YEAR

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

  // ENROLLMENTS FOR SELECTED YEAR

  readonly yearEnrollments = computed(() => {
    const yearId = this.selectedYearId();

    if (yearId === null) {
      return [];
    }

    return this.enrollments().filter(
      enrollment => enrollment.academicYearId === yearId
    );
  });

  // STUDENT ROWS

  readonly studentRows = computed<StudentRow[]>(() => {
    const students = this.students();
    const yearEnrollments = this.yearEnrollments();

    const rows: StudentRow[] = [];

    const enrollmentByStudent = new Map<number, Enrollment[]>();

    for (const enrollment of yearEnrollments) {
      const existing = enrollmentByStudent.get(
        enrollment.studentId
      ) ?? [];

      existing.push(enrollment);

      enrollmentByStudent.set(
        enrollment.studentId,
        existing
      );
    }

    for (const student of students) {
      const studentEnrollments =
        enrollmentByStudent.get(student.id) ?? [];

      if (studentEnrollments.length === 0) {
        rows.push({
          student,
          classroomId: null,
          classroomName: 'Unassigned',
          enrolled: false
        });

        continue;
      }

      const processedClassrooms = new Set<number>();

      for (const enrollment of studentEnrollments) {
        if (processedClassrooms.has(enrollment.classroomId)) {
          continue;
        }

        processedClassrooms.add(enrollment.classroomId);

        const classroom = this.classrooms().find(
          item => item.id === enrollment.classroomId
        );

        rows.push({
          student,
          classroomId: enrollment.classroomId,
          classroomName:
            classroom?.name ?? enrollment.classroomName,
          enrolled: true
        });
      }
    }

    return rows;
  });

  // STATS

  get enrolledCount(): number {
    return new Set(
      this.yearEnrollments().map(
        enrollment => enrollment.studentId
      )
    ).size;
  }

  get classroomCount(): number {
    return this.availableClassrooms().length;
  }

  get unassignedCount(): number {
    return this.studentRows().filter(
      row => !row.enrolled
    ).length;
  }

  // FILTER STUDENTS

  get filteredRows(): StudentRow[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.studentRows().filter(row => {
      if (
        this.selectedClassroomId === 'ALL' &&
        !row.enrolled
      ) {
        return false;
      }

      if (
        this.selectedClassroomId === 'UNASSIGNED' &&
        row.enrolled
      ) {
        return false;
      }

      if (
        typeof this.selectedClassroomId === 'number' &&
        row.classroomId !== this.selectedClassroomId
      ) {
        return false;
      }

      const fullName = (
        row.student.firstName + ' ' +
        row.student.lastName
      ).toLowerCase();

      const matchesSearch =
        fullName.includes(search) ||
        row.student.email.toLowerCase().includes(search);

      return matchesSearch;
    });
  }

  // CLEAR FILTERS

  clearFilters(): void {
    this.selectedClassroomId = 'ALL';
    this.searchTerm = '';
  }

  // DELETE STUDENT

  deleteStudent(id: number): void {
    if (this.deleting()) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this student?'
    );

    if (!confirmed) return;

    this.deleting.set(true);
    this.deletingId.set(id);
    this.errorMessage.set('');

    this.studentService.delete(id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.deletingId.set(null);
        this.loadData();
      },

      error: error => {
        console.error('Error deleting student:', error);

        this.errorMessage.set(
          error.error?.message ||
          'Unable to delete student.'
        );

        this.deleting.set(false);
        this.deletingId.set(null);
      }
    });
  }
}
