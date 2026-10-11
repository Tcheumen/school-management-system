import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  forkJoin
} from 'rxjs';

import {
  AuthService
} from '../../../../core/services/auth.service';

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


@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.scss'
})
export class MyProfile implements OnInit {

  loading = true;

  errorMessage = '';

  fullName = '';

  email = '';

  role = '';

  enrollment: Enrollment | null = null;

  teacherAssignments: TeacherAssignment[] = [];


  constructor(
    private authService: AuthService,
    private enrollmentService: EnrollmentService,
    private teacherAssignmentService: TeacherAssignmentService,
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit(): void {

    this.loadProfile();
  }


  loadProfile(): void {

    this.loading = true;

    this.errorMessage = '';

    const role =
      this.authService.getRole();


    if (role === 'STUDENT') {

      this.loadStudentProfile();

      return;
    }

    if (role === 'TEACHER') {

      this.loadTeacherProfile();

      return;
    }

    this.loadBasicProfile();
  }


  /* ========================================
     BASIC PROFILE
  ======================================== */

  private loadBasicProfile(): void {

    this.authService
      .getCurrentUser()
      .subscribe({

        next: user => {

          this.fullName =
            user.fullName;

          this.email =
            user.email;

          this.role =
            user.role;

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: error => {

          console.error(
            'Error loading profile:',
            error
          );

          this.errorMessage =
            'Unable to load your profile.';

          this.loading = false;

          this.cdr.detectChanges();
        }

      });
  }


  /* ========================================
     STUDENT PROFILE
  ======================================== */

  private loadStudentProfile(): void {

    console.log('🔥 START STUDENT PROFILE');

    console.log(
      'TOKEN:',
      this.authService.getToken()
    );

    console.log(
      'ROLE:',
      this.authService.getRole()
    );


    this.authService
      .getCurrentUser()
      .subscribe({

        next: user => {

          console.log(
            '✅ AUTH /ME:',
            user
          );
        },

        error: error => {

          console.error(
            '❌ AUTH /ME ERROR:',
            error
          );
        }

      });


    this.enrollmentService
      .getMineForStudent()
      .subscribe({

        next: enrollment => {

          console.log(
            '✅ STUDENT ENROLLMENT:',
            enrollment
          );
        },

        error: error => {

          console.error(
            '❌ STUDENT ENROLLMENT ERROR:',
            error
          );
        }

      });


    forkJoin({

      user:
        this.authService
          .getCurrentUser(),

      enrollment:
        this.enrollmentService
          .getMineForStudent()

    }).subscribe({

      next: result => {

        console.log(
          '✅ COMPLETE PROFILE:',
          result
        );

        this.fullName =
          result.user.fullName;

        this.email =
          result.user.email;

        this.role =
          result.user.role;

        this.enrollment =
          result.enrollment;

        this.loading = false;

        this.cdr.detectChanges();
      },

      error: error => {

        console.error(
          '❌ COMPLETE PROFILE ERROR:',
          error
        );

        this.errorMessage =
          'Unable to load your profile.';

        this.loading = false;

        this.cdr.detectChanges();
      }

    });
  }


  /* ========================================
    TEACHERS PROFILE
 ======================================== */
  
  private loadTeacherProfile(): void {

    forkJoin({

      user:
        this.authService
          .getCurrentUser(),

      assignments:
        this.teacherAssignmentService
          .getMine()

    }).subscribe({

      next: result => {

        this.fullName =
          result.user.fullName;

        this.email =
          result.user.email;

        this.role =
          result.user.role;

        this.teacherAssignments =
          result.assignments;

        this.loading = false;

        this.cdr.detectChanges();
      },

      error: error => {

        console.error(
          'Error loading teacher profile:',
          error
        );

        this.errorMessage =
          'Unable to load your profile.';

        this.loading = false;

        this.cdr.detectChanges();
      }

    });
  }
  

  /* ========================================
     INITIALS
  ======================================== */

  get initials(): string {

    if (!this.fullName) {
      return 'U';
    }

    const names =
      this.fullName
        .trim()
        .split(/\s+/);


    if (names.length === 1) {

      return names[0]
        .charAt(0)
        .toUpperCase();
    }


    return (
      names[0].charAt(0) +
      names[names.length - 1].charAt(0)
    ).toUpperCase();
  }

  get teacherId(): number | null {

    if (
      this.teacherAssignments.length === 0
    ) {
      return null;
    }

    return this.teacherAssignments[0]
      .teacherId;
  }


  get teacherSubjects(): string[] {

    return [
      ...new Set(
        this.teacherAssignments
          .map(
            assignment =>
              assignment.subjectName
          )
      )
    ];
  }


  get teacherClassrooms(): string[] {

    return [
      ...new Set(
        this.teacherAssignments
          .map(
            assignment =>
              assignment.classroomName
          )
      )
    ];
  }


  get teacherAcademicYears(): string[] {

    return [
      ...new Set(
        this.teacherAssignments
          .map(
            assignment =>
              assignment.academicYearName
          )
      )
    ];
  }


  get totalTeacherAssignments(): number {

    return this.teacherAssignments.length;
  }


  /* ========================================
     ROLE
  ======================================== */

  get roleLabel(): string {

    if (!this.role) {
      return '';
    }

    return (
      this.role.charAt(0) +
      this.role
        .slice(1)
        .toLowerCase()
    );
  }


  get roleDescription(): string {

    switch (this.role) {

      case 'ADMIN':
        return 'School administrator account';

      case 'TEACHER':
        return 'Teacher account';

      case 'STUDENT':
        return 'Student account';

      default:
        return 'School Management System account';
    }
  }

}