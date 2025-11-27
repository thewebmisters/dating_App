import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SendMessagePayload, SendMessageResponse, UnclaimedChats } from '../data/auth-dto';
import { ChatSummary, PaginatedChatsResponse } from '../data/chats-dto';
@Injectable({
  providedIn: 'root',
})
export class Chat {
     private baseUrl = environment.baseUrl;
  constructor(
    private http:HttpClient
  ){}
    /**
   * Sends a new chat message to the backend.
   * @param payload The message content and the ID of the recipient profile.
   * @returns An observable with the server's response.
   */
  sendMessage(payload: SendMessagePayload): Observable<SendMessageResponse> {
    const fullUrl = `${this.baseUrl}/chats/send`; // Use the new endpoint
    return this.http.post<SendMessageResponse>(fullUrl, payload);
  }
 getWriterChats(): Observable<ChatSummary[]> {
    const fullUrl = `${this.baseUrl}/chats`;
    
    //  Call the API, expecting the full paginated response object
    return this.http.get<PaginatedChatsResponse>(fullUrl).pipe(
      //  Use the map operator to transform the response
      map((response: { data: { data: any; }; }) => {
        // . Return only the nested 'data' array, which is what the component needs
        return response.data.data;
      })
    );
  }
  getUnclaimedChats():Observable<UnclaimedChats[]>{
    const fullUrl = `${this.baseUrl}/chats/available`
    return this.http.get<UnclaimedChats[]>(fullUrl)
  }
}
