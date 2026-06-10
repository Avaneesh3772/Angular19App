import {
  AfterViewInit, Component, ElementRef, inject,
  OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  catchError, combineLatest, concatMap, debounceTime,
  delay, distinctUntilChanged, filter, forkJoin, from,
  fromEvent, map, merge, mergeMap, of, shareReplay,
  Subject, Subscription, switchMap, take, throwError, toArray, zip
} from 'rxjs';
import { ANGULAR_MATERIAL_MODULES } from '../shared/angular-material';
import { RxjsSharedService } from '../shared/services/rxjs-shared.service';
import { ageList, cityList, colorsList, fruitsList, RxjsConstants, usersList } from './rxjs-learning.constants';
import { ApiTodo, ApiUser } from './rxjs-learning.models';
import { RxjsLearningService } from './rxjs-learning.service';

@Component({
  selector: 'app-rxjs-learning',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES, ReactiveFormsModule],
  templateUrl: './rxjs-learning.component.html',
  styleUrl: './rxjs-learning.component.scss'
})
export class RxjsLearningComponent implements OnInit, AfterViewInit, OnDestroy {

  private rxjsService   = inject(RxjsLearningService);
  private rxjsSharedService = inject(RxjsSharedService);

  // ─── fromEvent needs a native element reference ──────────────────────────
  @ViewChild('fromEventBtn') fromEventBtn!: ElementRef;
  private fromEventSub?: Subscription;

  // ─── FormControls for reactive search inputs ─────────────────────────────
  debounceControl    = new FormControl('');
  distinctControl    = new FormControl('');
  switchMapControl   = new FormControl('');
  behaviorMsgControl = new FormControl('');

  // ─── Output arrays (each operator writes its results here) ───────────────
  // Creation
  ofOutput:        string[] = [];
  fromOutput:      string[] = [];
  fromEventOutput: string[] = [];
  toArrayOutput:   string[] = [];

  // Filtering
  filterOutput:   string[] = [];
  takeOutput:     string[] = [];
  debounceOutput: string[] = [];
  distinctOutput: string[] = [];
  shareReplayOutput: string[] = [];

  // Transformation
  mapOutput:       string[] = [];
  mergeMapOutput:  string[] = [];
  concatMapOutput: string[] = [];
  switchMapOutput: string[] = [];
  switchMapResults: ApiUser[] = [];
  switchMapCallCount = 0;

  // Combination
  forkJoinOutput:      string[] = [];
  zipOutput:           string[] = [];
  combineLatestOutput: string[] = [];

  // Error handling
  catchErrorOutput: string[] = [];

  // Subjects
  subjectOutput:        string[] = [];
  behaviorSubjectOutput: string[] = [];
  private manualSubject$ = new Subject<string>();
  private subscriptions = new Subscription();

