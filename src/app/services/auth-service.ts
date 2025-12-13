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
  ) {}
  
 public initializeAuthentication(): void {
 const token =  this.getAccessToken(); 
    // Pass the token to the connect method
    this.webSocketService.connect(token);
  }
  register(body: any): Observable<any> {
    const fullUrl = `${environment.baseUrl}/auth/register`;
    return this.http.post<any>(fullUrl, body).pipe(
      tap((response) => {
        if (isPlatformBrowser(this.platformId)) {
          if (response?.token) {
             const token = response.token;
            localStorage.setItem('access_token',token);
              this.webSocketService.connect(token);
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
          if (response?.token) {
             const token = response.token;
            localStorage.setItem('access_token',token);
              this.webSocketService.connect(token);
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
forgotPassword(payload:any):Observable<any>{
  const fullUrl=`${this.baseUrl}/auth/forgot-password`;
  return this.http.post(fullUrl,payload);

}
  getUserDetails(): Observable<AuthenticatedUserDTO> {
    const fullUrl = `${environment.baseUrl}/auth/user`;
    return this.http.get<AuthenticatedUserDTO>(fullUrl);
  }

  getProfiles(): Observable<Writer[]> {
    const fullUrl = `${environment.baseUrl}/profiles`;
    return this.http.get<Writer[]>(fullUrl);
  }
  getCurrentProfile(id: number): Observable<Writer> {
    const fullUrl = `${environment.baseUrl}/profiles/${id}`;
    return this.http.get<Writer>(fullUrl);
  }

 logout(): Observable<any> {
    const fullUrl = `${environment.baseUrl}/auth/logout`;
    return this.http.post<any>(fullUrl, {}).pipe(
      tap({
        next: () => this.performClientSideLogout(),
        error: () => this.performClientSideLogout()
      })
    );
  }

    /**
   * Performs all the client-side cleanup for logging out.
   */
  performClientSideLogout(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.webSocketService.disconnect();
      localStorage.removeItem('access_token');
      sessionStorage.clear();
     
    }
  }
}
