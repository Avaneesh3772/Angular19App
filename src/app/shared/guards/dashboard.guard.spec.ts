import { TestBed } from '@angular/core/testing';
import { DialogNotAuthorizedComponent } from '../components/dialog-not-authorized/dialog-not-authorized.component';
import { UserPersonalInfo } from '../models/app.models';
import { AppCommonService } from '../services/app-common.service';
import { AppInitializerDataService } from '../services/app-initializer-data.service';
import { DashboardGuard } from './dashboard.guard';

describe('DashboardGuard', () => {
  let guard: DashboardGuard;
  let appInitializerSpy: jasmine.SpyObj<AppInitializerDataService>;
  let appCommonSpy: jasmine.SpyObj<AppCommonService>;

  function userConfig(roles: string[]): UserPersonalInfo {
    return {
      employeeNumber: 339803934,
      firstname: 'Avaneesh',
      lastname: 'Mishra',
      roles,
    };
  }

  beforeEach(() => {
    appInitializerSpy = jasmine.createSpyObj('AppInitializerDataService', ['getAppConfigurationData']);
    appCommonSpy = jasmine.createSpyObj('AppCommonService', ['openNotAuthorizedDialogBox']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AppInitializerDataService, useValue: appInitializerSpy },
        { provide: AppCommonService, useValue: appCommonSpy },
      ],
    });

    guard = TestBed.inject(DashboardGuard);
  });

  it('should allow access when user has dashboard role', () => {
    appInitializerSpy.getAppConfigurationData.and.returnValue(userConfig(['dashboard']));

    expect(guard.canMatch()).toBeTrue();
    expect(appCommonSpy.openNotAuthorizedDialogBox).not.toHaveBeenCalled();
  });

  it('should allow access when dashboard is among multiple roles', () => {
    appInitializerSpy.getAppConfigurationData.and.returnValue(
      userConfig(['dashboard', 'templates', 'admin'])
    );

    expect(guard.canMatch()).toBeTrue();
    expect(appCommonSpy.openNotAuthorizedDialogBox).not.toHaveBeenCalled();
  });

  it('should deny access and open dialog when user lacks dashboard role', () => {
    appInitializerSpy.getAppConfigurationData.and.returnValue(
      userConfig(['templates', 'admin'])
    );

    expect(guard.canMatch()).toBeFalse();
    expect(appCommonSpy.openNotAuthorizedDialogBox).toHaveBeenCalledOnceWith(
      DialogNotAuthorizedComponent
    );
  });

  it('should deny access when app configuration is null', () => {
    appInitializerSpy.getAppConfigurationData.and.returnValue(null);

    expect(guard.canMatch()).toBeFalse();
    expect(appCommonSpy.openNotAuthorizedDialogBox).toHaveBeenCalledOnceWith(
      DialogNotAuthorizedComponent
    );
  });

  it('should deny access when roles array is empty', () => {
    appInitializerSpy.getAppConfigurationData.and.returnValue(userConfig([]));

    expect(guard.canMatch()).toBeFalse();
    expect(appCommonSpy.openNotAuthorizedDialogBox).toHaveBeenCalledOnceWith(
      DialogNotAuthorizedComponent
    );
  });
});
