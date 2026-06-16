import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HTTP_TEST_PROVIDERS } from '../shared/testing/test-helpers';
import { RoleConstants } from './role.constants';
import { TemplateList, Users, UsersRole } from './role.models';
import { RoleService } from './role.service';

describe('RoleService', () => {
  let service: RoleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...HTTP_TEST_PROVIDERS],
    });
    service = TestBed.inject(RoleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ─── getUsersList ──────────────────────────────────────────────────────────
  it('should call getUsersList and return template data', () => {
    const mockTemplates: TemplateList[] = [{
      template: 'Master Template',
      frequency: 'monthly',
      month: 11,
      year: 2019,
      lastActionDate: '2021-02-01 23:06:18',
      status: 'Uploaded',
      comments: 'Lorem ipsum is dummy text used in laying out print, graphic or web designs',
      user: 'Rakesh Mishra',
    }];

    let result: TemplateList[] = [];
    service.getUsersList(RoleConstants.roleMockDataURL).subscribe(data => {
      result = data;
    });

    const req = httpMock.expectOne(RoleConstants.roleMockDataURL);
    expect(req.request.method).toBe('GET');
    req.flush(mockTemplates);

    expect(result.length).toBe(1);
    expect(result[0].template).toBe('Master Template');
    expect(result[0].frequency).toBe('monthly');
  });

  it('should handle HTTP error in getUsersList', () => {
    let errorReceived: unknown = null;

    service.getUsersList(RoleConstants.roleMockDataURL).subscribe({
      next: () => fail('Expected an error, not data'),
      error: (err) => { errorReceived = err; },
    });

    const req = httpMock.expectOne(RoleConstants.roleMockDataURL);
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    expect(errorReceived).toBeTruthy();
  });

  // ─── getUserFullDetails ────────────────────────────────────────────────────
  it('should call getUserFullDetails and return user role data', () => {
    const mockRoles: UsersRole[] = [{
      employeeIdentifier: 101,
      roleDescription: 'Lorem ipsum dolor sit amet, consectetur',
      roleName: 'Dashboard Viewer',
      roleType: 'Dashboard Viewer',
    }];

    let result: UsersRole[] = [];
    service.getUserFullDetails(RoleConstants.roleAssignmentUserDataURL).subscribe(data => {
      result = data;
    });

    const req = httpMock.expectOne(RoleConstants.roleAssignmentUserDataURL);
    expect(req.request.method).toBe('GET');
    req.flush(mockRoles);

    expect(result.length).toBe(1);
    expect(result[0].employeeIdentifier).toBe(101);
    expect(result[0].roleName).toBe('Dashboard Viewer');
  });

  it('should handle HTTP error in getUserFullDetails', () => {
    let errorReceived: unknown = null;

    service.getUserFullDetails(RoleConstants.roleAssignmentUserDataURL).subscribe({
      next: () => fail('Expected an error, not data'),
      error: (err) => { errorReceived = err; },
    });

    const req = httpMock.expectOne(RoleConstants.roleAssignmentUserDataURL);
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    expect(errorReceived).toBeTruthy();
  });

  // ─── getUsersSearchList ────────────────────────────────────────────────────
  it('should call getUsersSearchList and return users list', () => {
    const mockUsers: Users[] = [{
      employeeIdentifier: 101,
      firstName: 'Avaneesh',
      lastName: 'Mishra',
    }];

    let result: Users[] = [];
    service.getUsersSearchList(RoleConstants.roleAssignmentDataURL).subscribe(data => {
      result = data;
    });

    const req = httpMock.expectOne(RoleConstants.roleAssignmentDataURL);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);

    expect(result.length).toBe(1);
    expect(result[0].firstName).toBe('Avaneesh');
    expect(result[0].lastName).toBe('Mishra');
  });

  it('should handle HTTP error in getUsersSearchList', () => {
    let errorReceived: unknown = null;

    service.getUsersSearchList(RoleConstants.roleAssignmentDataURL).subscribe({
      next: () => fail('Expected an error, not data'),
      error: (err) => { errorReceived = err; },
    });

    const req = httpMock.expectOne(RoleConstants.roleAssignmentDataURL);
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    expect(errorReceived).toBeTruthy();
  });
});
