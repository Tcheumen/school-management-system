import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TeacherService } from '../../services/teacher.service';
import { Teacher } from '../../models/teacher.model';

@Component({
  selector: 'app-teacher-list',
  imports: [RouterLink],
  templateUrl: './teacher-list.html',
  styleUrl: './teacher-list.scss'
})
export class TeacherList implements OnInit {

  teachers = signal<Teacher[]>([]);
  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private teacherService: TeacherService
  ) { }

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.teacherService.getAll().subscribe({
      next: teachers => {
        this.teachers.set(teachers);
        this.loading.set(false);
      },

      error: error => {
        console.error(error);

        this.errorMessage.set(
          'Unable to load teachers'
        );

        this.loading.set(false);
      }
    });
  }

  deleteTeacher(id: number): void {
    const confirmed = window.confirm(
      'Are you sure you want to delete this teacher?'
    );

    if (!confirmed) {
      return;
    }

    this.teacherService.delete(id).subscribe({
      next: () => {
        this.loadTeachers();
      },

      error: error => {
        console.error(error);

        this.errorMessage.set(
          'Unable to delete teacher'
        );
      }
    });
  }
}