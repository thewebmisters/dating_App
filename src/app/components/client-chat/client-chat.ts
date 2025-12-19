import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SendMessagePayload, Writer } from '../../data/auth-dto';
import { AvatarModule } from 'primeng/avatar';
import { Chat } from '../../services/chat';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth-service';
import { DataService } from '../../services/data-service';
import { WebSocketService } from '../web-socket-service';

@Component({
  selector: 'app-client-chat',
  imports: [FormsModule, CommonModule, AvatarModule],
  templateUrl: './client-chat.html',
  styleUrl: './client-chat.css',
})
export class ClientChat {
  writerProfile: Writer | null = null;
  messages: any = [];
  isSending = false; // To disable the button while sending
  userDetails: any;
  chatInput: string = '';
  isLoading = true;
  writerId!: number;
  userId: number | undefined = undefined;
  private channelName = '';
  // Access the navigation state in the constructor.
  constructor(
    private router: Router,
    private chatService: Chat,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private dataService: DataService,
    private webSocketService: WebSocketService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.writerProfile = navigation.extras.state['writerProfile'];
    }
  }
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const user = sessionStorage.getItem('user');
      if (user) {
        this.userDetails = JSON.parse(user);
        this.subscribeToClientChannel(this.userDetails.id);
      }
    }
    this.userId = this.userDetails?.id;
    const idFromUrl = this.route.snapshot.paramMap.get('id');
    if (idFromUrl) {
      // Convert the string from the URL to a number
      this.writerId = parseInt(idFromUrl, 10);

      // Now that we have a reliable ID, fetch the profile
      this.fetchProfileById(this.writerId);
    } else {
      // If there's no ID in the URL, something is wrong. Go back home.
      //console.error("No writer ID found in URL. Redirecting.");
      this.router.navigate(['/client-home']);
    }
  }

  //   this.writerId = this.dataService.getId();
  //   if (!this.writerId) {
  //     this.router.navigate(['/login']);
  //     return;
  //   }
  //   this.fetchProfileById(this.writerId);

  // }
  subscribeToClientChannel(userId: number): void {
    this.channelName = `App.Models.User.${userId}`;
    //console.log('my channel is',this.channelName)
    this.webSocketService.listen(this.channelName, '.NewMessage', (eventData: any) => {
      //console.log('subscribed to event',eventData.message);
      if (eventData.message && eventData.message.sender_id === this.writerProfile?.id) {
        this.messages.push(eventData.message);
        this.scrollToBottom();
      } else {
        this.dataService.handleApiError("You Received a message for a different chat");
      }
    });
  }
  ngOnDestroy() {
    if (this.channelName) {
      this.webSocketService.leaveChannel(this.channelName);
    }
  }

  fetchProfileById(id: number) {
    this.isLoading = true;
    this.authService.getCurrentProfile(id).subscribe({
      next: (response) => {
        this.writerProfile = response;
        this.isLoading = false;
      },
      error: (err) => {
        this.dataService.handleApiError(err);
        setTimeout(() => this.router.navigate(['dashboard']), 3000);
      },
    });
  }
  //  loadInitialChatData() {
  //     this.isLoading = true;
  //     this.chatService.getChatMessages(1).subscribe({
  //       next: (messages) => {
  //         this.messages = messages.data;
  // //console.log('messages retrieved',this.messages);
  //         // Extract client info from the first message (if messages exist)
  //         if (messages.length > 0) {
  //           // We need an endpoint to get the client details properly.
  //           // For now, we can try to find the client's info from a message.
  //           const clientMessage = messages.find((m) => m.sender_type === 'user');
  //           if (clientMessage) {
  //             // This is a temporary solution. Ideally I'd have a getChatDetails endpoint.
  //             // this.client = clientMessage.sender;
  //           }
  //         }
  //         this.chatService.markAsRead(1).subscribe();
  //  this.isLoading = false;
  //         setTimeout(() => this.scrollToBottom(), 100);

  //             },
  //             error: (err) => {
  //                this.dataService.handleApiError(err);
  //               this.isLoading = false;
  //             }
  //           });
  //         }

  /**
   * Sends the user's message to the backend via the ChatService.
   */
  sendMessage(): void {
    // Guard clauses: Ensure we have a profile and a message to send
    if (!this.writerProfile) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Writer profile not loaded.',
      });
      return;
    }
    if (!this.chatInput.trim() || this.isSending) {
      return;
    }
    this.isSending = true;
    const payload: SendMessagePayload = {
      profile_id: this.writerProfile.id,
      content: this.chatInput.trim(),
      attachments: [],
    };
    //  Clear the input immediately for a responsive feel
    this.chatInput = '';
    this.chatService.sendMessage(payload).subscribe({
      next: (response) => {
        //  On SUCCESS, push the new message from the server's response to our array
        this.messages.push(response.data);

        //  backend should return the new credit balance.
        // If it does, I can update the UI like this:
        // if (response.new_credit_balance !== undefined) {
        //   this.userDetails.credits_balance = response.new_credit_balance;
        // }

        this.isSending = false;
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (err) => {
        this.dataService.handleApiError(err);
        // Put the failed message back in the input box so the user can retry
        this.chatInput = payload.content;
      },
    });
  }
  scrollToBottom() {
    const container = document.getElementById('messageArea');
    if (container) container.scrollTop = container.scrollHeight;
  }
  navigateToClientHome(): void {
    this.router.navigate(['/client-home']);
  }
  logout(): void {
    this.authService.logout().subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: response || 'logged out successfully' });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.dataService.handleApiError(err);
        this.router.navigate(['/login']);
      }
    })
  }
}
