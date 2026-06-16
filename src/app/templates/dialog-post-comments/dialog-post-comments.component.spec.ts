import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import {
  ANIMATION_TEST_PROVIDER,
  createDialogProviders,
} from '../../shared/testing/test-helpers';
import { PostList } from '../template.models';
import { TemplatesService } from '../templates.service';
import { DialogPostCommentsComponent } from './dialog-post-comments.component';

const mockPost: PostList = { id: 1, userId: 1, title: 'Test Post', body: 'Body' };

describe('DialogPostCommentsComponent', () => {
  let component: DialogPostCommentsComponent;
  let fixture: ComponentFixture<DialogPostCommentsComponent>;
  let templatesServiceSpy: jasmine.SpyObj<TemplatesService>;
  const dialogProviders = createDialogProviders({ rowData: mockPost });

  beforeEach(async () => {
    templatesServiceSpy = jasmine.createSpyObj('TemplatesService', ['getAllCommentsData']);
    templatesServiceSpy.getAllCommentsData.and.returnValue(of([]));

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load comments on init', () => {
    expect(templatesServiceSpy.getAllCommentsData).toHaveBeenCalled();
  });
});
