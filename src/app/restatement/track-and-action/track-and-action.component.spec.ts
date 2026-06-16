import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ANIMATION_TEST_PROVIDER } from '../../shared/testing/test-helpers';
import { RestatementService } from '../restatement.service';
import { TrackAndActionComponent } from './track-and-action.component';

describe('TrackAndActionComponent', () => {
  let component: TrackAndActionComponent;
  let fixture: ComponentFixture<TrackAndActionComponent>;
  let restatementServiceSpy: jasmine.SpyObj<RestatementService>;

  beforeEach(async () => {
    restatementServiceSpy = jasmine.createSpyObj('RestatementService', ['getCommentsList']);
    restatementServiceSpy.getCommentsList.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [TrackAndActionComponent],
      providers: [
        ANIMATION_TEST_PROVIDER,
        provideRouter([]),
        { provide: RestatementService, useValue: restatementServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackAndActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
