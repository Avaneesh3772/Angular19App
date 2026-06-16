import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EMPTY, of, throwError } from 'rxjs';
import { ANIMATION_TEST_PROVIDER, ROUTER_TEST_PROVIDER } from '../../shared/testing/test-helpers';
import { RestatementConstants } from '../restatement.constants';
import { CommentsList } from '../restatement.models';
import { RestatementService } from '../restatement.service';
import { TrackAndActionComponent } from './track-and-action.component';

/**
 * UNIT TEST — TrackAndActionComponent
 *
 * Loads comments, filters to id < 21, displays table, and navigates
 * to track detail on email link click.
 */

const mockComments: CommentsList[] = [
  { id: 5, postId: 1, name: 'Visible Comment', email: 'visible@test.com', body: 'Shown' },
  { id: 25, postId: 2, name: 'Hidden Comment', email: 'hidden@test.com', body: 'Filtered out' },
];

describe('TrackAndActionComponent', () => {
  let component: TrackAndActionComponent;
  let fixture: ComponentFixture<TrackAndActionComponent>;
  let restatementServiceSpy: jasmine.SpyObj<RestatementService>;
  let router: Router;

  beforeEach(async () => {
    restatementServiceSpy = jasmine.createSpyObj('RestatementService', ['getCommentsList']);
    restatementServiceSpy.getCommentsList.and.returnValue(of(mockComments));

    await TestBed.configureTestingModule({
      imports: [TrackAndActionComponent],
      providers: [
        ANIMATION_TEST_PROVIDER,
        ROUTER_TEST_PROVIDER,
        { provide: RestatementService, useValue: restatementServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackAndActionComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  // ─── Basic setup ───────────────────────────────────────────────────────────

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have empty dataSource before ngOnInit', () => {
    expect(component.dataSource).toEqual([]);
    expect(component.userDataLoaded).toBeFalse();
  });

  // ─── ngOnInit / showCommentsTable ──────────────────────────────────────────

  it('should call getCommentsList with commentsApiURL on init', () => {
    fixture.detectChanges();

    expect(restatementServiceSpy.getCommentsList)
      .toHaveBeenCalledWith(RestatementConstants.commentsApiURL);
  });

  it('should filter comments with id less than 21', () => {
    fixture.detectChanges();

    expect(component.dataSource.length).toBe(1);
    expect(component.dataSource[0].id).toBe(5);
    expect(component.userDataLoaded).toBeTrue();
  });

  it('should set errorMessage when API call fails', () => {
    restatementServiceSpy.getCommentsList.and.returnValue(
      throwError(() => ({ message: 'Load failed' }))
    );

    fixture.detectChanges();

    expect(component.errorMessage).toBe('Load failed');
    expect(component.userDataLoaded).toBeFalse();
  });

  it('should have correct displayedColumns', () => {
    fixture.detectChanges();
    expect(component.displayedColumns).toEqual(RestatementConstants.displayedColumns);
  });

  it('navigateToTrack should navigate to track route with comment id', () => {
    spyOn(router, 'navigate');

    component.navigateToTrack(mockComments[0]);

    expect(router.navigate).toHaveBeenCalledWith(['restatement/track', mockComments[0].id]);
  });

  // ─── Template tests ────────────────────────────────────────────────────────

  it('should display page title in template', () => {
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.page-title');
    expect(title?.textContent?.trim()).toBe('Track and Action');
  });

  it('should show data table when userDataLoaded is true', () => {
    fixture.detectChanges();

    const table = fixture.debugElement.query(By.css('table[mat-table], mat-table'));
    expect(table).toBeTruthy();
  });

  it('should render one table row after filtering', () => {
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('mat-row, tr[mat-row]'));
    expect(rows.length).toBe(1);
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
