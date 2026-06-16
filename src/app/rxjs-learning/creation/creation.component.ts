import { AfterViewInit, Component, ElementRef, inject, OnDestroy, ViewChild } from '@angular/core';
import { from, fromEvent, of, Subscription, toArray } from 'rxjs';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';
import { cityList, colorsList, fruitsList } from '../rxjs-learning.constants';
import { DoctorItem } from '../rxjs-learning.models';
import { RxjsLearningService } from '../rxjs-learning.service';

/**
 * CREATION OPERATORS — of(), from(), fromEvent(), toArray()
 *
 * Scenario: Hospital intake desk — queue patients, scan stock, log check-ins, batch cities.
 */
@Component({
  selector: 'app-rxjs-creation',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES],
  templateUrl: './creation.component.html',
})
export class CreationComponent implements AfterViewInit, OnDestroy {

  private rxjsService = inject(RxjsLearningService);

  @ViewChild('checkInBtn') checkInBtn!: ElementRef<HTMLButtonElement>;
  private checkInSub?: Subscription;

  doctors: DoctorItem[] = [];
  ofOutput: string[] = [];
  fromOutput: string[] = [];
  fromEventOutput: string[] = [];
  toArrayOutput: string[] = [];

  ngAfterViewInit(): void {
    // Pre-load doctors so of() demo uses real data from doctorsData.json
    this.rxjsService.getDoctors().subscribe(docs => {
      this.doctors = docs;
    });

    let checkInCount = 0;
    this.checkInSub = fromEvent(this.checkInBtn.nativeElement, 'click').subscribe(() => {
      checkInCount++;
      this.fromEventOutput.push(`🩺 Check-in #${checkInCount} logged via fromEvent()`);
    });
  }

  ngOnDestroy(): void {
    this.checkInSub?.unsubscribe();
  }

  /** of() — emit fixed values synchronously (urgent specialty alerts) */
  runOf(): void {
    this.ofOutput = [];
    const specialties = this.doctors.length
      ? this.doctors.slice(0, 4).map(d => d.specialty)
      : colorsList.slice(0, 4);

    of(...specialties).subscribe({
      next: spec => this.ofOutput.push(`▶ Urgent slot opened: "${spec}"`),
      complete: () => this.ofOutput.push('✅ complete — all specialties emitted'),
    });
  }

  /** from() — convert array to Observable (fruit pharmacy stock scan) */
  runFrom(): void {
    this.fromOutput = [];
    from(fruitsList).subscribe({
      next: fruit => this.fromOutput.push(`📦 Scanned stock item: "${fruit}"`),
      complete: () => this.fromOutput.push('✅ complete — all items scanned one-by-one'),
    });
  }

  /** toArray() — collect all emissions into one array on complete */
  runToArray(): void {
    this.toArrayOutput = [];
    from(cityList).pipe(toArray()).subscribe({
      next: cities => this.toArrayOutput.push(`🌍 Service areas batch: [${cities.join(', ')}]`),
      complete: () => this.toArrayOutput.push('✅ complete — ONE array emitted (not 6 separate values)'),
    });
  }

  clearFromEventLog(): void {
    this.fromEventOutput = [];
  }
}
