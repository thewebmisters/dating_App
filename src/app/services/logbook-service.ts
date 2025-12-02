import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class LogbookService {
 private baseUrl=environment.baseUrl;
  constructor(private http:HttpClient){}
  /**
   * Fetches all logbook entries for a specific client user.
   * @param userId The ID of the client.
   */
  getLogbookForUser(userId: number): Observable<any[]> {
    const fullUrl = `${this.baseUrl}/users/${userId}/logbooks`;
    return this.http.get<any>(fullUrl).pipe(
      map((response: { data: any; }) => response.data) // Assuming the response is { message: "...", data: [...] }
    );
  }

  /**
   * Creates a new logbook entry.
   * @param payload The data for the new entry.
   */
  createLogbookEntry(payload: any): Observable<any> {
    const fullUrl = `${this.baseUrl}/logbooks`;
    return this.http.post(fullUrl, payload);
  }
}
