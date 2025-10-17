import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Inventar } from '../inventar.model';
import { Dosar } from '../dosar.model';

@Injectable({
  providedIn: 'root'
})
export class InventarService {

  private apiUrl = 'http://localhost:8081/api/inventar';
  private apiUrl1 = 'http://localhost:8081/api/dosare';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Inventar[]> {
    return this.http.get<Inventar[]>(this.apiUrl);
  }

  save(inventar: Inventar): Observable<Inventar> {
    return this.http.post<Inventar>(this.apiUrl, inventar);
  }

  updateInventar(inventar: Inventar): Observable<Inventar> {
    return this.http.put<Inventar>(`${this.apiUrl}/${inventar.id}`, inventar);
  }

  deleteInventar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAllD(): Observable<Dosar[]> {
    return this.http.get<Dosar[]>(this.apiUrl1);
  }

  // inventar.service.ts
getByCompartimentId(compartimentId: number): Observable<Inventar[]> {
  return this.http.get<Inventar[]>(`${this.apiUrl}/compartiment/${compartimentId}`);
}


}
