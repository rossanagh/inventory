// src/app/services/compartiment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compartiment } from '../compartiment.model';
import { Fond } from '../fond.model';


@Injectable({
  providedIn: 'root'
})
export class CompartimentService {
  private apiUrl = 'http://localhost:8081/api/compartimente';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Compartiment[]> {
    return this.http.get<Compartiment[]>(this.apiUrl);
  }

  save(compartiment: Compartiment): Observable<Compartiment> {
    return this.http.post<Compartiment>(this.apiUrl, compartiment);
  }

  updateCompartiment(compartiment: Compartiment): Observable<Compartiment> {
    return this.http.put<Compartiment>(`${this.apiUrl}/${compartiment.id}`, compartiment);
  }
  
  getFondById(id: number): Observable<Fond> {
    return this.http.get<Fond>(`${this.apiUrl}/${id}`);
  }

  deleteCompartiment(compartimentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${compartimentId}`);
  }
  getCompartimenteByFondId(fondId: number): Observable<Compartiment[]> {
    return this.http.get<Compartiment[]>(`${this.apiUrl}/fond/${fondId}`);
  }
  
}
