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
  concatMap,
  debounceTime,
  delay,
  distinctUntilChanged,
  from,
  map,
  mergeMap,
  of,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';
import { ApiUser, OrderItem, OrderSummary } from '../rxjs-learning.models';
import { RxjsLearningService } from '../rxjs-learning.service';

const LOG = '[Transformation RxJS]';

interface MergeMapResult {
  userId: number;
  name: string;
  email: string;
  arrivedAt: string;
  delayMs: number;
}

interface ConcatMapStep {
  orderId: string;
  customer: string;
  step: string;
  stepIndex: number;
  totalSteps: number;
}

/** Simulated network latency per JSONPlaceholder user — mergeMap finishes out of order */
const MERGE_MAP_DELAYS: Record<number, number> = { 1: 1000, 2: 300, 3: 600 };

const FULFILLMENT_STEPS = ['Validate payment', 'Pack warehouse', 'Create shipping label'] as const;

/**
 * TRANSFORMATION OPERATORS — E-Commerce Order Fulfillment Hub
 *
 * map()       → enrich raw orders with shipping & grand total
 * mergeMap()  → fetch 3 customer profiles from JSONPlaceholder in PARALLEL
 * concatMap() → process each order through 3 fulfillment steps SEQUENTIALLY
 * switchMap() → live order lookup; cancels stale searches while typing
 */
@Component({
  selector: 'app-rxjs-transformation',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES, ReactiveFormsModule, DecimalPipe],
  templateUrl: './transformation.component.html',
  styleUrl: './transformation.component.scss',
})
export class TransformationComponent implements OnInit, OnDestroy {

  private rxjsService = inject(RxjsLearningService);
  private cdr = inject(ChangeDetectorRef);
  private subscriptions = new Subscription();

  orderSearchControl = new FormControl('', { nonNullable: true });

  orders: OrderItem[] = [];
  isLoadingOrders = true;

  // map()
  mapRunning = false;
  mapSummaries: OrderSummary[] = [];
  mapLog: string[] = [];

  // mergeMap()
  mergeMapRunning = false;
  mergeMapResults: MergeMapResult[] = [];
  mergeMapLog: string[] = [];

  // concatMap()
  concatMapRunning = false;
  concatMapSteps: ConcatMapStep[] = [];
  concatMapLog: string[] = [];
  concatCurrentOrder: string | null = null;

  // switchMap()
  switchMapRunning = false;
  switchMapResults: OrderItem[] = [];
  switchMapLog: string[] = [];
  switchMapCallCount = 0;
  isSearchPending = false;

  ngOnInit(): void {
    console.log(`${LOG} ngOnInit → loading orders from ordersData.json`);
    this.rxjsService.getOrders().subscribe({
      next: data => {
        this.orders = data;
        this.isLoadingOrders = false;
        console.log(`${LOG} Orders loaded:`, data);
        this.cdr.detectChanges();
      },
      error: err => {
        this.isLoadingOrders = false;
        console.error(`${LOG} Failed to load orders:`, err);
        this.cdr.detectChanges();
      },
    });

    this.setupOrderSearch();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    console.log(`${LOG} ngOnDestroy → unsubscribed`);
  }

  /** map() — 1-to-1 transform: raw order → fulfillment summary with shipping & ETA */
  runMap(): void {
    if (!this.orders.length || this.mapRunning) return;

    console.group(`${LOG} map() pipeline`);
    this.mapRunning = true;
    this.mapSummaries = [];
    this.mapLog = ['map() → transforming each order (1 input → 1 output)…'];
    this.cdr.detectChanges();

    from(this.orders).pipe(
      map(order => this.toOrderSummary(order)),
      tap(summary => {
        const line = `${summary.orderId}: $${summary.grandTotal.toFixed(2)} (${summary.eta})`;
        this.mapLog.push(`map() → ${line}`);
        console.log(`${LOG} map() →`, summary);
        this.cdr.detectChanges();
      }),
    ).subscribe({
      next: summary => this.mapSummaries.push(summary),
      complete: () => {
        this.mapRunning = false;
        this.mapLog.push(`map() → complete — ${this.mapSummaries.length} summaries created`);
        console.log(`${LOG} map() complete`);
        console.groupEnd();
        this.cdr.detectChanges();
      },
    });
  }

  private toOrderSummary(order: OrderItem): OrderSummary {
    const shipping = order.priority === 'express' ? 12.99 : 4.99;
    return {
      orderId: order.id,
      customer: order.customer,
      itemCount: order.items,
      shipping,
      grandTotal: order.total + shipping,
      eta: order.priority === 'express' ? 'Next-day delivery' : '3–5 business days',
    };
  }

