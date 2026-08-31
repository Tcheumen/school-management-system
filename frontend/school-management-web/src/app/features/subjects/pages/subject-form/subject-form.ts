import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SubjectService } from '../../services/subject.service';
import { SubjectRequest } from '../../models/subject.model';

@Component({
  selector: 'app-subject-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './subject-form.html',
  styleUrl: './subject-form.scss'
})
export class SubjectForm implements OnInit {

  name = '';
  description = '';

  loading = signal(false);
  errorMessage = signal('');

  isEditMode = false;

  private subjectId?: number;

  constructor(
    private subjectService: SubjectService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.subjectId = Number(id);
      this.isEditMode = true;
      this.loadSubject(this.subjectId);
    }
  }

  loadSubject(id: number): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.subjectService.getById(id).subscribe({
      next: (subject) => {
        this.name = subject.name;
        this.description = subject.description;
        this.loading.set(false);
      },

      error: (error) => {
        console.error('Error loading subject:', error);
        this.errorMessage.set('Unable to load subject');
        this.loading.set(false);
      }
    });
  }

  save(): void {
    const request: SubjectRequest = {
      name: this.name,
      description: this.description
    };

    this.errorMessage.set('');

    if (this.isEditMode && this.subjectId) {
      this.updateSubject(request);
    } else {
      this.createSubject(request);
    }
  }

  createSubject(request: SubjectRequest): void {
    this.loading.set(true);

    this.subjectService.create(request).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/subjects']);
      },

      error: (error) => {
        console.error('Error creating subject:', error);
        this.errorMessage.set('Unable to create subject');
        this.loading.set(false);
      }
    });
  }

  updateSubject(request: SubjectRequest): void {
    if (!this.subjectId) {
      return;
    }

    this.loading.set(true);

    this.subjectService.update(
      this.subjectId,
      request
    ).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/subjects']);
      },

      error: (error) => {
        console.error('Error updating subject:', error);
        this.errorMessage.set('Unable to update subject');
        this.loading.set(false);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/subjects']);
  }
}