import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  ClassSchedule
} from '../../models/class-schedule.model';

import {
  ClassScheduleService
} from '../../services/class-schedule.service';

@Component({
  selector: 'app-schedule-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './schedule-list.html',
  styleUrl: './schedule-list.scss'
})
export class ScheduleList implements OnInit {

  schedules = signal<ClassSchedule[]>([]);

  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private classScheduleService:
      ClassScheduleService
  ) { }

  ngOnInit(): void {
    this.loadSchedules();
  }

  loadSchedules(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.classScheduleService
      .getAll()
      .subscribe({

        next: (schedules) => {
          this.schedules.set(
            this.sortSchedules(schedules)
          );

          this.loading.set(false);
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

          this.loading.set(false);
        }
      });
  }

  deleteSchedule(
    id: number
  ): void {

    const confirmed = confirm(
      'Are you sure you want to delete this schedule?'
    );

    if (!confirmed) {
      return;
    }

    this.classScheduleService
      .delete(id)
      .subscribe({

        next: () => {
          this.loadSchedules();
        },

        error: (error) => {
          console.error(
            'Error deleting schedule:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to delete schedule'
          );
        }
      });
  }

  private sortSchedules(
    schedules: ClassSchedule[]
  ): ClassSchedule[] {

    const dayOrder: Record<string, number> = {
      MONDAY: 1,
      TUESDAY: 2,
      WEDNESDAY: 3,
      THURSDAY: 4,
      FRIDAY: 5,
      SATURDAY: 6,
      SUNDAY: 7
    };

    return [...schedules].sort(
      (a, b) => {

        const dayDifference =
          (dayOrder[a.dayOfWeek] ?? 99) -
          (dayOrder[b.dayOfWeek] ?? 99);

        if (dayDifference !== 0) {
          return dayDifference;
        }

        return a.startTime.localeCompare(
          b.startTime
        );
      }
    );
  }

  formatDay(
    day: string
  ): string {

    const days: Record<string, string> = {
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

  formatTime(
    time: string
  ): string {

    if (!time) {
      return '';
    }

    return time.substring(0, 5);
  }
}