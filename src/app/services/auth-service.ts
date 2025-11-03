import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { userDetailsBody, UserDTO } from '../data/auth-dto';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  baseUrl = 'https://realspark.jonahdevs.co.ke/api';
  register(body: any): Observable<any> {
    const fullUrl = `${this.baseUrl}/auth/register`;
    return this.http.post<any>(fullUrl, body);
  }
   login(body: any): Observable<any> {
    const fullUrl = `${this.baseUrl}/auth/login`;
    return this.http.post<any>(fullUrl, body).pipe(
      tap(response => {
        // This is the crucial part:
        // After a successful login, store the token.
        if (response && response.data && response.data.access_token) {
          localStorage.setItem('access_token', response.data.access_token);
        }
      })
    );
  }
   //helper method to get stored acess token
    getAccessToken(){
      return sessionStorage.getItem('token');
    }
    getUserDetails(body?:any):Observable<any>{
      const fullUrl = `${this.baseUrl}/auth/user`;
      return this.http.get<any>(fullUrl,body)
    }
    //helper function for log out
    logout(){
      sessionStorage.removeItem('token');
     }

}
