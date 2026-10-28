
import {
  Component,
  OnInit,
  computed,
  signal
} from '@angular/core';

import { DecimalPipe } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { ClassSchedule } from '../../models/class-schedule.model';
import { ClassScheduleService } from '../../services/class-schedule.service';

import { AcademicYear } from '../../../academic-years/models/academic-year.model';
import { AcademicYearService } from '../../../academic-years/services/academic-year.service';

import { Classroom } from '../../../classrooms/models/classroom.model';
import { ClassroomService } from '../../../classrooms/services/classroom.service';

type ScheduleView = 'WEEK' | 'LIST';
type IdFilter = number | 'ALL';

interface ScheduleDay {
  value: string;
  label: string;
}

interface ScheduleBlock {
  schedule: ClassSchedule;
  top: number;
  height: number;
  width: number;
  left: number;
  conflict: boolean;
}

@Component({
  selector: 'app-schedule-list',
  standalone: true,
  imports: [RouterLink, FormsModule, DecimalPipe],
  templateUrl: './schedule-list.html',
  styleUrl: './schedule-list.scss'
})
export class ScheduleList implements OnInit {

  schedules = signal<ClassSchedule[]>([]);
  academicYears = signal<AcademicYear[]>([]);
  classrooms = signal<Classroom[]>([]);

  loading = signal(false);
  deleting = signal(false);
  deletingId = signal<number | null>(null);
  errorMessage = signal('');

  activeView = signal<ScheduleView>('WEEK');
  selectedYearId = signal<number | null>(null);
  selectedClassroomId: IdFilter = 'ALL';
  selectedTeacherId: IdFilter = 'ALL';
  searchTerm = '';

  selectedSchedule = signal<ClassSchedule | null>(null);

  readonly days: ScheduleDay[] = [
    { value: 'MONDAY', label: 'Monday' },
    { value: 'TUESDAY', label: 'Tuesday' },
    { value: 'WEDNESDAY', label: 'Wednesday' },
    { value: 'THURSDAY', label: 'Thursday' },
    { value: 'FRIDAY', label: 'Friday' },
    { value: 'SATURDAY', label: 'Saturday' },
    { value: 'SUNDAY', label: 'Sunday' }
  ];

  // The timetable runs from 07:00 to 19:00.
  readonly startHour = 7;
  readonly endHour = 19;

  readonly hourHeight = 72;
  readonly hourLabels = Array.from(
    { length: this.endHour - this.startHour + 1 },
    (_, index) => this.startHour + index
  );

  constructor(
    private classScheduleService: ClassScheduleService,
    private academicYearService: AcademicYearService,
    private classroomService: ClassroomService
  ) { }

  ngOnInit(): void {
    this.loadSchedules();
  }

  // ================================
  // LOAD DATA
  // ================================

  loadSchedules(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    forkJoin({
      schedules: this.classScheduleService.getAll(),
      years: this.academicYearService.getAll(),
      classrooms: this.classroomService.getAll()
    }).subscribe({
      next: data => {
        this.schedules.set(
          this.sortSchedules(data.schedules)
        );

        this.academicYears.set(data.years);
        this.classrooms.set(data.classrooms);

        const yearExists = data.years.some(
          year => year.id === this.selectedYearId()
        );

        if (!yearExists) {
          const activeYear = data.years.find(
            year => year.active
          );

          const latestYear = [...data.years].sort(
            (a, b) => b.startDate.localeCompare(a.startDate)
          )[0];

          this.selectedYearId.set(
            activeYear?.id ?? latestYear?.id ?? null
          );
        }

        const selectedClassroom = this.selectedClassroomId;

        if (
          typeof selectedClassroom === 'number' &&
          !data.classrooms.some(
            classroom =>
              classroom.id === selectedClassroom &&
              classroom.academicYearId === this.selectedYearId()
          )
        ) {
          this.selectedClassroomId = 'ALL';
        }

        const selected = this.selectedSchedule();

        if (selected) {
          this.selectedSchedule.set(
            data.schedules.find(
              schedule => schedule.id === selected.id
            ) ?? null
          );
        }

        this.loading.set(false);
      },

      error: error => {
        console.error('Error loading schedules:', error);

        this.errorMessage.set(
          typeof error.error === 'string'
            ? error.error
            : error.error?.message ||
            'Unable to load schedules and school data.'
        );

        this.loading.set(false);
      }
    });
  }

