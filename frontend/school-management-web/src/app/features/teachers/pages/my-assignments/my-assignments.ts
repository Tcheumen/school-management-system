import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  TeacherAssignment
} from '../../../teacher-assignments/models/teacher-assignment.model';

import {
  TeacherAssignmentService
} from '../../../teacher-assignments/services/teacher-assignment.service';

@Component({
  selector: 'app-my-assignments',
  standalone: true,
  imports: [],
  templateUrl: './my-assignments.html',
  styleUrl: './my-assignments.scss'
})
export class MyAssignments implements OnInit {

  assignments =
    signal<TeacherAssignment[]>([]);

  loading = signal(false);

  errorMessage = signal('');

  constructor(
    private teacherAssignmentService:
      TeacherAssignmentService
  ) { }

  ngOnInit(): void {
    this.loadAssignments();
  }

  loadAssignments(): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.teacherAssignmentService
      .getMine()
      .subscribe({

        next: (assignments) => {

          this.assignments.set(
            assignments
          );

          this.loading.set(false);
        },

        error: (error) => {

          console.error(
            'Error loading teacher assignments:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to load your assignments'
          );

          this.loading.set(false);
        }
      });
  }
}