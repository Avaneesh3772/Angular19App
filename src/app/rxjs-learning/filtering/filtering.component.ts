import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, from, shareReplay, Subscription, switchMap, take } from 'rxjs';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';
import { usersList } from '../rxjs-learning.constants';
import { DoctorItem, EmployeeItem } from '../rxjs-learning.models';
import { RxjsLearningService } from '../rxjs-learning.service';

/**
 * FILTERING OPERATORS — filter(), take(), debounceTime(), distinctUntilChanged(), shareReplay()
 *
 * Scenario: HR portal — eligibility checks, top doctors, employee search, department filter, cached API.
 */
@Component({
  selector: 'app-rxjs-filtering',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES, ReactiveFormsModule],
  templateUrl: './filtering.component.html',
})
export class FilteringComponent implements OnInit, OnDestroy {

  private rxjsService = inject(RxjsLearningService);
  private subscriptions = new Subscription();

  employeeSearchControl = new FormControl('');
  departmentControl     = new FormControl('Engineering');

  filterOutput: string[] = [];
  takeOutput: string[] = [];
  debounceOutput: string[] = [];
  distinctOutput: string[] = [];
  shareReplayOutput: string[] = [];
  debounceResults: EmployeeItem[] = [];

  ngOnInit(): void {
    this.setupEmployeeSearch();
    this.setupDepartmentFilter();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /** filter() — only eligible loan applicants from usersList */
  runFilter(): void {
    this.filterOutput = [];
    from(usersList).pipe(
      filter(user => user.eligibility === true),
    ).subscribe({
      next: u => this.filterOutput.push(`✅ ${u.name} (${u.country}, age ${u.age}) — eligible`),
      complete: () => this.filterOutput.push('✅ complete — ineligible users blocked'),
    });
  }

  /** take(n) — emit only first 3 doctors from doctorsData.json array */
  runTake(): void {
    this.takeOutput = ['⏳ Loading doctors from doctorsData.json...'];
    this.rxjsService.getDoctors().pipe(
      switchMap(doctors => from(doctors)),
      take(3),
    ).subscribe({
      next: doc => this.takeOutput.push(`▶ ${doc.name} — ${doc.specialty} (⭐ ${doc.rating})`),
      complete: () => this.takeOutput.push('✅ complete — stopped after 3 doctors'),
    });
  }

  /** debounceTime() — employee search waits 600ms after typing stops */
  private setupEmployeeSearch(): void {
    let employees: EmployeeItem[] = [];
    this.rxjsService.getEmployees().subscribe(data => { employees = data; });

    this.subscriptions.add(
      this.employeeSearchControl.valueChanges.pipe(
        debounceTime(600),
      ).subscribe(term => {
        if (!term?.trim()) {
          this.debounceResults = [];
          return;
        }
        this.debounceResults = employees.filter(e =>
          e.name.toLowerCase().includes(term.toLowerCase()) ||
          e.department.toLowerCase().includes(term.toLowerCase())
        );
        this.debounceOutput.push(`🔔 Search fired after 600ms pause: "${term}" → ${this.debounceResults.length} match(es)`);
      }),
    );
  }

  /** distinctUntilChanged() — skip duplicate department selections */
  private setupDepartmentFilter(): void {
    this.subscriptions.add(
      this.departmentControl.valueChanges.pipe(
        distinctUntilChanged(),
      ).subscribe(dept => {
        if (dept) {
          this.distinctOutput.push(`▶ Department changed to: "${dept}" (duplicates skipped)`);
        }
      }),
    );
  }

  /** shareReplay(1) — 3 subscribers share ONE HTTP call to jsonplaceholder /users */
  runShareReplay(): void {
    this.shareReplayOutput = ['⏳ Creating shared Observable with shareReplay(1)...'];

    const users$ = this.rxjsService.getUsers().pipe(shareReplay(1));

    users$.subscribe(users =>
      this.shareReplayOutput.push(`📡 Subscriber 1 → ${users.length} users from JSONPlaceholder`)
    );
    users$.subscribe(users =>
      this.shareReplayOutput.push(`📡 Subscriber 2 → ${users.length} users (cached — no new HTTP!)`)
    );
    users$.subscribe(users =>
      this.shareReplayOutput.push(`📡 Subscriber 3 → ${users.length} users (cached again!)`)
    );
    this.shareReplayOutput.push('💡 Check Network tab — only 1 request to jsonplaceholder.typicode.com/users');
  }

  clearDebounce(): void {
    this.debounceOutput = [];
    this.debounceResults = [];
    this.employeeSearchControl.setValue('');
  }

  clearDistinct(): void {
    this.distinctOutput = [];
  }
}
