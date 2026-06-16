import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import {
  ANIMATION_TEST_PROVIDER,
  HTTP_TEST_PROVIDERS,
} from '../shared/testing/test-helpers';
import { TemplatesService } from './templates.service';
import { TemplatesComponent } from './templates.component';

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
    templatesServiceSpy.getAllTemplateData.and.returnValue(of([]));

    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    matDialogSpy.open.and.returnValue({ afterClosed: () => of(undefined) } as MatDialogRef<unknown>);

    await TestBed.configureTestingModule({
      imports: [TemplatesComponent],
      providers: [
        ANIMATION_TEST_PROVIDER,
        ...HTTP_TEST_PROVIDERS,
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
