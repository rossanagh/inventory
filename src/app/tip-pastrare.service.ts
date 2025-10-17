import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipPastrare } from '../tip-pastrare.model';

@Injectable({ providedIn: 'root' })
export class TipPastrareService {
  private apiUrl = '${environment.apiUrl}/api/tip-pastrare';

  constructor(private http: HttpClient) {}

  getAll(): Observable<TipPastrare[]> {
    return this.http.get<TipPastrare[]>(this.apiUrl);
  }

  save(tip: TipPastrare): Observable<TipPastrare> {
    return this.http.post<TipPastrare>(this.apiUrl, tip);
  }

  update(tip: TipPastrare): Observable<TipPastrare> {
    return this.http.put<TipPastrare>(`${this.apiUrl}/${tip.id}`, tip);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
