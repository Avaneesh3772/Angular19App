import { Component, effect, signal } from '@angular/core';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';

@Component({
  selector: 'app-effects-signals',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES],
  templateUrl: './effects-signals.component.html',
  styleUrl: './effects-signals.component.scss'
})
export class EffectsSignalsComponent {

  selectedTheme = signal<'light' | 'dark'>('light');
  fontSize      = signal<number>(14);
  effectLog     = signal<string[]>([]);

  /**
   * effect() runs immediately when created, then re-runs automatically whenever
   * any signal it reads (selectedTheme, fontSize, effectLog) changes.
   *
   * allowSignalWrites: true is required here because we write to effectLog
   * inside the effect. Use sparingly — it can create infinite loops if misused.
   */
  private themeEffect = effect(() => {
    const theme = this.selectedTheme();
    const size  = this.fontSize();
    localStorage.setItem('user-theme', theme);
    localStorage.setItem('user-font-size', String(size));
    this.effectLog.update(logs => [
      ...logs.slice(-6),
      `[${new Date().toLocaleTimeString()}] theme="${theme}", fontSize=${size}px — saved to localStorage`
    ]);
  }, { allowSignalWrites: true });

  clearEffectLog(): void {
    this.effectLog.set([]);
  }
}
