import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ANIMATION_TEST_PROVIDER } from '../../shared/testing/test-helpers';
import { InitiateAndDefineComponent } from './initiate-and-define.component';

/**
 * UNIT TEST — InitiateAndDefineComponent
 *
 * Static page with Material tabs — no service dependencies.
 */

describe('InitiateAndDefineComponent', () => {
  let component: InitiateAndDefineComponent;
  let fixture: ComponentFixture<InitiateAndDefineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitiateAndDefineComponent],
      providers: [ANIMATION_TEST_PROVIDER],
    }).compileComponents();

    fixture = TestBed.createComponent(InitiateAndDefineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display page title in template', () => {
    const title = fixture.nativeElement.querySelector('.page-title');
    expect(title?.textContent?.trim()).toBe('Initiate & Define');
  });

  it('should render mat-tab-group with three tabs', () => {
    const tabGroup = fixture.nativeElement.querySelector('mat-tab-group');
    expect(tabGroup).toBeTruthy();

    const tabLabels = fixture.nativeElement.querySelectorAll('.mdc-tab__text-label, .mat-mdc-tab');
    expect(tabLabels.length).toBeGreaterThanOrEqual(3);
  });

  it('should display first tab content by default', () => {
    expect(fixture.nativeElement.textContent).toContain('First Tab Content');
  });
});
