import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LogbookEntry {
  id: number;
  user_id: number;
  writer_id: number;
  category: string;
  title: string;
  description: string;
  metadata: any;
  created_at: string;
  updated_at?: string;
}

export interface LogbookResponse {
  message: string;
  data: {
    current_page: number;
    data: LogbookEntry[];
    per_page: number;
    total: number;
  };
}

export interface GroupedLogbookResponse {
  message: string;
  data: {
    [category: string]: LogbookEntry[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class LogbookService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  // ===== EXISTING METHODS =====

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

  // ===== NEW MISSING METHODS =====

  /**
   * 9.1 Get Logbook Entries - Retrieve logbook entries (paginated)
   */
  getLogbookEntries(perPage: number = 20, category?: string): Observable<LogbookResponse> {
    const fullUrl = `${this.baseUrl}/logbooks`;
    let params = new HttpParams().set('per_page', perPage.toString());

    if (category) {
      params = params.set('category', category);
    }

    return this.http.get<LogbookResponse>(fullUrl, { params });
  }

  /**
   * 9.2 Get Grouped Logbook Entries - Get entries grouped by category
   */
  getGroupedLogbookEntries(): Observable<GroupedLogbookResponse> {
    const fullUrl = `${this.baseUrl}/logbooks/grouped`;
    return this.http.get<GroupedLogbookResponse>(fullUrl);
  }

  /**
   * 9.4 Search Logbook Entries - Search entries by keyword
   */
  searchLogbookEntries(query: string, perPage: number = 20): Observable<LogbookResponse> {
    const fullUrl = `${this.baseUrl}/logbooks/search`;
    const params = new HttpParams()
      .set('q', query)
      .set('per_page', perPage.toString());

    return this.http.get<LogbookResponse>(fullUrl, { params });
  }

  /**
   * 9.5 Get Entries by Writer - Get logbook entries for specific writer
   */
  getEntriesByWriter(writerId: number, perPage: number = 20): Observable<LogbookResponse> {
    const fullUrl = `${this.baseUrl}/logbooks/by-writer`;
    const params = new HttpParams()
      .set('writer_id', writerId.toString())
      .set('per_page', perPage.toString());

    return this.http.get<LogbookResponse>(fullUrl, { params });
  }

  /**
   * 9.6 Get Single Entry - Get specific logbook entry
   */
  getLogbookEntry(id: number): Observable<{ message: string; data: LogbookEntry }> {
    const fullUrl = `${this.baseUrl}/logbooks/${id}`;
    return this.http.get<{ message: string; data: LogbookEntry }>(fullUrl);
  }

  /**
   * 9.7 Update Entry - Update logbook entry
   */
  updateLogbookEntry(id: number, payload: Partial<LogbookEntry>): Observable<{ message: string; data: LogbookEntry }> {
    const fullUrl = `${this.baseUrl}/logbooks/${id}`;
    return this.http.put<{ message: string; data: LogbookEntry }>(fullUrl, payload);
  }

  /**
   * 9.8 Delete Entry - Delete logbook entry
   */
  deleteLogbookEntry(id: number): Observable<{ message: string }> {
    const fullUrl = `${this.baseUrl}/logbooks/${id}`;
    return this.http.delete<{ message: string }>(fullUrl);
  }

  // ===== UTILITY METHODS =====

  /**
   * Get logbook categories for filtering
   */
  getLogbookCategories(): string[] {
    return [
      'chat_activity',
      'message_activity',
      'profile_update',
      'payment_activity',
      'system_notification',
      'user_interaction'
    ];
  }

  /**
   * Create a standardized logbook entry payload
   */
  createLogbookPayload(
    category: string,
    title: string,
    description: string,
    metadata?: any
  ): any {
    return {
      category,
      title,
      description,
      metadata: metadata || {}
    };
  }
}
