import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Dosar } from '../dosar.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DosarService {
  private apiUrl = 'http://localhost:8081/api/dosare';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Dosar[]> {
    return this.http.get<Dosar[]>(this.apiUrl);
  }

  save(dosar: Dosar): Observable<Dosar> {
    return this.http.post<Dosar>(this.apiUrl, dosar);
  }

  update(dosar: Dosar): Observable<Dosar> {
    return this.http.put<Dosar>(`${this.apiUrl}/${dosar.id}`, dosar);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getDosareById(fondId: number): Observable<Dosar[]> {
    return this.http.get<Dosar[]>(`${this.apiUrl}/dosare/${fondId}`);
  }
  addDosar(dosar: Dosar): Observable<Dosar> {
    return this.http.post<Dosar>(`${this.apiUrl}`, dosar);
  }
  existsNumarCriteriu(inventarId: number, numarCriteriu: string): Observable<boolean> {
    const params = { inventarId: inventarId.toString(), numarCriteriu };
    return this.http.get<boolean>(`${this.apiUrl}/exists`, { params });
  }
  existsNumarCriteriuBatch(inventarId: number, nums: number[]): Observable<number[]> {
    const params = new HttpParams().set('inventarId', String(inventarId));
    return this.http.post<number[]>(`${this.apiUrl}/exists-batch`, nums, { params });
  }

  
}
