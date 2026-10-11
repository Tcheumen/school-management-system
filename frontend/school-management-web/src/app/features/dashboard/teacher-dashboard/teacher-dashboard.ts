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
  TeacherAssignment
} from '../../teacher-assignments/models/teacher-assignment.model';

import {
  TeacherAssignmentService
} from '../../teacher-assignments/services/teacher-assignment.service';

import {
  ClassSchedule
} from '../../schedules/models/class-schedule.model';

import {
  ClassScheduleService
} from '../../schedules/services/class-schedule.service';

import {
  Enrollment
} from '../../enrollments/models/enrollment.model';

import {
  EnrollmentService
} from '../../enrollments/services/enrollment.service';

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
  selector: 'app-teacher-dashboard',

  standalone: true,

  imports: [
    RouterLink
  ],

  templateUrl: './teacher-dashboard.html',

  styleUrl: './teacher-dashboard.scss'
})
export class TeacherDashboard implements OnInit {

  /* ========================================
     DATA
  ======================================== */

  assignments: TeacherAssignment[] = [];

  schedules: ClassSchedule[] = [];

  enrollments: Enrollment[] = [];

  attendances: Attendance[] = [];

  grades: Grade[] = [];


  /* ========================================
     STATE
  ======================================== */

  loading = false;

  errorMessage = '';

  showUploadMessage = false;

  private pendingRequests = 0;


  /* ========================================
     CURRENT TEACHER
  ======================================== */

  teacherName = '';


  constructor(
    private teacherAssignmentService:
      TeacherAssignmentService,

    private classScheduleService:
      ClassScheduleService,

    private enrollmentService:
      EnrollmentService,

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

    this.loadCurrentUser();

    this.loadDashboard();
  }


  /* ========================================
     CURRENT USER

     Seulement nécessaire ici pour afficher :
     "Welcome Back, Daniela"

     Le profil complet est géré par TeacherLayout.
  ======================================== */


  private loadCurrentUser(): void {

    console.log(
      '🔥 Loading current teacher...'
    );

    this.authService
      .getCurrentUser()
      .subscribe({

        next: user => {

          console.log(
            '✅ CURRENT TEACHER:',
            user
          );

          this.teacherName =
            user.fullName;

          this.cdr.detectChanges();
        },

        error: error => {

          console.error(
            '❌ CURRENT TEACHER ERROR:',
            error
          );

          this.teacherName =
            'Teacher';

          this.cdr.detectChanges();
        }

      });
  }

  /* ========================================
     LOAD DASHBOARD
  ======================================== */

  loadDashboard(): void {

    this.loading = true;
    this.errorMessage = '';

    forkJoin({

      assignments:
        this.teacherAssignmentService
          .getMine(),

      schedules:
        this.classScheduleService
          .getMineForTeacher(),

      enrollments:
        this.enrollmentService
          .getMineForTeacher(),

      attendances:
        this.attendanceService
          .getMineForTeacher(),

      grades:
        this.gradeService
          .getMineForTeacher()

    })
      .subscribe({

        next: result => {

          this.assignments =
            [...result.assignments];

          this.schedules =
            [...result.schedules].sort(
              (a, b) =>
                a.startTime.localeCompare(
                  b.startTime
                )
            );

          this.enrollments =
            [...result.enrollments];

          this.attendances =
            [...result.attendances];

          this.grades =
            [...result.grades];

          this.loading = false;

          console.log(
            '✅ TEACHER DASHBOARD:',
            {
              assignments:
                this.assignments,

              schedules:
                this.schedules,

              enrollments:
                this.enrollments,

              attendances:
                this.attendances,

              grades:
                this.grades,

              loading:
                this.loading
            }
          );

          /*
           * Important dans ton application :
           * force la mise à jour du template.
           */
          this.cdr.detectChanges();
        },

        error: error => {

          console.error(
            '❌ Error loading teacher dashboard:',
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
     REQUEST STATE
  ======================================== */

  private requestFinished(): void {

    this.pendingRequests--;

    if (this.pendingRequests <= 0) {

      this.pendingRequests = 0;

      this.loading = false;
    }
  }


  private handleError(
    source: string,
    error: unknown
  ): void {

    console.error(
      `Error loading teacher ${source}:`,
      error
    );

    this.errorMessage =
      'Some dashboard data could not be loaded.';

    this.requestFinished();
  }


  /* ========================================
     STATISTICS
  ======================================== */

  get totalClasses(): number {

    const classroomIds =
      this.assignments.map(
        assignment =>
          assignment.classroomId
      );

    return new Set(
      classroomIds
    ).size;
  }


  get totalStudents(): number {

    const studentIds =
      this.enrollments.map(
        enrollment =>
          enrollment.studentId
      );

    return new Set(
      studentIds
    ).size;
  }


  get totalAssignments(): number {

    return this.assignments.length;
  }


  get totalAttendances(): number {

    return this.attendances.length;
  }


  /* ========================================
     RECENT GRADES
  ======================================== */

  get recentGrades(): Grade[] {

    return this.grades
      .slice()
      .reverse()
      .slice(0, 4);
  }


  /* ========================================
     UPCOMING CLASSES
  ======================================== */

  get upcomingClasses(): ClassSchedule[] {

    return this.schedules
      .slice(0, 4);
  }


  /* ========================================
     TEACHER NAME
  ======================================== */

  get teacherFirstName(): string {

    if (!this.teacherName) {

      return 'Teacher';
    }

    return this.teacherName
      .trim()
      .split(/\s+/)[0];
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


  /* ========================================
     UPLOAD MATERIAL
     Backend plus tard
  ======================================== */

  uploadMaterial(): void {

    this.showUploadMessage = true;
  }


  closeUploadMessage(): void {

    this.showUploadMessage = false;
  }

}