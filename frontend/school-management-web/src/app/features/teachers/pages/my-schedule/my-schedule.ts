import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  ClassSchedule
} from '../../../schedules/models/class-schedule.model';

import {
  ClassScheduleService
} from '../../../schedules/services/class-schedule.service';

@Component({
  selector: 'app-my-schedule',
  standalone: true,
  imports: [],
  templateUrl: './my-schedule.html',
  styleUrl: './my-schedule.scss'
})
export class MySchedule implements OnInit {

  schedules =
    signal<ClassSchedule[]>([]);

  loading = signal(false);

  errorMessage = signal('');

  constructor(
    private classScheduleService:
      ClassScheduleService
  ) { }

  ngOnInit(): void {
    this.loadSchedule();
  }

  loadSchedule(): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.classScheduleService
      .getMineForTeacher()
      .subscribe({

        next: (schedules) => {

          this.schedules.set(
            this.sortSchedules(
              schedules
            )
          );

          this.loading.set(false);
        },

        error: (error) => {

          console.error(
            'Error loading teacher schedule:',
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

  formatDay(
    day: string
  ): string {

    const labels: Record<string, string> = {
      MONDAY: 'Monday',
      TUESDAY: 'Tuesday',
      WEDNESDAY: 'Wednesday',
      THURSDAY: 'Thursday',
      FRIDAY: 'Friday',
      SATURDAY: 'Saturday',
      SUNDAY: 'Sunday'
    };

    return labels[day] ?? day;
  }

  formatTime(
    time: string
  ): string {

    return time?.substring(0, 5) ?? '';
  }

  private sortSchedules(
    schedules: ClassSchedule[]
  ): ClassSchedule[] {

    const dayOrder:
      Record<string, number> = {

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

        const dayComparison =
          dayOrder[a.dayOfWeek] -
          dayOrder[b.dayOfWeek];

        if (dayComparison !== 0) {
          return dayComparison;
        }

        return a.startTime.localeCompare(
          b.startTime
        );
      }
    );
  }
}