import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentReportCard } from './student-report-card';

describe('StudentReportCard', () => {
  let component: StudentReportCard;
  let fixture: ComponentFixture<StudentReportCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentReportCard],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentReportCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
