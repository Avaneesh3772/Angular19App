import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { EMPTY, of, throwError } from 'rxjs';
import { PostComment, UserList } from './dashboard.models';
import { DashboardService } from './dashboard.service';
import { DashboardComponent } from './dashboard.component';

/**
 * UNIT TEST — DashboardComponent
 *
 * A component has TWO things to test:
 *   1. CLASS logic  — methods, properties, state changes (TypeScript)
 *   2. TEMPLATE     — what the user actually sees in the HTML (DOM)
 *
 * KEY CONCEPT — Mocking Services with jasmine.createSpyObj():
 * ──────────────────────────────────────────────────────────
 * We do NOT use the real DashboardService (that would need HttpClient + network).
 * Instead we create a "spy object" — a fake object with fake methods that
 * return whatever we want.
 *
 * jasmine.createSpyObj('ServiceName', ['method1', 'method2'])
 *   → creates an object with method1 and method2 as spies
 *   → .and.returnValue(of([...])) tells the spy what to return
 *   → .and.returnValue(throwError(...)) simulates an error
 *
 * KEY CONCEPT — fixture.detectChanges():
 * ───────────────────────────────────────
 * Angular does NOT automatically update the DOM in tests.
 * You must call fixture.detectChanges() to:
 *   - Run ngOnInit()
 *   - Apply data bindings to the template
 *   - Re-render after any state change
 */

// ─── Shared mock data (reused across multiple tests) ─────────────────────────
const mockUsers: UserList[] = [
  {
    id: 1, name: 'Alice Smith', username: 'alice1', email: 'alice@test.com',
    phone: '111-222-3333', website: 'alice.com',
    address: { street: 'Main St', suite: 'A1', city: 'New York', zipcode: '10001', geo: { lat: '1', lng: '2' } },
    company: { name: 'Acme Corp', catchPhrase: 'Test phrase', bs: 'test bs' }
  },
  {
    id: 2, name: 'Bob Jones', username: 'bob2', email: 'bob@test.com',
    phone: '444-555-6666', website: 'bob.com',
    address: { street: 'Oak Ave', suite: 'B2', city: 'London', zipcode: 'W1A 1AA', geo: { lat: '3', lng: '4' } },
    company: { name: 'Globex', catchPhrase: 'Another phrase', bs: 'bs data' }
  }
];

const mockComments: PostComment[] = [
  { postId: 1, id: 1, name: 'Comment 1', email: 'user1@test.com', body: 'Hello' },
  { postId: 1, id: 2, name: 'Comment 2', email: 'user2@test.com', body: 'World' }
];

// ─────────────────────────────────────────────────────────────────────────────

