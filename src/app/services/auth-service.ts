import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { userDetailsBody, UserDTO, userProfileDTO } from '../data/auth-dto';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  constructor(private http: HttpClient) {
    // This constructor check is good for robustness
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('access_token');
    }
  }
register(body: any): Observable<any> {
    const fullUrl = `${environment.baseUrl}/auth/register`;
    return this.http.post<any>(fullUrl, body);
  }

  login(body: any): Observable<any> {
    const fullUrl = `${environment.baseUrl}/auth/login`;
    return this.http.post<any>(fullUrl, body).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) { // Also guard the write operation
          if (response && response.data && response.data.access_token) {
            localStorage.setItem('access_token', response.data.access_token);
          }
        }
      })
    );
  }

  getAccessToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      // READ FROM 'localStorage' TO MATCH THE LOGIN METHOD
      return localStorage.getItem('access_token');
    }
    // If on the server, there is no token, so return null
    return null;
  }

  getUserDetails(body?: any): Observable<any> {
    const fullUrl = `${environment.baseUrl}/auth/user`;
    return this.http.get<any>(fullUrl, body);
  }

  getProfiles(): Observable<userProfileDTO[]> {
    const fullUrl = `${environment.baseUrl}/profiles`;
    return this.http.get<userProfileDTO[]>(fullUrl);
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('access_token');
    }
  }

}