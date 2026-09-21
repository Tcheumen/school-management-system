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
  ClassSchedule
} from '../../schedules/models/class-schedule.model';

import {
  ClassScheduleService
} from '../../schedules/services/class-schedule.service';

import {
  Attendance
} from '../../attendances/models/attendance.model';

import {
  AttendanceService
} from '../../attendances/services/attendance.service';

import {
  Grade
} from '../../grades/models/grade.model';

import {
  GradeService
} from '../../grades/services/grade.service';

import {
  AuthService
} from '../../../core/services/auth.service';


@Component({
  selector: 'app-student-dashboard',

  standalone: true,

  imports: [
    RouterLink
  ],

  templateUrl: './student-dashboard.html',

  styleUrl: './student-dashboard.scss'
})
export class StudentDashboard implements OnInit {

  /* ========================================
     DATA
  ======================================== */

  schedules: ClassSchedule[] = [];

  attendances: Attendance[] = [];

  grades: Grade[] = [];


  /* ========================================
     STATE
  ======================================== */

  loading = true;

  errorMessage = '';


  /* ========================================
     CURRENT STUDENT
  ======================================== */

  studentName = '';


  constructor(
    private classScheduleService:
      ClassScheduleService,

    private attendanceService:
      AttendanceService,

    private gradeService:
      GradeService,

    private authService:
      AuthService,
    
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
     LOAD EVERYTHING
  ======================================== */
  loadDashboard(): void {

    this.loading = true;
    this.errorMessage = '';

    forkJoin({

      user:
        this.authService
          .getCurrentUser(),

      schedules:
        this.classScheduleService
          .getMineForStudent(),

      attendances:
        this.attendanceService
          .getMineForStudent(),

      grades:
        this.gradeService
          .getMineForStudent()

    })
      .subscribe({

        next: result => {

          console.log(
            'STUDENT DASHBOARD:',
            result
          );


          /* USER */

          this.studentName =
            result.user.fullName;


          /* SCHEDULE */

          this.schedules =
            [...result.schedules].sort(
              (a, b) =>
                a.startTime.localeCompare(
                  b.startTime
                )
            );


          /* ATTENDANCE */

          this.attendances =
            [...result.attendances];


          /* GRADES */

          this.grades =
            [...result.grades];


          /* LOADING */

          this.loading = false;


          /*
           * Force Angular à mettre immédiatement
           * le template à jour.
           */

          this.cdr.detectChanges();
        },


        error: error => {

          console.error(
            'Error loading student dashboard:',
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
     STUDENT FIRST NAME
  ======================================== */

  get studentFirstName(): string {

    if (!this.studentName) {

      return 'Student';
    }

    return this.studentName
      .trim()
      .split(/\s+/)[0];
  }


  /* ========================================
     SCHEDULE
  ======================================== */

  get totalClasses(): number {

    return this.schedules.length;
  }


  get upcomingClasses(): ClassSchedule[] {

    return this.schedules
      .slice(0, 5);
  }


  /* ========================================
     ATTENDANCE
  ======================================== */

  get attendancePercentage(): number {

    if (this.attendances.length === 0) {

      return 0;
    }

    const present =
      this.attendances.filter(
        attendance =>
          attendance.status === 'PRESENT'
      ).length;

    return Math.round(
      (
        present /
        this.attendances.length
      ) * 100
    );
  }


  get absentPercentage(): number {

    if (this.attendances.length === 0) {

      return 0;
    }

    const absent =
      this.attendances.filter(
        attendance =>
          attendance.status === 'ABSENT'
      ).length;

    return Math.round(
      (
        absent /
        this.attendances.length
      ) * 100
    );
  }


  get latePercentage(): number {

    if (this.attendances.length === 0) {

      return 0;
    }

    const late =
      this.attendances.filter(
        attendance =>
          attendance.status === 'LATE'
      ).length;

    return Math.round(
      (
        late /
        this.attendances.length
      ) * 100
    );
  }


  /* ========================================
     GRADES
  ======================================== */

  get averageGrade(): number {

    if (this.grades.length === 0) {

      return 0;
    }

    const total =
      this.grades.reduce(
        (
          sum,
          grade
        ) =>
          sum +
          Number(grade.value),
        0
      );

    return Number(
      (
        total /
        this.grades.length
      ).toFixed(2)
    );
  }


  get recentGrades(): Grade[] {

    return this.grades
      .slice()
      .reverse()
      .slice(0, 5);
  }


  getGradeClass(
    value: number
  ): string {

    if (value >= 16) {
      return 'excellent';
    }

    if (value >= 12) {
      return 'good';
    }

    if (value >= 10) {
      return 'average';
    }

    return 'low';
  }


  /* ========================================
     FORMAT TIME
  ======================================== */

  formatTime(
    time: string
  ): string {

    if (!time) {
      return '';
    }

    return time.substring(
      0,
      5
    );
  }


  /* ========================================
     FORMAT DAY
  ======================================== */

  formatDay(
    day: string
  ): string {

    const days:
      Record<string, string> = {

      MONDAY: 'Monday',

      TUESDAY: 'Tuesday',

      WEDNESDAY: 'Wednesday',

      THURSDAY: 'Thursday',

      FRIDAY: 'Friday',

      SATURDAY: 'Saturday',

      SUNDAY: 'Sunday'

    };

    return days[day] ?? day;
  }

}