  /** mergeMap() — parallel inner streams; results may arrive out of order */
  runMergeMap(): void {
    if (this.mergeMapRunning) return;

    console.group(`${LOG} mergeMap() pipeline`);
    this.mergeMapRunning = true;
    this.mergeMapResults = [];
    this.mergeMapLog = [
      'mergeMap() → fetching JSONPlaceholder users 1, 2, 3 in PARALLEL…',
      'mergeMap() → delays: User1=1000ms, User2=300ms, User3=600ms (expect 2 → 3 → 1)',
    ];
    this.cdr.detectChanges();

    from([1, 2, 3]).pipe(
      mergeMap(userId =>
        this.rxjsService.getUserById(userId).pipe(
          delay(MERGE_MAP_DELAYS[userId]),
          map((user: ApiUser) => ({
            userId,
            name: user.name,
            email: user.email,
            arrivedAt: new Date().toLocaleTimeString(),
            delayMs: MERGE_MAP_DELAYS[userId],
          })),
          tap(result => {
            const line = `User ${result.userId} (${result.name}) arrived after ${result.delayMs}ms`;
            this.mergeMapLog.push(`mergeMap() → ✅ ${line}`);
            console.log(`${LOG} mergeMap() →`, result);
            this.cdr.detectChanges();
          }),
        ),
      ),
    ).subscribe({
      next: result => this.mergeMapResults.push(result),
      complete: () => {
        this.mergeMapRunning = false;
        this.mergeMapLog.push('mergeMap() → all parallel requests complete');
        console.log(`${LOG} mergeMap() complete — arrival order:`, this.mergeMapResults.map(r => r.userId));
        console.groupEnd();
        this.cdr.detectChanges();
      },
      error: err => {
        this.mergeMapRunning = false;
        this.mergeMapLog.push(`mergeMap() → error: ${err.message}`);
        console.error(`${LOG} mergeMap() error:`, err);
        console.groupEnd();
        this.cdr.detectChanges();
      },
    });
  }

  /** concatMap() — one order fully processed before the next begins */
  runConcatMap(): void {
    if (!this.orders.length || this.concatMapRunning) return;

    const queue = this.orders.slice(0, 3);
    console.group(`${LOG} concatMap() pipeline`);
    this.concatMapRunning = true;
    this.concatMapSteps = [];
    this.concatMapLog = [
      `concatMap() → processing ${queue.length} orders ONE AT A TIME…`,
      `concatMap() → queue: ${queue.map(o => o.id).join(' → ')}`,
    ];
    this.concatCurrentOrder = null;
    this.cdr.detectChanges();

    from(queue).pipe(
      concatMap(order =>
        from(FULFILLMENT_STEPS).pipe(
          concatMap((step, stepIndex) =>
            of({ order, step, stepIndex }).pipe(
              delay(500),
              tap(({ order: o, step: s, stepIndex: i }) => {
                this.concatCurrentOrder = o.id;
                const entry: ConcatMapStep = {
                  orderId: o.id,
                  customer: o.customer,
                  step: s,
                  stepIndex: i + 1,
                  totalSteps: FULFILLMENT_STEPS.length,
                };
                this.concatMapSteps.push(entry);
                this.concatMapLog.push(`concatMap() → ${o.id} step ${i + 1}/3: ${s}`);
                console.log(`${LOG} concatMap() →`, entry);
                this.cdr.detectChanges();
              }),
            ),
          ),
        ),
      ),
    ).subscribe({
      complete: () => {
        this.concatMapRunning = false;
        this.concatCurrentOrder = null;
        this.concatMapLog.push('concatMap() → all orders fulfilled in strict sequence ✅');
        console.log(`${LOG} concatMap() complete`);
        console.groupEnd();
        this.cdr.detectChanges();
      },
      error: err => {
        this.concatMapRunning = false;
        this.concatCurrentOrder = null;
        console.error(`${LOG} concatMap() error:`, err);
        console.groupEnd();
        this.cdr.detectChanges();
      },
    });
  }

  /** switchMap() — only the latest search matters; previous HTTP calls cancelled */
  private setupOrderSearch(): void {
    this.subscriptions.add(
      this.orderSearchControl.valueChanges.pipe(
        tap(() => {
          this.isSearchPending = true;
          this.cdr.detectChanges();
        }),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(term => {
          this.isSearchPending = false;
          const q = term.trim().toLowerCase();

          if (!q) {
            this.switchMapResults = [];
            this.switchMapLog = [];
            this.switchMapRunning = false;
            return of([] as OrderItem[]);
          }

          this.switchMapRunning = true;
          this.switchMapCallCount++;
          const callNum = this.switchMapCallCount;
          this.switchMapLog = [`switchMap() → request #${callNum} for "${term}" (previous cancelled)…`];
          console.log(`${LOG} switchMap() request #${callNum}:`, term);
          this.cdr.detectChanges();

          return of(this.orders).pipe(
            delay(600),
            map(list => list.filter(o =>
              o.customer.toLowerCase().includes(q) ||
              o.id.toLowerCase().includes(q),
            )),
            tap(results => {
              this.switchMapLog.push(`switchMap() → request #${callNum} done → ${results.length} order(s)`);
              console.log(`${LOG} switchMap() #${callNum} results:`, results);
              this.switchMapRunning = false;
              this.cdr.detectChanges();
            }),
          );
        }),
      ).subscribe(results => {
        this.switchMapResults = results;
        this.cdr.detectChanges();
      }),
    );
  }

  clearMap(): void {
    this.mapSummaries = [];
    this.mapLog = [];
    this.mapRunning = false;
    this.cdr.detectChanges();
  }

  clearMergeMap(): void {
    this.mergeMapResults = [];
    this.mergeMapLog = [];
    this.mergeMapRunning = false;
    this.cdr.detectChanges();
  }

  clearConcatMap(): void {
    this.concatMapSteps = [];
    this.concatMapLog = [];
    this.concatCurrentOrder = null;
    this.concatMapRunning = false;
    this.cdr.detectChanges();
  }

  clearSwitchMap(): void {
    this.orderSearchControl.setValue('');
    this.switchMapResults = [];
    this.switchMapLog = [];
    this.switchMapCallCount = 0;
    this.switchMapRunning = false;
    this.cdr.detectChanges();
  }
}