  // ─── Lifecycle ────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.setupDebounceTime();
    this.setupDistinctUntilChanged();
    this.setupSwitchMap();
    this.setupSubject();
  }

  ngAfterViewInit(): void {
    this.setupFromEvent();
  }

  ngOnDestroy(): void {
    this.fromEventSub?.unsubscribe();
    this.subscriptions.unsubscribe();
  }

  // ════════════════════════════════════════════════════════════════════════════
  // TAB 1 — CREATION OPERATORS
  // ════════════════════════════════════════════════════════════════════════════

  /**
   * of() — emits each argument as a separate value synchronously, then completes.
   * Best for emitting fixed known values or a list of items.
   */
  runOf(): void {
    this.ofOutput = [];
    of(...colorsList).subscribe({
      next:     color  => this.ofOutput.push(`▶ emitted: "${color}"`),
      complete: ()     => this.ofOutput.push('✅ complete')
    });
  }

  /**
   * from() — converts an array (or Promise/Iterable) into an Observable,
   * emitting each item one at a time, then completes.
   */
  runFrom(): void {
    this.fromOutput = [];
    from(fruitsList).subscribe({
      next:     fruit => this.fromOutput.push(`▶ emitted: "${fruit}"`),
      complete: ()    => this.fromOutput.push('✅ complete')
    });
  }

  /**
   * fromEvent() — creates an Observable from a DOM event.
   * Set up in ngAfterViewInit so the button element is available.
   * Every click on the "Click Me" button triggers this.
   */
  private setupFromEvent(): void {
    let count = 0;
    this.fromEventSub = fromEvent(this.fromEventBtn.nativeElement, 'click')
      .subscribe(() => {
        count++;
        this.fromEventOutput.push(`🖱️ Click #${count} captured by fromEvent()`);
      });
  }

  /**
   * toArray() — collects all emissions into a single array
   * and emits it once the source completes.
   */
  runToArray(): void {
    this.toArrayOutput = [];
    from(cityList).pipe(
      toArray()
    ).subscribe({
      next:     arr => this.toArrayOutput.push(`▶ Collected array: [${arr.join(', ')}]`),
      complete: ()  => this.toArrayOutput.push('✅ complete — emitted ONE array, not 6 individual values')
    });
  }

  // ════════════════════════════════════════════════════════════════════════════
  // TAB 2 — FILTERING OPERATORS
  // ════════════════════════════════════════════════════════════════════════════

  /**
   * filter() — passes through only values that satisfy the predicate.
   * Here: only eligible users (eligibility === true).
   */
  runFilter(): void {
    this.filterOutput = [];
    from(usersList).pipe(
      filter(user => user.eligibility === true)
    ).subscribe({
      next:     u  => this.filterOutput.push(`✅ ${u.name} (${u.country}, age ${u.age}) — eligible`),
      complete: () => this.filterOutput.push('✅ complete — only eligible users passed through')
    });
  }

  /**
   * take(n) — emits only the first n values and then completes.
   * Here: take only the first 3 colors.
   */
  runTake(): void {
    this.takeOutput = [];
    from(colorsList).pipe(
      take(3)
    ).subscribe({
      next:     c  => this.takeOutput.push(`▶ "${c}"`),
      complete: () => this.takeOutput.push('✅ complete — stopped after 3 values (remaining ignored)')
    });
  }

  /**
   * debounceTime(ms) — waits for a silence period before emitting.
   * Ideal for search boxes: don't fire on every keystroke, wait until user stops typing.
   * Try typing quickly — the output only fires after you pause for 600ms.
   */
  private setupDebounceTime(): void {
    let keystrokeCount = 0;
    let emitCount = 0;

    this.subscriptions.add(
      this.debounceControl.valueChanges.subscribe(() => keystrokeCount++)
    );

    this.subscriptions.add(
      this.debounceControl.valueChanges.pipe(
        debounceTime(600)
      ).subscribe(value => {
        if (value) {
          emitCount++;
          this.debounceOutput.push(`⌨️  Keystrokes so far: ${keystrokeCount}`);
          this.debounceOutput.push(`🔔 Emit #${emitCount} after 600ms pause: "${value}"`);
          this.debounceOutput.push('─────────────────────');
        }
      })
    );
  }

  clearDebounce(): void {
    this.debounceOutput = [];
    this.debounceControl.setValue('');
  }

  /**
   * distinctUntilChanged() — skips emission if the new value equals the previous value.
   * Try typing "hello" → backspace to "hell" → type "o" again — it WON'T re-emit "hello".
   */
  private setupDistinctUntilChanged(): void {
    this.subscriptions.add(
      this.distinctControl.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged()
      ).subscribe(value => {
        if (value !== null) {
          this.distinctOutput.push(`▶ New distinct value: "${value}"`);
        }
      })
    );
  }

  clearDistinct(): void {
    this.distinctOutput = [];
    this.distinctControl.setValue('');
  }

  /**
   * shareReplay(1) — multicasts the source and replays the last n emissions to new subscribers.
   * Without shareReplay: 3 subscribers = 3 HTTP requests.
   * With shareReplay(1): 3 subscribers = only 1 HTTP request, result is cached and replayed.
   */
  runShareReplay(): void {
    this.shareReplayOutput = [];
    this.shareReplayOutput.push('Making 3 subscriptions to the SAME Observable...');

    const users$ = this.rxjsService.getUsers().pipe(
      shareReplay(1)
    );

    users$.subscribe(users =>
      this.shareReplayOutput.push(`📡 Subscriber 1 got ${users.length} users`)
    );
    users$.subscribe(users =>
      this.shareReplayOutput.push(`📡 Subscriber 2 got ${users.length} users (replayed — no new HTTP call!)`)
    );
    users$.subscribe(users =>
      this.shareReplayOutput.push(`📡 Subscriber 3 got ${users.length} users (replayed again!)`)
    );

    this.shareReplayOutput.push('✅ Only 1 HTTP request was made (check Network tab in DevTools)');
  }

  // ════════════════════════════════════════════════════════════════════════════
  // TAB 3 — TRANSFORMATION OPERATORS
  // ════════════════════════════════════════════════════════════════════════════

  /**
   * map() — transforms each emitted value.
   * Here: double every age in the list.
   */
  runMap(): void {
    this.mapOutput = [];
    from(ageList).pipe(
      map(age => age * 2)
    ).subscribe({
      next:     doubled => this.mapOutput.push(`▶ ${doubled / 2} × 2 = ${doubled}`),
      complete: ()      => this.mapOutput.push('✅ complete')
    });
  }

  /**
   * mergeMap() — maps to inner Observable and merges all inner Observables concurrently.
   * Requests run IN PARALLEL — results may arrive out of order.
   * Here: fetch todos for users 1, 2, and 3 simultaneously.
   */
  runMergeMap(): void {
    this.mergeMapOutput = ['⏳ Fetching todos for users 1, 2, 3 in PARALLEL...'];

    from([1, 2, 3]).pipe(
      mergeMap(userId =>
        this.rxjsService.getTodos().pipe(
          map((todos: ApiTodo[]) => todos.filter(t => t.userId === userId).slice(0, 2)),
          map(todos => ({ userId, todos }))
        )
      )
    ).subscribe({
      next: result => {
        this.mergeMapOutput.push(`--- User ${result.userId} results arrived ---`);
        result.todos.forEach(t =>
          this.mergeMapOutput.push(`  [${t.completed ? '✅' : '⬜'}] ${t.title.substring(0, 45)}`)
        );
      },
      complete: () => this.mergeMapOutput.push('✅ All parallel requests complete (notice possible out-of-order arrival)')
    });
  }

  /**
   * concatMap() — maps to inner Observable and subscribes to each ONE AT A TIME, in order.
   * Requests run SEQUENTIALLY — guaranteed order, but slower.
   * Here: fetch page 1 (users 1–5) then page 2 (users 6–10) in strict sequence.
   */
  runConcatMap(): void {
    this.concatMapOutput = ['⏳ Fetching pages SEQUENTIALLY (page 1, then page 2)...'];

    from([1, 2]).pipe(
      concatMap(page =>
        this.rxjsService.getUsers().pipe(
          map(users => ({ page, users: users.slice((page - 1) * 5, page * 5) }))
        )
      )
    ).subscribe({
      next: result => {
        this.concatMapOutput.push(`--- Page ${result.page} arrived ---`);
        result.users.forEach(u => this.concatMapOutput.push(`  ${u.name} (${u.email})`));
      },
      complete: () => this.concatMapOutput.push('✅ Always in order: page 1 always before page 2')
    });
  }

  /**
   * switchMap() — maps to inner Observable but CANCELS the previous inner Observable
   * when a new value arrives. Perfect for search: if the user types again before
   * the previous result arrives, the old request is abandoned.
   * Try typing quickly — only the final result appears!
   */
  private setupSwitchMap(): void {
    this.subscriptions.add(
      this.switchMapControl.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(term => {
          if (!term) {
            this.switchMapResults = [];
            return of([] as ApiUser[]);
          }
          this.switchMapCallCount++;
          const callNum = this.switchMapCallCount;
          this.switchMapOutput = [`→ Request #${callNum} started for "${term}" (previous cancelled if any)...`];

          return this.rxjsService.getUsers().pipe(
            delay(600), // simulate slower API so cancellation is visible
            map(users => {
              const filtered = users.filter(u =>
                u.name.toLowerCase().includes(term.toLowerCase())
              );
              this.switchMapOutput.push(`✅ Request #${callNum} completed → ${filtered.length} result(s) for "${term}"`);
              return filtered;
            })
          );
        })
      ).subscribe(users => {
        this.switchMapResults = users;
      })
    );
  }

  clearSwitchMap(): void {
    this.switchMapOutput = [];
    this.switchMapResults = [];
    this.switchMapCallCount = 0;
    this.switchMapControl.setValue('');
  }

  // ════════════════════════════════════════════════════════════════════════════
  // TAB 4 — COMBINATION OPERATORS
  // ════════════════════════════════════════════════════════════════════════════

  /**
   * forkJoin() — waits for ALL source Observables to complete, then emits their
   * last values as a combined object (like Promise.all).
   * Here: fetch users AND todos in parallel, get both results at once.
   */
  runForkJoin(): void {
    this.forkJoinOutput = ['⏳ Waiting for BOTH APIs to complete...'];

    forkJoin({
      users: this.rxjsService.getUsers(),
      todos: this.rxjsService.getTodos()
    }).subscribe({
      next: result => {
        this.forkJoinOutput.push(`✅ Both completed at the same time!`);
        this.forkJoinOutput.push(`👤 Users loaded: ${result.users.length}`);
        this.forkJoinOutput.push(`📋 Todos loaded: ${result.todos.length}`);
        this.forkJoinOutput.push(`First user: ${result.users[0].name}`);
        this.forkJoinOutput.push(`First todo: "${result.todos[0].title.substring(0, 40)}..."`);
      },
      complete: () => this.forkJoinOutput.push('✅ forkJoin complete')
    });
  }

  /**
   * zip() — combines the nth emission from each source Observable into one array.
   * Stops when the shortest source completes.
   * Here: pair each color with a city (index-by-index).
   */
  runZip(): void {
    this.zipOutput = [];
    zip(
      from(colorsList),
      from(cityList)
    ).subscribe({
      next:     ([color, city]) => this.zipOutput.push(`▶ "${color}" paired with "${city}"`),
      complete: ()              => this.zipOutput.push('✅ complete')
    });
  }

  /**
   * combineLatest() — emits whenever ANY source emits, combining the latest value from each.
   * Used with BehaviorSubjects or signals that change over time.
   * Here: combine two of() observables as a simple demo.
   */
  runCombineLatest(): void {
    this.combineLatestOutput = [];
    const colors$ = of('Red', 'Blue', 'Green');
    const nums$   = of(1, 2, 3);

    combineLatest([colors$, nums$]).subscribe({
      next:     ([color, num]) => this.combineLatestOutput.push(`▶ Latest: "${color}" + ${num}`),
      complete: ()             => this.combineLatestOutput.push('✅ complete')
    });
  }

  /**
   * merge() — subscribes to all sources at once and emits each value as it arrives.
   * Unlike forkJoin, it doesn't wait for all to complete.
   */
  runMerge(): void {
    this.combineLatestOutput = [];
    const stream1$ = from(['🔴 A1', '🔴 A2', '🔴 A3']);
    const stream2$ = from(['🔵 B1', '🔵 B2', '🔵 B3']);

    merge(stream1$, stream2$).subscribe({
      next:     val => this.combineLatestOutput.push(`▶ ${val}`),
      complete: ()  => this.combineLatestOutput.push('✅ complete — values interleaved from both streams')
    });
  }

  // ════════════════════════════════════════════════════════════════════════════
  // TAB 5 — ERROR HANDLING
  // ════════════════════════════════════════════════════════════════════════════

  /**
   * throwError() + catchError() — throwError creates an Observable that immediately
   * errors. catchError intercepts the error and returns a fallback Observable,
   * so the stream recovers gracefully instead of crashing.
   */
  runCatchError(): void {
    this.catchErrorOutput = ['⏳ Starting Observable that will throw an error...'];

    throwError(() => new Error('🚨 Simulated server error — HTTP 500')).pipe(
      catchError((err: Error) => {
        this.catchErrorOutput.push(`❌ Error caught: "${err.message}"`);
        this.catchErrorOutput.push('↩️  Returning fallback data instead of crashing...');
        return of(['Fallback Item 1', 'Fallback Item 2', 'Fallback Item 3']);
      })
    ).subscribe({
      next:     data => data.forEach((item: string) => this.catchErrorOutput.push(`📦 ${item}`)),
      complete: ()   => this.catchErrorOutput.push('✅ Stream completed gracefully despite the error!')
    });
  }

  /**
   * HTTP error + catchError() — simulate a real API failure scenario.
   * The service method throws immediately; catchError recovers with an empty array.
   */
  runHttpCatchError(): void {
    this.catchErrorOutput = ['⏳ Calling a failing HTTP endpoint...'];

    this.rxjsService.getFailingRequest().pipe(
      catchError((err: Error) => {
        this.catchErrorOutput.push(`❌ HTTP error caught: "${err.message}"`);
        this.catchErrorOutput.push('↩️  Providing empty fallback so the UI does not break...');
        return of([] as ApiUser[]);
      })
    ).subscribe({
      next:     data  => this.catchErrorOutput.push(`📦 Fallback data length: ${(data as ApiUser[]).length}`),
      complete: ()    => this.catchErrorOutput.push('✅ App still running! catchError saved us.')
    });
  }

  // ════════════════════════════════════════════════════════════════════════════
  // TAB 6 — SUBJECTS
  // ════════════════════════════════════════════════════════════════════════════

  /**
   * Subject — a multicast Observable that you push values into manually via .next().
   * Unlike a regular Observable, it has no initial value and late subscribers
   * do NOT receive past emissions.
   */
  private setupSubject(): void {
    this.subscriptions.add(
      this.manualSubject$.subscribe(value =>
        this.subjectOutput.push(`📢 Subscriber received: "${value}"`)
      )
    );
  }

  emitToSubject(color: string): void {
    this.manualSubject$.next(color);
  }

  clearSubjectOutput(): void {
    this.subjectOutput = [];
  }

  /**
   * BehaviorSubject — like Subject but holds the current value.
   * Every NEW subscriber immediately gets the last emitted value
   * (unlike Subject, where late subscribers miss previous emissions).
   *
   * Here: the RxjsSharedService wraps a BehaviorSubject.
   * We send a message from this component → HeaderComponent displays it.
   * This is the classic cross-component communication pattern in Angular.
   */
  sendToHeader(): void {
    const msg = this.behaviorMsgControl.value ?? '';
    if (!msg.trim()) return;

    this.rxjsSharedService.sendHeaderMessage(msg);
    this.behaviorSubjectOutput.push(`📤 Sent to Header: "${msg}"`);
    this.behaviorSubjectOutput.push(`💡 HeaderComponent subscribed to the same BehaviorSubject and now shows this message`);
    this.behaviorMsgControl.setValue('');
  }

  clearHeaderMessage(): void {
    this.rxjsSharedService.clearHeaderMessage();
    this.behaviorSubjectOutput.push('🧹 Cleared — Header message removed');
  }

  showLateSubscriberDemo(): void {
    const msg = this.rxjsSharedService.getCurrentMessage();
    this.behaviorSubjectOutput.push(`🔔 Late subscriber joined NOW and immediately got: "${msg || '(empty — no message sent yet)'}"`);
    this.behaviorSubjectOutput.push(`💡 This is BehaviorSubject's key feature — it replays the latest value to new subscribers`);
  }
}
