import {
  Component,
  signal
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  ClassSchedule
} from '../../../schedules/models/class-schedule.model';

import {
  ClassScheduleService
} from '../../../schedules/services/class-schedule.service';

@Component({
  selector: 'app-student-schedule',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './student-schedule.html',
  styleUrl: './student-schedule.scss'
})
export class StudentSchedule {

  schedules =
    signal<ClassSchedule[]>([]);

  loading = signal(false);
  errorMessage = signal('');

  readonly days = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY'
  ];

  constructor(
    private classScheduleService:
      ClassScheduleService
  ) {
    this.loadSchedule();
  }

  loadSchedule(): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.classScheduleService
      .getMineForStudent()
      .subscribe({

        next: (schedules) => {

          this.schedules.set(schedules);

          this.loading.set(false);
        },

        error: (error) => {

          console.error(
            'Error loading student schedule:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to load your schedule'
          );

          this.loading.set(false);
        }
      });
  }

  getSchedulesForDay(
    day: string
  ): ClassSchedule[] {

    return this.schedules()
      .filter(
        schedule =>
          schedule.dayOfWeek === day
      )
      .sort(
        (a, b) =>
          a.startTime.localeCompare(
            b.startTime
          )
      );
  }

  formatDay(
    day: string
  ): string {

    switch (day) {
      case 'MONDAY':
        return 'Monday';

      case 'TUESDAY':
        return 'Tuesday';

      case 'WEDNESDAY':
        return 'Wednesday';

      case 'THURSDAY':
        return 'Thursday';

      case 'FRIDAY':
        return 'Friday';

      case 'SATURDAY':
        return 'Saturday';

      case 'SUNDAY':
        return 'Sunday';

      default:
        return day;
    }
  }

  formatTime(
    time: string
  ): string {

    if (!time) {
      return '';
    }

    return time.substring(0, 5);
  }
}