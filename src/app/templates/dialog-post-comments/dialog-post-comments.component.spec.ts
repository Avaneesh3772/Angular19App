import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatDialogRef } from '@angular/material/dialog';
import { EMPTY, of, throwError } from 'rxjs';
import {
  ANIMATION_TEST_PROVIDER,
  createDialogProviders,
  createMatDialogRefMock,
} from '../../shared/testing/test-helpers';
import { TemplateConstants } from '../template.constants';
import { CommentList, PostList } from '../template.models';
import { TemplatesService } from '../templates.service';
import { DialogPostCommentsComponent } from './dialog-post-comments.component';

/**
 * UNIT TEST — DialogPostCommentsComponent
 *
 * Loads comments for a selected post row. MAT_DIALOG_DATA provides rowData;
 * TemplatesService.getAllCommentsData is mocked.
 */

const mockPost: PostList = { id: 1, userId: 1, title: 'Test Post', body: 'Body' };

const mockComments: CommentList[] = [{
  postId: 1,
  id: 1,
  name: 'Test User',
  email: 'test@test.com',
  body: 'Test comment body',
}];

describe('DialogPostCommentsComponent', () => {
  let component: DialogPostCommentsComponent;
  let fixture: ComponentFixture<DialogPostCommentsComponent>;
  let templatesServiceSpy: jasmine.SpyObj<TemplatesService>;
  let dialogRef: ReturnType<typeof createMatDialogRefMock>;
  const dialogProviders = createDialogProviders({ rowData: mockPost });

  beforeEach(async () => {
    templatesServiceSpy = jasmine.createSpyObj('TemplatesService', ['getAllCommentsData']);
    templatesServiceSpy.getAllCommentsData.and.returnValue(of(mockComments));

    await TestBed.configureTestingModule({
      imports: [DialogPostCommentsComponent],
      providers: [
        ANIMATION_TEST_PROVIDER,
        ...dialogProviders,
        { provide: TemplatesService, useValue: templatesServiceSpy },
      ],
    })
      .overrideComponent(DialogPostCommentsComponent, {
        set: { providers: [...dialogProviders, { provide: TemplatesService, useValue: templatesServiceSpy }] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DialogPostCommentsComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef) as unknown as ReturnType<typeof createMatDialogRefMock>;
  });

  // ─── Basic setup ───────────────────────────────────────────────────────────

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should receive rowData from MAT_DIALOG_DATA', () => {
    fixture.detectChanges();
    expect(component.rowData).toEqual(mockPost);
  });

  // ─── ngOnInit / getCommentsData ────────────────────────────────────────────

  it('should call getAllCommentsData with correct URL on init', () => {
    fixture.detectChanges();

    expect(templatesServiceSpy.getAllCommentsData)
      .toHaveBeenCalledWith(TemplateConstants.commentsApiURL(mockPost.id));
  });

  it('should populate dataSource and set userDataLoaded on success', () => {
    fixture.detectChanges();

    expect(component.dataSource.length).toBe(1);
    expect(component.dataSource[0].email).toBe('test@test.com');
    expect(component.userDataLoaded).toBeTrue();
  });

  it('should set errorMessage when comments API fails', () => {
    templatesServiceSpy.getAllCommentsData.and.returnValue(
      throwError(() => ({ message: 'Comments load failed' }))
    );

    fixture.detectChanges();

    expect(component.errorMessage).toBe('Comments load failed');
    expect(component.userDataLoaded).toBeFalse();
  });

  it('should have correct displayedColumns', () => {
    fixture.detectChanges();
    expect(component.displayedColumns).toEqual(TemplateConstants.displayedColumnsComments);
  });

  it('closeDialog should close dialog with true', () => {
    component.closeDialog();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  // ─── Template tests ────────────────────────────────────────────────────────

  it('should display post ID in dialog title', () => {
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.dialog-title-row');
    expect(title?.textContent).toContain('1');
  });

  it('should show comments table when userDataLoaded is true', () => {
    fixture.detectChanges();

    const table = fixture.debugElement.query(By.css('table[mat-table], mat-table'));
    expect(table).toBeTruthy();
  });

  it('should show loading spinner while comments are loading', () => {
    templatesServiceSpy.getAllCommentsData.and.returnValue(EMPTY);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('mat-spinner')).toBeTruthy();
  });
});
