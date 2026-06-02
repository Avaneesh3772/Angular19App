import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeCalculationComponent } from './le-calculation.component';

describe('LeCalculationComponent', () => {
  let component: LeCalculationComponent;
  let fixture: ComponentFixture<LeCalculationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeCalculationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
