import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';
import { DoctorItem } from '../signals-learning.models';
import { SignalsLearningService } from '../signals-learning.service';

@Component({
  selector: 'app-to-signal',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES],
  templateUrl: './to-signal.component.html',
  styleUrl: './to-signal.component.scss'
})
export class ToSignalComponent {

  private sigService = inject(SignalsLearningService);

  /**
   * toSignal() converts an Observable into a Signal.
   * - No async pipe needed in the template
   * - No manual subscribe/unsubscribe
   * - Works seamlessly inside computed() and effect()
   * - initialValue is used until the HTTP response arrives
   */
  doctors = toSignal(
    this.sigService.getDoctors(),
    { initialValue: [] as DoctorItem[] }
  );

  selectedSpecialty = signal<string>('All');

  filteredDoctors = computed(() => {
    const spec = this.selectedSpecialty();
    return spec === 'All'
      ? this.doctors()
      : this.doctors().filter(d => d.specialty === spec);
  });

  specialties = computed(() => {
    const list = ['All', ...new Set(this.doctors().map(d => d.specialty))];
    return list.sort();
  });
}
