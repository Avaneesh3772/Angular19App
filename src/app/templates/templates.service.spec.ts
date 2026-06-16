import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HTTP_TEST_PROVIDERS } from '../shared/testing/test-helpers';
import { TemplateConstants } from './template.constants';
import { CommentList, CreatePostModel, PostList } from './template.models';
import { TemplatesService } from './templates.service';

describe('TemplatesService', () => {
  let service: TemplatesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...HTTP_TEST_PROVIDERS],
    });
    service = TestBed.inject(TemplatesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ─── getAllTemplateData ────────────────────────────────────────────────────
  it('should call getAllTemplateData and return template data', () => {
    const mockTemplates: PostList[] = [{
      body: 'angular 19 unit test cases',
      id: 1,
      title: 'Angular 19 test cases',
      userId: 1,
    }];

    let result: PostList[] = [];
    service.getAllTemplateData(TemplateConstants.getTemplateURL).subscribe(data => {
      result = data;
    });

    const req = httpMock.expectOne(TemplateConstants.getTemplateURL);
    expect(req.request.method).toBe('GET');
    req.flush(mockTemplates);

    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Angular 19 test cases');
    expect(result[0].body).toBe('angular 19 unit test cases');
    expect(result[0].id).toBe(1);
    expect(result[0].userId).toBe(1);
  });

  it('should handle HTTP error in getAllTemplateData', () => {
    let errorReceived: unknown = null;

    service.getAllTemplateData(TemplateConstants.getTemplateURL).subscribe({
      next: () => fail('Expected an error, not data'),
      error: (err) => { errorReceived = err; },
    });

    const req = httpMock.expectOne(TemplateConstants.getTemplateURL);
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    expect(errorReceived).toBeTruthy();
  });

  // ─── postNewTemplateData ───────────────────────────────────────────────────
  it('should call postNewTemplateData and create a new post', () => {
    const createBody: CreatePostModel = {
      title: 'New Post',
      body: 'New post body',
      userId: 1,
    };

    const mockResponse: PostList = {
      id: 101,
      title: 'New Post',
      body: 'New post body',
      userId: 1,
    };

    let result: PostList | undefined;
    service.postNewTemplateData(TemplateConstants.postTemplateURL, createBody).subscribe(data => {
      result = data;
    });

    const req = httpMock.expectOne(TemplateConstants.postTemplateURL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(JSON.stringify(createBody));
    req.flush(mockResponse);

    expect(result).toEqual(mockResponse);
  });

  it('should handle HTTP error in postNewTemplateData', () => {
    const createBody: CreatePostModel = {
      title: 'New Post',
      body: 'New post body',
      userId: 1,
    };

    let errorReceived: unknown = null;

    service.postNewTemplateData(TemplateConstants.postTemplateURL, createBody).subscribe({
      next: () => fail('Expected an error, not data'),
      error: (err) => { errorReceived = err; },
    });

    const req = httpMock.expectOne(TemplateConstants.postTemplateURL);
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    expect(errorReceived).toBeTruthy();
  });

  // ─── updateNewTemplateData ─────────────────────────────────────────────────
  it('should call updateNewTemplateData and update a post', () => {
    const updateBody: PostList = {
      id: 1,
      title: 'Updated Post',
      body: 'Updated body',
      userId: 1,
    };

    const updateUrl = TemplateConstants.updateTemplateURL(1);

    let result: PostList | undefined;
    service.updateNewTemplateData(updateUrl, updateBody).subscribe(data => {
      result = data;
    });

    const req = httpMock.expectOne(updateUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toBe(JSON.stringify(updateBody));
    req.flush(updateBody);

    expect(result).toEqual(updateBody);
    expect(result?.title).toBe('Updated Post');
  });

  it('should handle HTTP error in updateNewTemplateData', () => {
    const updateBody: PostList = {
      id: 1,
      title: 'Updated Post',
      body: 'Updated body',
      userId: 1,
    };

    const updateUrl = TemplateConstants.updateTemplateURL(1);
    let errorReceived: unknown = null;

    service.updateNewTemplateData(updateUrl, updateBody).subscribe({
      next: () => fail('Expected an error, not data'),
      error: (err) => { errorReceived = err; },
    });

    const req = httpMock.expectOne(updateUrl);
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    expect(errorReceived).toBeTruthy();
  });

  // ─── deleteTemplateData ────────────────────────────────────────────────────
  it('should call deleteTemplateData and delete a post', () => {
    const deleteUrl = TemplateConstants.deleteTemplateURL(1);
    let completed = false;

    service.deleteTemplateData(deleteUrl).subscribe(() => {
      completed = true;
    });

    const req = httpMock.expectOne(deleteUrl);
    expect(req.request.method).toBe('DELETE');
    req.flush({});

    expect(completed).toBeTrue();
  });

  it('should handle HTTP error in deleteTemplateData', () => {
    const deleteUrl = TemplateConstants.deleteTemplateURL(1);
    let errorReceived: unknown = null;

    service.deleteTemplateData(deleteUrl).subscribe({
      next: () => fail('Expected an error, not data'),
      error: (err) => { errorReceived = err; },
    });

    const req = httpMock.expectOne(deleteUrl);
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    expect(errorReceived).toBeTruthy();
  });

  // ─── getAllCommentsData ────────────────────────────────────────────────────
  it('should call getAllCommentsData and return comments', () => {
    const mockComments: CommentList[] = [{
      postId: 1,
      id: 1,
      name: 'Test User',
      email: 'test@test.com',
      body: 'Test comment',
    }];

    const commentsUrl = TemplateConstants.commentsApiURL(1);
    let result: CommentList[] = [];

    service.getAllCommentsData(commentsUrl).subscribe(data => {
      result = data;
    });

    const req = httpMock.expectOne(commentsUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockComments);

    expect(result.length).toBe(1);
    expect(result[0].email).toBe('test@test.com');
    expect(result[0].body).toBe('Test comment');
  });

  it('should handle HTTP error in getAllCommentsData', () => {
    const commentsUrl = TemplateConstants.commentsApiURL(1);
    let errorReceived: unknown = null;

    service.getAllCommentsData(commentsUrl).subscribe({
      next: () => fail('Expected an error, not data'),
      error: (err) => { errorReceived = err; },
    });

    const req = httpMock.expectOne(commentsUrl);
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    expect(errorReceived).toBeTruthy();
  });
});
