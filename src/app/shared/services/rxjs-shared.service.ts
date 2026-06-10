import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Shared service that demonstrates BehaviorSubject for cross-component communication.
 * The RxjsLearningComponent pushes messages here; HeaderComponent displays them.
 */
@Injectable({ providedIn: 'root' })
export class RxjsSharedService {

  // BehaviorSubject holds the current value; new subscribers immediately get the last emitted value
  private headerMessageSubject = new BehaviorSubject<string>('');

  // Expose as plain Observable so consumers cannot call .next() directly
  headerMessage$: Observable<string> = this.headerMessageSubject.asObservable();

  sendHeaderMessage(message: string): void {
    this.headerMessageSubject.next(message);
  }

  clearHeaderMessage(): void {
    this.headerMessageSubject.next('');
  }

  getCurrentMessage(): string {
    return this.headerMessageSubject.getValue();
  }
}
