import { Component, computed, effect, inject, linkedSignal, OnDestroy, OnInit, resource, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, of, Subscription, switchMap } from 'rxjs';
import { ANGULAR_MATERIAL_MODULES } from '../shared/angular-material';
import { artistGenres, departments, SignalsConstants, techProductsList } from './signals-learning.constants';
import { ArtistItem, CartItem, DoctorItem, EmployeeItem, ProductItem } from './signals-learning.models';
import { SignalsLearningService } from './signals-learning.service';

@Component({
  selector: 'app-signals-learning',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES, ReactiveFormsModule],
  templateUrl: './signals-learning.component.html',
  styleUrl: './signals-learning.component.scss'
})
export class SignalsLearningComponent implements OnInit, OnDestroy {

  private sigService = inject(SignalsLearningService);
  private subscriptions = new Subscription();

  // ════════════════════════════════════════════════════════════════════════
  // SECTION 1 — signal() + set() + update()
  // Problem: Shopping Cart — add/remove/adjust quantities
  // ════════════════════════════════════════════════════════════════════════

  /** The product catalog — a read-only signal wrapping a static list */
  readonly productCatalog = signal<ProductItem[]>(techProductsList);

  /** Cart items — writable signal; shape: ProductItem + qty */
  cartItems = signal<CartItem[]>([]);

