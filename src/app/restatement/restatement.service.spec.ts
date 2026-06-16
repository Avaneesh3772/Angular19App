import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HTTP_TEST_PROVIDERS } from '../shared/testing/test-helpers';
import { RestatementService } from './restatement.service';
import { CommentsList } from './restatement.models';
import { RestatementConstants } from './restatement.constants';

describe('RestatementService', () => {
  let service: RestatementService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...HTTP_TEST_PROVIDERS],
    });
    service = TestBed.inject(RestatementService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ─── getCommentsList ───────────────────────────────────────────────────────
  it('should call getCommentsList and return comments data', () => {
    const mockComments: CommentsList[] = [{
      body: 'angular 19 unit test cases',
      email: 'Eliseo@gardner.biz',
      id: 1,
      name: 'id labore ex et quam laborum',
      postId: 1,
    }];
  
      let result: CommentsList[] = [];
      service.getCommentsList(RestatementConstants.commentsApiURL).subscribe(data => {
        result = data;
      });
  
      const req = httpMock.expectOne(RestatementConstants.commentsApiURL);
      expect(req.request.method).toBe('GET');
      req.flush(mockComments);
  
      expect(result.length).toBe(1);
      expect(result[0].body).toBe('angular 19 unit test cases');
      expect(result[0].email).toBe('Eliseo@gardner.biz');
      expect(result[0].id).toBe(1);
      expect(result[0].name).toBe('id labore ex et quam laborum');
      expect(result[0].postId).toBe(1);
    });

      it('should handle HTTP error in getCommentsList', () => {
        let errorReceived: unknown = null;
    
        service.getCommentsList(RestatementConstants.commentsApiURL).subscribe({
          next: () => fail('Expected an error, not data'),
          error: (err) => { errorReceived = err; },
        });
    
        const req = httpMock.expectOne(RestatementConstants.commentsApiURL);
        req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    
        expect(errorReceived).toBeTruthy();
      });

});
