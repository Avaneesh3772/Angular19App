import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EMPTY, of, throwError } from 'rxjs';
import { statusType } from '../../shared/constants/app.constants';
import { AppCommonService } from '../../shared/services/app-common.service';
import { ANIMATION_TEST_PROVIDER } from '../../shared/testing/test-helpers';
import { AdminConstants } from '../admin.constants';
import { TemplateDetails } from '../admin.models';
import { AdminService } from '../admin.service';
import { RoundingModelCalculationComponent } from './rounding-model-calculation.component';

/**
 * UNIT TEST — RoundingModelCalculationComponent
 *
 * This component loads admin template data on init and displays it in a Material table.
 *
 * Dependencies we mock (no real HTTP or shared service calls in tests):
 *   - AdminService.getUsersList()  → fetches template rows from mock JSON URL
 *   - AppCommonService.getColorForStatus() → returns CSS color for status badges
 *
 * Observable return values used in tests:
 *   - of(mockTemplates)     → simulates successful API response
 *   - throwError(() => err)  → simulates API failure (error callback runs)
 *   - EMPTY                  → observable that never emits → keeps loading spinner visible
 *
 * fixture.detectChanges() triggers ngOnInit() and updates the DOM — call it
 * whenever you need init logic or template bindings to run.
 */

// ─── Shared mock data (reused across multiple tests) ─────────────────────────
const mockTemplates: TemplateDetails[] = [{
  quarter: 'Q1',
  month: 11,
  year: 2019,
  template: 'Master Template',
  status: 'Uploaded',
  initiationdate: '2021-12-05 21:36:54',
  comments: 'Lorem ipsum',
  initiatedby: 'Avaneesh Mishra',
}];

// ─────────────────────────────────────────────────────────────────────────────

describe('RoundingModelCalculationComponent', () => {
  let component: RoundingModelCalculationComponent;
  let fixture: ComponentFixture<RoundingModelCalculationComponent>;

  // Spy objects replace real services — we control what they return per test
  let adminServiceSpy: jasmine.SpyObj<AdminService>;
  let appCommonSpy: jasmine.SpyObj<AppCommonService>;

  beforeEach(async () => {
    // AdminService spy — only getUsersList is used by this component
    adminServiceSpy = jasmine.createSpyObj('AdminService', ['getUsersList']);
    // Default: return mock data immediately (success path for most tests)
    adminServiceSpy.getUsersList.and.returnValue(of(mockTemplates));

    // AppCommonService spy — checkStatus() delegates color lookup here
    appCommonSpy = jasmine.createSpyObj('AppCommonService', ['getColorForStatus']);
    appCommonSpy.getColorForStatus.and.callFake((status: string) => {
      if (status === statusType.success) return 'green';
      if (status === statusType.failed) return 'red';
      return 'orange'; // uploaded and any other status
    });

    await TestBed.configureTestingModule({
      imports: [RoundingModelCalculationComponent],
      providers: [
        ANIMATION_TEST_PROVIDER, // disables Material animations in tests
        { provide: AdminService, useValue: adminServiceSpy },
        { provide: AppCommonService, useValue: appCommonSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RoundingModelCalculationComponent);
    component = fixture.componentInstance;
  });

  // ─── Basic setup ───────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty dataSource before ngOnInit', () => {
    // No detectChanges() — ngOnInit has not run yet
    expect(component.dataSource).toEqual([]);
    expect(component.userDataLoaded).toBeFalse();
  });

  // ─── ngOnInit / AdminService integration ─────────────────────────────────────

  it('should call getUsersList with adminMockDataURL on init', () => {
    fixture.detectChanges(); // runs ngOnInit → showUserTable() → getUsersList()

    expect(adminServiceSpy.getUsersList).toHaveBeenCalledWith(AdminConstants.adminMockDataURL);
  });

  it('should populate dataSource and set userDataLoaded on success', () => {
    fixture.detectChanges();

    expect(component.dataSource.length).toBe(1);
    expect(component.dataSource[0].template).toBe('Master Template');
    expect(component.userDataLoaded).toBeTrue();
    expect(component.errorMessage).toBe('');
  });

  it('should set errorMessage when API call fails', () => {
    // Override default spy return for this test only
    adminServiceSpy.getUsersList.and.returnValue(
      throwError(() => ({ message: 'Failed to load admin data' }))
    );

    fixture.detectChanges();

    expect(component.errorMessage).toBe('Failed to load admin data');
    expect(component.userDataLoaded).toBeFalse();
  });

  // ─── Component properties & methods ────────────────────────────────────────

  it('should have correct displayedColumns', () => {
    fixture.detectChanges();

    // Column keys must match matColumnDef names in the template
    expect(component.displayedColumns).toEqual([
      'monthYear', 'initiationdate', 'template', 'initiatedby', 'status',
    ]);
  });

  it('checkStatus should delegate to AppCommonService', () => {
    // Pure method test — no detectChanges() needed
    expect(component.checkStatus(statusType.success)).toBe('green');
    expect(component.checkStatus(statusType.failed)).toBe('red');
    expect(component.checkStatus(statusType.uploaded)).toBe('orange');
    expect(appCommonSpy.getColorForStatus).toHaveBeenCalledWith(statusType.uploaded);
  });

  it('dateConvert should return formatted date string', () => {
    // Uses DateUtils.getUTCFormatTime() — format is YYYY-MM-DD HH:mm:ss
    const result = component.dateConvert('2021-12-05 21:36:54');
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  });

  // ─── Template (DOM) tests ──────────────────────────────────────────────────
  // Query the rendered HTML to verify what the user sees

  it('should display page title in template', () => {
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.page-title');
    expect(title?.textContent?.trim()).toBe('Rounding Model Calculation');
  });

  it('should show data table when userDataLoaded is true', () => {
    fixture.detectChanges(); // success path → userDataLoaded becomes true

    const table = fixture.debugElement.query(By.css('table[mat-table], mat-table'));
    expect(table).toBeTruthy();
  });

  it('should render table rows matching dataSource length', () => {
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('mat-row, tr[mat-row]'));
    expect(rows.length).toBe(mockTemplates.length);
  });

  it('should show error message in template when API fails', () => {
    adminServiceSpy.getUsersList.and.returnValue(
      throwError(() => ({ message: 'API error' }))
    );

    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('.error-message');
    expect(errorEl).toBeTruthy();
    expect(errorEl.textContent).toContain('API error');
  });

  it('should show loading spinner while data is loading', () => {
    // EMPTY never emits — subscribe success/error never run, userDataLoaded stays false
    adminServiceSpy.getUsersList.and.returnValue(EMPTY);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('mat-spinner')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.page-title')?.textContent)
      .toContain('Rounding Model Calculation');
  });
});
