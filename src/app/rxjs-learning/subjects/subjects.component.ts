import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';
import { RxjsSharedService } from '../../shared/services/rxjs-shared.service';
import { colorsList } from '../rxjs-learning.constants';

/**
 * SUBJECTS — Subject, BehaviorSubject, ReplaySubject
 *
 * Scenario: Event bus, shared app state, activity log with replay for late subscribers.
 */
@Component({
  selector: 'app-rxjs-subjects',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES, ReactiveFormsModule],
  templateUrl: './subjects.component.html',
})
export class SubjectsComponent implements OnInit, OnDestroy {

  private rxjsSharedService = inject(RxjsSharedService);
  private subscriptions = new Subscription();

  readonly colorsList = colorsList;
  behaviorMsgControl = new FormControl('');

  // Subject — no initial value, late subscribers miss past emissions
  private themeSubject$ = new Subject<string>();
  subjectOutput: string[] = [];

  // ReplaySubject(2) — replays last 2 values to new subscribers
  private activityLog$ = new ReplaySubject<string>(2);
  replayOutput: string[] = [];

  behaviorSubjectOutput: string[] = [];

  ngOnInit(): void {
    this.subscriptions.add(
      this.themeSubject$.subscribe(color =>
        this.subjectOutput.push(`🎨 Theme broadcast: "${color}"`),
      ),
    );

    this.subscriptions.add(
      this.activityLog$.subscribe(msg =>
        this.replayOutput.push(`📋 Activity log: "${msg}"`),
      ),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /** Subject — push theme color to all current subscribers */
  broadcastTheme(color: string): void {
    this.themeSubject$.next(color);
  }

  /** ReplaySubject — log admin actions; late subscribers see last 2 entries */
  logActivity(action: string): void {
    this.activityLog$.next(action);
  }

  joinLateSubscriber(): void {
    const lateLog: string[] = [];
    this.activityLog$.subscribe(msg => lateLog.push(msg));
    this.replayOutput.push(`🔔 Late subscriber joined — immediately received last 2: [${lateLog.join(' | ')}]`);
  }

  clearSubjectOutput(): void {
    this.subjectOutput = [];
  }

  clearReplayOutput(): void {
    this.replayOutput = [];
  }

  /** BehaviorSubject via RxjsSharedService — cross-component Header message */
  sendToHeader(): void {
    const msg = this.behaviorMsgControl.value ?? '';
    if (!msg.trim()) return;

    this.rxjsSharedService.sendHeaderMessage(msg);
    this.behaviorSubjectOutput.push(`📤 Sent to Header: "${msg}"`);
    this.behaviorSubjectOutput.push('💡 HeaderComponent reads the same BehaviorSubject — watch the banner update!');
    this.behaviorMsgControl.setValue('');
  }

  clearHeaderMessage(): void {
    this.rxjsSharedService.clearHeaderMessage();
    this.behaviorSubjectOutput.push('🧹 Header message cleared');
  }

  showLateBehaviorDemo(): void {
    const current = this.rxjsSharedService.getCurrentMessage();
    this.behaviorSubjectOutput.push(
      `🔔 Late subscriber gets current value immediately: "${current || '(empty)'}"`,
    );
  }
}
