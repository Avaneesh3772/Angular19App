import {
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  combineLatest,
  concatMap,
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  from,
  of,
  shareReplay,
  startWith,
  Subscription,
  take,
  tap,
  toArray,
} from 'rxjs';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';
import { departments } from '../rxjs-learning.constants';
import { EmployeeItem } from '../rxjs-learning.models';
import { RxjsLearningService } from '../rxjs-learning.service';

const LOG = '[Filtering RxJS]';

type ScreeningPhase = 'idle' | 'filter' | 'take' | 'done';

/**
 * FILTERING OPERATORS — unified HR Promotion Shortlisting exercise
 *
 * shareReplay(1)       → load employeeData.json once, shared by roster + pipeline
 * debounceTime(600)    → search box waits until user stops typing
 * distinctUntilChanged → department dropdown skips duplicate selections
 * filter()             → keep only employees with 3+ years of service
 * take(3)              → shortlist first 3 eligible candidates for interview panel
 */
@Component({
  selector: 'app-rxjs-filtering',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES, ReactiveFormsModule],
  templateUrl: './filtering.component.html',
  styleUrl: './filtering.component.scss',
})
export class FilteringComponent implements OnInit, OnDestroy {

  private rxjsService = inject(RxjsLearningService);
  private cdr = inject(ChangeDetectorRef);

  private subscriptions = new Subscription();
  private pipelineSub?: Subscription;

  readonly departmentList = departments;

  searchControl = new FormControl('', { nonNullable: true });
  /** Empty string = all departments (no filter applied yet) */
  departmentControl = new FormControl('', { nonNullable: true });

  employees: EmployeeItem[] = [];
  visibleEmployees: EmployeeItem[] = [];
  isLoadingEmployees = true;
  isSearchPending = false;
  private shareReplayLogs = 0;
  private lastLoggedSearch = '';
  private lastLoggedDepartment: string | null = null;

  searchTerm = '';
  selectedDepartment = '';
  screeningStarted = false;

  currentPhase: ScreeningPhase = 'idle';
  filterPassed: EmployeeItem[] = [];
  checkingEmployee: EmployeeItem | null = null;
  interviewPanel: EmployeeItem[] = [];
  streamLog: string[] = [];

  ngOnInit(): void {
    console.log(`${LOG} ngOnInit → loading employees with shareReplay(1)`);

    const employees$ = this.rxjsService.getEmployees().pipe(
      shareReplay(1),
      tap(data => console.log(`${LOG} shareReplay(1) → HTTP response cached:`, data)),
    );

    // Subscriber 1 — populates the roster
    this.subscriptions.add(
      employees$.subscribe(data => {
        this.employees = data;
        this.isLoadingEmployees = false;
        this.applyVisibleFilters('shareReplay load');
        this.logShareReplay('Subscriber 1 → roster loaded');
        this.cdr.detectChanges();
      }),
    );

    // Subscriber 2 — proves shareReplay: no second HTTP call
    this.subscriptions.add(
      employees$.subscribe(data => {
        this.logShareReplay(`Subscriber 2 → pipeline source ready (${data.length} employees — cached, no new HTTP)`);
      }),
    );

    this.setupLiveFilters();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.pipelineSub?.unsubscribe();
    console.log(`${LOG} ngOnDestroy → unsubscribed`);
  }

  /** Step 3 — user clicks to run filter() + take(3) on the currently visible roster */
  buildInterviewPanel(): void {
    if (!this.visibleEmployees.length) return;
    if (this.screeningStarted && this.currentPhase !== 'done') return;

    console.log(`${LOG} Button clicked → starting filter() + take(3) pipeline`);
    this.runScreeningPipeline();
  }

  private logShareReplay(message: string): void {
    this.shareReplayLogs++;
    this.streamLog.push(`shareReplay(1) → ${message}`);
    console.log(`${LOG} shareReplay(1) → ${message}`);
    this.cdr.detectChanges();
  }

  isPassedFilter(empId: number): boolean {
    return this.filterPassed.some(e => e.id === empId);
  }

