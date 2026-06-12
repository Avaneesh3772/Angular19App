import { DecimalPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';

@Component({
  selector: 'app-computed-signals',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES, DecimalPipe],
  templateUrl: './computed-signals.component.html',
  styleUrl: './computed-signals.component.scss'
})
export class ComputedSignalsComponent {

  // Input signals — changed by the user via sliders
  baseSalary    = signal(50000);
  bonusPercent  = signal(10);   // % of baseSalary
  taxPercent    = signal(20);   // % of grossSalary
  deductPercent = signal(8);    // % of baseSalary

  // Derived signals — computed() re-runs automatically when source signals change
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
}
