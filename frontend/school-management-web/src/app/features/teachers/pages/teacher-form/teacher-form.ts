import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TeacherService } from '../../services/teacher.service';
import { TeacherRequest } from '../../models/teacher.model';

@Component({
  selector: 'app-teacher-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './teacher-form.html',
  styleUrl: './teacher-form.scss'
})
export class TeacherForm implements OnInit {

  firstName = '';
  lastName = '';
  email = '';
  phoneNumber = '';
  specialty = '';

  loading = signal(false);
  errorMessage = signal('');

  isEditMode = false;

  private teacherId?: number;

  constructor(
    private teacherService: TeacherService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.teacherId = Number(id);
      this.isEditMode = true;

      this.loadTeacher(this.teacherId);
    }
  }

  loadTeacher(id: number): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.teacherService.getById(id).subscribe({
      next: (teacher) => {
        this.firstName = teacher.firstName;
        this.lastName = teacher.lastName;
        this.email = teacher.email;
        this.phoneNumber = teacher.phoneNumber;
        this.specialty = teacher.specialty;

        this.loading.set(false);
      },

      error: (error) => {
        console.error('Error loading teacher:', error);

        this.errorMessage.set(
          'Unable to load teacher'
        );

        this.loading.set(false);
      }
    });
  }

  save(): void {
    this.errorMessage.set('');

    const request: TeacherRequest = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      specialty: this.specialty
    };

    if (this.isEditMode && this.teacherId) {
      this.updateTeacher(request);
    } else {
      this.createTeacher(request);
    }
  }

  createTeacher(request: TeacherRequest): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.teacherService.create(request).subscribe({
      next: () => {
        this.loading.set(false);

        this.router.navigate(['/teachers']);
      },

      error: (error) => {
        console.error('Error creating teacher:', error);

        this.errorMessage.set(
          'Unable to create teacher'
        );

        this.loading.set(false);
      }
    });
  }

  updateTeacher(request: TeacherRequest): void {
    if (!this.teacherId) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.teacherService.update(
      this.teacherId,
      request
    ).subscribe({
      next: () => {
        this.loading.set(false);

        this.router.navigate(['/teachers']);
      },

      error: (error) => {
        console.error('Error updating teacher:', error);

        this.errorMessage.set(
          'Unable to update teacher'
        );

        this.loading.set(false);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/teachers']);
  }
}