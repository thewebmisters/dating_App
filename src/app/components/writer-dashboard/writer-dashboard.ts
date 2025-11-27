import { UnclaimedChats } from './../../data/auth-dto';
import { Component } from '@angular/core';
import { Chat } from '../../services/chat';
import { MessageService } from 'primeng/api';
import { ChatSummary } from '../../data/chats-dto';

@Component({
  selector: 'app-writer-dashboard',
  imports: [],
  templateUrl: './writer-dashboard.html',
  styleUrl: './writer-dashboard.css',
})
export class WriterDashboard {
  imgSrc: string = '/assets/images/mainlogo.jpg';
  writerChats:ChatSummary[]=[];
  unclaimedChats:UnclaimedChats[]=[];
constructor(
  private chatService:Chat,
  private messageService:MessageService
){}
ngOnInit(){
  this.fetchWriterChats();
  this.fetchUnclaimedChats();
}
fetchWriterChats():void{
  this.chatService.getWriterChats().subscribe({
    next:(response)=>{
      this.writerChats=response;
      console.log('response',this.writerChats);
    },
    error:(err)=>{
       this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: err.error?.message,
      life: 3000,
    });
    }
  })
}
fetchUnclaimedChats(){
  this.chatService.getUnclaimedChats().subscribe({
    next:(response)=>{
this.unclaimedChats =response;
//console.log('unclaimed chats',this.unclaimedChats);
    },
    error:(err)=>{
        this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: err.error?.message,
      life: 3000,
    });
    }
  })
}
}
