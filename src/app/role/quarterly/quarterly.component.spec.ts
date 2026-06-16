import { ComponentFixture, TestBed } from '@angular/core/testing';
import { statusType } from '../../shared/constants/app.constants';
import { AppCommonService } from '../../shared/services/app-common.service';
import { ANIMATION_TEST_PROVIDER } from '../../shared/testing/test-helpers';
import { TemplateList } from '../role.models';
import { Child2ParentData, QuarterlyComponent } from './quarterly.component';

/**
 * UNIT TEST — QuarterlyComponent
 *
 * Child component with signal input (quartelyTemplateList) and signal output
 * (child2ParentDataTransfer). Tests @Input/@Output replacement patterns in Angular 19.
 */

const mockQuarterlyTemplates: TemplateList[] = [{
  template: 'Quarterly Master',
  frequency: 'quarterly',
  month: 3,
  year: 2020,
  lastActionDate: '2021-03-01 10:00:00',
  status: 'Success',
  comments: 'Quarterly comments',
  user: 'Avaneesh Mishra',
}];

describe('QuarterlyComponent', () => {
  let component: QuarterlyComponent;
  let fixture: ComponentFixture<QuarterlyComponent>;
  let appCommonSpy: jasmine.SpyObj<AppCommonService>;

  beforeEach(async () => {
    appCommonSpy = jasmine.createSpyObj('AppCommonService', ['getColorForStatus']);
    appCommonSpy.getColorForStatus.and.callFake((status: string) => {
      if (status === statusType.success) return 'green';
      if (status === statusType.failed) return 'red';
      return 'orange';
    });

    await TestBed.configureTestingModule({
      imports: [QuarterlyComponent],
      providers: [
        ANIMATION_TEST_PROVIDER,
        { provide: AppCommonService, useValue: appCommonSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QuarterlyComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('quartelyTemplateList', mockQuarterlyTemplates);
    fixture.detectChanges();
  });

  // ─── Basic setup ───────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set templateName from first quarterly template on init', () => {
    expect(component.templateName).toBe('Quarterly Master');
  });

  // ─── Component methods ─────────────────────────────────────────────────────

  it('checkStatus should delegate to AppCommonService', () => {
    expect(component.checkStatus(statusType.success)).toBe('green');
    expect(appCommonSpy.getColorForStatus).toHaveBeenCalledWith(statusType.success);
  });

  it('dateConvert should return formatted date string', () => {
    const result = component.dateConvert('2021-03-01 10:00:00');
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  });

  it('child2ParentMethod should emit Child2ParentData via output signal', () => {
    let emitted: Child2ParentData | undefined;
    component.child2ParentDataTransfer.subscribe(data => { emitted = data; });

    component.child2ParentMethod();

    expect(emitted).toEqual({ name: 'Andrew', city: 'London', Gender: 'Male' });
  });

  // ─── Template tests ────────────────────────────────────────────────────────

  it('should display template name with Quarterly label in accordion header', () => {
    const header = fixture.nativeElement.querySelector('.accordion-header');
    expect(header?.textContent).toContain('Quarterly Master');
    expect(header?.textContent).toContain('Quarterly');
  });

  it('should render user info from quartelyTemplateList input', () => {
    expect(fixture.nativeElement.textContent).toContain('Avaneesh Mishra');
    expect(fixture.nativeElement.textContent).toContain('Success');
  });

  it('should have child-to-parent button in template', () => {
    const button = fixture.nativeElement.querySelector('.child-to-parent-section button');
    expect(button).toBeTruthy();
    expect(button.textContent).toContain('Child component to Parent');
  });
});
