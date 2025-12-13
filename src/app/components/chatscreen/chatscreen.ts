import { AvatarModule } from 'primeng/avatar';
import { AuthenticatedUserDTO, UserDTO, Writer } from './../../data/auth-dto';
import { MessageService } from 'primeng/api';
import { AuthService } from './../../services/auth-service';
import { Component } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data-service';
import { Chat } from '../../services/chat';
import { WebSocketService } from '../web-socket-service';
import { LogbookService } from '../../services/logbook-service';
@Component({
  selector: 'app-chatscreen',
  imports: [ToastModule, FormsModule, AvatarModule, CommonModule],
  templateUrl: './chatscreen.html',
  styleUrl: './chatscreen.css',
})
export class Chatscreen {
  writer: AuthenticatedUserDTO | null = null;
  client: any | null = null;
  messages: any[] = [];
  logEntries: any[] = [];
  currentChatId!: number;
  isLoading = true;
  isSending = false;
  writerId:number | undefined=undefined;
  // --- INPUT & UI LOGIC ---
  replyText = '';
  minChars = 100;
  private channelName = '';
  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private dataService: DataService,
    private chatService: Chat,
    private webSocketService: WebSocketService,
    private logbookService:LogbookService
  ) {}
  ngOnInit() {
    this.currentChatId = this.dataService.getChatId();
    if (!this.currentChatId) {
      this.router.navigate(['writer-dashboard']);
      return;
    }
    this.fetchLoggedInWriterDetails();
    this.writerId=this.writer?.id;
    this.loadInitialChatData();
  }
  subscribeToWriterChannel(writerId: number): void {
    this.channelName = `App.Models.User.${writerId}`;
     this.webSocketService.listen(this.channelName, '.NewMessage', (eventData: any) => {
     //  console.log('📨 New message for this chat:',eventData.message.message);
       // console.log('📨 New message for this chat:', eventData);
      // Check if the incoming message belongs to the currently open chat
      if (eventData.message && eventData.message.chat_id === this.currentChatId) {
      // console.log('📨 New message for this chat:', eventData.message);
        this.messages.push(eventData.message);
        this.scrollToBottom();
      } else {
         this.dataService.handleApiError("You Received a message for a different chat");
       // console.log('the current chat id is not correct')
        //console.log('Received a message for a different chat.', eventData.message.sender_id);
        // Here i can show a toast notification: "New message from [Client Name]"
      }
    });
  }
  ngOnDestroy() {
    // Clean up the connection when the component is destroyed
    // to prevent memory leaks and duplicate listeners.
    if (this.channelName) {
      this.webSocketService.leaveChannel(this.channelName);
    }
  }

  fetchLoggedInWriterDetails() {
    this.authService.getUserDetails().subscribe({
      next: (response) => {
        this.writer = response;
      //  console.log('writer details',this.writer);
         if (this.writer?.id) {
          this.subscribeToWriterChannel(this.writer.id);
        }
      },
      error: (err) => {
        this.dataService.handleApiError(err);
      },
    });
  }
  /**
   * Finds the message container element and scrolls it to the bottom.
   * This ensures the most recent message is visible.
   */
  scrollToBottom(): void {
    try {
      const container = document.getElementById('messageArea');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    } catch (err) {
      //console.error('Could not scroll to bottom:', err);
    }
  }
  loadInitialChatData() {
  this.isLoading = true;
  this.chatService.getChatMessages(this.currentChatId).subscribe({
    next: (messagesResponse) => {
      this.messages = Array.isArray(messagesResponse) ? messagesResponse : [];
      //console.log('Initial messages loaded:', this.messages);
      this.client = null;
      this.chatService.markAsRead(this.currentChatId).subscribe();
      this.isLoading = false;
      setTimeout(() => this.scrollToBottom(), 100);
      if (this.client) {
        this.logbookService.getLogbookForUser(this.client.id).subscribe({
          next: (logbookData) => {
              this.logEntries = logbookData;
              this.isLoading = false;
            },
            error: (err) => {
               this.dataService.handleApiError(err);
              this.isLoading = false;
              this.messages = [];
            }
        });
      }
    },
    error: (err) => {
      this.isLoading = false;
      this.dataService.handleApiError(err);
      this.messages = []; 
    },
  });
}

  sendMessage() {
    if (this.sendDisabled || this.isSending) return;
    this.isSending = true;

    const payload = { content: this.replyText.trim() };

    this.chatService.sendWriterMessage(this.currentChatId, payload).subscribe({
      next: (response) => {
      //  console.log('ressponse is',response)
        // Adding the new message returned from the server to our array
        this.messages.push(response.data);
        this.replyText = '';
        this.isSending = false;
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (err) => {
        this.isSending = false;
       this.dataService.handleApiError(err);
      },
    });
  }

  logout():void {
    this.authService.logout().subscribe({
        next:(response)=>{
            this.messageService.add({ severity: 'success', summary: 'Success', detail: response || 'logged out successfully' });
    this.router.navigate(['/login']);
        },
        error:(err)=>{
         this.dataService.handleApiError(err);
         this.router.navigate(['/login']);
        }
      })
      }

  get charCount() {
    return this.replyText.length;
  }

  get sendDisabled() {
    return this.replyText.length < this.minChars;
  }
}
interface Message {
  sender: 'client' | 'writer';
  text: string;
  time: string;
  avatar: string;
}
interface LogEntry {
  text: string;
  date: string;
}
