import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {
  ANIMATION_TEST_PROVIDER,
  createDialogProviders,
  createMatDialogRefMock,
} from '../../shared/testing/test-helpers';
import { DialogCreateResourceComponent } from './dialog-create-resource.component';

/**
 * UNIT TEST — DialogCreateResourceComponent
 *
 * Dialog form for creating a new post. Tests form submit/close behaviour
 * via mocked MatDialogRef (createDialogProviders helper).
 */

describe('DialogCreateResourceComponent', () => {
  let component: DialogCreateResourceComponent;
  let fixture: ComponentFixture<DialogCreateResourceComponent>;
  let dialogRef: ReturnType<typeof createMatDialogRefMock>;
  const dialogProviders = createDialogProviders();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCreateResourceComponent],
      providers: [ANIMATION_TEST_PROVIDER, ...dialogProviders],
    })
      .overrideComponent(DialogCreateResourceComponent, {
        set: { providers: dialogProviders },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DialogCreateResourceComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef) as unknown as ReturnType<typeof createMatDialogRefMock>;
    fixture.detectChanges();
  });

  // ─── Basic setup ───────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize createPost with empty values', () => {
    expect(component.createPost).toEqual({ title: '', body: '', userId: 0 });
  });

  // ─── Dialog actions ────────────────────────────────────────────────────────

  it('formSubmit should close dialog with createPost data', () => {
    component.createPost = { title: 'Test Title', body: 'Test body content', userId: 5 };

    component.formSubmit({ value: component.createPost } as NgForm);

    expect(dialogRef.close).toHaveBeenCalledWith(component.createPost);
  });

  it('closeDialog should close dialog with null', () => {
    component.closeDialog();

    expect(dialogRef.close).toHaveBeenCalledWith(null);
  });

  // ─── Template tests ────────────────────────────────────────────────────────

  it('should display dialog title in template', () => {
    const title = fixture.nativeElement.querySelector('[mat-dialog-title]');
    expect(title?.textContent?.trim()).toBe('Create Post Data');
  });

  it('should render submit and cancel buttons in template', () => {
    const submitBtn = fixture.nativeElement.querySelector('button[type="submit"]');
    const cancelBtn = fixture.nativeElement.querySelector('button[type="button"]');

    expect(submitBtn?.textContent?.trim()).toContain('Submit Data');
    expect(cancelBtn?.textContent?.trim()).toBe('Cancel');
  });
});
