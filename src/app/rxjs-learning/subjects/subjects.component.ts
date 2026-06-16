import { Component, inject } from '@angular/core';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';
import { RxjsSharedService } from '../../shared/services/rxjs-shared.service';
import { SubjectInboxComponent } from './subject-inbox.component';

const LOG = '[Subjects RxJS]';

/**
 * SUBJECTS — component communication demo
 *
 * Component A (this page)  →  publishes via RxjsSharedService
 * Component B (inbox)      →  subscribes via RxjsSharedService
 * HeaderComponent          →  also subscribes to BehaviorSubject notification$
 */
@Component({
  selector: 'app-rxjs-subjects',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES, SubjectInboxComponent],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.scss',
})
export class SubjectsComponent {

  private shared = inject(RxjsSharedService);

  readonly notifications = [
    { label: 'All systems operational', message: '✅ All systems operational' },
    { label: 'Maintenance tonight', message: '⚠️ Scheduled maintenance tonight 10 PM – 11 PM' },
    { label: 'New release deployed', message: '🚀 Version 2.4 deployed successfully' },
  ];

  readonly actions = [
    'Profile saved',
    'Report exported',
    'User logged out',
  ];

  /** BehaviorSubject — push shared STATE to Header + inbox */
  sendNotification(message: string): void {
    console.log(`${LOG} BehaviorSubject.next() →`, message);
    this.shared.publishNotification(message);
  }

  clearNotification(): void {
    console.log(`${LOG} BehaviorSubject cleared`);
    this.shared.clearNotification();
  }

  /** Subject — push one-time EVENT to inbox (Header does not listen to this stream) */
  sendAction(action: string): void {
    console.log(`${LOG} Subject.next() →`, action);
    this.shared.publishAction(action);
  }

  resetAll(): void {
    this.shared.clearNotification();
    console.log(`${LOG} reset — notification cleared (refresh page to clear inbox events)`);
  }
}
