import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ANIMATION_TEST_PROVIDER } from '../../shared/testing/test-helpers';
import { RestatementService } from '../restatement.service';
import { TrackComponent } from './track.component';

describe('TrackComponent', () => {
  let component: TrackComponent;
  let fixture: ComponentFixture<TrackComponent>;
  let restatementServiceSpy: jasmine.SpyObj<RestatementService>;

  beforeEach(async () => {
    restatementServiceSpy = jasmine.createSpyObj('RestatementService', ['getCommentsList']);
    restatementServiceSpy.getCommentsList.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [TrackComponent],
      providers: [
        ANIMATION_TEST_PROVIDER,
        { provide: RestatementService, useValue: restatementServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id: '1' } } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
