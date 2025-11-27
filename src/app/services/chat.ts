import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SendMessagePayload, SendMessageResponse } from '../data/auth-dto';
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
}
