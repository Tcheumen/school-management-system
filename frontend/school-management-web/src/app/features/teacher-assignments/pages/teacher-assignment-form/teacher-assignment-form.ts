import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  TeacherAssignmentRequest
} from '../../models/teacher-assignment.model';

import {
  TeacherAssignmentService
} from '../../services/teacher-assignment.service';

import {
  Teacher
} from '../../../teachers/models/teacher.model';

import {
  TeacherService
} from '../../../teachers/services/teacher.service';

import {
  Subject
} from '../../../subjects/models/subject.model';

import {
  SubjectService
} from '../../../subjects/services/subject.service';

import {
  Classroom
} from '../../../classrooms/models/classroom.model';

import {
  ClassroomService
} from '../../../classrooms/services/classroom.service';

import {
  AcademicYear
} from '../../../academic-years/models/academic-year.model';

import {
  AcademicYearService
} from '../../../academic-years/services/academic-year.service';

@Component({
  selector: 'app-teacher-assignment-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './teacher-assignment-form.html',
  styleUrl: './teacher-assignment-form.scss'
})
export class TeacherAssignmentForm implements OnInit {

  teacherId: number | null = null;
  subjectId: number | null = null;
  classroomId: number | null = null;
  academicYearId: number | null = null;

  teachers = signal<Teacher[]>([]);
  subjects = signal<Subject[]>([]);
  classrooms = signal<Classroom[]>([]);
  academicYears = signal<AcademicYear[]>([]);

  loading = signal(false);
  loadingData = signal(false);
  errorMessage = signal('');

  constructor(
    private teacherAssignmentService: TeacherAssignmentService,
    private teacherService: TeacherService,
    private subjectService: SubjectService,
    private classroomService: ClassroomService,
    private academicYearService: AcademicYearService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReferenceData();
  }

  loadReferenceData(): void {
    this.loadingData.set(true);
    this.errorMessage.set('');

    let teachersLoaded = false;
    let subjectsLoaded = false;
    let classroomsLoaded = false;
    let academicYearsLoaded = false;

    const checkLoadingComplete = () => {
      if (
        teachersLoaded &&
        subjectsLoaded &&
        classroomsLoaded &&
        academicYearsLoaded
      ) {
        this.loadingData.set(false);
      }
    };

    this.teacherService.getAll().subscribe({
      next: (teachers) => {
        this.teachers.set(teachers);
        teachersLoaded = true;
        checkLoadingComplete();
      },
      error: (error) => {
        console.error('Error loading teachers:', error);
        this.errorMessage.set('Unable to load teachers');
        teachersLoaded = true;
        checkLoadingComplete();
      }
    });

    this.subjectService.getAll().subscribe({
      next: (subjects) => {
        this.subjects.set(subjects);
        subjectsLoaded = true;
        checkLoadingComplete();
      },
      error: (error) => {
        console.error('Error loading subjects:', error);
        this.errorMessage.set('Unable to load subjects');
        subjectsLoaded = true;
        checkLoadingComplete();
      }
    });

    this.classroomService.getAll().subscribe({
      next: (classrooms) => {
        this.classrooms.set(classrooms);
        classroomsLoaded = true;
        checkLoadingComplete();
      },
      error: (error) => {
        console.error('Error loading classrooms:', error);
        this.errorMessage.set('Unable to load classrooms');
        classroomsLoaded = true;
        checkLoadingComplete();
      }
    });

    this.academicYearService.getAll().subscribe({
      next: (academicYears) => {
        this.academicYears.set(academicYears);
        academicYearsLoaded = true;
        checkLoadingComplete();
      },
      error: (error) => {
        console.error('Error loading academic years:', error);
        this.errorMessage.set('Unable to load academic years');
        academicYearsLoaded = true;
        checkLoadingComplete();
      }
    });
  }

  get filteredClassrooms(): Classroom[] {
    if (this.academicYearId === null) {
      return [];
    }

    return this.classrooms().filter(
      classroom =>
        classroom.academicYearId === this.academicYearId
    );
  }

  onAcademicYearChange(): void {
    if (this.classroomId === null) {
      return;
    }

    const classroomStillValid =
      this.filteredClassrooms.some(
        classroom =>
          classroom.id === this.classroomId
      );

    if (!classroomStillValid) {
      this.classroomId = null;
    }
  }

  save(): void {
    this.errorMessage.set('');

    if (
      this.teacherId === null ||
      this.subjectId === null ||
      this.classroomId === null ||
      this.academicYearId === null
    ) {
      this.errorMessage.set(
        'Teacher, subject, classroom and academic year are required'
      );
      return;
    }

    const request: TeacherAssignmentRequest = {
      teacherId: this.teacherId,
      subjectId: this.subjectId,
      classroomId: this.classroomId,
      academicYearId: this.academicYearId
    };

    this.loading.set(true);

    this.teacherAssignmentService
      .create(request)
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/teacher-assignments']);
        },

        error: (error) => {
          console.error(
            'Error creating teacher assignment:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to create teacher assignment'
          );

          this.loading.set(false);
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/teacher-assignments']);
  }
}