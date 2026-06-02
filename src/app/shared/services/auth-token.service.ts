import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthTokenService {

  setTokenToSessionStorage(key: string, value: string): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  getTokenFromSessionStorage(key: string): string | null {
    return sessionStorage.getItem(key);
  }
}
