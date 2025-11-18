import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// This interface defines the data we will send to the backend
export interface SendMessagePayload {
  receiver_id: number;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class Chat {
  constructor(
    private http:HttpClient
  ){}
   /**
   * Sends a new chat message to the backend.
   * The AuthInterceptor will automatically add the Bearer token.
   * @param payload The message content and the ID of the recipient.
   * @returns An observable with the newly created message object from the server.
   */
 
  sendMessage(payload:SendMessagePayload):Observable<any>{
const fullUrl =  `${environment.baseUrl}/messages`
   return this.http.post(fullUrl, payload);
  }
}
