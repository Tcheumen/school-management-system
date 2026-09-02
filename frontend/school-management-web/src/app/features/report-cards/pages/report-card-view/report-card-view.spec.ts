import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCardView } from './report-card-view';

describe('ReportCardView', () => {
  let component: ReportCardView;
  let fixture: ComponentFixture<ReportCardView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportCardView],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportCardView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
