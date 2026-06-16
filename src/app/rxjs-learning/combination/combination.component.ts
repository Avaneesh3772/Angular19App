import {
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  combineLatest,
  concatMap,
  delay,
  forkJoin,
  from,
  merge,
  of,
  startWith,
  Subscription,
  zip,
} from 'rxjs';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';
import { departments } from '../rxjs-learning.constants';
import {
  ArtistItem,
  DoctorItem,
  EmployeeItem,
  OrderItem,
} from '../rxjs-learning.models';
import { RxjsLearningService } from '../rxjs-learning.service';

const LOG = '[Combination RxJS]';

interface DashboardSnapshot {
  employeeCount: number;
  doctorCount: number;
  orderCount: number;
  totalPayroll: number;
  openOrders: number;
}

interface InnovationPair {
  employee: string;
  department: string;
  artist: string;
  genre: string;
}

/**
 * COMBINATION OPERATORS — Executive Business Dashboard
 *
 * forkJoin()       → bootstrap dashboard — wait for ALL HTTP sources
 * combineLatest()  → live KPI filter when department OR min years changes
 * zip()            → pair employees with artists index-by-index
 * merge()          → interleave HR + IT notification streams
 */
@Component({
  selector: 'app-rxjs-combination',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES, ReactiveFormsModule, DecimalPipe],
  templateUrl: './combination.component.html',
  styleUrl: './combination.component.scss',
})
export class CombinationComponent implements OnInit, OnDestroy {

  private rxjsService = inject(RxjsLearningService);
  private cdr = inject(ChangeDetectorRef);
  private subscriptions = new Subscription();

  readonly departmentList = departments;

  minYearsControl = new FormControl(3, { nonNullable: true });
  departmentControl = new FormControl('', { nonNullable: true });

  employees: EmployeeItem[] = [];
  artists: ArtistItem[] = [];
  isLoadingData = true;

  // forkJoin
  forkJoinRunning = false;
  dashboardSnapshot: DashboardSnapshot | null = null;
  forkJoinLog: string[] = [];

  // combineLatest
  filteredEmployees: EmployeeItem[] = [];
  combineLog: string[] = [];

  // zip
  zipRunning = false;
  innovationPairs: InnovationPair[] = [];
  zipLog: string[] = [];

  // merge
  mergeRunning = false;
  liveFeed: string[] = [];
  mergeLog: string[] = [];

