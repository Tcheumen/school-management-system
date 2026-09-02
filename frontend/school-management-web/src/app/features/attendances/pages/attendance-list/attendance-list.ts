import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  Attendance
} from '../../models/attendance.model';

import {
  AttendanceService
} from '../../services/attendance.service';

@Component({
  selector: 'app-attendance-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './attendance-list.html',
  styleUrl: './attendance-list.scss'
})
export class AttendanceList implements OnInit {

  attendances = signal<Attendance[]>([]);

  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private attendanceService:
      AttendanceService
  ) { }

  ngOnInit(): void {
    this.loadAttendances();
  }

  loadAttendances(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.attendanceService
      .getAll()
      .subscribe({

        next: (attendances) => {
          this.attendances.set(
            this.sortAttendances(attendances)
          );

          this.loading.set(false);
        },

        error: (error) => {
          console.error(
            'Error loading attendances:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to load attendances'
          );

          this.loading.set(false);
        }
      });
  }

  deleteAttendance(
    id: number
  ): void {

    const confirmed = confirm(
      'Are you sure you want to delete this attendance record?'
    );

    if (!confirmed) {
      return;
    }

    this.attendanceService
      .delete(id)
      .subscribe({

        next: () => {
          this.loadAttendances();
        },

        error: (error) => {
          console.error(
            'Error deleting attendance:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to delete attendance'
          );
        }
      });
  }

  getStatusLabel(
    status: string
  ): string {

    const labels: Record<string, string> = {
      PRESENT: 'Present',
      ABSENT: 'Absent',
      LATE: 'Late'
    };

    return labels[status] ?? status;
  }

  formatTime(
    time: string
  ): string {

    if (!time) {
      return '';
    }

    return time.substring(0, 5);
  }

  private sortAttendances(
    attendances: Attendance[]
  ): Attendance[] {

    return [...attendances].sort(
      (a, b) => {

        const dateComparison =
          b.attendanceDate.localeCompare(
            a.attendanceDate
          );

        if (dateComparison !== 0) {
          return dateComparison;
        }

        return a.startTime.localeCompare(
          b.startTime
        );
      }
    );
  }
}