  // ================================
  // YEAR / CLASSROOM / TEACHER
  // ================================

  get selectedYearLabel(): string {
    return this.academicYears().find(
      year => year.id === this.selectedYearId()
    )?.name ?? 'No academic year';
  }

  onYearChange(yearId: number | null): void {
    this.selectedYearId.set(yearId);
    this.selectedClassroomId = 'ALL';
    this.selectedTeacherId = 'ALL';
    this.selectedSchedule.set(null);
  }

  readonly availableClassrooms = computed(() => {
    const yearId = this.selectedYearId();

    return this.classrooms()
      .filter(classroom =>
        classroom.academicYearId === yearId
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  readonly yearSchedules = computed(() => {
    const yearId = this.selectedYearId();

    return this.schedules().filter(
      schedule => schedule.academicYearId === yearId
    );
  });

  readonly availableTeachers = computed(() => {
    const teacherMap = new Map<number, string>();

    for (const schedule of this.yearSchedules()) {
      teacherMap.set(
        schedule.teacherId,
        schedule.teacherFullName
      );
    }

    return [...teacherMap.entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  // ================================
  // FILTERED SCHEDULES
  // ================================

  get filteredSchedules(): ClassSchedule[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.yearSchedules().filter(schedule => {
      const matchesClassroom =
        this.selectedClassroomId === 'ALL' ||
        schedule.classroomId === this.selectedClassroomId;

      const matchesTeacher =
        this.selectedTeacherId === 'ALL' ||
        schedule.teacherId === this.selectedTeacherId;

      const text = [
        schedule.teacherFullName,
        schedule.subjectName,
        schedule.classroomName,
        this.formatDay(schedule.dayOfWeek)
      ].join(' ').toLowerCase();

      return (
        matchesClassroom &&
        matchesTeacher &&
        text.includes(search)
      );
    });
  }

  clearFilters(): void {
    this.selectedClassroomId = 'ALL';
    this.selectedTeacherId = 'ALL';
    this.searchTerm = '';
  }

  changeView(view: ScheduleView): void {
    this.activeView.set(view);
  }

  // ================================
  // STATISTICS
  // ================================

  get totalSchedules(): number {
    return this.yearSchedules().length;
  }

  get totalTeachers(): number {
    return new Set(
      this.yearSchedules().map(
        schedule => schedule.teacherId
      )
    ).size;
  }

  get totalClassrooms(): number {
    return new Set(
      this.yearSchedules().map(
        schedule => schedule.classroomId
      )
    ).size;
  }

  get totalHours(): number {
    return this.yearSchedules().reduce((sum, schedule) => {
      const duration =
        this.timeToMinutes(schedule.endTime) -
        this.timeToMinutes(schedule.startTime);

      return sum + Math.max(0, duration);
    }, 0) / 60;
  }

  // ================================
  // TIME HELPERS
  // ================================

  timeToMinutes(time: string): number {
    if (!time) return 0;

    const parts = time.split(':');

    const hours = Number(parts[0] ?? 0);
    const minutes = Number(parts[1] ?? 0);

    return hours * 60 + minutes;
  }

  formatTime(time: string): string {
    return time ? time.substring(0, 5) : '';
  }

  formatHour(hour: number): string {
    return `${hour.toString().padStart(2, '0')}:00`;
  }

  formatDay(day: string): string {
    const found = this.days.find(
      item => item.value === day.toUpperCase()
    );

    return found?.label ?? day;
  }

  private sortSchedules(
    schedules: ClassSchedule[]
  ): ClassSchedule[] {
    return [...schedules].sort((a, b) => {
      const dayA = this.days.findIndex(
        day => day.value === a.dayOfWeek
      );

      const dayB = this.days.findIndex(
        day => day.value === b.dayOfWeek
      );

      const diff =
        (dayA === -1 ? 99 : dayA) -
        (dayB === -1 ? 99 : dayB);

      return diff !== 0
        ? diff
        : a.startTime.localeCompare(b.startTime);
    });
  }

  // ================================
  // CONFLICT DETECTION
  // ================================

  schedulesOverlap(
    first: ClassSchedule,
    second: ClassSchedule
  ): boolean {
    if (first.id === second.id) return false;

    if (first.dayOfWeek !== second.dayOfWeek) {
      return false;
    }

    const firstStart = this.timeToMinutes(first.startTime);
    const firstEnd = this.timeToMinutes(first.endTime);
    const secondStart = this.timeToMinutes(second.startTime);
    const secondEnd = this.timeToMinutes(second.endTime);

    return firstStart < secondEnd &&
      secondStart < firstEnd;
  }

  hasConflict(schedule: ClassSchedule): boolean {
    return this.yearSchedules().some(other => {
      if (!this.schedulesOverlap(schedule, other)) {
        return false;
      }

      return (
        schedule.classroomId === other.classroomId ||
        schedule.teacherId === other.teacherId
      );
    });
  }

  get conflictCount(): number {
    return this.yearSchedules().filter(
      schedule => this.hasConflict(schedule)
    ).length;
  }

  // ================================
  // WEEKLY TIMETABLE
  // ================================

  get visibleDays(): ScheduleDay[] {
    // Always show weekdays, and show weekend days
    // only if lessons exist there.
    const scheduledDays = new Set(
      this.filteredSchedules.map(
        schedule => schedule.dayOfWeek
      )
    );

    return this.days.filter(
      (day, index) =>
        index < 5 || scheduledDays.has(day.value)
    );
  }

  getTimetableBlocks(day: string): ScheduleBlock[] {
    const items = this.filteredSchedules
      .filter(schedule => schedule.dayOfWeek === day)
      .sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
      );

    // Assign overlapping lessons to horizontal lanes.
    const blocks: ScheduleBlock[] = [];

    const laneEnds: number[] = [];

    for (const schedule of items) {
      const start = this.timeToMinutes(schedule.startTime);
      const end = this.timeToMinutes(schedule.endTime);

      let laneIndex = laneEnds.findIndex(
        laneEnd => laneEnd <= start
      );

      if (laneIndex === -1) {
        laneIndex = laneEnds.length;
        laneEnds.push(end);
      } else {
        laneEnds[laneIndex] = end;
      }

      const laneCount = Math.max(
        1,
        items.filter(other =>
          this.schedulesOverlap(schedule, other) ||
          other.id === schedule.id
        ).length
      );

      blocks.push({
        schedule,
        top: (
          (start - this.startHour * 60) / 60
        ) * this.hourHeight,
        height: Math.max(
          40,
          ((end - start) / 60) * this.hourHeight
        ),
        left: (laneIndex / laneCount) * 100,
        width: 100 / laneCount,
        conflict: this.hasConflict(schedule)
      });
    }

    return blocks;
  }

  get timetableHeight(): number {
    return (
      this.endHour - this.startHour
    ) * this.hourHeight;
  }

  // ================================
  // DETAILS MODAL
  // ================================

  viewSchedule(schedule: ClassSchedule): void {
    this.selectedSchedule.set(schedule);
  }

  closeDetails(): void {
    this.selectedSchedule.set(null);
  }

  // ================================
  // DELETE
  // ================================

  deleteSchedule(id: number): void {
    if (this.deleting()) return;

    const schedule = this.schedules().find(
      item => item.id === id
    );

    if (!schedule) return;

    const confirmed = window.confirm(
      `Delete ${schedule.subjectName} on ` +
      `${this.formatDay(schedule.dayOfWeek)} ` +
      `${this.formatTime(schedule.startTime)}?`
    );

    if (!confirmed) return;

    this.deleting.set(true);
    this.deletingId.set(id);
    this.errorMessage.set('');

    this.classScheduleService.delete(id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.deletingId.set(null);
        this.selectedSchedule.set(null);
        this.loadSchedules();
      },

      error: error => {
        console.error('Error deleting schedule:', error);

        this.errorMessage.set(
          typeof error.error === 'string'
            ? error.error
            : error.error?.message ||
            'Unable to delete schedule.'
        );

        this.deleting.set(false);
        this.deletingId.set(null);
      }
    });
  }
}
