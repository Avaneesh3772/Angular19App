import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { concatMap, delay, from, fromEvent, of, Subscription, toArray } from 'rxjs';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';
import { DoctorItem } from '../rxjs-learning.models';
import { RxjsLearningService } from '../rxjs-learning.service';

/** Console prefix — filter DevTools with: Creation RxJS */
const LOG = '[Creation RxJS]';

/**
 * CREATION OPERATORS — one unified practical exercise
 *
 * 🏥 Doctor Appointment Clinic
 *   fromEvent() → receptionist clicks "Open Morning Clinic"
 *   of()        → emit fixed clinic session details (name, shift, date)
 *   from()      → stream each available doctor one-by-one (slot scanning)
 *   toArray()   → collect all slots into the final morning schedule
 */
@Component({
  selector: 'app-rxjs-creation',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES],
  templateUrl: './creation.component.html',
  styleUrl: './creation.component.scss',
})
export class CreationComponent implements OnInit, OnDestroy {

  private rxjsService = inject(RxjsLearningService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('openClinicBtn', { read: ElementRef }) openClinicBtn!: ElementRef<HTMLButtonElement>;

  private clinicClickSub?: Subscription;
  private scanSub?: Subscription;
  private fromEventAttached = false;

  doctors: DoctorItem[] = [];
  isLoadingDoctors = true;
  sessionStarted = false;

  currentPhase: 'idle' | 'fromEvent' | 'of' | 'from' | 'toArray' | 'done' = 'idle';
  clinicMeta: string[] = [];
  scanningDoctor: DoctorItem | null = null;
  morningSchedule: DoctorItem[] = [];
  streamLog: string[] = [];

  get availableDoctors(): DoctorItem[] {
    return this.doctors.filter(d => d.available);
  }

  ngOnInit(): void {
    console.log(`${LOG} ngOnInit → loading doctors from doctorsData.json`);

    this.rxjsService.getDoctors().subscribe({
      next: docs => {
        this.doctors = docs;
        this.isLoadingDoctors = false;
        console.log(`${LOG} HTTP loaded doctors:`, docs);
        console.log(`${LOG} Available today (${this.availableDoctors.length}):`,
          this.availableDoctors.map(d => d.name));
        // Render the button (inside @else), then attach fromEvent
        this.cdr.detectChanges();
        this.attachFromEventListener();
      },
      error: err => {
        this.isLoadingDoctors = false;
        console.error(`${LOG} Failed to load doctors:`, err);
        this.cdr.detectChanges();
        this.attachFromEventListener();
      },
    });
  }

  ngOnDestroy(): void {
    this.clinicClickSub?.unsubscribe();
    this.scanSub?.unsubscribe();
    console.log(`${LOG} ngOnDestroy → unsubscribed fromEvent & from() streams`);
  }

  /** fromEvent() — bind once the "Open Morning Clinic" button is rendered */
  private attachFromEventListener(): void {
    if (this.fromEventAttached) return;

    const btn = this.openClinicBtn?.nativeElement;
    if (!btn) {
      // ViewChild may need one more tick after @if renders the button
      setTimeout(() => this.attachFromEventListener(), 0);
      return;
    }

    this.fromEventAttached = true;
    console.log(`${LOG} fromEvent() listener attached to "Open Morning Clinic" button`);

    this.clinicClickSub = fromEvent(btn, 'click').subscribe(event => {
      console.log(`${LOG} fromEvent() CLICK received →`, event);
      this.runMorningClinicSession();
    });
  }

  private runMorningClinicSession(): void {
    console.group(`${LOG} Pipeline started`);
    console.log(`${LOG} Step 1 — fromEvent(): user clicked, starting clinic session`);

    this.resetSession();
    this.sessionStarted = true;
    this.currentPhase = 'fromEvent';
    this.streamLog.push('fromEvent() → Receptionist clicked "Open Morning Clinic"');
    this.cdr.detectChanges();

    // Step 2 — of(): emits each argument as a separate value, synchronously
    this.currentPhase = 'of';
    console.log(`${LOG} Step 2 — of(): emitting 3 fixed clinic metadata values…`);

    of(
      'Toronto General — Cardiology Wing',
      'Morning Shift: 8 AM – 12 PM',
      `Session Date: ${new Date().toLocaleDateString()}`,
    ).subscribe({
      next: val => {
        console.log(`${LOG} of() NEXT → emitted value:`, val);
        this.clinicMeta.push(val);
        this.streamLog.push(`of() → "${val}"`);
        this.cdr.detectChanges();
      },
      complete: () => {
        console.log(`${LOG} of() COMPLETE → clinicMeta array:`, this.clinicMeta);
        this.scanAvailableDoctors();
      },
    });
  }

  /** from() — scan each available doctor with a short delay so the UI updates visibly */
  private scanAvailableDoctors(): void {
    this.currentPhase = 'from';
    const available = this.availableDoctors;
    console.log(`${LOG} Step 3 — from(): streaming ${available.length} doctors one-by-one…`, available);
    this.cdr.detectChanges();

    this.scanSub?.unsubscribe();
    this.scanSub = from(available).pipe(
      concatMap(doc => of(doc).pipe(delay(500))),
    ).subscribe({
      next: doc => {
        console.log(`${LOG} from() NEXT → scanning doctor:`, doc);
        this.scanningDoctor = doc;
        this.streamLog.push(`from() → Scanning slot: ${doc.name} (${doc.specialty})`);
        this.cdr.detectChanges();
      },
      complete: () => {
        console.log(`${LOG} from() COMPLETE → all doctors scanned`);
        this.scanningDoctor = null;
        this.buildFinalSchedule(available);
      },
    });
  }

  private buildFinalSchedule(available: DoctorItem[]): void {
    this.currentPhase = 'toArray';
    console.log(`${LOG} Step 4 — toArray(): collecting ${available.length} doctors into one array…`);
    this.cdr.detectChanges();

    from(available).pipe(toArray()).subscribe(schedule => {
      console.log(`${LOG} toArray() NEXT → final schedule array (${schedule.length} slots):`, schedule);
      this.morningSchedule = schedule;
      this.streamLog.push(`toArray() → Morning schedule ready — ${schedule.length} appointment slots`);
      this.currentPhase = 'done';
      this.cdr.detectChanges();
      console.log(`${LOG} Pipeline COMPLETE ✅`);
      console.groupEnd();
    });
  }

  resetSession(): void {
    this.scanSub?.unsubscribe();
    this.sessionStarted = false;
    this.currentPhase = 'idle';
    this.clinicMeta = [];
    this.scanningDoctor = null;
    this.morningSchedule = [];
    this.streamLog = [];
    this.cdr.detectChanges();
    console.log(`${LOG} resetSession() → cleared appointment board & stream log`);
  }

  phaseLabel(): string {
    const labels: Record<string, string> = {
      fromEvent: 'fromEvent() — user click received',
      of: 'of() — emitting clinic metadata…',
      from: 'from() — scanning each doctor slot…',
      toArray: 'toArray() — building final schedule…',
      done: '✅ Schedule complete',
    };
    return labels[this.currentPhase] ?? '';
  }
}
