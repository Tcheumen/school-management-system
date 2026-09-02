import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  AttendanceRequest,
  AttendanceStatus
} from '../../models/attendance.model';

import {
  AttendanceService
} from '../../services/attendance.service';

import {
  ClassSchedule
} from '../../../schedules/models/class-schedule.model';

import {
  ClassScheduleService
} from '../../../schedules/services/class-schedule.service';

import {
  Enrollment
} from '../../../enrollments/models/enrollment.model';

import {
  EnrollmentService
} from '../../../enrollments/services/enrollment.service';

@Component({
  selector: 'app-attendance-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './attendance-form.html',
  styleUrl: './attendance-form.scss'
})
export class AttendanceForm implements OnInit {

  classScheduleId: number | null = null;
  enrollmentId: number | null = null;

  attendanceDate = '';

  status: AttendanceStatus = 'PRESENT';

  remarks = '';

  schedules = signal<ClassSchedule[]>([]);
  enrollments = signal<Enrollment[]>([]);

  loading = signal(false);
  loadingData = signal(false);
  errorMessage = signal('');

  isEditMode = false;

  private attendanceId?: number;

  readonly statuses: AttendanceStatus[] = [
    'PRESENT',
    'ABSENT',
    'LATE'
  ];

  constructor(
    private attendanceService: AttendanceService,
    private classScheduleService: ClassScheduleService,
    private enrollmentService: EnrollmentService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (id) {
      this.attendanceId = Number(id);
      this.isEditMode = true;
    }

    this.loadReferenceData();
  }

  loadReferenceData(): void {

    this.loadingData.set(true);
    this.errorMessage.set('');

    let schedulesLoaded = false;
    let enrollmentsLoaded = false;

    const checkComplete = () => {

      if (
        schedulesLoaded &&
        enrollmentsLoaded
      ) {

        if (
          this.isEditMode &&
          this.attendanceId
        ) {
          this.loadAttendance(
            this.attendanceId
          );
        } else {
          this.loadingData.set(false);
        }
      }
    };

    this.classScheduleService
      .getAll()
      .subscribe({

        next: (schedules) => {
          this.schedules.set(schedules);

          schedulesLoaded = true;
          checkComplete();
        },

        error: (error) => {

          console.error(
            'Error loading schedules:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to load schedules'
          );

          schedulesLoaded = true;
          checkComplete();
        }
      });

    this.enrollmentService
      .getAll()
      .subscribe({

        next: (enrollments) => {

          this.enrollments.set(
            enrollments
          );

          enrollmentsLoaded = true;
          checkComplete();
        },

        error: (error) => {

          console.error(
            'Error loading enrollments:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to load enrollments'
          );

          enrollmentsLoaded = true;
          checkComplete();
        }
      });
  }

  loadAttendance(
    id: number
  ): void {

    this.attendanceService
      .getById(id)
      .subscribe({

        next: (attendance) => {

          this.classScheduleId =
            attendance.classScheduleId;

          this.enrollmentId =
            attendance.enrollmentId;

          this.attendanceDate =
            attendance.attendanceDate;

          this.status =
            attendance.status;

          this.remarks =
            attendance.remarks ?? '';

          this.loadingData.set(false);
        },

        error: (error) => {

          console.error(
            'Error loading attendance:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to load attendance'
          );

          this.loadingData.set(false);
        }
      });
  }

  get selectedSchedule():
    ClassSchedule | undefined {

    if (
      this.classScheduleId === null
    ) {
      return undefined;
    }

    return this.schedules().find(
      schedule =>
        schedule.id ===
        this.classScheduleId
    );
  }

  get filteredEnrollments():
    Enrollment[] {

    const schedule =
      this.selectedSchedule;

    if (!schedule) {
      return [];
    }

    return this.enrollments().filter(
      enrollment =>

        enrollment.classroomId ===
        schedule.classroomId &&

        enrollment.academicYearId ===
        schedule.academicYearId
    );
  }

  onScheduleChange(): void {

    if (
      this.enrollmentId === null
    ) {
      return;
    }

    const stillValid =
      this.filteredEnrollments.some(
        enrollment =>
          enrollment.id ===
          this.enrollmentId
      );

    if (!stillValid) {
      this.enrollmentId = null;
    }
  }

  save(): void {

    this.errorMessage.set('');

    if (
      this.classScheduleId === null ||
      this.enrollmentId === null ||
      !this.attendanceDate ||
      !this.status
    ) {

      this.errorMessage.set(
        'Schedule, student, date and status are required'
      );

      return;
    }

    const request: AttendanceRequest = {

      enrollmentId:
        this.enrollmentId,

      classScheduleId:
        this.classScheduleId,

      attendanceDate:
        this.attendanceDate,

      status:
        this.status,

      remarks:
        this.remarks.trim() || undefined
    };

    if (
      this.isEditMode &&
      this.attendanceId
    ) {

      this.updateAttendance(
        request
      );

    } else {

      this.createAttendance(
        request
      );
    }
  }

  createAttendance(
    request: AttendanceRequest
  ): void {

    this.loading.set(true);

    this.attendanceService
      .create(request)
      .subscribe({

        next: () => {

          this.loading.set(false);

          this.router.navigate([
            '/attendances'
          ]);
        },

        error: (error) => {

          console.error(
            'Error creating attendance:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to create attendance'
          );

          this.loading.set(false);
        }
      });
  }

  updateAttendance(
    request: AttendanceRequest
  ): void {

    if (!this.attendanceId) {
      return;
    }

    this.loading.set(true);

    this.attendanceService
      .update(
        this.attendanceId,
        request
      )
      .subscribe({

        next: () => {

          this.loading.set(false);

          this.router.navigate([
            '/attendances'
          ]);
        },

        error: (error) => {

          console.error(
            'Error updating attendance:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to update attendance'
          );

          this.loading.set(false);
        }
      });
  }

  formatSchedule(
    schedule: ClassSchedule
  ): string {

    return (
      `${schedule.dayOfWeek} — ` +
      `${schedule.startTime.substring(0, 5)} - ` +
      `${schedule.endTime.substring(0, 5)} — ` +
      `${schedule.classroomName} — ` +
      `${schedule.subjectName}`
    );
  }

  formatStatus(
    status: AttendanceStatus
  ): string {

    const labels:
      Record<AttendanceStatus, string> = {

      PRESENT: 'Present',
      ABSENT: 'Absent',
      LATE: 'Late'
    };

    return labels[status];
  }

  cancel(): void {
    this.router.navigate([
      '/attendances'
    ]);
  }
}