import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DashboardService } from './dashboard.service';
import { PostComment, UserList } from './dashboard.models';

/**
 * UNIT TEST — DashboardService
 *
 * DashboardService uses HttpClient (via WebApiService).
 * We CANNOT let it make real HTTP calls in a test — tests must be:
 *   - Fast  (no network round trips)
 *   - Reliable (no dependency on external APIs being up)
 *   - Isolated (each test controls its own data)
 *
 * SOLUTION — HttpTestingController (Angular's built-in HTTP mock):
 * ────────────────────────────────────────────────────────────────
 * Instead of provideHttpClient() (real HTTP), we use:
 *   provideHttpClient()        ← still needed (registers HttpClient token)
 *   provideHttpClientTesting() ← replaces the real backend with a mock
 *
 * HttpTestingController lets us:
 *   - Intercept outgoing requests with expectOne(url)
 *   - Inspect what URL / headers / body were sent
 *   - Reply with fake data using req.flush(data)
 *   - Reply with errors using req.flush(null, { status: 500 })
 *   - Verify no unexpected requests were made with .verify()
 */
describe('DashboardService', () => {

  let service: DashboardService;
  let httpMock: HttpTestingController;   // ← this is our HTTP interceptor in tests

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),           // registers HttpClient in the test module
        provideHttpClientTesting(),    // replaces real HTTP with the mock backend
      ]
    });

    // TestBed.inject() is how you get a service instance in tests (replaces `new`)
    service  = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // afterEach runs after every it() block
  // .verify() ensures no unexpected HTTP requests were made
  // (catches typos in URLs, extra calls you didn't expect, etc.)
  afterEach(() => {
    httpMock.verify();
  });

  // ─── Creation test ─────────────────────────────────────────────────────────
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ─── getUsersList ──────────────────────────────────────────────────────────
  it('should call getUsersList and return user data', () => {
    // Fake data that our mock will return
    const mockUsers: UserList[] = [
      { id: 1, name: 'Alice', email: 'alice@test.com', phone: '111', website: 'alice.com',
        address: { street: 'Main St', city: 'NY', zipcode: '10001',
          geo: { lat: '1', lng: '2' }, suite: 'A1' },
        company: { name: 'Acme', catchPhrase: 'test', bs: 'test' },
        username: 'alice1' }
    ];

    const testUrl = 'https://jsonplaceholder.typicode.com/users';

    // Step 1: Call the service method — it triggers an HTTP request internally
    // We subscribe to capture the result
    let result: UserList[] = [];
    service.getUsersList(testUrl).subscribe(data => {
      result = data;
    });

    // Step 2: HttpTestingController intercepts the pending request
    // expectOne(url) — asserts exactly ONE request was made to this URL
    // (if 0 or 2+ requests were made, the test fails here)
    const req = httpMock.expectOne(testUrl);

    // Step 3: Verify the request used the correct HTTP method
    expect(req.request.method).toBe('GET');

    // Step 4: flush() — simulate the server responding with our mock data
    // This triggers our subscribe callback above
    req.flush(mockUsers);

    // Step 5: Now we can assert the service returned the expected data
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Alice');
    expect(result[0].email).toBe('alice@test.com');
  });

  // ─── getDropdownList ───────────────────────────────────────────────────────
  it('should call getDropdownList and return post comments', () => {
    const mockComments: PostComment[] = [
      { postId: 1, id: 1, name: 'Test User', email: 'test@test.com', body: 'Hello' }
    ];

    const testUrl = 'https://jsonplaceholder.typicode.com/comments';

    let result: PostComment[] = [];
    service.getDropdownList(testUrl).subscribe(data => {
      result = data;
    });

    const req = httpMock.expectOne(testUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockComments);

    expect(result.length).toBe(1);
    expect(result[0].email).toBe('test@test.com');
  });

  // ─── Error handling ────────────────────────────────────────────────────────
  it('should handle HTTP error in getUsersList', () => {
    const testUrl = 'https://jsonplaceholder.typicode.com/users';

    let errorReceived: unknown = null;

    service.getUsersList(testUrl).subscribe({
      next: () => fail('Expected an error, not data'),  // fail() forces a test failure
      error: (err) => { errorReceived = err; }
    });

    const req = httpMock.expectOne(testUrl);

    // flush() with a 500 status simulates a server error
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    expect(errorReceived).toBeTruthy();
  });

});
