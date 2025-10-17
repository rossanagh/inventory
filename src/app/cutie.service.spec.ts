import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cutie } from '../cutie.model';

@Injectable({ providedIn: 'root' })
export class CutieService {
  private apiUrl = 'http://localhost:8081/api/cutie';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Cutie[]> {
    return this.http.get<Cutie[]>(this.apiUrl);
  }

  save(cutie: Cutie): Observable<Cutie> {
    return this.http.post<Cutie>(this.apiUrl, cutie);
  }

  update(cutie: Cutie): Observable<Cutie> {
    return this.http.put<Cutie>(`${this.apiUrl}/${cutie.id}`, cutie);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