  /**
   * Live roster filters — debounceTime on search, distinctUntilChanged on department.
   * combineLatest keeps both in sync and updates visibleEmployees as a bound array.
   */
  private setupLiveFilters(): void {
    const search$ = this.searchControl.valueChanges.pipe(
      tap(() => {
        this.isSearchPending = true;
        this.cdr.detectChanges();
      }),
      debounceTime(600),
      distinctUntilChanged(),
      tap(term => {
        this.isSearchPending = false;
        this.searchTerm = term;
      }),
    );

    const department$ = this.departmentControl.valueChanges.pipe(
      distinctUntilChanged(),
      tap(dept => { this.selectedDepartment = dept; }),
    );

    this.subscriptions.add(
      combineLatest([
        search$.pipe(startWith(this.searchControl.value)),
        department$.pipe(startWith(this.departmentControl.value)),
      ]).subscribe(([term, dept]) => {
        this.searchTerm = term;
        this.selectedDepartment = dept;
        this.isSearchPending = false;
        this.applyVisibleFilters('live filter');

        if (term !== this.lastLoggedSearch) {
          this.lastLoggedSearch = term;
          if (term) {
            console.log(`${LOG} debounceTime(600) → search applied: "${term}"`);
            this.streamLog.push(`debounceTime(600) → search: "${term}" → ${this.visibleEmployees.length} visible`);
          }
        }
        if (dept !== this.lastLoggedDepartment) {
          this.lastLoggedDepartment = dept;
          if (dept) {
            console.log(`${LOG} distinctUntilChanged() → department: "${dept}"`);
            this.streamLog.push(`distinctUntilChanged() → department: "${dept}" → ${this.visibleEmployees.length} visible`);
          }
        }

        console.log(`${LOG} Visible employees:`, this.visibleEmployees);
        this.cdr.detectChanges();
      }),
    );
  }

  /** Recompute left-panel roster from current search + department filters */
  private applyVisibleFilters(reason: string): void {
    let list = this.employees;

    if (this.selectedDepartment) {
      list = list.filter(e => e.department === this.selectedDepartment);
    }

    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      list = list.filter(e =>
        e.name.toLowerCase().includes(term) ||
        e.role.toLowerCase().includes(term),
      );
    }

    this.visibleEmployees = list;
    console.log(`${LOG} applyVisibleFilters(${reason}) → ${list.length} of ${this.employees.length}`);
  }

  /** filter() then take(3) — build interview panel from visible employees */
  private runScreeningPipeline(): void {
    console.group(`${LOG} Screening pipeline started`);
    console.log(`${LOG} Pool (${this.visibleEmployees.length} employees):`, this.visibleEmployees);

    this.pipelineSub?.unsubscribe();
    this.clearScreeningResults();
    this.screeningStarted = true;
    this.currentPhase = 'filter';
    this.streamLog.push(`filter() → screening ${this.visibleEmployees.length} visible employee(s) (yearsOfService >= 3)`);
    this.cdr.detectChanges();

    const pool = [...this.visibleEmployees];

    this.pipelineSub = from(pool).pipe(
        concatMap(emp => of(emp).pipe(delay(400))),
        tap(emp => {
          this.checkingEmployee = emp;
          this.cdr.detectChanges();
        }),
        filter(emp => emp.yearsOfService >= 3),
        tap(emp => {
          console.log(`${LOG} filter() PASS →`, emp.name, `(years: ${emp.yearsOfService})`);
          this.filterPassed.push(emp);
          this.streamLog.push(`filter() → ✅ ${emp.name} (${emp.yearsOfService} yrs)`);
          this.cdr.detectChanges();
        }),
        take(3),
        toArray(),
      ).subscribe({
        next: panel => {
          this.currentPhase = 'take';
          console.log(`${LOG} take(3) → interview panel:`, panel);
          this.interviewPanel = panel;
          this.streamLog.push(`take(3) → interview panel ready — ${panel.length} candidate(s)`);
          this.currentPhase = 'done';
          this.checkingEmployee = null;
          this.cdr.detectChanges();
          console.log(`${LOG} Pipeline COMPLETE ✅`);
          console.groupEnd();
        },
        error: err => {
          console.error(`${LOG} Pipeline error:`, err);
          console.groupEnd();
        },
      });
  }

  private clearScreeningResults(): void {
    this.filterPassed = [];
    this.checkingEmployee = null;
    this.interviewPanel = [];
    this.streamLog = this.streamLog.filter(line =>
      line.startsWith('shareReplay') ||
      line.startsWith('debounceTime') ||
      line.startsWith('distinctUntilChanged'),
    );
  }

  resetPanel(): void {
    this.pipelineSub?.unsubscribe();
    this.screeningStarted = false;
    this.currentPhase = 'idle';
    this.filterPassed = [];
    this.checkingEmployee = null;
    this.interviewPanel = [];
    this.streamLog = [];
    this.cdr.detectChanges();
    console.log(`${LOG} resetPanel() → cleared interview panel & stream log (filters unchanged)`);
  }

  /** Clears search + department filters and restores full roster */
  clearFilters(): void {
    this.lastLoggedSearch = '';
    this.lastLoggedDepartment = null;
    this.searchControl.setValue('', { emitEvent: true });
    this.departmentControl.setValue('', { emitEvent: true });
    this.cdr.detectChanges();
    console.log(`${LOG} clearFilters() → search & department reset, ${this.employees.length} employees visible`);
  }

  phaseLabel(): string {
    const labels: Record<ScreeningPhase, string> = {
      idle: '',
      filter: 'filter() — checking years of service…',
      take: 'take(3) — building interview panel…',
      done: '✅ Shortlist complete',
    };
    return labels[this.currentPhase];
  }
}
