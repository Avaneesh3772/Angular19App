import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
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

  errorMessage = signal<string | null>(null);
  isLoading    = signal<boolean>(true);

  /**
   * ERROR HANDLING PATTERN for toSignal():
   *
   * If the source Observable errors and we do NOT handle it,
   * toSignal() re-throws the error in the injection context —
   * the component crashes with no visible feedback to the user.
   *
   * Solution: pipe catchError BEFORE toSignal().
   *   - catchError intercepts the error
   *   - We save it in a separate errorMessage signal for the template
   *   - We return of([]) so the signal has a safe empty-array fallback
   *   - The component stays alive and shows a friendly error message
   */
  doctors = toSignal(
    this.sigService.getDoctors().pipe(
      catchError(err => {
        this.errorMessage.set(`Failed to load doctors: ${err.message ?? 'Unknown error'}`);
        return of([] as DoctorItem[]); // safe fallback — signal stays usable
      })
    ),
    { initialValue: [] as DoctorItem[] }
  );

  selectedSpecialty = signal<string>('All');

  filteredDoctors = computed(() => {
    const spec = this.selectedSpecialty();
    const list = this.doctors() ?? [];
    return spec === 'All' ? list : list.filter(d => d.specialty === spec);
  });

  specialties = computed(() => {
    const list = ['All', ...new Set((this.doctors() ?? []).map(d => d.specialty))];
    return list.sort();
  });

  /**
   * effect() watches the doctors signal.
   * When data arrives (length > 0) or an error is set, loading is done.
   * We cannot call signal.set() inside computed(), so effect() is the right tool.
   */
  private loadingTracker = effect(() => {
    const hasData  = (this.doctors() ?? []).length > 0;
    const hasError = this.errorMessage() !== null;
    if (hasData || hasError) {
      this.isLoading.set(false);
    }
  }, { allowSignalWrites: true });
}
