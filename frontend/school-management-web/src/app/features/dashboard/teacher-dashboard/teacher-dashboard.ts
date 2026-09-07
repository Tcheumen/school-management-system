import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

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
  AuthService
} from '../../../core/services/auth.service';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './teacher-dashboard.html',
  styleUrl: './teacher-dashboard.scss'
})
export class TeacherDashboard implements OnInit {

  assignments =
    signal<TeacherAssignment[]>([]);

  schedules =
    signal<ClassSchedule[]>([]);

  loading = signal(false);

  errorMessage = signal('');

  constructor(
    private teacherAssignmentService:
      TeacherAssignmentService,
    private classScheduleService:
      ClassScheduleService,
    private authService:
      AuthService,
    private router:
      Router
  ) { }

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {

    this.loading.set(true);
    this.errorMessage.set('');

    let assignmentsLoaded = false;
    let schedulesLoaded = false;

    const checkComplete = () => {
      if (
        assignmentsLoaded &&
        schedulesLoaded
      ) {
        this.loading.set(false);
      }
    };

    this.teacherAssignmentService
      .getMine()
      .subscribe({

        next: (assignments) => {

          this.assignments.set(
            assignments
          );

          assignmentsLoaded = true;

          checkComplete();
        },

        error: (error) => {

          console.error(
            'Error loading assignments:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to load teacher assignments'
          );

          assignmentsLoaded = true;

          checkComplete();
        }
      });

    this.classScheduleService
      .getMineForTeacher()
      .subscribe({

        next: (schedules) => {

          this.schedules.set(
            this.sortSchedules(
              schedules
            )
          );

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
            'Unable to load teacher schedule'
          );

          schedulesLoaded = true;

          checkComplete();
        }
      });
  }

  private sortSchedules(
    schedules: ClassSchedule[]
  ): ClassSchedule[] {

    const days: Record<string, number> = {
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
          days[a.dayOfWeek] -
          days[b.dayOfWeek];

        if (dayComparison !== 0) {
          return dayComparison;
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

  logout(): void {

    this.authService.logout();

    this.router.navigate([
      '/login'
    ]);
  }
}