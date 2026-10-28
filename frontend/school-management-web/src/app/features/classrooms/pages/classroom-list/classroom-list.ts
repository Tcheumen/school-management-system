
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
  Classroom
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

import {
  Student
} from '../../../students/models/student.model';

import {
  StudentService
} from '../../../students/services/student.service';

interface ClassroomRow {
  classroom: Classroom;
  studentCount: number;
  teacherCount: number;
  subjectCount: number;
}

@Component({
  selector: 'app-classroom-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './classroom-list.html',
  styleUrl: './classroom-list.scss'
})
export class ClassroomList implements OnInit {

  // DATA
  classrooms = signal<Classroom[]>([]);
  academicYears = signal<AcademicYear[]>([]);
  enrollments = signal<Enrollment[]>([]);
  assignments = signal<TeacherAssignment[]>([]);
  students = signal<Student[]>([]);

  // STATES
  loading = signal(false);
  deleting = signal(false);
  deletingId = signal<number | null>(null);
  errorMessage = signal('');

  // FILTERS
  selectedYearId = signal<number | null>(null);
  searchTerm = '';

  // DETAILS MODAL
  selectedClassroom = signal<Classroom | null>(null);

  constructor(
    private classroomService: ClassroomService,
    private academicYearService: AcademicYearService,
    private enrollmentService: EnrollmentService,
    private teacherAssignmentService: TeacherAssignmentService,
    private studentService: StudentService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  // =====================================
  // LOAD ALL DATA
  // =====================================

  loadData(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    forkJoin({
      classrooms: this.classroomService.getAll(),
      academicYears: this.academicYearService.getAll(),
      enrollments: this.enrollmentService.getAll(),
      assignments: this.teacherAssignmentService.getAll(),
      students: this.studentService.getAll()
    }).subscribe({

      next: data => {
        this.classrooms.set(data.classrooms);
        this.academicYears.set(data.academicYears);
        this.enrollments.set(data.enrollments);
        this.assignments.set(data.assignments);
        this.students.set(data.students);

        const yearExists = data.academicYears.some(
          year => year.id === this.selectedYearId()
        );

        if (!yearExists) {
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

        const selected = this.selectedClassroom();

        if (selected) {
          const updated = data.classrooms.find(
            classroom => classroom.id === selected.id
          );

          this.selectedClassroom.set(updated ?? null);
        }

        this.loading.set(false);
      },

      error: error => {
        console.error(
          'Error loading classroom data:',
          error
        );

        this.errorMessage.set(
          'Unable to load classrooms and related school data.'
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

  onYearChange(yearId: number): void {
    this.selectedYearId.set(yearId);
    this.selectedClassroom.set(null);
  }

  clearFilters(): void {
    this.searchTerm = '';
  }

  // =====================================
  // CLASSROOMS FOR SELECTED YEAR
  // =====================================

  readonly yearClassrooms = computed(() => {
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
  // RELATIONS
  // =====================================

  getClassroomEnrollments(
    classroom: Classroom
  ): Enrollment[] {
    return this.enrollments().filter(
      enrollment =>
        enrollment.classroomId === classroom.id &&
        enrollment.academicYearId === classroom.academicYearId
    );
  }

  getClassroomAssignments(
    classroom: Classroom
  ): TeacherAssignment[] {
    return this.assignments().filter(
      assignment =>
        assignment.classroomId === classroom.id &&
        assignment.academicYearId === classroom.academicYearId
    );
  }

  getStudentCount(classroom: Classroom): number {
    return new Set(
      this.getClassroomEnrollments(classroom).map(
        enrollment => enrollment.studentId
      )
    ).size;
  }

  getTeacherCount(classroom: Classroom): number {
    return new Set(
      this.getClassroomAssignments(classroom).map(
        assignment => assignment.teacherId
      )
    ).size;
  }

  getSubjectCount(classroom: Classroom): number {
    return new Set(
      this.getClassroomAssignments(classroom).map(
        assignment => assignment.subjectId
      )
    ).size;
  }

  // =====================================
  // CLASSROOM ROWS
  // =====================================

  readonly classroomRows = computed<ClassroomRow[]>(() => {
    return this.yearClassrooms().map(classroom => {
      return {
        classroom,
        studentCount: this.getStudentCount(classroom),
        teacherCount: this.getTeacherCount(classroom),
        subjectCount: this.getSubjectCount(classroom)
      };
    });
  });

  // =====================================
  // FILTERED CLASSROOMS
  // =====================================

  get filteredRows(): ClassroomRow[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.classroomRows().filter(row => {
      const classroom = row.classroom;

      return (
        classroom.name.toLowerCase().includes(search) ||
        classroom.level.toLowerCase().includes(search)
      );
    });
  }

  // =====================================
  // STATISTICS
  // =====================================

  get totalClassrooms(): number {
    return this.yearClassrooms().length;
  }

  get totalStudents(): number {
    const classroomIds = new Set(
      this.yearClassrooms().map(classroom => classroom.id)
    );

    return new Set(
      this.enrollments()
        .filter(enrollment =>
          enrollment.academicYearId === this.selectedYearId() &&
          classroomIds.has(enrollment.classroomId)
        )
        .map(enrollment => enrollment.studentId)
    ).size;
  }

  get totalTeachers(): number {
    const classroomIds = new Set(
      this.yearClassrooms().map(classroom => classroom.id)
    );

    return new Set(
      this.assignments()
        .filter(assignment =>
          assignment.academicYearId === this.selectedYearId() &&
          classroomIds.has(assignment.classroomId)
        )
        .map(assignment => assignment.teacherId)
    ).size;
  }

  // =====================================
  // CLASSROOM DETAILS
  // =====================================

  viewClassroom(classroom: Classroom): void {
    this.selectedClassroom.set(classroom);
  }

  closeClassroomDetails(): void {
    this.selectedClassroom.set(null);
  }

  readonly selectedStudents = computed(() => {
    const classroom = this.selectedClassroom();

    if (!classroom) {
      return [];
    }

    const enrollments = this.getClassroomEnrollments(
      classroom
    );

    const studentById = new Map(
      this.students().map(student => [student.id, student])
    );

    const uniqueIds = new Set<number>();

    return enrollments
      .filter(enrollment => {
        if (uniqueIds.has(enrollment.studentId)) {
          return false;
        }

        uniqueIds.add(enrollment.studentId);
        return true;
      })
      .map(enrollment => {
        const student = studentById.get(
          enrollment.studentId
        );

        return {
          id: enrollment.studentId,
          fullName: student
            ? `${student.firstName} ${student.lastName}`
            : enrollment.studentFullName,
          email: student?.email ?? ''
        };
      })
      .sort((a, b) =>
        a.fullName.localeCompare(b.fullName)
      );
  });

  readonly selectedTeachingAssignments = computed(() => {
    const classroom = this.selectedClassroom();

    if (!classroom) {
      return [];
    }

    return this.getClassroomAssignments(classroom)
      .sort((a, b) =>
        a.subjectName.localeCompare(b.subjectName)
      );
  });

  // =====================================
  // DELETE CLASSROOM
  // =====================================

  deleteClassroom(id: number): void {
    if (this.deleting()) {
      return;
    }

    const classroom = this.classrooms().find(
      item => item.id === id
    );

    if (!classroom) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${classroom.name}"?`
    );

    if (!confirmed) {
      return;
    }

    this.deleting.set(true);
    this.deletingId.set(id);
    this.errorMessage.set('');

    this.classroomService.delete(id).subscribe({

      next: () => {
        this.deleting.set(false);
        this.deletingId.set(null);
        this.selectedClassroom.set(null);
        this.loadData();
      },

      error: error => {
        console.error(
          'Error deleting classroom:',
          error
        );

        const backendMessage =
          typeof error.error === 'string'
            ? error.error
            : error.error?.message;

        this.errorMessage.set(
          backendMessage ||
          'Unable to delete classroom. It may have enrollments or teaching assignments.'
        );

        this.deleting.set(false);
        this.deletingId.set(null);
      }

    });
  }
}
