import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cutie } from '../cutie.model';

@Injectable({
  providedIn: 'root'
})
export class CutieService {

  private apiUrl = '${environment.apiUrl}/api/cutii'; // Adresa API-ului backend pentru cutii

  constructor(private http: HttpClient) {}

  // Metodă pentru a obține toate cutiile
  getAll(): Observable<Cutie[]> {
    return this.http.get<Cutie[]>(this.apiUrl);
  }

  // Metodă pentru a salva o cutie nouă
  save(cutie: Cutie): Observable<Cutie> {
    return this.http.post<Cutie>(this.apiUrl, cutie);
  }

  // Metodă pentru a actualiza o cutie existentă
  updateCutie(cutie: Cutie): Observable<Cutie> {
    return this.http.put<Cutie>(`${this.apiUrl}/${cutie.id}`, cutie);
  }

  // Metodă pentru a șterge o cutie pe baza id-ului
  deleteCutie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
