import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundingModelCalculationComponent } from './rounding-model-calculation.component';

describe('RoundingModelCalculationComponent', () => {
  let component: RoundingModelCalculationComponent;
  let fixture: ComponentFixture<RoundingModelCalculationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoundingModelCalculationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoundingModelCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
