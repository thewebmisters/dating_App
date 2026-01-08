import { environment } from './../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { SendMessagePayload, SendMessageResponse, UnclaimedChats, UnclaimedChatsResponse } from '../data/auth-dto';
import { ChatSummary, ClaimedChat, ClaimedChatsResponse, MessageResponseDTO, PaginatedChatsResponse, SendWriterMessagePayload } from '../data/chats-dto';
import { mapToCanMatch } from '@angular/router';

export interface UnreadCountResponse {
  message: string;
  count: number;
}

export interface BlockedUsersResponse {
  message: string;
  data: {
    data: BlockedUser[];
    total: number;
  };
}

export interface BlockedUser {
  id: number;
  blocker_id: number;
  blocked_id: number;
  reason: string;
  created_at: string;
  blocked_user: {
    id: number;
    name: string;
    profile_photo: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class Chat {
  private baseUrl = environment.baseUrl;
  constructor(
    private http: HttpClient
  ) { }

  // ===== EXISTING METHODS =====

  /**
 * Sends a new chat message to the backend.
 * @param payload The message content and the ID of the recipient profile.
 * @returns An observable with the server's response.
 */
  sendMessage(payload: SendMessagePayload): Observable<SendMessageResponse> {
    const fullUrl = `${this.baseUrl}/chats/send`;
    console.log('Chat service sending to:', fullUrl);
    console.log('Chat service payload:', payload);
    return this.http.post<SendMessageResponse>(fullUrl, payload).pipe(
      tap(response => console.log('Chat service response:', response))
    );
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

  claimChat(chatId: number): Observable<any> {
    const fullUrl = `${this.baseUrl}/chats/${chatId}/claim`;
    return this.http.post(fullUrl, {});
  }

  // 1. METHOD TO GET MESSAGES FOR A CHAT
  getChatMessages(chatId: number, perPage: number = 50): Observable<MessageResponseDTO> {
    const fullUrl = `${this.baseUrl}/chats/${chatId}/messages`;
    const params = new HttpParams().set('per_page', perPage.toString());
    return this.http.get<MessageResponseDTO>(fullUrl, { params });
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

  blockUser(payload: any): Observable<any> {
    const fullUrl = `${this.baseUrl}/blocked-users`;
    return this.http.post<any>(fullUrl, payload)
  }

  // ===== NEW MISSING METHODS =====

  /**
   * 6.1 Get User's Chats - Retrieve all chats for authenticated user
   */
  getUserChats(perPage: number = 20): Observable<PaginatedChatsResponse> {
    const fullUrl = `${this.baseUrl}/chats`;
    const params = new HttpParams().set('per_page', perPage.toString());
    return this.http.get<PaginatedChatsResponse>(fullUrl, { params });
  }

  /**
   * 6.5 Get Unread Message Count - Get total unread messages for user
   */
  getUnreadCount(): Observable<UnreadCountResponse> {
    const fullUrl = `${this.baseUrl}/chats/unread-count`;
    return this.http.get<UnreadCountResponse>(fullUrl);
  }

  /**
   * 6.9 Release Chat (Writer Only) - Release a claimed chat
   */
  releaseChat(chatId: number): Observable<any> {
    const fullUrl = `${this.baseUrl}/chats/${chatId}/release`;
    return this.http.post(fullUrl, {});
  }
  reportChat(payload: any): Observable<any> {
    const fullUrl = `${this.baseUrl}/reports`;
    return this.http.post(fullUrl, payload);
  }
  // ===== BLOCKED USERS API =====

  /**
   * 11.1 Get Blocked Users - Get all users blocked by authenticated user
   */
  getBlockedUsers(perPage: number = 20): Observable<BlockedUsersResponse> {
    const fullUrl = `${this.baseUrl}/blocked-users`;
    const params = new HttpParams().set('per_page', perPage.toString());
    return this.http.get<BlockedUsersResponse>(fullUrl, { params });
  }

  /**
   * 11.3 Unblock User - Unblock a user
   */
  unblockUser(blockedId: number): Observable<any> {
    const fullUrl = `${this.baseUrl}/blocked-users/${blockedId}`;
    return this.http.delete(fullUrl);
  }

  /**
   * 11.4 Get Users Who Blocked You
   */
  getUsersWhoBlockedMe(): Observable<any> {
    const fullUrl = `${this.baseUrl}/blocked-users/blocked-by`;
    return this.http.get(fullUrl);
  }

  /**
   * 11.5 Check if User is Blocked
   */
  checkIfUserBlocked(userId: number): Observable<{ message: string; is_blocked: boolean }> {
    const fullUrl = `${this.baseUrl}/blocked-users/check`;
    const params = new HttpParams().set('user_id', userId.toString());
    return this.http.get<{ message: string; is_blocked: boolean }>(fullUrl, { params });
  }

  /**
   * 11.7 Get Blocked Users Count
   */
  getBlockedUsersCount(): Observable<{ message: string; count: number }> {
    const fullUrl = `${this.baseUrl}/blocked-users/count`;
    return this.http.get<{ message: string; count: number }>(fullUrl);
  }

  /**
   * 11.6 Check Blocking Relationship - Check blocking relationship between two users
   */
  checkBlockingRelationship(user1Id: number, user2Id: number): Observable<{
    message: string;
    data: {
      user1_blocked_user2: boolean;
      user2_blocked_user1: boolean;
    };
  }> {
    const fullUrl = `${this.baseUrl}/blocked-users/check-between`;
    const params = new HttpParams()
      .set('user1_id', user1Id.toString())
      .set('user2_id', user2Id.toString());
    return this.http.get<{
      message: string;
      data: {
        user1_blocked_user2: boolean;
        user2_blocked_user1: boolean;
      };
    }>(fullUrl, { params });
  }
}
