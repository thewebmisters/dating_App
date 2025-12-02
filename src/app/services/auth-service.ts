import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthenticatedUserDTO, Writer, WriterProfileDTO } from '../data/auth-dto';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment.development'; 
import { WebSocketService } from '../components/web-socket-service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private baseUrl = environment.baseUrl;
  constructor(private http: HttpClient,
  private webSocketService: WebSocketService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('access_token');
    }
     
  }
  
  public initializeAuthentication(): void {
    const token = this.getAccessToken();
    if (token) {
      // If a token exists, the user is already logged in.
      // Establish the WebSocket connection.
      this.webSocketService.connect();
    }
  }
  register(body: any): Observable<any> {
    const fullUrl = `${environment.baseUrl}/auth/register`;
    return this.http.post<any>(fullUrl, body).pipe(
      tap((response) => {
        if (isPlatformBrowser(this.platformId)) {
          if (response && response.token) {
            localStorage.setItem('access_token', response.token);
              this.webSocketService.connect(); 
          }
        }
      })
    );
  }

  login(body: any): Observable<any> {
    const fullUrl = `${environment.baseUrl}/auth/login`;
    return this.http.post<any>(fullUrl, body).pipe(
      tap((response) => {
        if (isPlatformBrowser(this.platformId)) {
          // Also guard the write operation
          if (response && response.token) {
            localStorage.setItem('access_token', response.token);
              this.webSocketService.connect(); 
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

  getUserDetails(): Observable<AuthenticatedUserDTO> {
    const fullUrl = `${environment.baseUrl}/auth/user`;
    return this.http.get<AuthenticatedUserDTO>(fullUrl);
  }

  getProfiles(): Observable<WriterProfileDTO> {
    const fullUrl = `${environment.baseUrl}/profiles`;
    return this.http.get<WriterProfileDTO>(fullUrl);
  }
  getCurrentProfile(id: number): Observable<Writer> {
    const fullUrl = `${environment.baseUrl}/profiles/${id}`;
    return this.http.get<Writer>(fullUrl);
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('access_token');
       this.webSocketService.disconnect();
    }
  }
}
