import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Classroom } from '../../models/classroom.model';
import { ClassroomService } from '../../services/classroom.service';

@Component({
  selector: 'app-classroom-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './classroom-list.html',
  styleUrl: './classroom-list.scss'
})
export class ClassroomList implements OnInit {

  classrooms = signal<Classroom[]>([]);
  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private classroomService: ClassroomService
  ) { }

  ngOnInit(): void {
    this.loadClassrooms();
  }

  loadClassrooms(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.classroomService.getAll().subscribe({
      next: (classrooms) => {
        this.classrooms.set(classrooms);
        this.loading.set(false);
      },

      error: (error) => {
        console.error('Error loading classrooms:', error);

        this.errorMessage.set(
          'Unable to load classrooms'
        );

        this.loading.set(false);
      }
    });
  }

  deleteClassroom(id: number): void {
    const confirmed = confirm(
      'Are you sure you want to delete this classroom?'
    );

    if (!confirmed) {
      return;
    }

    this.classroomService.delete(id).subscribe({
      next: () => {
        this.loadClassrooms();
      },

      error: (error) => {
        console.error(
          'Error deleting classroom:',
          error
        );

        this.errorMessage.set(
          'Unable to delete classroom'
        );
      }
    });
  }
}