  ngOnInit(): void {
    console.log(`${LOG} ngOnInit → pre-loading employee & artist data`);

    this.subscriptions.add(
      forkJoin({
        employees: this.rxjsService.getEmployees(),
        artists: this.rxjsService.getArtists(),
      }).subscribe({
        next: ({ employees, artists }) => {
          this.employees = employees;
          this.artists = artists;
          this.isLoadingData = false;
          console.log(`${LOG} Pre-load complete:`, employees.length, 'employees,', artists.length, 'artists');
          this.setupCombineLatestFilter();
          this.cdr.detectChanges();
        },
        error: err => {
          this.isLoadingData = false;
          console.error(`${LOG} Pre-load failed:`, err);
          this.cdr.detectChanges();
        },
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    console.log(`${LOG} ngOnDestroy → unsubscribed`);
  }

  /** forkJoin() — wait for employees + doctors + orders before building dashboard */
  runForkJoin(): void {
    if (this.forkJoinRunning) return;

    console.group(`${LOG} forkJoin()`);
    this.forkJoinRunning = true;
    this.dashboardSnapshot = null;
    this.forkJoinLog = [
      'forkJoin() → waiting for employeeData.json + doctorsData.json + ordersData.json…',
      'forkJoin() → all 3 must complete — like Promise.all()',
    ];
    this.cdr.detectChanges();

    forkJoin({
      employees: this.rxjsService.getEmployees(),
      doctors: this.rxjsService.getDoctors(),
      orders: this.rxjsService.getOrders(),
    }).subscribe({
      next: ({ employees, doctors, orders }) => {
        const totalPayroll = employees.reduce((sum, e) => sum + e.salary, 0);
        const openOrders = orders.filter(o => o.status === 'pending').length;

        this.dashboardSnapshot = {
          employeeCount: employees.length,
          doctorCount: doctors.length,
          orderCount: orders.length,
          totalPayroll,
          openOrders,
        };

        this.forkJoinLog.push(`forkJoin() → ✅ employees: ${employees.length}`);
        this.forkJoinLog.push(`forkJoin() → ✅ doctors: ${doctors.length}`);
        this.forkJoinLog.push(`forkJoin() → ✅ orders: ${orders.length}`);
        this.forkJoinLog.push(`forkJoin() → dashboard ready — payroll $${totalPayroll.toLocaleString()}, ${openOrders} open orders`);
        console.log(`${LOG} forkJoin() result:`, this.dashboardSnapshot);
        this.cdr.detectChanges();
      },
      complete: () => {
        this.forkJoinRunning = false;
        this.forkJoinLog.push('forkJoin() → complete');
        console.groupEnd();
        this.cdr.detectChanges();
      },
      error: err => {
        this.forkJoinRunning = false;
        this.forkJoinLog.push(`forkJoin() → error: ${err.message}`);
        console.error(`${LOG} forkJoin() error:`, err);
        console.groupEnd();
        this.cdr.detectChanges();
      },
    });
  }

  /** combineLatest() — re-filter when EITHER min years OR department changes */
  private setupCombineLatestFilter(): void {
    this.subscriptions.add(
      combineLatest([
        this.minYearsControl.valueChanges.pipe(startWith(this.minYearsControl.value)),
        this.departmentControl.valueChanges.pipe(startWith(this.departmentControl.value)),
      ]).subscribe(([minYears, department]) => {
        let list = this.employees.filter(e => e.yearsOfService >= minYears);
        if (department) {
          list = list.filter(e => e.department === department);
        }
        this.filteredEmployees = list;

        const deptLabel = department || 'All Departments';
        const line = `combineLatest() → years ≥ ${minYears} AND dept = "${deptLabel}" → ${list.length} employee(s)`;
        this.combineLog = [line, ...list.map(e => `  • ${e.name} — ${e.role} (${e.yearsOfService} yrs)`)];
        console.log(`${LOG} ${line}`);
        this.cdr.detectChanges();
      }),
    );
  }

  /** zip() — pair employee[i] with artist[i] by index */
  runZip(): void {
    if (!this.employees.length || !this.artists.length || this.zipRunning) return;

    const count = Math.min(this.employees.length, this.artists.length, 5);
    console.group(`${LOG} zip()`);
    this.zipRunning = true;
    this.innovationPairs = [];
    this.zipLog = [`zip() → pairing ${count} employees with ${count} artists (index 0↔0, 1↔1…)…`];
    this.cdr.detectChanges();

    zip(
      from(this.employees.slice(0, count)),
      from(this.artists.slice(0, count)),
    ).subscribe({
      next: ([employee, artist]) => {
        const pair: InnovationPair = {
          employee: employee.name,
          department: employee.department,
          artist: artist.name,
          genre: artist.genre,
        };
        this.innovationPairs.push(pair);
        this.zipLog.push(`zip() → ${pair.employee} ↔ ${pair.artist} (${pair.genre})`);
        console.log(`${LOG} zip() pair:`, pair);
        this.cdr.detectChanges();
      },
      complete: () => {
        this.zipRunning = false;
        this.zipLog.push(`zip() → complete — ${this.innovationPairs.length} pairs created`);
        console.groupEnd();
        this.cdr.detectChanges();
      },
    });
  }

  /** merge() — interleave HR and IT notification streams as they emit */
  runMerge(): void {
    if (this.mergeRunning) return;

    console.group(`${LOG} merge()`);
    this.mergeRunning = true;
    this.liveFeed = [];
    this.mergeLog = ['merge() → HR stream + IT stream running concurrently…'];
    this.cdr.detectChanges();

    const hrAlerts$ = from([
      '👥 HR: Q2 performance reviews now open',
      '👥 HR: New hire Priya Patel onboarded',
      '👥 HR: Benefits enrollment deadline Friday',
    ]).pipe(concatMap(msg => of(msg).pipe(delay(500))));

    const itAlerts$ = from([
      '🖥️ IT: VPN patch scheduled tonight',
      '🖥️ IT: Payroll system v2.4 deployed',
      '🖥️ IT: MFA required for all users',
    ]).pipe(concatMap(msg => of(msg).pipe(delay(800))));

    merge(hrAlerts$, itAlerts$).subscribe({
      next: msg => {
        this.liveFeed.push(msg);
        this.mergeLog.push(`merge() → ${msg}`);
        console.log(`${LOG} merge() →`, msg);
        this.cdr.detectChanges();
      },
      complete: () => {
        this.mergeRunning = false;
        this.mergeLog.push('merge() → both streams complete — values interleaved');
        console.groupEnd();
        this.cdr.detectChanges();
      },
    });
  }

  clearForkJoin(): void {
    this.dashboardSnapshot = null;
    this.forkJoinLog = [];
    this.forkJoinRunning = false;
    this.cdr.detectChanges();
  }

  clearZip(): void {
    this.innovationPairs = [];
    this.zipLog = [];
    this.zipRunning = false;
    this.cdr.detectChanges();
  }

  clearMerge(): void {
    this.liveFeed = [];
    this.mergeLog = [];
    this.mergeRunning = false;
    this.cdr.detectChanges();
  }
}
