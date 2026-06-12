import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';
import { departments } from '../signals-learning.constants';
import { EmployeeItem } from '../signals-learning.models';
import { SignalsLearningService } from '../signals-learning.service';

@Component({
  selector: 'app-linked-signal',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES],
  templateUrl: './linked-signal.component.html',
  styleUrl: './linked-signal.component.scss'
})
export class LinkedSignalComponent {

  private sigService = inject(SignalsLearningService);

  readonly departmentList    = signal<string[]>(departments);
  selectedDepartment         = signal<string>('Engineering');

  employees = toSignal(
    this.sigService.getEmployees(),
    { initialValue: [] as EmployeeItem[] }
  );

  /**
   * linkedSignal() — Angular 19 new primitive.
   *
   * KEY DIFFERENCE vs computed():
   *   computed()      → READ-ONLY, always reflects derived value, cannot be overridden
   *   linkedSignal()  → WRITABLE, starts with derived value, can be manually .set(),
   *                     but RESETS to derived value when source signals change
   *
   * Use case here: when department changes → auto-select the first employee of that dept.
   *                But the user can still override the selection (it stays until dept changes).
   */
  linkedEmployee = linkedSignal<EmployeeItem | null>(() => {
    const dept = this.selectedDepartment();
    return this.employees().find(e => e.department === dept) ?? null;
  });

  employeesInDept = computed(() => {
    const dept = this.selectedDepartment();
    return this.employees().filter(e => e.department === dept);
  });

  linkedSignalLog: string[] = [];

  onDepartmentChange(dept: string): void {
    this.selectedDepartment.set(dept);
    this.linkedSignalLog.push(
      `🏢 Dept → "${dept}" — linkedSignal auto-reset to first employee`
    );
  }

  onEmployeeManualSelect(empId: number): void {
    const emp = this.employeesInDept().find(e => e.id === empId);
    if (!emp) return;
    // Manual override — stays until department changes again
    this.linkedEmployee.set(emp);
    this.linkedSignalLog.push(
      `👤 Manual override → "${emp.name}" (will reset when dept changes)`
    );
  }
}