  /** computed() — total price automatically recalculates whenever cartItems changes */
  cartTotal = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.price * item.qty, 0)
  );

  /** computed() — total item count in cart */
  cartItemCount = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.qty, 0)
  );

  addToCart(product: ProductItem): void {
    // update() — transforms current value; used when new value depends on previous value
    this.cartItems.update(items => {
      const existing = items.find(i => i.id === product.id);
      if (existing) {
        // Item already in cart — increment qty
        return items.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      // New item — spread product + add qty: 1
      return [...items, { ...product, qty: 1 }];
    });
  }

  decrementQty(id: number): void {
    this.cartItems.update(items =>
      items
        .map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i)
        .filter(i => i.qty > 0) // remove if qty reaches 0
    );
  }

  removeFromCart(id: number): void {
    this.cartItems.update(items => items.filter(i => i.id !== id));
  }

  clearCart(): void {
    // set() — replaces the entire signal value
    this.cartItems.set([]);
  }

  // ════════════════════════════════════════════════════════════════════════
  // SECTION 2 — computed()
  // Problem: Salary Calculator — all values auto-update from 3 inputs
  // ════════════════════════════════════════════════════════════════════════

  baseSalary     = signal(50000);
  bonusPercent   = signal(10);    // % of baseSalary
  taxPercent     = signal(20);    // % of grossSalary
  deductPercent  = signal(8);     // % of baseSalary

  /** All derived values — computed() re-runs only when their source signals change */
  bonusAmount     = computed(() => Math.round(this.baseSalary() * this.bonusPercent() / 100));
  grossSalary     = computed(() => this.baseSalary() + this.bonusAmount());
  taxAmount       = computed(() => Math.round(this.grossSalary() * this.taxPercent() / 100));
  deductionAmount = computed(() => Math.round(this.baseSalary() * this.deductPercent() / 100));
  netSalary       = computed(() => this.grossSalary() - this.taxAmount() - this.deductionAmount());

  onBaseSalaryChange(event: Event): void {
    this.baseSalary.set(+(event.target as HTMLInputElement).value);
  }
  onBonusChange(event: Event): void {
    this.bonusPercent.set(+(event.target as HTMLInputElement).value);
  }
  onTaxChange(event: Event): void {
    this.taxPercent.set(+(event.target as HTMLInputElement).value);
  }
  onDeductChange(event: Event): void {
    this.deductPercent.set(+(event.target as HTMLInputElement).value);
  }

  // ════════════════════════════════════════════════════════════════════════
  // SECTION 3 — effect()
  // Problem: Theme & Font Preference — run side effects when signal changes
  // ════════════════════════════════════════════════════════════════════════

  selectedTheme  = signal<'light' | 'dark'>('light');
  fontSize       = signal<number>(14);
  effectLog      = signal<string[]>([]);

  /**
   * effect() runs immediately when created, then re-runs whenever any
   * signal it reads changes. It must NOT change signals inside it (use
   * allowSignalWrites: true only when truly necessary).
   */
  private themeEffect = effect(() => {
    const theme = this.selectedTheme();
    const size  = this.fontSize();
    // Side effect 1: persist to localStorage
    localStorage.setItem('user-theme', theme);
    localStorage.setItem('user-font-size', String(size));
    // Side effect 2: append to log (uses allowSignalWrites because we write to effectLog)
    this.effectLog.update(logs => [
      ...logs.slice(-6), // keep last 7 lines
      `[${new Date().toLocaleTimeString()}] theme="${theme}", fontSize=${size}px — saved to localStorage`
    ]);
  }, { allowSignalWrites: true });

  clearEffectLog(): void {
    this.effectLog.set([]);
  }

  // ════════════════════════════════════════════════════════════════════════
  // SECTION 4 — toSignal()
  // Problem: Doctor Directory — load HTTP data once, use it like a signal
  // ════════════════════════════════════════════════════════════════════════

  /**
   * toSignal() converts an Observable into a Signal.
   * No need for async pipe, no manual subscription/unsubscription.
   * initialValue is what the signal holds before the HTTP response arrives.
   */
  doctors = toSignal(
    this.sigService.getDoctors(),
    { initialValue: [] as DoctorItem[] }
  );

  selectedSpecialty = signal<string>('All');

  /** Derived from two signals — recomputes whenever doctors or selectedSpecialty changes */
  filteredDoctors = computed(() => {
    const spec = this.selectedSpecialty();
    return spec === 'All'
      ? this.doctors()
      : this.doctors().filter(d => d.specialty === spec);
  });

  /** Unique specialty list for the filter dropdown */
  specialties = computed(() => {
    const list = ['All', ...new Set(this.doctors().map(d => d.specialty))];
    return list.sort();
  });

  // ════════════════════════════════════════════════════════════════════════
  // SECTION 5 — toObservable()
  // Problem: Employee Search — Signal → RxJS pipeline → back to Signal
  // ════════════════════════════════════════════════════════════════════════

  employeeSearchTerm = signal<string>('');

  /** Load employees once as a signal */
  employees = toSignal(
    this.sigService.getEmployees(),
    { initialValue: [] as EmployeeItem[] }
  );

  /**
   * toObservable() converts a Signal back into an Observable.
   * This lets us use RxJS operators (debounceTime, switchMap etc.) on signal values.
   * Then toSignal() converts the result back — full circle:
   * Signal → Observable → RxJS pipeline → Signal
   */
  private employeeSearch$ = toObservable(this.employeeSearchTerm).pipe(
    debounceTime(400),
    distinctUntilChanged(),
    switchMap(term => {
      if (term.trim().length < 2) return of([] as EmployeeItem[]);
      const filtered = this.employees().filter(e =>
        e.name.toLowerCase().includes(term.toLowerCase()) ||
        e.department.toLowerCase().includes(term.toLowerCase()) ||
        e.role.toLowerCase().includes(term.toLowerCase())
      );
      return of(filtered);
    })
  );

  employeeSearchResults = toSignal(this.employeeSearch$, { initialValue: [] as EmployeeItem[] });

  onEmployeeSearch(event: Event): void {
    this.employeeSearchTerm.set((event.target as HTMLInputElement).value);
  }

  // ════════════════════════════════════════════════════════════════════════
  // SECTION 6 — linkedSignal()  (Angular 19 — new!)
  // Problem: Department Selector — selecting dept auto-resets the employee
  // ════════════════════════════════════════════════════════════════════════

  readonly departmentList = signal<string[]>(departments);
  selectedDepartment     = signal<string>('Engineering');

  /**
   * linkedSignal() creates a WRITABLE signal whose default value is derived
   * from other signals. Key difference from computed():
   *
   *   computed()      — READ-ONLY, always reflects derived value
   *   linkedSignal()  — WRITABLE, can be overridden manually, but RESETS
   *                     to the derived value when source signals change
   *
   * Use case: When department changes → auto-reset employee to first in that dept.
   *           But user can still override the selection manually.
   */
  linkedEmployee = linkedSignal<EmployeeItem | null>(() => {
    const dept = this.selectedDepartment();
    return this.employees().find(e => e.department === dept) ?? null;
  });

  /** Employees in the currently selected department */
  employeesInDept = computed(() => {
    const dept = this.selectedDepartment();
    return this.employees().filter(e => e.department === dept);
  });

  linkedSignalLog: string[] = [];

  onDepartmentChange(dept: string): void {
    this.selectedDepartment.set(dept);
    this.linkedSignalLog.push(`🏢 Department changed to "${dept}" → employee auto-reset by linkedSignal`);
  }

  onEmployeeManualSelect(emp: EmployeeItem): void {
    // Manually override the linkedSignal — it accepts .set() like any writable signal
    this.linkedEmployee.set(emp);
    this.linkedSignalLog.push(`👤 Manually selected: "${emp.name}" (override stays until dept changes again)`);
  }

  // ════════════════════════════════════════════════════════════════════════
  // SECTION 7 — resource()  (Angular 19 — new!)
  // Problem: Artist Gallery — async data load with built-in loading/error signals
  // ════════════════════════════════════════════════════════════════════════

  readonly genreList     = signal<string[]>(artistGenres);
  selectedArtistGenre    = signal<string>('All');

  /**
   * resource() — Angular 19's built-in async data loading primitive.
   * It automatically tracks loading/error state as Signals.
   *
   * request: () => the "input" signal — whenever this changes, loader re-runs
   * loader : async function that receives { request, abortSignal }
   *
   * Exposes built-in signals:
   *   .value()     — the loaded data (Signal)
   *   .isLoading() — true while fetching (Signal)
   *   .error()     — error if loader throws (Signal)
   *   .reload()    — manually trigger a re-fetch
   */
  artistResource = resource({
    request: () => this.selectedArtistGenre(),
    loader: async ({ request: genre, abortSignal }) => {
      // Artificial delay to make isLoading() visible in the UI
      await new Promise<void>(resolve => setTimeout(resolve, 700));
      const response = await fetch(SignalsConstants.artistDataURL, { signal: abortSignal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data: ArtistItem[] = await response.json();
      return genre === 'All' ? data : data.filter(a => a.genre === genre);
    }
  });

  // ════════════════════════════════════════════════════════════════════════
  // SECTION 8 — mutate() REMOVED
  // Explanation + update() migration pattern
  // (No interactive demo — conceptual only)
  // ════════════════════════════════════════════════════════════════════════

  // ─── Lifecycle ────────────────────────────────────────────────────────────
  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
