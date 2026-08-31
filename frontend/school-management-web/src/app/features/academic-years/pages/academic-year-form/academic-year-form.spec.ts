import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicYearForm } from './academic-year-form';

describe('AcademicYearForm', () => {
  let component: AcademicYearForm;
  let fixture: ComponentFixture<AcademicYearForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademicYearForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicYearForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
