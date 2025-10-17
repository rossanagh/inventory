import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private baseUrl = '${environment.apiUrl}/api/auth';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { username, password }).pipe(
      tap(response => {
        // Exemplu: salvezi username-ul si un flag isAdmin
        localStorage.setItem('username', username);
        localStorage.setItem('isAdmin', 'true'); // sau în funcție de răspunsul de la server
      })
    );
  }
  

  isLoggedIn(): boolean {
    return localStorage.getItem('isAdmin') === 'true';
  }

  logout() {
    localStorage.removeItem('isAdmin');
  }
}
