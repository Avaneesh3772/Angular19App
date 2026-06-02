import { Injectable } from '@angular/core';
import { CanMatch } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class DashboardGuard implements CanMatch {
  canMatch(): boolean {
    return true;
  }
}

