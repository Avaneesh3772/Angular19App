import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ANIMATION_TEST_PROVIDER, createDialogProviders } from '../../shared/testing/test-helpers';
import { DialogCreateResourceComponent } from './dialog-create-resource.component';

describe('DialogCreateResourceComponent', () => {
  let component: DialogCreateResourceComponent;
  let fixture: ComponentFixture<DialogCreateResourceComponent>;
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
