import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EMPTY, of, throwError } from 'rxjs';
import { ANIMATION_TEST_PROVIDER } from '../shared/testing/test-helpers';
import { TemplateConstants } from './template.constants';
import { CreatePostModel, PostList } from './template.models';
import { TemplatesService } from './templates.service';
import { DialogCreateResourceComponent } from './dialog-create-resource/dialog-create-resource.component';
import { DialogPostCommentsComponent } from './dialog-post-comments/dialog-post-comments.component';
import { TemplatesComponent } from './templates.component';

/**
 * UNIT TEST — TemplatesComponent
 *
 * Tests CRUD operations on template posts via mocked TemplatesService and MatDialog.
 * Pattern matches DashboardComponent: spy services, call detectChanges() per test.
 */

const mockPosts: PostList[] = [
  { id: 1, userId: 1, title: 'Angular 19 test cases', body: 'angular 19 unit test cases' },
  { id: 2, userId: 2, title: 'Second Post', body: 'Another body' },
];

describe('TemplatesComponent', () => {
  let component: TemplatesComponent;
  let fixture: ComponentFixture<TemplatesComponent>;
  let templatesServiceSpy: jasmine.SpyObj<TemplatesService>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    templatesServiceSpy = jasmine.createSpyObj('TemplatesService', [
      'getAllTemplateData',
      'postNewTemplateData',
      'updateNewTemplateData',
      'deleteTemplateData',
    ]);
    templatesServiceSpy.getAllTemplateData.and.returnValue(of(mockPosts));
    templatesServiceSpy.postNewTemplateData.and.returnValue(of(mockPosts[0]));
    templatesServiceSpy.updateNewTemplateData.and.returnValue(of(mockPosts[0]));
    templatesServiceSpy.deleteTemplateData.and.returnValue(of({}));

    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    matDialogSpy.open.and.returnValue({ afterClosed: () => of(undefined) } as MatDialogRef<unknown>);

    await TestBed.configureTestingModule({
      imports: [TemplatesComponent],
      providers: [
        ANIMATION_TEST_PROVIDER,
        { provide: TemplatesService, useValue: templatesServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy },
      ],
    })
      .overrideComponent(TemplatesComponent, {
        set: { providers: [{ provide: MatDialog, useValue: matDialogSpy }] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TemplatesComponent);
    component = fixture.componentInstance;
  });

  // ─── Basic setup ───────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty dataSource before ngOnInit', () => {
    expect(component.dataSource).toEqual([]);
    expect(component.userDataLoaded).toBeFalse();
  });

  // ─── ngOnInit / getTemplateData ────────────────────────────────────────────

  it('should call getAllTemplateData with correct URL on init', () => {
    fixture.detectChanges();

    expect(templatesServiceSpy.getAllTemplateData)
      .toHaveBeenCalledWith(TemplateConstants.getTemplateURL);
  });

  it('should populate dataSource and set userDataLoaded on success', () => {
    fixture.detectChanges();

    expect(component.dataSource.length).toBe(2);
    expect(component.dataSource[0].title).toBe('Angular 19 test cases');
    expect(component.userDataLoaded).toBeTrue();
  });

  it('should set errorMessage when getTemplateData fails', () => {
    templatesServiceSpy.getAllTemplateData.and.returnValue(
      throwError(() => ({ message: 'Failed to load templates' }))
    );

    fixture.detectChanges();

    expect(component.errorMessage).toBe('Failed to load templates');
    expect(component.userDataLoaded).toBeFalse();
  });

  it('should have correct displayedColumns', () => {
    fixture.detectChanges();

    expect(component.displayedColumns).toEqual(TemplateConstants.displayedColumns);
  });

  // ─── Dialog & CRUD methods ─────────────────────────────────────────────────

  it('should open create resource dialog', () => {
    fixture.detectChanges();

    component.openCreateNewResourceDialog();

    expect(matDialogSpy.open).toHaveBeenCalledWith(
      DialogCreateResourceComponent,
      jasmine.objectContaining({ height: '500px', width: '600px' })
    );
  });

  it('should call postNewTemplateData when dialog returns valid post data', () => {
    const newPost: CreatePostModel = { title: 'New', body: 'New body text', userId: 1 };
    matDialogSpy.open.and.returnValue({ afterClosed: () => of(newPost) } as MatDialogRef<unknown>);

    fixture.detectChanges();
    component.openCreateNewResourceDialog();

    expect(templatesServiceSpy.postNewTemplateData).toHaveBeenCalled();
    expect(templatesServiceSpy.getAllTemplateData).toHaveBeenCalledTimes(2); // init + refresh
  });

  it('should NOT call postNewTemplateData when dialog returns invalid data', () => {
    matDialogSpy.open.and.returnValue({ afterClosed: () => of(null) } as MatDialogRef<unknown>);

    fixture.detectChanges();
    component.openCreateNewResourceDialog();

    expect(templatesServiceSpy.postNewTemplateData).not.toHaveBeenCalled();
  });

  it('should call updateNewTemplateData when updateResource is invoked', () => {
    fixture.detectChanges();

    component.updateResource(mockPosts[0]);

    expect(templatesServiceSpy.updateNewTemplateData).toHaveBeenCalledWith(
      TemplateConstants.updateTemplateURL(mockPosts[0].id),
      jasmine.objectContaining({ id: mockPosts[0].id })
    );
  });

  it('should call deleteTemplateData when deleteResource is invoked', () => {
    fixture.detectChanges();

    component.deleteResource(mockPosts[0]);

    expect(templatesServiceSpy.deleteTemplateData)
      .toHaveBeenCalledWith(TemplateConstants.deleteTemplateURL(mockPosts[0].id));
  });

  it('should open comments dialog with row data', () => {
    fixture.detectChanges();

    component.openCommentsDialog(mockPosts[0]);

    expect(matDialogSpy.open).toHaveBeenCalledWith(
      DialogPostCommentsComponent,
      jasmine.objectContaining({ data: { rowData: mockPosts[0] } })
    );
  });

  // ─── Template (DOM) tests ──────────────────────────────────────────────────

  it('should display page title in template', () => {
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.page-title');
    expect(title?.textContent?.trim()).toBe('Template');
  });

  it('should show data table when userDataLoaded is true', () => {
    fixture.detectChanges();

    const table = fixture.debugElement.query(By.css('table[mat-table], mat-table'));
    expect(table).toBeTruthy();
  });

  it('should render table rows matching dataSource length', () => {
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('mat-row, tr[mat-row]'));
    expect(rows.length).toBe(mockPosts.length);
  });

  it('should show error message in template when API fails', () => {
    templatesServiceSpy.getAllTemplateData.and.returnValue(
      throwError(() => ({ message: 'API error' }))
    );

    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('.error-message');
    expect(errorEl?.textContent).toContain('API error');
  });

  it('should show loading spinner while data is loading', () => {
    templatesServiceSpy.getAllTemplateData.and.returnValue(EMPTY);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('mat-spinner')).toBeTruthy();
  });
});
