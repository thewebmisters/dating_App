import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { SendMessagePayload, SendMessageResponse, UnclaimedChats, UnclaimedChatsResponse } from '../data/auth-dto';
import { ChatSummary, ClaimedChat, ClaimedChatsResponse, PaginatedChatsResponse, SendWriterMessagePayload } from '../data/chats-dto';
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
    
    return this.http.get<any>(fullUrl).pipe( // Used <any> to handle the inconsistent response
      map(response => {
       
        
        // Case 1: It's the paginated object (it has a 'data' property which is an array)
        if (response.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }
        
        // Case 2: It's just a simple array
        if (Array.isArray(response.data)) {
          return response.data;
        }
        
        // Fallback: If the structure is unexpected, return an empty array to prevent errors.
        return [];
      })
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
  
  // 1. METHOD TO GET MESSAGES FOR A CHAT
  getChatMessages(chatId: number): Observable<any[]> {
    const fullUrl = `${this.baseUrl}/chats/${chatId}/messages`;
    return this.http.get<any>(fullUrl).pipe(
      map(response => response.data) // Extract the nested message array
    );
  }

  // 2. METHOD FOR THE WRITER TO SEND A MESSAGE
  sendWriterMessage(chatId: number, payload: SendWriterMessagePayload): Observable<any> {
    const fullUrl = `${this.baseUrl}/chats/${chatId}/send-writer`;
    return this.http.post(fullUrl, payload);
  }
/**
   * Fetches the list of chats already claimed by the authenticated writer.
   */
   getClaimedChats(): Observable<ClaimedChat[]> {
    const fullUrl = `${this.baseUrl}/chats/claimed`;
    return this.http.get<ClaimedChatsResponse>(fullUrl).pipe(
      map(response => {
        return Array.isArray(response.data) ? response.data : [];
      })
    );
  }
  //  METHOD TO MARK MESSAGES AS READ
  markAsRead(chatId: number): Observable<any> {
    const fullUrl = `${this.baseUrl}/chats/${chatId}/read`;
    return this.http.post(fullUrl, {});
  }
}
