import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


export interface AuditEntry {
  username: string;
  action: string;
  timestamp?: string; // opțional, depinde cum numești câmpul în backend (ts/timestamp)
}

@Injectable({ providedIn: 'root' })
export class AuditService {
  // >>> dacă vrei, mută în environment.ts
  private readonly BASE_URL = 'http://localhost:8081';
  private readonly AUDIT_URL = `${this.BASE_URL}/api/audit/log`;

  constructor(private http: HttpClient) {}

  /**
   * Trimite un eveniment în audit (Login/Logout sau altă acțiune).
   * Folosește "fire-and-forget" dar cu loguri de debug în consolă.
   */
  log(username: string | null, action: string): void {
    const payload: AuditEntry = {
      username: username || 'anonymous',
      action
    };

    console.log('[AUDIT FRONT] sending', payload);

    // Dacă ai nevoie de headere extra, adaugă aici
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<void>(this.AUDIT_URL, payload, { headers }).subscribe({
      next: () => console.log('[AUDIT FRONT] sent OK'),
      error: (err) => console.error('[AUDIT FRONT] error', err)
    });
  }

  /** Helperi utili */
  logLogin(username: string | null): void { this.log(username, 'Login'); }
  logLogout(username: string | null): void { this.log(username, 'Logout'); }
}