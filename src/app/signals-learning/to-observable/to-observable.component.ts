import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';
import { EmployeeItem } from '../signals-learning.models';
import { SignalsLearningService } from '../signals-learning.service';

@Component({
  selector: 'app-to-observable',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES, ReactiveFormsModule, DecimalPipe],
  templateUrl: './to-observable.component.html',
  styleUrl: './to-observable.component.scss'
})
export class ToObservableComponent {

  private sigService = inject(SignalsLearningService);

  // Load all employees once
  employees = toSignal(
    this.sigService.getEmployees(),
    { initialValue: [] as EmployeeItem[] }
  );

  employeeSearchTerm = signal<string>('');

  /**
   * Full circle: Signal → Observable → RxJS pipeline → Signal
   *
   * Step 1: toObservable() converts our search signal into an Observable
   *         so we can apply RxJS operators like debounceTime and switchMap.
   * Step 2: Apply debounce (wait for user to stop typing) and distinctUntilChanged.
   * Step 3: switchMap filters the employee list.
   * Step 4: toSignal() converts the result back into a Signal for the template.
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

  displayedColumns = ['name', 'department', 'role', 'salary'];

  onEmployeeSearch(event: Event): void {
    this.employeeSearchTerm.set((event.target as HTMLInputElement).value);
  }
}
