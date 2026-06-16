import { ComponentFixture, TestBed } from '@angular/core/testing';
import { statusType } from '../../shared/constants/app.constants';
import { AppCommonService } from '../../shared/services/app-common.service';
import { ANIMATION_TEST_PROVIDER } from '../../shared/testing/test-helpers';
import { TemplateList } from '../role.models';
import { MonthlyComponent } from './monthly.component';

/**
 * UNIT TEST — MonthlyComponent
 *
 * Child component using Angular 19 signal input (monthlyTemplateList).
 * Use fixture.componentRef.setInput() to pass parent data in tests.
 */

const mockMonthlyTemplates: TemplateList[] = [{
  template: 'Master Template',
  frequency: 'monthly',
  month: 11,
  year: 2019,
  lastActionDate: '2021-02-01 23:06:18',
  status: 'Uploaded',
  comments: 'Monthly comments',
  user: 'Rakesh Mishra',
}];

describe('MonthlyComponent', () => {
  let component: MonthlyComponent;
  let fixture: ComponentFixture<MonthlyComponent>;
  let appCommonSpy: jasmine.SpyObj<AppCommonService>;

  beforeEach(async () => {
    appCommonSpy = jasmine.createSpyObj('AppCommonService', ['getColorForStatus']);
    appCommonSpy.getColorForStatus.and.callFake((status: string) => {
      if (status === statusType.success) return 'green';
      if (status === statusType.failed) return 'red';
      return 'orange';
    });

    await TestBed.configureTestingModule({
      imports: [MonthlyComponent],
      providers: [
        ANIMATION_TEST_PROVIDER,
        { provide: AppCommonService, useValue: appCommonSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MonthlyComponent);
    component = fixture.componentInstance;

    // Signal input — set before detectChanges so ngOnInit reads the data
    fixture.componentRef.setInput('monthlyTemplateList', mockMonthlyTemplates);
    fixture.detectChanges();
  });

  // ─── Basic setup ───────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set templateName from first monthly template on init', () => {
    expect(component.templateName).toBe('Master Template');
  });

  // ─── Component methods ─────────────────────────────────────────────────────

  it('checkStatus should delegate to AppCommonService', () => {
    expect(component.checkStatus(statusType.uploaded)).toBe('orange');
    expect(appCommonSpy.getColorForStatus).toHaveBeenCalledWith(statusType.uploaded);
  });

  it('dateConvert should return formatted date string', () => {
    const result = component.dateConvert('2021-02-01 23:06:18');
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  });

  // ─── Template tests ────────────────────────────────────────────────────────

  it('should display template name with Monthly label in accordion header', () => {
    const header = fixture.nativeElement.querySelector('.accordion-header');
    expect(header?.textContent).toContain('Master Template');
    expect(header?.textContent).toContain('Monthly');
  });

  it('should render user info from monthlyTemplateList input', () => {
    expect(fixture.nativeElement.textContent).toContain('Rakesh Mishra');
    expect(fixture.nativeElement.textContent).toContain('Uploaded');
  });
});
