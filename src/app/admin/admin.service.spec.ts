import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HTTP_TEST_PROVIDERS } from '../shared/testing/test-helpers';
import { AdminService } from './admin.service';
import { TemplateDetails } from './admin.models';
import { AdminConstants } from './admin.constants';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...HTTP_TEST_PROVIDERS],
    });
    service = TestBed.inject(AdminService);
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
    const mockTemplates: TemplateDetails[] = [{
    "quarter": "Q1",
    "month": 11,
    "year": 2019,
    "template": "Master Template",
    "status": "Uploaded",
    "initiationdate": "2021-12-05 21:36:54",
    "comments": "Lorem ipsum is dummy text",
    "initiatedby": "Avaneesh Mishra"  
  }];
  let result: TemplateDetails[] = [];
      service.getUsersList(AdminConstants.adminMockDataURL).subscribe(data => {
        result = data;
  });
  const req = httpMock.expectOne(AdminConstants.adminMockDataURL);
      expect(req.request.method).toBe('GET');
      req.flush(mockTemplates);
  
      expect(result.length).toBe(1);
      expect(result[0].quarter).toBe('Q1');
      expect(result[0].template).toBe('Master Template');
      expect(result[0].month).toBe(11);
      expect(result[0].year).toBe(2019);
      expect(result[0].status).toBe('Uploaded');
      expect(result[0].initiationdate).toBe('2021-12-05 21:36:54');
      expect(result[0].comments).toBe('Lorem ipsum is dummy text');
      expect(result[0].initiatedby).toBe('Avaneesh Mishra');
});
  it('should handle HTTP error in getUsersList', () => {
    let errorReceived: unknown = null;

    service.getUsersList(AdminConstants.adminMockDataURL).subscribe({
      next: () => fail('Expected an error, not data'),
      error: (err) => { errorReceived = err; },
    });

    const req = httpMock.expectOne(AdminConstants.adminMockDataURL);
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    expect(errorReceived).toBeTruthy();
  });
});