describe('DashboardComponent', () => {

  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  // Spy objects — typed so TypeScript knows their shape
  let dashboardServiceSpy: jasmine.SpyObj<DashboardService>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {

    // Create the spy objects BEFORE configuring TestBed
    // 'DashboardService' is just a label for error messages
    // ['getUsersList', 'getDropdownList'] lists the methods we want to spy on
    dashboardServiceSpy = jasmine.createSpyObj('DashboardService', ['getUsersList', 'getDropdownList']);
    matDialogSpy        = jasmine.createSpyObj('MatDialog', ['open']);

    // Set DEFAULT return values for the spies
    // Every test starts with these — individual tests can override them
    dashboardServiceSpy.getUsersList.and.returnValue(of(mockUsers));
    dashboardServiceSpy.getDropdownList.and.returnValue(of(mockComments));

    // Mock the dialog to return an object with afterClosed() returning of(undefined)
    // This is needed because showDialogBox() calls dialogRef.afterClosed().subscribe()
    const mockDialogRef = { afterClosed: () => of(undefined) };
    matDialogSpy.open.and.returnValue(mockDialogRef as MatDialogRef<unknown>);

    await TestBed.configureTestingModule({
      // For standalone components, put them in imports[] not declarations[]
      imports: [DashboardComponent],
      providers: [
        provideNoopAnimations(),   // disables Material animations — avoids async timing issues
        provideHttpClient(),       // DashboardService extends WebApiService which needs HttpClient
        { provide: DashboardService, useValue: dashboardServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy },
      ]
    })
    /**
     * WHY overrideComponent?
     *
     * DashboardComponent is STANDALONE and imports [...ANGULAR_MATERIAL_MODULES].
     * Those Material imports create a CHILD injector on the component level that
     * provides the REAL MatDialog — which overrides our TestBed-level spy.
     *
     * overrideComponent() injects our mock directly into the component's own
     * provider level, so it takes priority over the Material module's provider.
     */
    .overrideComponent(DashboardComponent, {
      set: {
        providers: [
          { provide: MatDialog, useValue: matDialogSpy }
        ]
      }
    })
    .compileComponents();

    fixture   = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    // NOTE: We do NOT call fixture.detectChanges() here
    // because some tests need to configure spies BEFORE ngOnInit runs
  });

  // ─── 1. Creation ───────────────────────────────────────────────────────────
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // ─── 2. Initial state (before ngOnInit) ───────────────────────────────────
  it('should have empty dataSource before ngOnInit', () => {
    // detectChanges() NOT called yet — ngOnInit has NOT run
    expect(component.dataSource).toEqual([]);
    expect(component.userDataLoaded).toBeFalse();
    expect(component.errorMessage).toBe('');
  });

  // ─── 3. ngOnInit — service calls ──────────────────────────────────────────
  it('should call getUsersList and getDropdownList on init', () => {
    fixture.detectChanges(); // ← triggers ngOnInit

    // toHaveBeenCalled() — asserts the spy method was called at least once
    expect(dashboardServiceSpy.getUsersList).toHaveBeenCalled();
    expect(dashboardServiceSpy.getDropdownList).toHaveBeenCalled();
  });

  it('should call getUsersList with the correct API URL', () => {
    fixture.detectChanges();

    // toHaveBeenCalledWith() — asserts it was called with specific arguments
    expect(dashboardServiceSpy.getUsersList)
      .toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users');
  });

  // ─── 4. Successful data load ───────────────────────────────────────────────
  it('should populate dataSource with users on successful API call', () => {
    fixture.detectChanges(); // triggers ngOnInit → spy returns mockUsers → subscribe fires

    expect(component.dataSource.length).toBe(2);
    expect(component.dataSource[0].name).toBe('Alice Smith');
    expect(component.dataSource[1].email).toBe('bob@test.com');
  });

  it('should set userDataLoaded to true after successful API call', () => {
    fixture.detectChanges();
    expect(component.userDataLoaded).toBeTrue();
  });

  it('should set dropDownData$ observable on init', () => {
    fixture.detectChanges();
    // dropDownData$ should be set (not null/undefined)
    expect(component.dropDownData$).toBeTruthy();
  });

  // ─── 5. Error handling ─────────────────────────────────────────────────────
  it('should set errorMessage when API call fails', () => {
    // Override the default spy for this specific test
    const errorResponse = { message: 'Http failure response: 500' };
    dashboardServiceSpy.getUsersList.and.returnValue(
      throwError(() => errorResponse)  // simulate HTTP error
    );

    fixture.detectChanges(); // triggers ngOnInit with the error spy

    expect(component.errorMessage).toBe('Http failure response: 500');
  });

  it('should set userDataLoaded to false when API call fails', () => {
    dashboardServiceSpy.getUsersList.and.returnValue(
      throwError(() => ({ message: 'Network error' }))
    );

    fixture.detectChanges();

    expect(component.userDataLoaded).toBeFalse();
  });

  // ─── 6. displayedColumns ──────────────────────────────────────────────────
  it('should have correct displayedColumns', () => {
    fixture.detectChanges();
    expect(component.displayedColumns).toEqual(['id', 'name', 'username', 'email', 'phone']);
  });

  // ─── 7. updateTopic method ────────────────────────────────────────────────
  it('should call updateTopic with the selected value', () => {
    // Spy on a method of the component itself using spyOn()
    // spyOn(object, 'methodName') — wraps a REAL method with a spy
    spyOn(component, 'updateTopic');

    component.updateTopic('test-topic');

    expect(component.updateTopic).toHaveBeenCalledWith('test-topic');
  });

  // ─── 8. showDialogBox ─────────────────────────────────────────────────────
  it('should open dialog with correct data when showDialogBox is called', () => {
    fixture.detectChanges();

    component.showDialogBox(mockUsers[0]);

    // Verify MatDialog.open() was called
    expect(matDialogSpy.open).toHaveBeenCalled();

    // Check the dialog was opened with the correct data
    // matDialogSpy.open.calls.mostRecent() gets the last call's arguments
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const callArgs = matDialogSpy.open.calls.mostRecent().args as any[];
    expect(callArgs[1]?.data?.userInfo).toEqual(mockUsers[0]);
    expect(callArgs[1]?.width).toBe('600px');
    expect(callArgs[1]?.height).toBe('400px');
  });

  // ─── 9. Template tests (what the USER sees in the browser) ───────────────
  it('should display page title "Dashboard" in the template', () => {
    fixture.detectChanges();

    // fixture.nativeElement is the component's root DOM element
    // querySelector finds the first matching element (like document.querySelector)
    const title = fixture.nativeElement.querySelector('.page-title');
    expect(title?.textContent?.trim()).toBe('Dashboard');
  });

  it('should show the data table when userDataLoaded is true', () => {
    fixture.detectChanges(); // ngOnInit runs → spy returns mockUsers → userDataLoaded = true

    // By.css() is Angular's helper for querying DebugElements
    const table = fixture.debugElement.query(By.css('mat-table, table[mat-table]'));
    expect(table).toBeTruthy(); // table exists in DOM
  });

  it('should NOT show the data table when userDataLoaded is false', () => {
    // Make getUsersList hang (never emit) so userDataLoaded stays false
    // EMPTY observable — never emits any value, never completes
    dashboardServiceSpy.getUsersList.and.returnValue(EMPTY);

    fixture.detectChanges();

    const table = fixture.debugElement.query(By.css('mat-table, table[mat-table]'));
    expect(table).toBeNull(); // table is NOT in DOM (hidden by @if)
  });

  it('should show error message in template when API fails', () => {
    dashboardServiceSpy.getUsersList.and.returnValue(
      throwError(() => ({ message: 'API failed' }))
    );

    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('.error-message');
    expect(errorEl).toBeTruthy();
    expect(errorEl.textContent).toContain('API failed');
  });

  it('should render correct number of rows in the table', () => {
    fixture.detectChanges();

    // mat-row is the Material table row selector
    const rows = fixture.debugElement.queryAll(By.css('mat-row, tr[mat-row]'));
    // We have 2 users in mockUsers, so we expect 2 rows
    expect(rows.length).toBe(mockUsers.length);
  });

});
