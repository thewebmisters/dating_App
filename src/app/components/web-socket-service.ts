import { Injectable, Injector } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';//pusher class from library
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth-service';
@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  /**
   *
   *
   * @type {(Echo<any> | undefined)} it holds Laravel Echo WebSocket instance.
   * @memberof WebSocketService
   */
  echo!: Echo<any> | undefined;
  // Private property to hold the lazily-loaded AuthService
  private authService!: AuthService;
  constructor() {}
  /**
   * Initializes the Laravel Echo instance.
   * This should be called once the user is logged in.
   */
   /**
   * Initializes the Laravel Echo instance.
   */
  
    connect(token: string | null): void {
     if (!token) {
      this.disconnect();
      return;
    }
    if (this.echo) {
      return;
    }
    (window as any).Pusher = Pusher;

    this.echo = new Echo({
      broadcaster: 'pusher',
      key: environment.pusherAppKey,
      cluster: environment.pusherAppCluster,
      forceTLS: true,
      authEndpoint: `${environment.baseUrl}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json'
        },
      },
    });
  }


  /**
   * Listens for an event on a specific private channel.
   * @param channel The name of the private channel (e.g., 'chat.6')
   * @param event The name of the event to listen for (e.g., 'NewMessageEvent')
   * @returns An observable or a way to handle the callback.
   */
  listen(channel: string, event: string, callback: (data: any) => void) {
    if (!this.echo) {
     console.error('Echo not connected. Call connect() first.');
      return;
    }
console.log('connected to pusher')
    this.echo.private(channel).listen(event, callback);
  }

  /**
   * Disconnects from a channel to prevent memory leaks.
   * @param channel The channel to leave.
   */
  leaveChannel(channel: string): void {
    if (this.echo) {
      this.echo.leave(channel);
    }
  }

  /**
   * Disconnects the entire Echo instance on logout.
   */
  disconnect(): void {
    if (this.echo) {
      this.echo.disconnect();
      this.echo = undefined;
    }
  }
}
