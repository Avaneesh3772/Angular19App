import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  concatMap, debounceTime, delay, distinctUntilChanged,
  from, map, mergeMap, of, Subscription, switchMap,
} from 'rxjs';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';
import { ageList } from '../rxjs-learning.constants';
import { ApiTodo, DoctorItem } from '../rxjs-learning.models';
import { RxjsLearningService } from '../rxjs-learning.service';

/**
 * TRANSFORMATION OPERATORS — map(), mergeMap(), concatMap(), switchMap()
 *
 * Scenario: Data pipeline — salary calc, parallel todos, sequential templates, live doctor search.
 */
@Component({
  selector: 'app-rxjs-transformation',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES, ReactiveFormsModule],
  templateUrl: './transformation.component.html',
})
export class TransformationComponent implements OnInit, OnDestroy {

  private rxjsService = inject(RxjsLearningService);
  private subscriptions = new Subscription();

  doctorSearchControl = new FormControl('');

  mapOutput: string[] = [];
  mergeMapOutput: string[] = [];
  concatMapOutput: string[] = [];
  switchMapOutput: string[] = [];
  switchMapResults: DoctorItem[] = [];
  switchMapCallCount = 0;

  ngOnInit(): void {
    this.setupDoctorSearch();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /** map() — transform ageList into pension eligibility (age × 2 for demo) */
  runMap(): void {
    this.mapOutput = [];
    from(ageList).pipe(
      map(age => ({ age, pensionScore: age * 2, eligible: age >= 18 })),
    ).subscribe({
      next: r => this.mapOutput.push(`▶ Age ${r.age} → pension score ${r.pensionScore} ${r.eligible ? '✅' : '❌'}`),
      complete: () => this.mapOutput.push('✅ complete'),
    });
  }

  /** mergeMap() — fetch todos for users 1, 2, 3 in PARALLEL from JSONPlaceholder */
  runMergeMap(): void {
    this.mergeMapOutput = ['⏳ Fetching todos for users 1, 2, 3 in PARALLEL...'];

    from([1, 2, 3]).pipe(
      mergeMap(userId =>
        this.rxjsService.getTodos().pipe(
          map((todos: ApiTodo[]) => todos.filter(t => t.userId === userId).slice(0, 2)),
          map(todos => ({ userId, todos })),
        ),
      ),
    ).subscribe({
      next: result => {
        this.mergeMapOutput.push(`--- User ${result.userId} (may arrive out of order) ---`);
        result.todos.forEach(t =>
          this.mergeMapOutput.push(`  [${t.completed ? '✅' : '⬜'}] ${t.title.substring(0, 50)}`),
        );
      },
      complete: () => this.mergeMapOutput.push('✅ All parallel requests complete'),
    });
  }

  /** concatMap() — load adminMockData THEN roleMockData SEQUENTIALLY */
  runConcatMap(): void {
    this.concatMapOutput = ['⏳ Loading adminMockData.json → then roleMockData.json (sequential)...'];

    from(['admin', 'role'] as const).pipe(
      concatMap(source =>
        source === 'admin'
          ? this.rxjsService.getAdminTemplates().pipe(map(data => ({ source, count: data.length, sample: data[0]?.template })))
          : this.rxjsService.getRoleTemplates().pipe(map(data => ({ source, count: data.length, sample: data[0]?.template }))),
      ),
    ).subscribe({
      next: r => this.concatMapOutput.push(`📂 ${r.source}MockData.json → ${r.count} records (first: "${r.sample}")`),
      complete: () => this.concatMapOutput.push('✅ Always in order: admin finishes before role starts'),
    });
  }

  /** switchMap() — live doctor search; cancels previous request when user types again */
  private setupDoctorSearch(): void {
    this.subscriptions.add(
      this.doctorSearchControl.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(term => {
          if (!term?.trim()) {
            this.switchMapResults = [];
            return of([] as DoctorItem[]);
          }
          this.switchMapCallCount++;
          const callNum = this.switchMapCallCount;
          this.switchMapOutput = [`→ Request #${callNum} for "${term}" (previous cancelled)...`];

          return this.rxjsService.getDoctors().pipe(
            delay(500),
            map(doctors => {
              const filtered = doctors.filter(d =>
                d.name.toLowerCase().includes(term.toLowerCase()) ||
                d.specialty.toLowerCase().includes(term.toLowerCase()),
              );
              this.switchMapOutput.push(`✅ Request #${callNum} done → ${filtered.length} doctor(s)`);
              return filtered;
            }),
          );
        }),
      ).subscribe(results => { this.switchMapResults = results; }),
    );
  }

  clearSwitchMap(): void {
    this.switchMapOutput = [];
    this.switchMapResults = [];
    this.switchMapCallCount = 0;
    this.doctorSearchControl.setValue('');
  }
}
