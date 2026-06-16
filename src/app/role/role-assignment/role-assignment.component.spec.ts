import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EMPTY, of, throwError } from 'rxjs';
import { ANIMATION_TEST_PROVIDER } from '../../shared/testing/test-helpers';
import { RoleConstants } from '../role.constants';
import { Users, UsersRole } from '../role.models';
import { RoleService } from '../role.service';
import { RoleAssignmentComponent } from './role-assignment.component';

/**
 * UNIT TEST — RoleAssignmentComponent
 *
 * Search users by name, show dropdown results, and load role details
 * for the selected user via RoleService.
 */

const mockUsers: Users[] = [
  { employeeIdentifier: 101, firstName: 'Avaneesh', lastName: 'Mishra' },
  { employeeIdentifier: 102, firstName: 'Rakesh', lastName: 'Kumar' },
];

const mockRoles: UsersRole[] = [
  {
    employeeIdentifier: 101,
    roleName: 'Dashboard Viewer',
    roleDescription: 'Can view dashboard',
    roleType: 'Viewer',
  },
  {
    employeeIdentifier: 102,
    roleName: 'Admin',
    roleDescription: 'Full access',
    roleType: 'Admin',
  },
];

describe('RoleAssignmentComponent', () => {
  let component: RoleAssignmentComponent;
  let fixture: ComponentFixture<RoleAssignmentComponent>;
  let roleServiceSpy: jasmine.SpyObj<RoleService>;

  beforeEach(async () => {
    roleServiceSpy = jasmine.createSpyObj('RoleService', [
      'getUsersSearchList',
      'getUserFullDetails',
    ]);
    roleServiceSpy.getUsersSearchList.and.returnValue(of(mockUsers));
    roleServiceSpy.getUserFullDetails.and.returnValue(of(mockRoles));

    await TestBed.configureTestingModule({
      imports: [RoleAssignmentComponent],
      providers: [
        ANIMATION_TEST_PROVIDER,
        { provide: RoleService, useValue: roleServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleAssignmentComponent);
    component = fixture.componentInstance;
  });

  // ─── Basic setup ───────────────────────────────────────────────────────────

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // ─── ngOnInit ──────────────────────────────────────────────────────────────

  it('should call getUsersSearchList with roleAssignmentDataURL on init', () => {
    fixture.detectChanges();

    expect(roleServiceSpy.getUsersSearchList)
      .toHaveBeenCalledWith(RoleConstants.roleAssignmentDataURL);
  });

  it('should populate responseData on successful user search load', () => {
    fixture.detectChanges();

    expect(component.responseData.length).toBe(2);
    expect(component.responseData[0].firstName).toBe('Avaneesh');
  });

  it('should set errorMessage when user search load fails', () => {
    roleServiceSpy.getUsersSearchList.and.returnValue(
      throwError(() => ({ message: 'User list failed' }))
    );

    fixture.detectChanges();

    expect(component.errorMessage).toBe('User list failed');
  });

  // ─── Search box behaviour ──────────────────────────────────────────────────

  it('should filter users when search text is entered', () => {
    fixture.detectChanges();

    component.searchUser.setValue('Avaneesh');

    expect(component.filteredItems.length).toBe(1);
    expect(component.filteredItems[0].firstName).toBe('Avaneesh');
    expect(component.showResultBox).toBeTrue();
    expect(component.noRecordsFound).toBeFalse();
  });

  it('should set noRecordsFound when search has no matches', () => {
    fixture.detectChanges();

    component.searchUser.setValue('NonExistent');

    expect(component.filteredItems.length).toBe(0);
    expect(component.noRecordsFound).toBeTrue();
    expect(component.showResultBox).toBeFalse();
  });

  it('should have correct displayedColumns', () => {
    fixture.detectChanges();
    expect(component.displayedColumns).toEqual(RoleConstants.displayedColumns);
  });

  // ─── User selection ────────────────────────────────────────────────────────

  it('selectedValue should load roles for selected user', () => {
    fixture.detectChanges();

    component.selectedValue(mockUsers[0]);

    expect(component.userFullName).toBe('Avaneesh Mishra');
    expect(component.isUserDataAvailable).toBeTrue();
    expect(component.showResultBox).toBeFalse();
    expect(roleServiceSpy.getUserFullDetails)
      .toHaveBeenCalledWith(RoleConstants.roleAssignmentUserDataURL);
    expect(component.dataSource.length).toBe(1);
    expect(component.dataSource[0].roleName).toBe('Dashboard Viewer');
    expect(component.userDataLoaded).toBeTrue();
  });

  it('selectedValue should set errorMessage when role details fail', () => {
    roleServiceSpy.getUserFullDetails.and.returnValue(
      throwError(() => ({ message: 'Role details failed' }))
    );

    fixture.detectChanges();
    component.selectedValue(mockUsers[0]);

    expect(component.errorMessage).toBe('Role details failed');
  });

  // ─── Template tests ────────────────────────────────────────────────────────

  it('should display page title in template', () => {
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.page-title');
    expect(title?.textContent?.trim()).toBe('Role Assignment');
  });

  it('should show search results dropdown when matches found', () => {
    fixture.detectChanges();

    component.searchUser.setValue('Avaneesh');
    fixture.detectChanges();

    const results = fixture.nativeElement.querySelector('.search-results-card');
    expect(results).toBeTruthy();
    expect(results.textContent).toContain('Avaneesh Mishra');
  });

  it('should show role table after user selection', () => {
    fixture.detectChanges();
    component.selectedValue(mockUsers[0]);
    fixture.detectChanges();

    const table = fixture.debugElement.query(By.css('table[mat-table], mat-table'));
    expect(table).toBeTruthy();
  });

  it('should show loading spinner while role details are loading', () => {
    roleServiceSpy.getUserFullDetails.and.returnValue(EMPTY);

    fixture.detectChanges();
    component.selectedValue(mockUsers[0]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('mat-spinner')).toBeTruthy();
  });
});
