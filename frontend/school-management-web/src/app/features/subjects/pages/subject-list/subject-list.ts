import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Subject } from '../../models/subject.model';
import { SubjectService } from '../../services/subject.service';

@Component({
  selector: 'app-subject-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './subject-list.html',
  styleUrl: './subject-list.scss'
})
export class SubjectList implements OnInit {

  subjects = signal<Subject[]>([]);
  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private subjectService: SubjectService
  ) { }

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.subjectService.getAll().subscribe({
      next: (subjects) => {
        this.subjects.set(subjects);
        this.loading.set(false);
      },

      error: (error) => {
        console.error('Error loading subjects:', error);

        this.errorMessage.set(
          'Unable to load subjects'
        );

        this.loading.set(false);
      }
    });
  }

  deleteSubject(id: number): void {
    const confirmed = confirm(
      'Are you sure you want to delete this subject?'
    );

    if (!confirmed) {
      return;
    }

    this.subjectService.delete(id).subscribe({
      next: () => {
        this.loadSubjects();
      },

      error: (error) => {
        console.error('Error deleting subject:', error);

        this.errorMessage.set(
          'Unable to delete subject'
        );
      }
    });
  }
}