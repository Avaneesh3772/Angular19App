import {
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import {
  catchError,
  Observable,
  of,
  retry,
  Subscription,
  throwError,
} from 'rxjs';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';
import { ArtistItem, EmployeeItem, OrderItem } from '../rxjs-learning.models';
import { RxjsLearningService } from '../rxjs-learning.service';

const LOG = '[Error Handling RxJS]';

/**
 * ERROR HANDLING — E-Commerce Checkout Resilience Hub
 *
 * throwError() + catchError() → payment gateway crash → fallback to local orders
 * catchError()              → primary API 500 → switch to employeeData.json
 * retry(2)                  → flaky inventory API → retry then load artistData.json
 */
@Component({
  selector: 'app-rxjs-error-handling',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES],
  templateUrl: './error-handling.component.html',
  styleUrl: './error-handling.component.scss',
})
export class ErrorHandlingComponent implements OnDestroy {

  private rxjsService = inject(RxjsLearningService);
  private cdr = inject(ChangeDetectorRef);
  private subscriptions = new Subscription();

  // throwError + catchError
  paymentRunning = false;
  paymentStatus: 'idle' | 'error' | 'recovered' = 'idle';
  recoveredOrders: OrderItem[] = [];
  paymentLog: string[] = [];

  // HTTP catchError
  httpRunning = false;
  httpStatus: 'idle' | 'error' | 'recovered' = 'idle';
  fallbackEmployees: EmployeeItem[] = [];
  httpLog: string[] = [];

  // retry
  retryRunning = false;
  retryStatus: 'idle' | 'retrying' | 'success' | 'failed' = 'idle';
  retryArtists: ArtistItem[] = [];
  retryLog: string[] = [];
  private retryAttempt = 0;

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    console.log(`${LOG} ngOnDestroy → unsubscribed`);
  }

  /** throwError() emits an error → catchError() returns fallback Observable */
  runPaymentRecovery(): void {
    if (this.paymentRunning) return;

    console.group(`${LOG} throwError() + catchError()`);
    this.paymentRunning = true;
    this.paymentStatus = 'idle';
    this.recoveredOrders = [];
    this.paymentLog = [
      'throwError() → simulating payment gateway timeout (HTTP 504)…',
    ];
    this.cdr.detectChanges();

    this.subscriptions.add(
      throwError(() => new Error('Payment gateway timeout — HTTP 504')).pipe(
        catchError((err: Error) => {
          this.paymentStatus = 'error';
          this.paymentLog.push(`catchError() → caught: "${err.message}"`);
          this.paymentLog.push('catchError() → returning ordersData.json as fallback…');
          console.log(`${LOG} catchError caught:`, err.message);
          this.cdr.detectChanges();
          return this.rxjsService.getOrders();
        }),
      ).subscribe({
        next: orders => {
          this.paymentStatus = 'recovered';
          this.recoveredOrders = orders;
          this.paymentLog.push(`catchError() → ✅ recovered ${orders.length} orders from local JSON`);
          console.log(`${LOG} Fallback orders:`, orders);
          this.cdr.detectChanges();
        },
        complete: () => {
          this.paymentRunning = false;
          this.paymentLog.push('Stream completed gracefully — app did not crash');
          console.groupEnd();
          this.cdr.detectChanges();
        },
        error: err => {
          this.paymentRunning = false;
          this.paymentLog.push(`Unhandled error: ${err.message}`);
          console.error(`${LOG} Unhandled:`, err);
          console.groupEnd();
          this.cdr.detectChanges();
        },
      }),
    );
  }

  /** HTTP fails → catchError switches to backup local API */
  runHttpFallback(): void {
    if (this.httpRunning) return;

    console.group(`${LOG} HTTP catchError + fallback`);
    this.httpRunning = true;
    this.httpStatus = 'idle';
    this.fallbackEmployees = [];
    this.httpLog = [
      'HTTP → calling primary API (simulated HTTP 500)…',
    ];
    this.cdr.detectChanges();

    this.subscriptions.add(
      this.rxjsService.getFailingRequest().pipe(
        catchError((err: Error) => {
          this.httpStatus = 'error';
          this.httpLog.push(`catchError() → primary failed: "${err.message}"`);
          this.httpLog.push('catchError() → fallback → employeeData.json');
          console.log(`${LOG} Primary API failed, switching to fallback`);
          this.cdr.detectChanges();
          return this.rxjsService.getEmployees();
        }),
      ).subscribe({
        next: employees => {
          this.httpStatus = 'recovered';
          this.fallbackEmployees = employees;
          this.httpLog.push(`catchError() → ✅ loaded ${employees.length} employees from backup`);
          console.log(`${LOG} Fallback employees:`, employees);
          this.cdr.detectChanges();
        },
        complete: () => {
          this.httpRunning = false;
          this.httpLog.push('Stream complete — UI still works');
          console.groupEnd();
          this.cdr.detectChanges();
        },
      }),
    );
  }

  /** retry(2) — re-subscribe on failure; flaky API succeeds on 3rd attempt */
  runRetry(): void {
    if (this.retryRunning) return;

    console.group(`${LOG} retry(2)`);
    this.retryRunning = true;
    this.retryStatus = 'retrying';
    this.retryArtists = [];
    this.retryAttempt = 0;
    this.retryLog = [
      'retry(2) → simulating flaky inventory API (fails twice, succeeds on 3rd)…',
    ];
    this.cdr.detectChanges();

    const flakyInventory$: Observable<ArtistItem[]> = new Observable(subscriber => {
      this.retryAttempt++;
      const attempt = this.retryAttempt;
      this.retryLog.push(`HTTP attempt #${attempt}…`);
      console.log(`${LOG} Attempt #${attempt}`);
      this.cdr.detectChanges();

      if (attempt < 3) {
        subscriber.error(new Error(`503 Service Unavailable (attempt ${attempt})`));
        return;
      }

      this.rxjsService.getArtists().subscribe(subscriber);
    });

    this.subscriptions.add(
      flakyInventory$.pipe(
        retry(2),
        catchError((err: Error) => {
          this.retryStatus = 'failed';
          this.retryLog.push(`catchError() → all retries exhausted: "${err.message}"`);
          console.error(`${LOG} Retries exhausted:`, err);
          return of([] as ArtistItem[]);
        }),
      ).subscribe({
        next: artists => {
          if (artists.length) {
            this.retryStatus = 'success';
            this.retryArtists = artists.slice(0, 4);
            this.retryLog.push(`retry(2) → ✅ success on attempt #${this.retryAttempt}!`);
            this.retryLog.push(`Loaded ${artists.length} artists from artistData.json`);
            console.log(`${LOG} Success on attempt #${this.retryAttempt}`);
          }
          this.cdr.detectChanges();
        },
        complete: () => {
          this.retryRunning = false;
          this.retryLog.push('Stream complete');
          console.groupEnd();
          this.cdr.detectChanges();
        },
      }),
    );
  }

  clearPayment(): void {
    this.paymentRunning = false;
    this.paymentStatus = 'idle';
    this.recoveredOrders = [];
    this.paymentLog = [];
    this.cdr.detectChanges();
  }

  clearHttp(): void {
    this.httpRunning = false;
    this.httpStatus = 'idle';
    this.fallbackEmployees = [];
    this.httpLog = [];
    this.cdr.detectChanges();
  }

  clearRetry(): void {
    this.retryRunning = false;
    this.retryStatus = 'idle';
    this.retryArtists = [];
    this.retryLog = [];
    this.retryAttempt = 0;
    this.cdr.detectChanges();
  }
}
