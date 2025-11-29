import { reqHandler } from './../../../server';
import { AuthenticatedUserDTO, UnclaimedChats, UnclaimedChatsResponse } from './../../data/auth-dto';
import { Component } from '@angular/core';
import { Chat } from '../../services/chat';
import { MessageService } from 'primeng/api';
import { ChatSummary, PaginatedChatsResponse } from '../../data/chats-dto';
import { DataService } from '../../services/data-service';
import { AuthService } from '../../services/auth-service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Dialog } from "primeng/dialog";
import { Router } from '@angular/router';

@Component({
  selector: 'app-writer-dashboard',
  imports: [CommonModule, NgIf, Dialog,NgFor],
  templateUrl: './writer-dashboard.html',
  styleUrl: './writer-dashboard.css',
})
export class WriterDashboard {
  imgSrc: string = '/assets/images/mainlogo.jpg';
 writerChats: ChatSummary[] = []; 
  unclaimedChats: any[] = [];
  authUserDetails!:AuthenticatedUserDTO;
  showUnclaimedDialog = false; 
constructor(
  private chatService:Chat,
  private messageService:MessageService,
  private dataService:DataService,
  private authService:AuthService,
  private router:Router
){}
ngOnInit(){
  this.fetchWriterChats();
  this.fetchUnclaimedChats();
  this.fetchAuthUserDetails();
}
fetchAuthUserDetails():void{
this.authService.getUserDetails().subscribe({
  next:(response)=>{
    this. authUserDetails=response;
  },
  error:(err)=>{
    this.dataService.handleApiError(err);
  }
})
}
fetchWriterChats():void{
  this.chatService.getWriterChats().subscribe({
    next:(response)=>{
      this.writerChats=response;
      // console.log('response',this.writerChats.data);
    },
    error:(err)=>{
  this.dataService.handleApiError(err);
    }
  })
}
fetchUnclaimedChats(){
  this.chatService.getUnclaimedChats().subscribe({
    next:(response)=>{
this.unclaimedChats =response;
//console.log('unclaimed chats',this.unclaimedChats.data);
    },
    error:(err)=>{
      this.dataService.handleApiError(err);
    }
  })
}
/**
   * Navigates the writer to the specific chat screen.
   * @param chat The chat object that was clicked.
   */
  openChat(chat: ChatSummary): void {
    // Pass the CHAT ID to the chat screen route
    //this.router.navigate(['/writer/chat', chat.id]);
     this.dataService.setChatId(chat.id);
    this.router.navigate(['/chat-screen',chat.id]);
  }
  /**
   * Claims a chat and then refreshes the data.
   * @param chatId The ID of the chat to claim.
   */
  claimChat(chatId: number): void {
    this.chatService.claimChat(chatId).subscribe({
      next: (claimedChat) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Chat claimed!' });
          // Refresh both lists to show the updated state
        this.fetchWriterChats();
        this.fetchUnclaimedChats();
        this.showUnclaimedDialog = false;
        this.dataService.setChatId(claimedChat.id);
         // OPTIONAL: Immediately navigate to the chat you just claimed
        this.router.navigate(['/chat-screen',chatId]);
      },
      error: (err) => {
        this.dataService.handleApiError(err);
      }
    });
  }
}
