import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppCommonService } from '../services/app-common.service';
import { AppInitializerDataService } from '../services/app-initializer-data.service';

/** HttpClient + mock backend — use in every service spec */
export const HTTP_TEST_PROVIDERS = [
  provideHttpClient(),
  provideHttpClientTesting(),
];

/** Router context for components using RouterLink / Router */
export const ROUTER_TEST_PROVIDER = provideRouter([]);

/** Disable Material animations in tests */
export const ANIMATION_TEST_PROVIDER = provideNoopAnimations();

export function createMatDialogRefMock() {
  return {
    close: jasmine.createSpy('close'),
    afterClosed: () => of(undefined),
  };
}

export function createDialogProviders(dialogData: unknown = {}) {
  return [
    { provide: MatDialogRef, useValue: createMatDialogRefMock() },
    { provide: MAT_DIALOG_DATA, useValue: dialogData },
  ];
}

/** Configure TestBed with mocked guard dependencies and the required role */
export function configureGuardTestBed(role: string): void {
  const appInitializerSpy = jasmine.createSpyObj('AppInitializerDataService', ['getAppConfigurationData']);
  appInitializerSpy.getAppConfigurationData.and.returnValue({ roles: [role] });
  const appCommonSpy = jasmine.createSpyObj('AppCommonService', ['openNotAuthorizedDialogBox']);

  TestBed.configureTestingModule({
    providers: [
      { provide: AppInitializerDataService, useValue: appInitializerSpy },
      { provide: AppCommonService, useValue: appCommonSpy },
    ],
  });
}
