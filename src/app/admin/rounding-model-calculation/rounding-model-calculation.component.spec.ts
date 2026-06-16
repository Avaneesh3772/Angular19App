import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ANIMATION_TEST_PROVIDER } from '../../shared/testing/test-helpers';
import { AdminService } from '../admin.service';
import { RoundingModelCalculationComponent } from './rounding-model-calculation.component';

describe('RoundingModelCalculationComponent', () => {
  let component: RoundingModelCalculationComponent;
  let fixture: ComponentFixture<RoundingModelCalculationComponent>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;

  beforeEach(async () => {
    adminServiceSpy = jasmine.createSpyObj('AdminService', ['getUsersList']);
    adminServiceSpy.getUsersList.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [RoundingModelCalculationComponent],
      providers: [
        ANIMATION_TEST_PROVIDER,
        { provide: AdminService, useValue: adminServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RoundingModelCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
