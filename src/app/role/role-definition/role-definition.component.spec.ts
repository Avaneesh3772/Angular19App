import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ANIMATION_TEST_PROVIDER } from '../../shared/testing/test-helpers';
import { frequencyType, RoleConstants } from '../role.constants';
import { TemplateList } from '../role.models';
import { RoleService } from '../role.service';
import { Child2ParentData } from '../quarterly/quarterly.component';
import { RoleDefinitionComponent } from './role-definition.component';

/**
 * UNIT TEST — RoleDefinitionComponent
 *
 * Loads role mock data and splits it into monthly/quarterly lists
 * for child components. Also handles child-to-parent event data.
 */

const mockTemplates: TemplateList[] = [
  {
    template: 'Monthly Template',
    frequency: frequencyType.monthly,
    month: 11,
    year: 2019,
    lastActionDate: '2021-02-01 23:06:18',
    status: 'Uploaded',
    comments: 'Monthly comment',
    user: 'Rakesh Mishra',
  },
  {
    template: 'Quarterly Template',
    frequency: frequencyType.quarterly,
    month: 3,
    year: 2020,
    lastActionDate: '2021-03-01 10:00:00',
    status: 'Success',
    comments: 'Quarterly comment',
    user: 'Avaneesh Mishra',
  },
];

describe('RoleDefinitionComponent', () => {
  let component: RoleDefinitionComponent;
  let fixture: ComponentFixture<RoleDefinitionComponent>;
  let roleServiceSpy: jasmine.SpyObj<RoleService>;

  beforeEach(async () => {
    roleServiceSpy = jasmine.createSpyObj('RoleService', ['getUsersList']);
    roleServiceSpy.getUsersList.and.returnValue(of(mockTemplates));

    await TestBed.configureTestingModule({
      imports: [RoleDefinitionComponent],
      providers: [
        ANIMATION_TEST_PROVIDER,
        { provide: RoleService, useValue: roleServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleDefinitionComponent);
    component = fixture.componentInstance;
  });

  // ─── Basic setup ───────────────────────────────────────────────────────────

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have empty template lists before ngOnInit', () => {
    expect(component.monthlyTemplateList).toEqual([]);
    expect(component.quarterlyTemplateList).toEqual([]);
  });

  // ─── ngOnInit / getUserData ────────────────────────────────────────────────

  it('should call getUsersList with roleMockDataURL on init', () => {
    fixture.detectChanges();

    expect(roleServiceSpy.getUsersList)
      .toHaveBeenCalledWith(RoleConstants.roleMockDataURL);
  });

  it('should split data into monthly and quarterly lists', () => {
    fixture.detectChanges();

    expect(component.monthlyTemplateList.length).toBe(1);
    expect(component.monthlyTemplateList[0].template).toBe('Monthly Template');
    expect(component.quarterlyTemplateList.length).toBe(1);
    expect(component.quarterlyTemplateList[0].template).toBe('Quarterly Template');
  });

  it('should set errorMessage when API call fails', () => {
    roleServiceSpy.getUsersList.and.returnValue(
      throwError(() => ({ message: 'Role data failed' }))
    );

    fixture.detectChanges();

    expect(component.errorMessage).toBe('Role data failed');
  });

  // ─── Child-to-parent communication ───────────────────────────────────────

  it('printChild2ParentData should store event data', () => {
    const childData: Child2ParentData = { name: 'Andrew', city: 'London', Gender: 'Male' };

    component.printChild2ParentData(childData);

    expect(component.displayChild2ParentData).toEqual(childData);
  });

  // ─── Template tests ────────────────────────────────────────────────────────

  it('should display page title in template', () => {
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.page-title');
    expect(title?.textContent?.trim()).toBe('Role Definition');
  });

  it('should render monthly and quarterly child components when data exists', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-monthly')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-quarterly')).toBeTruthy();
  });

  it('should display child-to-parent data in template when received', () => {
    component.printChild2ParentData({ name: 'Andrew', city: 'London', Gender: 'Male' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Andrew');
    expect(fixture.nativeElement.textContent).toContain('London');
  });
});
