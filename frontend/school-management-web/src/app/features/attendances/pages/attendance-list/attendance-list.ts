
import {
  Component,
  OnInit,
  computed,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin, map, of } from 'rxjs';

import {
  Attendance,
  AttendanceStatus
} from '../../models/attendance.model';

import {
  AttendanceService
} from '../../services/attendance.service';

import {
  AuthService
} from '../../../../core/services/auth.service';

import {
  AcademicYear
} from '../../../academic-years/models/academic-year.model';

import {
  AcademicYearService
} from '../../../academic-years/services/academic-year.service';

import {
  Classroom
} from '../../../classrooms/models/classroom.model';

import {
  ClassroomService
} from '../../../classrooms/services/classroom.service';

import {
  Subject
} from '../../../subjects/models/subject.model';

import {
  SubjectService
} from '../../../subjects/services/subject.service';

type IdFilter = number | 'ALL';
type StatusFilter = AttendanceStatus | 'ALL';

@Component({
  selector: 'app-attendance-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './attendance-list.html',
  styleUrl: './attendance-list.scss'
})
export class AttendanceList implements OnInit {

  attendances = signal<Attendance[]>([]);
  academicYears = signal<AcademicYear[]>([]);
  classrooms = signal<Classroom[]>([]);
  subjects = signal<Subject[]>([]);

  loading = signal(false);
  deleting = signal(false);
  deletingId = signal<number | null>(null);

  errorMessage = signal('');

  selectedYearId = signal<number | null>(null);
  selectedClassroomId: IdFilter = 'ALL';
  selectedSubjectId: IdFilter = 'ALL';

  selectedStatus: StatusFilter = 'ALL';
  selectedDate = '';
  searchTerm = '';

  selectedAttendance = signal<Attendance | null>(null);

  readonly isTeacher: boolean;

  constructor(
    private attendanceService: AttendanceService,
    private authService: AuthService,
    private academicYearService: AcademicYearService,
    private classroomService: ClassroomService,
    private subjectService: SubjectService
  ) {
    this.isTeacher =
      this.authService.getRole() === 'TEACHER';
  }

  ngOnInit(): void {
    this.loadAttendances();
  }

  // =====================================
  // LOAD DATA
  // =====================================

  loadAttendances(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    const attendanceRequest$ = this.isTeacher
      ? this.attendanceService.getMineForTeacher()
      : this.attendanceService.getAll();

    forkJoin({
      attendances: attendanceRequest$,
      years: this.academicYearService.getAll(),
      // The teacher view derives classroom and subject
      // options from its own authorized attendance data.
      classrooms: this.isTeacher
        ? of([] as Classroom[])
        : this.classroomService.getAll(),
      subjects: this.isTeacher
        ? of([] as Subject[])
        : this.subjectService.getAll()
    }).subscribe({
      next: data => {
        this.attendances.set(
          this.sortAttendances(data.attendances)
        );

        this.academicYears.set(data.years);
        this.classrooms.set(data.classrooms);
        this.subjects.set(data.subjects);

        const yearExists = data.years.some(
          year => year.id === this.selectedYearId()
        );

        if (!yearExists) {
          const activeYear = data.years.find(
            year => year.active
          );

          const latestYear = [...data.years].sort(
            (a, b) =>
              b.startDate.localeCompare(a.startDate)
          )[0];

          this.selectedYearId.set(
            activeYear?.id ?? latestYear?.id ?? null
          );

          this.selectedClassroomId = 'ALL';
          this.selectedSubjectId = 'ALL';
        }

        const selected = this.selectedAttendance();

        if (selected) {
          this.selectedAttendance.set(
            data.attendances.find(
              attendance => attendance.id === selected.id
            ) ?? null
          );
        }

        this.loading.set(false);
      },

      error: error => {
        console.error(
          'Error loading attendance data:',
          error
        );

        const backendMessage =
          typeof error.error === 'string'
            ? error.error
            : error.error?.message;

        this.errorMessage.set(
          backendMessage ||
          'Unable to load attendance records.'
        );

        this.loading.set(false);
      }
    });
  }

  // =====================================
  // ACADEMIC YEAR
  // =====================================

  get selectedYearLabel(): string {
    return this.academicYears().find(
      year => year.id === this.selectedYearId()
    )?.name ?? 'No academic year';
  }

  onYearChange(yearId: number | null): void {
    this.selectedYearId.set(yearId);
    this.selectedClassroomId = 'ALL';
    this.selectedSubjectId = 'ALL';
    this.selectedAttendance.set(null);
  }

  // =====================================
  // AVAILABLE CLASSROOMS
  // =====================================

  readonly availableClassrooms = computed(() => {
    const yearId = this.selectedYearId();

    if (yearId === null) {
      return [] as {
        id: number;
        name: string;
        level: string;
      }[];
    }

    if (!this.isTeacher) {
      return this.classrooms()
        .filter(classroom =>
          classroom.academicYearId === yearId
        )
        .map(classroom => ({
          id: classroom.id,
          name: classroom.name,
          level: classroom.level
        }))
        .sort((a, b) =>
          a.name.localeCompare(b.name)
        );
    }

    const classroomMap = new Map<number, string>();

    for (const attendance of this.attendances()) {
      if (attendance.academicYearId === yearId) {
        classroomMap.set(
          attendance.classroomId,
          attendance.classroomName
        );
      }
    }

    return [...classroomMap.entries()]
      .map(([id, name]) => ({
        id,
        name,
        level: ''
      }))
      .sort((a, b) =>
        a.name.localeCompare(b.name)
      );
  });

