// src/app/services/fond.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fond } from '../fond.model';


@Injectable({
  providedIn: 'root'
})
export class FondService {
  private apiUrl = '${environment.apiUrl}/api/fonduri';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Fond[]> {
    return this.http.get<Fond[]>(this.apiUrl);
  }

  save(fond: Fond): Observable<Fond> {
    return this.http.post<Fond>(this.apiUrl, fond);
  }

  updateFond(fond: Fond): Observable<Fond> {
    return this.http.put<Fond>(`${this.apiUrl}/${fond.id}`, fond); // Folosește id-ul pentru actualizare
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getFondById(id: number): Observable<Fond> {
    return this.http.get<Fond>(`${this.apiUrl}/${id}`);
  }
  
}
