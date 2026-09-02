import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  TeacherAssignment
} from '../../models/teacher-assignment.model';

import {
  TeacherAssignmentService
} from '../../services/teacher-assignment.service';

@Component({
  selector: 'app-teacher-assignment-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './teacher-assignment-list.html',
  styleUrl: './teacher-assignment-list.scss'
})
export class TeacherAssignmentList implements OnInit {

  assignments = signal<TeacherAssignment[]>([]);

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
      .getAll()
      .subscribe({

        next: (assignments) => {
          this.assignments.set(assignments);
          this.loading.set(false);
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

          this.loading.set(false);
        }
      });
  }

  deleteAssignment(id: number): void {
    const confirmed = confirm(
      'Are you sure you want to delete this teacher assignment?'
    );

    if (!confirmed) {
      return;
    }

    this.teacherAssignmentService
      .delete(id)
      .subscribe({

        next: () => {
          this.loadAssignments();
        },

        error: (error) => {
          console.error(
            'Error deleting teacher assignment:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ??
            'Unable to delete teacher assignment'
          );
        }
      });
  }
}