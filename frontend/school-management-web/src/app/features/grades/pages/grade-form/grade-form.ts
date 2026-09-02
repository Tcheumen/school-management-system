import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  GradeRequest,
  GradeTerm
} from '../../models/grade.model';

import {
  GradeService
} from '../../services/grade.service';

import {
  TeacherAssignment
} from '../../../teacher-assignments/models/teacher-assignment.model';

import {
  TeacherAssignmentService
} from '../../../teacher-assignments/services/teacher-assignment.service';

import {
  Enrollment
} from '../../../enrollments/models/enrollment.model';

import {
  EnrollmentService
} from '../../../enrollments/services/enrollment.service';

@Component({
  selector: 'app-grade-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './grade-form.html',
  styleUrl: './grade-form.scss'
})
export class GradeForm implements OnInit {

  teacherAssignmentId: number | null = null;
  enrollmentId: number | null = null;

  term: GradeTerm = 'TERM_1';

  value: number | null = null;

  remarks = '';

  assignments =
    signal<TeacherAssignment[]>([]);

  enrollments =
    signal<Enrollment[]>([]);

  loading = signal(false);
  loadingData = signal(false);
  errorMessage = signal('');

  isEditMode = false;

  private gradeId?: number;

  readonly terms: GradeTerm[] = [
    'TERM_1',
    'TERM_2',
    'TERM_3'
  ];

  constructor(
    private gradeService: GradeService,
    private teacherAssignmentService:
      TeacherAssignmentService,
    private enrollmentService:
      EnrollmentService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (id) {
      this.gradeId = Number(id);
      this.isEditMode = true;
    }

    this.loadReferenceData();
  }

  loadReferenceData(): void {

    this.loadingData.set(true);
    this.errorMessage.set('');

    let assignmentsLoaded = false;
    let enrollmentsLoaded = false;

    const checkComplete = () => {

      if (
        assignmentsLoaded &&
        enrollmentsLoaded
      ) {

        if (
          this.isEditMode &&
          this.gradeId
        ) {
          this.loadGrade(
            this.gradeId
          );
        } else {
          this.loadingData.set(false);
        }
      }
    };

    this.teacherAssignmentService
      .getAll()
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
            'Error loading teacher assignments:',
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

    this.enrollmentService
      .getAll()
      .subscribe({

        next: (enrollments) => {

          this.enrollments.set(
            enrollments
          );

          enrollmentsLoaded = true;

          checkComplete();
        },

        error: (error) => {

          console.error(
            'Error loading enrollments:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to load enrollments'
          );

          enrollmentsLoaded = true;

          checkComplete();
        }
      });
  }

  loadGrade(
    id: number
  ): void {

    this.gradeService
      .getById(id)
      .subscribe({

        next: (grade) => {

          this.teacherAssignmentId =
            grade.teacherAssignmentId;

          this.enrollmentId =
            grade.enrollmentId;

          this.term =
            grade.term;

          this.value =
            grade.value;

          this.remarks =
            grade.remarks ?? '';

          this.loadingData.set(false);
        },

        error: (error) => {

          console.error(
            'Error loading grade:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to load grade'
          );

          this.loadingData.set(false);
        }
      });
  }

  get selectedAssignment():
    TeacherAssignment | undefined {

    if (
      this.teacherAssignmentId === null
    ) {
      return undefined;
    }

    return this.assignments().find(
      assignment =>
        assignment.id ===
        this.teacherAssignmentId
    );
  }

  get filteredEnrollments():
    Enrollment[] {

    const assignment =
      this.selectedAssignment;

    if (!assignment) {
      return [];
    }

    return this.enrollments().filter(
      enrollment =>

        enrollment.classroomId ===
        assignment.classroomId &&

        enrollment.academicYearId ===
        assignment.academicYearId
    );
  }

  onAssignmentChange(): void {

    if (
      this.enrollmentId === null
    ) {
      return;
    }

    const stillValid =
      this.filteredEnrollments.some(
        enrollment =>
          enrollment.id ===
          this.enrollmentId
      );

    if (!stillValid) {
      this.enrollmentId = null;
    }
  }

  save(): void {

    this.errorMessage.set('');

    if (
      this.teacherAssignmentId === null ||
      this.enrollmentId === null ||
      this.value === null ||
      !this.term
    ) {

      this.errorMessage.set(
        'Assignment, student, term and grade are required'
      );

      return;
    }

    if (
      this.value < 0 ||
      this.value > 20
    ) {

      this.errorMessage.set(
        'Grade must be between 0 and 20'
      );

      return;
    }

    const request: GradeRequest = {

      teacherAssignmentId:
        this.teacherAssignmentId,

      enrollmentId:
        this.enrollmentId,

      term:
        this.term,

      value:
        this.value,

      remarks:
        this.remarks.trim() || undefined
    };

    if (
      this.isEditMode &&
      this.gradeId
    ) {

      this.updateGrade(
        request
      );

    } else {

      this.createGrade(
        request
      );
    }
  }

  createGrade(
    request: GradeRequest
  ): void {

    this.loading.set(true);

    this.gradeService
      .create(request)
      .subscribe({

        next: () => {

          this.loading.set(false);

          this.router.navigate([
            '/grades'
          ]);
        },

        error: (error) => {

          console.error(
            'Error creating grade:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to create grade'
          );

          this.loading.set(false);
        }
      });
  }

  updateGrade(
    request: GradeRequest
  ): void {

    if (!this.gradeId) {
      return;
    }

    this.loading.set(true);

    this.gradeService
      .update(
        this.gradeId,
        request
      )
      .subscribe({

        next: () => {

          this.loading.set(false);

          this.router.navigate([
            '/grades'
          ]);
        },

        error: (error) => {

          console.error(
            'Error updating grade:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to update grade'
          );

          this.loading.set(false);
        }
      });
  }

  formatAssignment(
    assignment: TeacherAssignment
  ): string {

    return (
      `${assignment.teacherFullName} — ` +
      `${assignment.subjectName} — ` +
      `${assignment.classroomName} — ` +
      `${assignment.academicYearName}`
    );
  }

  formatTerm(
    term: GradeTerm
  ): string {

    const labels:
      Record<GradeTerm, string> = {

      TERM_1: 'Term 1',
      TERM_2: 'Term 2',
      TERM_3: 'Term 3'
    };

    return labels[term];
  }

  cancel(): void {

    this.router.navigate([
      '/grades'
    ]);
  }
}