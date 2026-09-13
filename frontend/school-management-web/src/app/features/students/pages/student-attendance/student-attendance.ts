import {
  Component,
  signal
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  Attendance
} from '../../../attendances/models/attendance.model';

import {
  AttendanceService
} from '../../../attendances/services/attendance.service';

@Component({
  selector: 'app-student-attendance',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './student-attendance.html',
  styleUrl: './student-attendance.scss'
})
export class StudentAttendance {

  attendances =
    signal<Attendance[]>([]);

  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private attendanceService:
      AttendanceService
  ) {
    this.loadAttendances();
  }

  loadAttendances(): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.attendanceService
      .getMineForStudent()
      .subscribe({

        next: (attendances) => {

          this.attendances.set(
            attendances
          );

          this.loading.set(false);
        },

        error: (error) => {

          console.error(
            'Error loading student attendance:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to load your attendance'
          );

          this.loading.set(false);
        }
      });
  }

  formatStatus(
    status: string
  ): string {

    switch (status) {

      case 'PRESENT':
        return 'Present';

      case 'ABSENT':
        return 'Absent';

      case 'LATE':
        return 'Late';

      default:
        return status;
    }
  }

  getStatusClass(
    status: string
  ): string {

    switch (status) {

      case 'PRESENT':
        return 'status-present';

      case 'ABSENT':
        return 'status-absent';

      case 'LATE':
        return 'status-late';

      default:
        return '';
    }
  }
}