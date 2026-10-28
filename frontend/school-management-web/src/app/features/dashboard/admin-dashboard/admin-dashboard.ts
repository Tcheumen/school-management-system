
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { StudentService } from '../../students/services/student.service';
import { TeacherService } from '../../teachers/services/teacher.service';
import { SubjectService } from '../../subjects/services/subject.service';
import { ClassroomService } from '../../classrooms/services/classroom.service';
import { AcademicYearService } from '../../academic-years/services/academic-year.service';
import { AttendanceService } from '../../attendances/services/attendance.service';
import { EnrollmentService } from '../../enrollments/services/enrollment.service';
import { GradeService } from '../../grades/services/grade.service';

import { AcademicYear } from '../../academic-years/models/academic-year.model';
import { Classroom } from '../../classrooms/models/classroom.model';
import { Enrollment } from '../../enrollments/models/enrollment.model';
import { Attendance } from '../../attendances/models/attendance.model';
import { Grade } from '../../grades/models/grade.model';

interface ClassroomOverview {
  id: number;
  name: string;
  level: string;
  studentCount: number;
  percentage: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard implements OnInit {

  // ======================================
  // STATE
  // ======================================

  loading = true;
  errorMessage = '';

  academicYears: AcademicYear[] = [];
  classrooms: Classroom[] = [];
  enrollments: Enrollment[] = [];
  attendances: Attendance[] = [];
  grades: Grade[] = [];

  selectedYearId: number | null = null;

  // ======================================
  // SCHOOL STATISTICS
  // ======================================

  studentCount = 0;
  teacherCount = 0;
  subjectCount = 0;
  classroomCount = 0;

  activeAcademicYear = '-';

  enrollmentCount = 0;
  enrolledStudentCount = 0;

  // ======================================
  // ACADEMIC PERFORMANCE
  // ======================================

  averageGrade: number | null = null;

  // ======================================
  // ATTENDANCE
  // ======================================

  presentPercentage = 0;
  latePercentage = 0;
  absentPercentage = 0;

  presentCount = 0;
  lateCount = 0;
  absentCount = 0;

  totalAttendanceRecords = 0;

  // ======================================
  // CLASSROOM OVERVIEW
  // ======================================

  classroomOverview: ClassroomOverview[] = [];

  // ======================================
  // RECENT ATTENDANCE RECORDS
  // ======================================

  recentAttendances: Attendance[] = [];

  constructor(
    private studentService: StudentService,
    private teacherService: TeacherService,
    private subjectService: SubjectService,
    private classroomService: ClassroomService,
    private academicYearService: AcademicYearService,
    private attendanceService: AttendanceService,
    private enrollmentService: EnrollmentService,
    private gradeService: GradeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  // ======================================
  // LOAD DASHBOARD
  // ======================================

  loadDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    forkJoin({
      students: this.studentService.getAll(),
      teachers: this.teacherService.getAll(),
      subjects: this.subjectService.getAll(),
      classrooms: this.classroomService.getAll(),
      academicYears: this.academicYearService.getAll(),
      enrollments: this.enrollmentService.getAll(),
      attendances: this.attendanceService.getAll(),
      grades: this.gradeService.getAll()
    }).subscribe({
      next: result => {

        // Global school counts
        this.studentCount = result.students.length;
        this.teacherCount = result.teachers.length;
        this.subjectCount = result.subjects.length;

        // Store reference data
        this.classrooms = result.classrooms;
        this.academicYears = result.academicYears;
        this.enrollments = result.enrollments;
        this.attendances = result.attendances;
        this.grades = result.grades;

        const activeYear = result.academicYears.find(
          year => year.active
        );

        this.activeAcademicYear =
          activeYear?.name ?? '-';

        // Preserve a valid selection after refresh.
        const selectedYearStillExists =
          result.academicYears.some(
            year => year.id === this.selectedYearId
          );

        if (!selectedYearStillExists) {
          const latestYear = [...result.academicYears]
            .sort((a, b) =>
              b.startDate.localeCompare(a.startDate)
            )[0];

          this.selectedYearId =
            activeYear?.id ?? latestYear?.id ?? null;
        }

        this.updateYearStatistics();

        this.loading = false;
        this.cdr.detectChanges();
      },

      error: error => {
        console.error(
          'Error loading admin dashboard:',
          error
        );

        this.errorMessage =
          'Unable to load dashboard data. Please try again.';

        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ======================================
  // YEAR FILTER
  // ======================================

  get sortedAcademicYears(): AcademicYear[] {
    return [...this.academicYears].sort(
      (a, b) => b.startDate.localeCompare(a.startDate)
    );
  }

  get selectedAcademicYearName(): string {
    return this.academicYears.find(
      year => year.id === this.selectedYearId
    )?.name ?? 'No academic year';
  }

  onYearChange(yearId: number | null): void {
    this.selectedYearId = yearId;
    this.updateYearStatistics();
    this.cdr.detectChanges();
  }

  // ======================================
  // RECALCULATE YEAR STATISTICS
  // ======================================

  private updateYearStatistics(): void {
    const yearId = this.selectedYearId;

    if (yearId === null) {
      this.classroomCount = 0;
      this.enrollmentCount = 0;
      this.enrolledStudentCount = 0;
      this.averageGrade = null;
      this.classroomOverview = [];
      this.recentAttendances = [];
      this.calculateAttendance([]);
      return;
    }

    const yearClassrooms = this.classrooms.filter(
      classroom => classroom.academicYearId === yearId
    );

    const yearEnrollments = this.enrollments.filter(
      enrollment => enrollment.academicYearId === yearId
    );

    const yearAttendances = this.attendances.filter(
      attendance => attendance.academicYearId === yearId
    );

    const yearGrades = this.grades.filter(
      grade => grade.academicYearId === yearId
    );

    // Classrooms
    this.classroomCount = yearClassrooms.length;

    // Enrollments
    this.enrollmentCount = yearEnrollments.length;

    this.enrolledStudentCount = new Set(
      yearEnrollments.map(
        enrollment => enrollment.studentId
      )
    ).size;

    // Average of recorded grades.
    // This is not a weighted school report average.
    this.averageGrade = yearGrades.length > 0
      ? yearGrades.reduce(
          (sum, grade) => sum + grade.value,
          0
        ) / yearGrades.length
      : null;

    // Attendance
    this.calculateAttendance(yearAttendances);

    // Enrollment distribution
    this.calculateClassroomOverview(
      yearClassrooms,
      yearEnrollments
    );

    // Actual records, sorted by attendance date.
    this.recentAttendances = [...yearAttendances]
      .sort((a, b) => {
        const dateDiff =
          b.attendanceDate.localeCompare(a.attendanceDate);

        return dateDiff !== 0
          ? dateDiff
          : b.id - a.id;
      })
      .slice(0, 4);
  }

  // ======================================
  // CLASSROOM ENROLLMENTS
  // ======================================

  private calculateClassroomOverview(
    classrooms: Classroom[],
    enrollments: Enrollment[]
  ): void {

    const rows = classrooms.map(classroom => {
      const students = new Set(
        enrollments
          .filter(
            enrollment =>
              enrollment.classroomId === classroom.id
          )
          .map(
            enrollment => enrollment.studentId
          )
      );

      return {
        id: classroom.id,
        name: classroom.name,
        level: classroom.level,
        studentCount: students.size,
        percentage: 0
      };
    });

    const maxCount = Math.max(
      1,
      ...rows.map(row => row.studentCount)
    );

    this.classroomOverview = rows
      .map(row => ({
        ...row,
        percentage:
          (row.studentCount / maxCount) * 100
      }))
      .sort((a, b) =>
        b.studentCount - a.studentCount ||
        a.name.localeCompare(b.name)
      );
  }

  // ======================================
  // ATTENDANCE
  // ======================================

  private calculateAttendance(
    attendances: Attendance[]
  ): void {

    const total = attendances.length;

    this.totalAttendanceRecords = total;

    this.presentCount = attendances.filter(
      attendance => attendance.status === 'PRESENT'
    ).length;

    this.lateCount = attendances.filter(
      attendance => attendance.status === 'LATE'
    ).length;

    this.absentCount = attendances.filter(
      attendance => attendance.status === 'ABSENT'
    ).length;

    if (total === 0) {
      this.presentPercentage = 0;
      this.latePercentage = 0;
      this.absentPercentage = 0;
      return;
    }

    this.presentPercentage =
      Math.round(this.presentCount * 100 / total);

    this.latePercentage =
      Math.round(this.lateCount * 100 / total);

    this.absentPercentage =
      Math.round(this.absentCount * 100 / total);
  }

  // ======================================
  // DONUT
  // ======================================

  getDonutStyle(): string {
    if (this.totalAttendanceRecords === 0) {
      return '#edf0f5';
    }

    // Use raw ratios to prevent rounding gaps
    // or totals above 100% in the donut.
    const presentEnd =
      this.presentCount * 100 / this.totalAttendanceRecords;

    const lateEnd =
      (this.presentCount + this.lateCount) *
      100 / this.totalAttendanceRecords;

    return `conic-gradient(
      #39c486 0% ${presentEnd}%,
      #f5af31 ${presentEnd}% ${lateEnd}%,
      #f46859 ${lateEnd}% 100%
    )`;
  }

  // ======================================
  // DISPLAY HELPERS
  // ======================================

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      PRESENT: 'Present',
      LATE: 'Late',
      ABSENT: 'Absent'
    };

    return labels[status] ?? status;
  }

  formatAverage(): string {
    return this.averageGrade === null
      ? '—'
      : this.averageGrade.toFixed(2);
  }
}
