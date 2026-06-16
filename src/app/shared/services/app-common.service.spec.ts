import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { statusType } from '../constants/app.constants';
import { DialogNotAuthorizedComponent } from '../components/dialog-not-authorized/dialog-not-authorized.component';
import { AppCommonService } from './app-common.service';

/**
 * UNIT TEST — AppCommonService
 *
 * This service has two types of methods:
 *
 *   1. getColorForStatus() — pure logic, no dependencies → test directly
 *   2. openNotAuthorizedDialogBox() — uses MatDialog → mock MatDialog with spy
 *
 * MatDialog mock pattern (same as DashboardComponent):
 *   matDialogSpy.open.and.returnValue({ afterClosed: () => of(undefined) })
 */
describe('AppCommonService', () => {
  let service: AppCommonService;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    matDialogSpy.open.and.returnValue({
      afterClosed: () => of(undefined),
    } as MatDialogRef<unknown>);

    TestBed.configureTestingModule({
      providers: [
        AppCommonService,
        { provide: MatDialog, useValue: matDialogSpy },
      ],
    });

    service = TestBed.inject(AppCommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ─── getColorForStatus ─────────────────────────────────────────────────────
  describe('getColorForStatus', () => {

    it('should return green for Success status', () => {
      expect(service.getColorForStatus(statusType.success)).toBe('green');
    });

    it('should return red for Failed status', () => {
      expect(service.getColorForStatus(statusType.failed)).toBe('red');
    });

    it('should return orange for Uploaded status', () => {
      expect(service.getColorForStatus(statusType.uploaded)).toBe('orange');
    });

    it('should return orange for an unknown status', () => {
      expect(service.getColorForStatus('Pending')).toBe('orange');
    });

  });

  // ─── openNotAuthorizedDialogBox ──────────────────────────────────────────
  describe('openNotAuthorizedDialogBox', () => {

    it('should open MatDialog with the provided component', () => {
      service.openNotAuthorizedDialogBox(DialogNotAuthorizedComponent);

      expect(matDialogSpy.open).toHaveBeenCalled();
      expect(matDialogSpy.open.calls.mostRecent().args[0]).toBe(DialogNotAuthorizedComponent);
    });

    it('should open dialog with correct width, height, and empty data', () => {
      service.openNotAuthorizedDialogBox(DialogNotAuthorizedComponent);

      const config = matDialogSpy.open.calls.mostRecent().args[1];
      expect(config?.width).toBe('400px');
      expect(config?.height).toBe('300px');
      expect(config?.data).toEqual({});
    });

  });

});
