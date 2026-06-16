import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, of, throwError } from 'rxjs';
import { ANIMATION_TEST_PROVIDER } from '../../shared/testing/test-helpers';
import { RestatementConstants } from '../restatement.constants';
import { CommentsList } from '../restatement.models';
import { RestatementService } from '../restatement.service';
import { TrackComponent } from './track.component';

/**
 * UNIT TEST — TrackComponent
 *
 * Reads comment ID from route params, loads all comments, and filters
 * to show the selected comment detail card.
 */

const mockComments: CommentsList[] = [
  { id: 1, postId: 10, name: 'Comment One', email: 'one@test.com', body: 'First comment' },
  { id: 2, postId: 20, name: 'Comment Two', email: 'two@test.com', body: 'Second comment' },
];

describe('TrackComponent', () => {
  let component: TrackComponent;
  let fixture: ComponentFixture<TrackComponent>;
  let restatementServiceSpy: jasmine.SpyObj<RestatementService>;

  beforeEach(async () => {
    restatementServiceSpy = jasmine.createSpyObj('RestatementService', ['getCommentsList']);
    restatementServiceSpy.getCommentsList.and.returnValue(of(mockComments));

    await TestBed.configureTestingModule({
      imports: [TrackComponent],
      providers: [
        ANIMATION_TEST_PROVIDER,
        { provide: RestatementService, useValue: restatementServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '1' } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackComponent);
    component = fixture.componentInstance;
  });

  // ─── Basic setup ───────────────────────────────────────────────────────────

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // ─── ngOnInit ──────────────────────────────────────────────────────────────

  it('should read comment ID from route params', () => {
    fixture.detectChanges();
    expect(component.getCommentID).toBe(1);
  });

  it('should call getCommentsList with commentsApiURL on init', () => {
    fixture.detectChanges();

    expect(restatementServiceSpy.getCommentsList)
      .toHaveBeenCalledWith(RestatementConstants.commentsApiURL);
  });

  it('should set getSelectedComment matching route ID', () => {
    fixture.detectChanges();

    expect(component.getSelectedComment).toEqual(mockComments[0]);
    expect(component.getSelectedComment.email).toBe('one@test.com');
  });

  it('should set errorMessage when API call fails', () => {
    restatementServiceSpy.getCommentsList.and.returnValue(
      throwError(() => ({ message: 'Track load failed' }))
    );

    fixture.detectChanges();

    expect(component.errorMessage).toBe('Track load failed');
  });

  // ─── Template tests ────────────────────────────────────────────────────────

  it('should display page title in template', () => {
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.page-title');
    expect(title?.textContent?.trim()).toBe('Track');
  });

  it('should display selected comment email in template', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('one@test.com');
  });

  it('should show error message in template when API fails', () => {
    restatementServiceSpy.getCommentsList.and.returnValue(
      throwError(() => ({ message: 'API error' }))
    );

    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('.error-message');
    expect(errorEl?.textContent).toContain('API error');
  });

  it('should show loading spinner while data is loading', () => {
    restatementServiceSpy.getCommentsList.and.returnValue(EMPTY);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('mat-spinner')).toBeTruthy();
  });
});
