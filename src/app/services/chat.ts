import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { SendMessagePayload, SendMessageResponse, UnclaimedChats, UnclaimedChatsResponse } from '../data/auth-dto';
import { ChatSummary, PaginatedChatsResponse } from '../data/chats-dto';
import { mapToCanMatch } from '@angular/router';
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
    const fullUrl = `${this.baseUrl}/chats/send`; 
    return this.http.post<SendMessageResponse>(fullUrl, payload);
  }
getWriterChats(): Observable<ChatSummary[]> {
  const fullUrl = `${this.baseUrl}/chats`;
  return this.http.get<PaginatedChatsResponse>(fullUrl).pipe(
    map(response => response.data.data) 
  );
}
getUnclaimedChats(): Observable<any[]> { 
  const fullUrl = `${this.baseUrl}/chats/available`;
  return this.http.get<UnclaimedChatsResponse>(fullUrl).pipe(
    map(response => response.data) 
  );
}
  claimChat(chatId:number):Observable<any>{
     const fullUrl = `${this.baseUrl}/chats/${chatId}/claim`;
  return this.http.post(fullUrl, {}); 
  }
}
