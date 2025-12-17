import  Pusher from 'pusher-js';
import { AuthenticatedUserDTO } from './../../data/auth-dto';
import { Component } from '@angular/core';
import { Chat } from '../../services/chat';
import { MessageService } from 'primeng/api';
import { ClaimedChat } from '../../data/chats-dto';
import { DataService } from '../../services/data-service';
import { AuthService } from '../../services/auth-service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Dialog } from "primeng/dialog";
import { Router } from '@angular/router';
import { WebSocketService } from '../web-socket-service';
@Component({
  selector: 'app-writer-dashboard',
  imports: [CommonModule, NgIf, Dialog, NgFor],
  templateUrl: './writer-dashboard.html',
  styleUrl: './writer-dashboard.css',
})
export class WriterDashboard {
  imgSrc: string = '/assets/images/mainlogo.jpg';
 writerChats: ClaimedChat[] = []; 
  unclaimedChats: any[] = [];
  authUserDetails!:AuthenticatedUserDTO;
  showUnclaimedDialog = false; 
  activeChatId: number | null = null;
constructor(
  private chatService:Chat,
  private messageService:MessageService,
  private dataService:DataService,
  private authService:AuthService,
  private router:Router,
  private webSocketService:WebSocketService
){}
ngOnInit(){
  //this.fetchWriterChats();
  this.fetchUnclaimedChats();
  this.fetchAuthUserDetails();
  this.fetchWriterClaimedChats();
}
fetchAuthUserDetails():void{
this.authService.getUserDetails().subscribe({
  next:(response)=>{
    this.authUserDetails=response;
    //console.log('writer details',this.authUserDetails)
  },
  error:(err)=>{
    this.dataService.handleApiError(err);
  }
})
}

// fetchWriterChats():void{
//   this.chatService.getWriterChats().subscribe({
//     next:(response)=>{
//       this.writerChats=response;
//        console.log('writer chats response',response);
//     },
//     error:(err)=>{
//   this.dataService.handleApiError(err);
//     }
//   })
// }

  fetchWriterClaimedChats(): void {
    this.chatService.getClaimedChats().subscribe({
      next: (response) => {
        this.writerChats = response;
      },
      error: (err) => {
       // this.dataService.handleApiError(err);
      }
    });
  }
fetchUnclaimedChats(){
  this.chatService.getUnclaimedChats().subscribe({
    next:(response)=>{
this.unclaimedChats =response;
//console.log('unclaimed chats',this.unclaimedChats);
    },
    error:(err)=>{
      //this.dataService.handleApiError(err);
    }
  })
}
/**
   * Navigates the writer to the specific chat screen.
   * @param chat The chat object that was clicked.
   */
  openChat(chat: ClaimedChat): void {
    // Pass the CHAT ID to the chat screen route
    //this.router.navigate(['/writer/chat', chat.id]);
     //this.dataService.setChatId(chat.id);
     //const chatsid=this.dataService.getChatId();
    // this.activeChatId = chat.id
    //console.log('claimed Chat Id',chatsid)
    this.router.navigate(['chat-screen',chat.id]);
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
        this.fetchWriterClaimedChats();
        this.fetchUnclaimedChats();
        this.showUnclaimedDialog = false;
       // this.dataService.setChatId(chatId);
        //const chatsid=this.dataService.getChatId();
        //console.log('claimed Chat Id',chatsid)
        this.router.navigate(['chat-screen',chatId]);
      },
      error: (err) => {
        this.dataService.handleApiError(err);
      }
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
}
