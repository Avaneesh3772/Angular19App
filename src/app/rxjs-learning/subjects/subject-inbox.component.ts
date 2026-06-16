import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';
import { RxjsSharedService } from '../../shared/services/rxjs-shared.service';

const LOG = '[Subject Inbox]';

/**
 * Receiver component — subscribes to RxjsSharedService.
 * Demonstrates how BehaviorSubject vs Subject feel from the subscriber side.
 */
@Component({
  selector: 'app-subject-inbox',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES],
  template: `
    <div class="inbox-panel">
      <p class="inbox-title">
        <mat-icon>inbox</mat-icon>
        Component B — Subscriber (SubjectInboxComponent)
      </p>
      <p class="inbox-hint">This child component listens to the same RxjsSharedService as the Header.</p>

      <div class="inbox-block">
        <span class="block-label">BehaviorSubject — current state</span>
        @if (currentNotification) {
          <div class="state-box">{{ currentNotification }}</div>
        } @else {
          <div class="state-box empty">Waiting for a notification…</div>
        }
        <p class="block-note">Subscribed on init → immediately received: "{{ initialNotification || '(empty)' }}"</p>
      </div>

      <div class="inbox-block">
        <span class="block-label">Subject — action events</span>
        @if (actionEvents.length) {
          @for (event of actionEvents; track $index) {
            <div class="event-row">{{ event }}</div>
          }
        } @else {
          <div class="state-box empty">No actions received yet — click an action button in Component A.</div>
        }
      </div>
    </div>
  `,
  styleUrl: './subject-inbox.component.scss',
})
export class SubjectInboxComponent implements OnInit, OnDestroy {

  private shared = inject(RxjsSharedService);
  private subscriptions = new Subscription();

  currentNotification = '';
  initialNotification = '';
  actionEvents: string[] = [];

  ngOnInit(): void {
    this.initialNotification = this.shared.getCurrentNotification();
    console.log(`${LOG} BehaviorSubject initial value on subscribe: "${this.initialNotification}"`);

    this.subscriptions.add(
      this.shared.notification$.subscribe(msg => {
        this.currentNotification = msg;
        console.log(`${LOG} BehaviorSubject update:`, msg);
      }),
    );

    this.subscriptions.add(
      this.shared.action$.subscribe(action => {
        this.actionEvents.unshift(`🔔 ${action}`);
        console.log(`${LOG} Subject event received:`, action);
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
