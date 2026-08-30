import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-student-list',
  imports: [RouterLink],
  templateUrl: './student-list.html',
  styleUrl: './student-list.scss'
})
export class StudentList implements OnInit {

  students = signal<Student[]>([]);
  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private studentService: StudentService
  ) { }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.studentService.getAll().subscribe({
      next: students => {
        console.log('Students received:', students);

        this.students.set(students);
        this.loading.set(false);
      },

      error: error => {
        console.error('Error loading students:', error);

        this.errorMessage.set(
          'Unable to load students'
        );

        this.loading.set(false);
      }
    });
  }

  deleteStudent(id: number): void {

    const confirmed = window.confirm(
      'Are you sure you want to delete this student?'
    );

    if (!confirmed) {
      return;
    }

    this.studentService.delete(id).subscribe({
      next: () => {
        this.loadStudents();
      },

      error: error => {
        console.error(
          'Error deleting student:',
          error
        );

        this.errorMessage.set(
          'Unable to delete student'
        );
      }
    });
  }
}