import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { StudentService } from '../../students/services/student.service';
import { TeacherService } from '../../teachers/services/teacher.service';
import { SubjectService } from '../../subjects/services/subject.service';
import { ClassroomService } from '../../classrooms/services/classroom.service';
import { AcademicYearService } from '../../academic-years/services/academic-year.service';
import { AttendanceService } from '../../attendances/services/attendance.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard implements OnInit {

  loading = false;
  errorMessage = '';

  studentCount = 0;
  teacherCount = 0;
  subjectCount = 0;
  classroomCount = 0;

  activeAcademicYear = '-';

  presentPercentage = 0;
  latePercentage = 0;
  absentPercentage = 0;

  private pendingRequests = 0;

  constructor(
    private studentService: StudentService,
    private teacherService: TeacherService,
    private subjectService: SubjectService,
    private classroomService: ClassroomService,
    private academicYearService: AcademicYearService,
    private attendanceService: AttendanceService
  ) { }

  ngOnInit(): void {
    this.loadDashboard();
  }

  refreshDashboard(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {

    this.errorMessage = '';
    this.pendingRequests = 0;

    this.loadStudents();
    this.loadTeachers();
    this.loadSubjects();
    this.loadClassrooms();
    this.loadAcademicYears();
    this.loadAttendances();
  }

  private startRequest(): void {
    this.pendingRequests++;
    this.loading = true;
  }

  private finishRequest(): void {

    this.pendingRequests--;

    if (this.pendingRequests <= 0) {
      this.pendingRequests = 0;
      this.loading = false;
    }
  }

  private handleError(
    label: string,
    error: unknown
  ): void {

    console.error(
      `${label} dashboard error:`,
      error
    );

    this.errorMessage =
      'Some dashboard data could not be loaded.';
  }

  private loadStudents(): void {

    this.startRequest();

    this.studentService
      .getAll()
      .pipe(
        finalize(() =>
          this.finishRequest()
        )
      )
      .subscribe({
        next: students => {
          this.studentCount =
            students.length;
        },
        error: error =>
          this.handleError(
            'Students',
            error
          )
      });
  }

  private loadTeachers(): void {

    this.startRequest();

    this.teacherService
      .getAll()
      .pipe(
        finalize(() =>
          this.finishRequest()
        )
      )
      .subscribe({
        next: teachers => {
          this.teacherCount =
            teachers.length;
        },
        error: error =>
          this.handleError(
            'Teachers',
            error
          )
      });
  }

  private loadSubjects(): void {

    this.startRequest();

    this.subjectService
      .getAll()
      .pipe(
        finalize(() =>
          this.finishRequest()
        )
      )
      .subscribe({
        next: subjects => {
          this.subjectCount =
            subjects.length;
        },
        error: error =>
          this.handleError(
            'Subjects',
            error
          )
      });
  }

  private loadClassrooms(): void {

    this.startRequest();

    this.classroomService
      .getAll()
      .pipe(
        finalize(() =>
          this.finishRequest()
        )
      )
      .subscribe({
        next: classrooms => {
          this.classroomCount =
            classrooms.length;
        },
        error: error =>
          this.handleError(
            'Classrooms',
            error
          )
      });
  }

  private loadAcademicYears(): void {

    this.startRequest();

    this.academicYearService
      .getAll()
      .pipe(
        finalize(() =>
          this.finishRequest()
        )
      )
      .subscribe({
        next: academicYears => {

          const activeYear =
            academicYears.find(
              year => year.active
            );

          this.activeAcademicYear =
            activeYear?.name ?? '-';
        },
        error: error =>
          this.handleError(
            'Academic years',
            error
          )
      });
  }

  private loadAttendances(): void {

    this.startRequest();

    this.attendanceService
      .getAll()
      .pipe(
        finalize(() =>
          this.finishRequest()
        )
      )
      .subscribe({
        next: attendances => {
          this.calculateAttendance(
            attendances
          );
        },
        error: error =>
          this.handleError(
            'Attendances',
            error
          )
      });
  }

  private calculateAttendance(
    attendances: { status: string }[]
  ): void {

    const total = attendances.length;

    if (total === 0) {
      this.presentPercentage = 0;
      this.latePercentage = 0;
      this.absentPercentage = 0;
      return;
    }

    const present =
      attendances.filter(
        a => a.status === 'PRESENT'
      ).length;

    const late =
      attendances.filter(
        a => a.status === 'LATE'
      ).length;

    const absent =
      attendances.filter(
        a => a.status === 'ABSENT'
      ).length;

    this.presentPercentage =
      Math.round(
        present / total * 100
      );

    this.latePercentage =
      Math.round(
        late / total * 100
      );

    this.absentPercentage =
      Math.round(
        absent / total * 100
      );
  }

  getDonutStyle(): string {

    const presentEnd =
      this.presentPercentage;

    const lateEnd =
      presentEnd +
      this.latePercentage;

    return `
      conic-gradient(
        #39c486 0% ${presentEnd}%,
        #f5af31 ${presentEnd}% ${lateEnd}%,
        #f46859 ${lateEnd}% 100%
      )
    `;
  }
}