import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
  login(body:any):Observable<any>{
    const fullUrl = `${this.baseUrl}/auth/login`;
    return this.http.post<any>(
      fullUrl,
      body
    )

  }
}
