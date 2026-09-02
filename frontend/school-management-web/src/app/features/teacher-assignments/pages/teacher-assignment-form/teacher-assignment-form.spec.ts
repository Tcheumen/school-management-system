import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherAssignmentForm } from './teacher-assignment-form';

describe('TeacherAssignmentForm', () => {
  let component: TeacherAssignmentForm;
  let fixture: ComponentFixture<TeacherAssignmentForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherAssignmentForm],
    }).compileComponents();

    fixture = TestBed.createComponent(TeacherAssignmentForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
