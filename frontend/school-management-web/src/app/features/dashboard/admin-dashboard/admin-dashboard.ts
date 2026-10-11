import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  forkJoin
} from 'rxjs';

import {
  StudentService
} from '../../students/services/student.service';

import {
  TeacherService
} from '../../teachers/services/teacher.service';

import {
  SubjectService
} from '../../subjects/services/subject.service';

import {
  ClassroomService
} from '../../classrooms/services/classroom.service';

import {
  AcademicYearService
} from '../../academic-years/services/academic-year.service';

import {
  AttendanceService
} from '../../attendances/services/attendance.service';


@Component({
  selector: 'app-admin-dashboard',

  standalone: true,

  imports: [
    RouterLink
  ],

  templateUrl: './admin-dashboard.html',

  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard implements OnInit {

  /* ========================================
     STATE
  ======================================== */

  loading = true;

  errorMessage = '';


  /* ========================================
     STATISTICS
  ======================================== */

  studentCount = 0;

  teacherCount = 0;

  subjectCount = 0;

  classroomCount = 0;

  activeAcademicYear = '-';


  /* ========================================
     ATTENDANCE
  ======================================== */

  presentPercentage = 0;

  latePercentage = 0;

  absentPercentage = 0;


  constructor(
    private studentService:
      StudentService,

    private teacherService:
      TeacherService,

    private subjectService:
      SubjectService,

    private classroomService:
      ClassroomService,

    private academicYearService:
      AcademicYearService,

    private attendanceService:
      AttendanceService,

    private cdr:
      ChangeDetectorRef
  ) { }


  /* ========================================
     INIT
  ======================================== */

  ngOnInit(): void {

    this.loadDashboard();
  }


  /* ========================================
     LOAD DASHBOARD
  ======================================== */

  loadDashboard(): void {

    this.loading = true;

    this.errorMessage = '';

    forkJoin({

      students:
        this.studentService
          .getAll(),

      teachers:
        this.teacherService
          .getAll(),

      subjects:
        this.subjectService
          .getAll(),

      classrooms:
        this.classroomService
          .getAll(),

      academicYears:
        this.academicYearService
          .getAll(),

      attendances:
        this.attendanceService
          .getAll()

    })
      .subscribe({

        next: result => {

          /* ================================
             COUNTS
          ================================ */

          this.studentCount =
            result.students.length;

          this.teacherCount =
            result.teachers.length;

          this.subjectCount =
            result.subjects.length;

          this.classroomCount =
            result.classrooms.length;


          /* ================================
             ACTIVE ACADEMIC YEAR
          ================================ */

          const activeYear =
            result.academicYears.find(
              year => year.active
            );

          this.activeAcademicYear =
            activeYear?.name ?? '-';


          /* ================================
             ATTENDANCE
          ================================ */

          this.calculateAttendance(
            result.attendances
          );


          /* ================================
             FINISH
          ================================ */

          this.loading = false;

          this.cdr.detectChanges();
        },


        error: error => {

          console.error(
            'Error loading admin dashboard:',
            error
          );

          this.errorMessage =
            'Some dashboard data could not be loaded.';

          this.loading = false;

          this.cdr.detectChanges();
        }

      });
  }


  /* ========================================
     ATTENDANCE CALCULATION
  ======================================== */

  private calculateAttendance(
    attendances: {
      status: string;
    }[]
  ): void {

    const total =
      attendances.length;


    if (total === 0) {

      this.presentPercentage = 0;

      this.latePercentage = 0;

      this.absentPercentage = 0;

      return;
    }


    const present =
      attendances.filter(
        attendance =>
          attendance.status ===
          'PRESENT'
      ).length;


    const late =
      attendances.filter(
        attendance =>
          attendance.status ===
          'LATE'
      ).length;


    const absent =
      attendances.filter(
        attendance =>
          attendance.status ===
          'ABSENT'
      ).length;


    this.presentPercentage =
      Math.round(
        (
          present /
          total
        ) * 100
      );


    this.latePercentage =
      Math.round(
        (
          late /
          total
        ) * 100
      );


    this.absentPercentage =
      Math.round(
        (
          absent /
          total
        ) * 100
      );
  }


  /* ========================================
     ATTENDANCE DONUT
  ======================================== */

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