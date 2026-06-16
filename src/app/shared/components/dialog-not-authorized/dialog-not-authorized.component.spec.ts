import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ANIMATION_TEST_PROVIDER, createDialogProviders } from '../../testing/test-helpers';
import { DialogNotAuthorizedComponent } from './dialog-not-authorized.component';

describe('DialogNotAuthorizedComponent', () => {
  let component: DialogNotAuthorizedComponent;
  let fixture: ComponentFixture<DialogNotAuthorizedComponent>;
  const dialogProviders = createDialogProviders();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogNotAuthorizedComponent],
      providers: [ANIMATION_TEST_PROVIDER, ...dialogProviders],
    })
      .overrideComponent(DialogNotAuthorizedComponent, {
        set: { providers: dialogProviders },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DialogNotAuthorizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
