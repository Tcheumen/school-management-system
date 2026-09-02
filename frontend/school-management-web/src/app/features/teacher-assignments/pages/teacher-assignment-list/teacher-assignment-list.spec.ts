import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherAssignmentList } from './teacher-assignment-list';

describe('TeacherAssignmentList', () => {
  let component: TeacherAssignmentList;
  let fixture: ComponentFixture<TeacherAssignmentList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherAssignmentList],
    }).compileComponents();

    fixture = TestBed.createComponent(TeacherAssignmentList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
