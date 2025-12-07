import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SendMessagePayload, Writer } from '../../data/auth-dto';
import { AvatarModule } from 'primeng/avatar';
import { Chat } from '../../services/chat';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../services/auth-service';
import { DataService } from '../../services/data-service';
import { WebSocketService } from '../web-socket-service';

@Component({
  selector: 'app-client-chat',
  imports: [FormsModule, CommonModule, AvatarModule, ToastModule],
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
  userId:number | undefined =undefined;
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
    this.userId=this.userDetails?.id;
    this.writerId = this.dataService.getId();
    if (!this.writerId) {
      this.router.navigate(['/login']);
      return;
    }
    this.fetchProfileById(this.writerId);
    if (this.writerId) {
      this.channelName = `chat.${this.writerId}`;
      this.webSocketService.listen(`private-App.Models.User.${this.userId}`, 'NewMessage', (newMessage: any) => {
        this.messages.push(newMessage.message.message);
        this.scrollToBottom();
      });
    }
    
  }
 subscribeToClientChannel(userId: number): void {
    this.channelName = `private-App.Models.User.${userId}`;
    this.webSocketService.listen(this.channelName, 'NewMessage', (eventData: any) => {
      if (eventData.message && eventData.message.chat_id === this.writerProfile?.id) {
        this.messages.push(eventData.message);
        this.scrollToBottom();
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
}