  // =====================================
  // AVAILABLE SUBJECTS
  // =====================================

  readonly availableSubjects = computed(() => {
    const yearId = this.selectedYearId();

    const subjectMap = new Map<number, string>();

    for (const attendance of this.attendances()) {
      if (attendance.academicYearId === yearId) {
        subjectMap.set(
          attendance.subjectId,
          attendance.subjectName
        );
      }
    }

    if (!this.isTeacher) {
      for (const subject of this.subjects()) {
        if (subjectMap.has(subject.id)) {
          subjectMap.set(subject.id, subject.name);
        }
      }
    }

    return [...subjectMap.entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) =>
        a.name.localeCompare(b.name)
      );
  });

  // =====================================
  // ATTENDANCES FOR SELECTED YEAR
  // =====================================

  readonly yearAttendances = computed(() => {
    const yearId = this.selectedYearId();

    if (yearId === null) {
      return [] as Attendance[];
    }

    return this.attendances().filter(
      attendance =>
        attendance.academicYearId === yearId
    );
  });

  // =====================================
  // FILTERED ATTENDANCES
  // =====================================

  get filteredAttendances(): Attendance[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.yearAttendances().filter(attendance => {
      const matchesClassroom =
        this.selectedClassroomId === 'ALL' ||
        attendance.classroomId === this.selectedClassroomId;

      const matchesSubject =
        this.selectedSubjectId === 'ALL' ||
        attendance.subjectId === this.selectedSubjectId;

      const matchesStatus =
        this.selectedStatus === 'ALL' ||
        attendance.status === this.selectedStatus;

      const matchesDate =
        !this.selectedDate ||
        attendance.attendanceDate === this.selectedDate;

      const matchesSearch =
        attendance.studentFullName
          .toLowerCase()
          .includes(search);

      return (
        matchesClassroom &&
        matchesSubject &&
        matchesStatus &&
        matchesDate &&
        matchesSearch
      );
    });
  }

  // =====================================
  // STATISTICS FOR CURRENT FILTERS
  // =====================================

  get totalRecords(): number {
    return this.filteredAttendances.length;
  }

  get presentCount(): number {
    return this.filteredAttendances.filter(
      attendance => attendance.status === 'PRESENT'
    ).length;
  }

  get lateCount(): number {
    return this.filteredAttendances.filter(
      attendance => attendance.status === 'LATE'
    ).length;
  }

  get absentCount(): number {
    return this.filteredAttendances.filter(
      attendance => attendance.status === 'ABSENT'
    ).length;
  }

  get attendanceRate(): number {
    if (this.totalRecords === 0) {
      return 0;
    }

    // Late counts as attendance.
    return Math.round(
      ((this.presentCount + this.lateCount) /
        this.totalRecords) * 100
    );
  }

  clearFilters(): void {
    this.selectedClassroomId = 'ALL';
    this.selectedSubjectId = 'ALL';
    this.selectedStatus = 'ALL';
    this.selectedDate = '';
    this.searchTerm = '';
  }

  // =====================================
  // DETAILS
  // =====================================

  viewAttendance(attendance: Attendance): void {
    this.selectedAttendance.set(attendance);
  }

  closeDetails(): void {
    this.selectedAttendance.set(null);
  }

  // =====================================
  // UTILITIES
  // =====================================

  getStatusLabel(status: AttendanceStatus): string {
    const labels: Record<AttendanceStatus, string> = {
      PRESENT: 'Present',
      ABSENT: 'Absent',
      LATE: 'Late'
    };

    return labels[status];
  }

  formatTime(time: string): string {
    return time ? time.substring(0, 5) : '';
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

  private sortAttendances(
    attendances: Attendance[]
  ): Attendance[] {
    return [...attendances].sort((a, b) => {
      const dateDifference =
        b.attendanceDate.localeCompare(a.attendanceDate);

      return dateDifference !== 0
        ? dateDifference
        : a.startTime.localeCompare(b.startTime);
    });
  }

  // =====================================
  // DELETE
  // =====================================

  deleteAttendance(id: number): void {
    if (this.deleting()) {
      return;
    }

    const attendance = this.attendances().find(
      item => item.id === id
    );

    if (!attendance) {
      return;
    }

    const confirmed = window.confirm(
      `Delete the attendance record of ` +
      `"${attendance.studentFullName}" on ` +
      `${attendance.attendanceDate}?`
    );

    if (!confirmed) {
      return;
    }

    this.deleting.set(true);
    this.deletingId.set(id);
    this.errorMessage.set('');

    this.attendanceService.delete(id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.deletingId.set(null);
        this.selectedAttendance.set(null);
        this.loadAttendances();
      },

      error: error => {
        console.error(
          'Error deleting attendance:',
          error
        );

        const backendMessage =
          typeof error.error === 'string'
            ? error.error
            : error.error?.message;

        this.errorMessage.set(
          backendMessage ||
          'Unable to delete attendance record.'
        );

        this.deleting.set(false);
        this.deletingId.set(null);
      }
    });
  }
}
