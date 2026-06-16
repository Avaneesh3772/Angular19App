import { Component, inject } from '@angular/core';
import { catchError, Observable, of, retry, throwError } from 'rxjs';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';
import { ArtistItem, DoctorItem } from '../rxjs-learning.models';
import { RxjsLearningService } from '../rxjs-learning.service';

/**
 * ERROR HANDLING — catchError(), throwError(), retry()
 *
 * Scenario: Resilient API layer — recover from failures, retry transient errors, fallback to local data.
 */
@Component({
  selector: 'app-rxjs-error-handling',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES],
  templateUrl: './error-handling.component.html',
})
export class ErrorHandlingComponent {

  private rxjsService = inject(RxjsLearningService);

  catchErrorOutput: string[] = [];
  httpErrorOutput: string[] = [];
  retryOutput: string[] = [];
  fallbackDoctors: DoctorItem[] = [];

  private retryAttempt = 0;

  /** throwError() + catchError() — simulate server crash, recover with fallback */
  runCatchError(): void {
    this.catchErrorOutput = ['⏳ Observable will throw immediately...'];

    throwError(() => new Error('🚨 Payment gateway timeout — HTTP 504')).pipe(
      catchError((err: Error) => {
        this.catchErrorOutput.push(`❌ Caught: "${err.message}"`);
        this.catchErrorOutput.push('↩️  Returning fallback order IDs instead of crashing...');
        return of(['ORD-1001', 'ORD-1002', 'ORD-1003']);
      }),
    ).subscribe({
      next: orders => orders.forEach(id => this.catchErrorOutput.push(`📦 Fallback order: ${id}`)),
      complete: () => this.catchErrorOutput.push('✅ Stream completed gracefully!'),
    });
  }

  /** HTTP catchError — failing service call returns empty array so UI survives */
  runHttpCatchError(): void {
    this.httpErrorOutput = ['⏳ Calling getFailingRequest() — always throws...'];

    this.rxjsService.getFailingRequest().pipe(
      catchError((err: Error) => {
        this.httpErrorOutput.push(`❌ HTTP error: "${err.message}"`);
        this.httpErrorOutput.push('↩️  Fallback → load doctorsData.json locally instead...');
        return this.rxjsService.getDoctors();
      }),
    ).subscribe({
      next: (doctors: DoctorItem[]) => {
        this.fallbackDoctors = doctors.slice(0, 3);
        this.httpErrorOutput.push(`📦 Recovered with ${doctors.length} doctors from local JSON`);
      },
      complete: () => this.httpErrorOutput.push('✅ App still running — catchError saved us'),
    });
  }

  /** retry(2) — retry failed API up to 2 times, then succeed on 3rd call */
  runRetry(): void {
    this.retryOutput = ['⏳ Simulating flaky API (fails first 2 attempts)...'];
    this.retryAttempt = 0;

    const flakyApi$: Observable<ArtistItem[]> = new Observable(subscriber => {
      this.retryAttempt++;
      this.retryOutput.push(`🔄 HTTP attempt #${this.retryAttempt}...`);
      if (this.retryAttempt < 3) {
        subscriber.error(new Error(`503 Service Unavailable (attempt ${this.retryAttempt})`));
        return;
      }
      this.rxjsService.getArtists().subscribe(subscriber);
    });

    flakyApi$.pipe(
      retry(2),
      catchError((err: Error) => {
        this.retryOutput.push(`❌ All retries exhausted: "${err.message}"`);
        return of([] as ArtistItem[]);
      }),
    ).subscribe({
      next: artists => {
        if (artists.length) {
          this.retryOutput.push(`✅ Success on attempt #${this.retryAttempt}! Loaded ${artists.length} artists from artistData.json`);
          artists.slice(0, 3).forEach(a => this.retryOutput.push(`  🎨 ${a.name} — ${a.genre}`));
        }
      },
      complete: () => this.retryOutput.push('✅ Stream complete'),
    });
  }
}
