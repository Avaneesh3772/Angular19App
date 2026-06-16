import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

/**
 * Shared communication bus for the RxJS Subjects demo.
 *
 * BehaviorSubject → shared STATE  (Header + inbox always know the current value)
 * Subject         → shared EVENTS (inbox only hears events while subscribed)
 */
@Injectable({ providedIn: 'root' })
export class RxjsSharedService {

  private notificationState$ = new BehaviorSubject<string>('');
  private actionEvent$ = new Subject<string>();

  /** Current app notification — new subscribers get the latest value immediately */
  notification$ = this.notificationState$.asObservable();

  /** One-time action events — no memory for late subscribers */
  action$ = this.actionEvent$.asObservable();

  /** Used by HeaderComponent (alias kept for existing tests) */
  headerMessage$ = this.notification$;

  publishNotification(message: string): void {
    this.notificationState$.next(message);
  }

  clearNotification(): void {
    this.notificationState$.next('');
  }

  getCurrentNotification(): string {
    return this.notificationState$.getValue();
  }

  publishAction(action: string): void {
    this.actionEvent$.next(action);
  }

  // Backward-compatible aliases used by HeaderComponent tests
  sendHeaderMessage(message: string): void {
    this.publishNotification(message);
  }

  clearHeaderMessage(): void {
    this.clearNotification();
  }

  getCurrentMessage(): string {
    return this.getCurrentNotification();
  }
}
