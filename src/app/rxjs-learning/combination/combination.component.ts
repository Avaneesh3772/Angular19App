import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, forkJoin, from, merge, startWith, zip } from 'rxjs';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';
import { cityList, colorsList, usersList } from '../rxjs-learning.constants';
import { EmployeeItem } from '../rxjs-learning.models';
import { RxjsLearningService } from '../rxjs-learning.service';

/**
 * COMBINATION OPERATORS — forkJoin(), combineLatest(), zip(), merge()
 *
 * Scenario: Dashboard assembly — load multiple datasets, combine filters, pair data, merge event streams.
 */
@Component({
  selector: 'app-rxjs-combination',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES, ReactiveFormsModule],
  templateUrl: './combination.component.html',
})
export class CombinationComponent implements OnInit, OnDestroy {

  private rxjsService = inject(RxjsLearningService);

  minAgeControl     = new FormControl(25);
  countryControl    = new FormControl('India');
  employees: EmployeeItem[] = [];

  forkJoinOutput: string[] = [];
  zipOutput: string[] = [];
  combineLatestOutput: string[] = [];
  mergeOutput: string[] = [];
  filteredUsers: typeof usersList = [];

  ngOnInit(): void {
    this.rxjsService.getEmployees().subscribe(data => { this.employees = data; });
    this.setupCombineLatestFilter();
  }

  ngOnDestroy(): void {}

  /** forkJoin() — load doctors + employees in parallel, wait for BOTH (like Promise.all) */
  runForkJoin(): void {
    this.forkJoinOutput = ['⏳ Waiting for doctorsData.json AND employeeData.json...'];

    forkJoin({
      doctors: this.rxjsService.getDoctors(),
      employees: this.rxjsService.getEmployees(),
    }).subscribe({
      next: result => {
        this.forkJoinOutput.push(`✅ Both loaded together!`);
        this.forkJoinOutput.push(`🩺 Doctors: ${result.doctors.length} | 👥 Employees: ${result.employees.length}`);
        this.forkJoinOutput.push(`First doctor: ${result.doctors[0].name}`);
        this.forkJoinOutput.push(`First employee: ${result.employees[0].name} (${result.employees[0].department})`);
      },
      complete: () => this.forkJoinOutput.push('✅ forkJoin complete'),
    });
  }

  /** zip() — pair colorsList[i] with cityList[i] index-by-index */
  runZip(): void {
    this.zipOutput = [];
    zip(from(colorsList), from(cityList)).subscribe({
      next: ([color, city]) => this.zipOutput.push(`▶ Theme "${color}" → Office in "${city}"`),
      complete: () => this.zipOutput.push('✅ complete — index 0 with 0, 1 with 1, etc.'),
    });
  }

  /** combineLatest() — filter usersList when EITHER min age OR country changes */
  private setupCombineLatestFilter(): void {
    combineLatest([
      this.minAgeControl.valueChanges.pipe(startWith(this.minAgeControl.value)),
      this.countryControl.valueChanges.pipe(startWith(this.countryControl.value)),
    ]).subscribe(([minAge, country]) => {
      this.filteredUsers = usersList.filter(u =>
        u.age >= (minAge ?? 0) && u.country === country,
      );
      this.combineLatestOutput.push(
        `▶ Age ≥ ${minAge} AND country = "${country}" → ${this.filteredUsers.length} user(s): ${this.filteredUsers.map(u => u.name).join(', ') || 'none'}`,
      );
    });
  }

  /** merge() — interleave two artist genre streams as they emit */
  runMerge(): void {
    this.mergeOutput = [];
    const renaissance$ = from(['🎨 Leonardo da Vinci', '🎨 Michelangelo']);
    const modern$      = from(['🖼️ Pablo Picasso', '🖼️ Salvador Dali']);

    merge(renaissance$, modern$).subscribe({
      next: val => this.mergeOutput.push(`▶ ${val}`),
      complete: () => this.mergeOutput.push('✅ complete — values interleaved from artistData genres'),
    });
  }

  clearCombineLatest(): void {
    this.combineLatestOutput = [];
  }
}
