import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { StudentService } from '../../services/student.service';
import { StudentRequest } from '../../models/student.model';

@Component({
  selector: 'app-student-form',
  imports: [FormsModule],
  templateUrl: './student-form.html',
  styleUrl: './student-form.scss'
})
export class StudentForm implements OnInit {

  studentId: number | null = null;

  firstName = '';
  lastName = '';
  dateOfBirth = '';
  email = '';
  phoneNumber = '';

  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.studentId = Number(id);
      this.loadStudent(this.studentId);
    }
  }

  loadStudent(id: number): void {
    this.loading.set(true);

    this.studentService.getById(id).subscribe({
      next: student => {
        this.firstName = student.firstName;
        this.lastName = student.lastName;
        this.dateOfBirth = student.dateOfBirth;
        this.email = student.email;
        this.phoneNumber = student.phoneNumber;

        this.loading.set(false);
      },

      error: () => {
        this.errorMessage.set('Unable to load student');
        this.loading.set(false);
      }
    });
  }

  save(): void {
    this.errorMessage.set('');

    const request: StudentRequest = {
      firstName: this.firstName,
      lastName: this.lastName,
      dateOfBirth: this.dateOfBirth,
      email: this.email,
      phoneNumber: this.phoneNumber
    };

    if (this.studentId) {
      this.updateStudent(request);
    } else {
      this.createStudent(request);
    }
  }

  createStudent(request: StudentRequest): void {
    this.studentService.create(request).subscribe({
      next: () => {
        this.router.navigate(['/students']);
      },

      error: () => {
        this.errorMessage.set('Unable to create student');
      }
    });
  }

  updateStudent(request: StudentRequest): void {
    if (!this.studentId) {
      return;
    }

    this.studentService.update(
      this.studentId,
      request
    ).subscribe({
      next: () => {
        this.router.navigate(['/students']);
      },

      error: () => {
        this.errorMessage.set('Unable to update student');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/students']);
  }
}