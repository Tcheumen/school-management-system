import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  ClassScheduleRequest
} from '../../models/class-schedule.model';

import {
  ClassScheduleService
} from '../../services/class-schedule.service';

import {
  TeacherAssignment
} from '../../../teacher-assignments/models/teacher-assignment.model';

import {
  TeacherAssignmentService
} from '../../../teacher-assignments/services/teacher-assignment.service';

@Component({
  selector: 'app-schedule-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './schedule-form.html',
  styleUrl: './schedule-form.scss'
})
export class ScheduleForm implements OnInit {

  teacherAssignmentId: number | null = null;
  dayOfWeek = '';
  startTime = '';
  endTime = '';

  assignments = signal<TeacherAssignment[]>([]);

  loading = signal(false);
  loadingData = signal(false);
  errorMessage = signal('');

  readonly days = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY'
  ];

  constructor(
    private classScheduleService: ClassScheduleService,
    private teacherAssignmentService: TeacherAssignmentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAssignments();
  }

  loadAssignments(): void {
    this.loadingData.set(true);
    this.errorMessage.set('');

    this.teacherAssignmentService
      .getAll()
      .subscribe({

        next: (assignments) => {
          this.assignments.set(assignments);
          this.loadingData.set(false);
        },

        error: (error) => {
          console.error(
            'Error loading teacher assignments:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to load teacher assignments'
          );

          this.loadingData.set(false);
        }
      });
  }

  save(): void {
    this.errorMessage.set('');

    if (
      this.teacherAssignmentId === null ||
      !this.dayOfWeek ||
      !this.startTime ||
      !this.endTime
    ) {
      this.errorMessage.set(
        'Assignment, day, start time and end time are required'
      );

      return;
    }

    if (this.endTime <= this.startTime) {
      this.errorMessage.set(
        'End time must be after start time'
      );

      return;
    }

    const request: ClassScheduleRequest = {
      teacherAssignmentId: this.teacherAssignmentId,
      dayOfWeek: this.dayOfWeek,
      startTime: this.startTime,
      endTime: this.endTime
    };

    this.loading.set(true);

    this.classScheduleService
      .create(request)
      .subscribe({

        next: () => {
          this.loading.set(false);

          this.router.navigate([
            '/schedules'
          ]);
        },

        error: (error) => {
          console.error(
            'Error creating schedule:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to create schedule'
          );

          this.loading.set(false);
        }
      });
  }

  formatDay(day: string): string {
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

  cancel(): void {
    this.router.navigate([
      '/schedules'
    ]);
  }
}