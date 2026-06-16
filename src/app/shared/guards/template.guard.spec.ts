import { TestBed } from '@angular/core/testing';
import { DialogNotAuthorizedComponent } from '../components/dialog-not-authorized/dialog-not-authorized.component';
import { UserPersonalInfo } from '../models/app.models';
import { AppCommonService } from '../services/app-common.service';
import { AppInitializerDataService } from '../services/app-initializer-data.service';
import { TemplateGuard } from './template.guard';

/**
 * UNIT TEST — TemplateGuard (CanMatch)
 *
 * Guards decide whether a route can be loaded. TemplateGuard checks if the
 * user has the 'templates' role from app configuration (loaded at startup).
 *
 * Dependencies to mock:
 *   AppInitializerDataService → getAppConfigurationData()
 *   AppCommonService          → openNotAuthorizedDialogBox()
 *
 * Test scenarios for ANY role-based guard:
 *   1. User HAS the required role        → canMatch() = true,  dialog NOT opened
 *   2. User has OTHER roles but not this → canMatch() = false, dialog opened
 *   3. App config is null (init failed)  → canMatch() = false, dialog opened
 *   4. Roles array is empty              → canMatch() = false, dialog opened
 *
 * For other guards, copy this file and change:
 *   - Guard class name
 *   - Required role string ('dashboard', 'admin', 'rolemanagement', 'restatement')
 */
describe('TemplateGuard', () => {
  let guard: TemplateGuard;
  let appInitializerSpy: jasmine.SpyObj<AppInitializerDataService>;
  let appCommonSpy: jasmine.SpyObj<AppCommonService>;

  /** Builds a minimal UserPersonalInfo with the given roles */
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

    guard = TestBed.inject(TemplateGuard);
  });

  // ─── Authorized ────────────────────────────────────────────────────────────
  it('should allow access when user has templates role', () => {
    appInitializerSpy.getAppConfigurationData.and.returnValue(userConfig(['templates']));

    expect(guard.canMatch()).toBeTrue();
    expect(appCommonSpy.openNotAuthorizedDialogBox).not.toHaveBeenCalled();
  });

  it('should allow access when templates is among multiple roles', () => {
    appInitializerSpy.getAppConfigurationData.and.returnValue(
      userConfig(['dashboard', 'templates', 'admin'])
    );

    expect(guard.canMatch()).toBeTrue();
    expect(appCommonSpy.openNotAuthorizedDialogBox).not.toHaveBeenCalled();
  });

  // ─── Unauthorized ────────────────────────────────────────────────────────
  it('should deny access and open dialog when user lacks templates role', () => {
    appInitializerSpy.getAppConfigurationData.and.returnValue(
      userConfig(['dashboard', 'admin'])
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
