import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SendMessagePayload, Writer} from '../../data/auth-dto';
import { AvatarModule } from 'primeng/avatar';
import { Chat } from '../../services/chat';
import { MessageService } from 'primeng/api';
import {  ToastModule } from "primeng/toast";
import { AuthService } from '../../services/auth-service';
import { DataService } from '../../services/data-service';

@Component({
  selector: 'app-client-chat',
  imports: [FormsModule, CommonModule, AvatarModule, ToastModule],
  templateUrl: './client-chat.html',
  styleUrl: './client-chat.css'
})
export class ClientChat {
writerProfile: Writer | null = null;
messages: any=[];
isSending = false; // To disable the button while sending
userDetails:any;
chatInput: string = '';
isLoading = true; 
writerId!:number;
   // Access the navigation state in the constructor.
constructor(
  private router:Router,
  private chatService:Chat,
  private messageService:MessageService,
  private route: ActivatedRoute,
  private authService:AuthService,
  private dataService:DataService,
   @Inject(PLATFORM_ID) private platformId: Object
){
  const navigation =  this.router.getCurrentNavigation();
  if(navigation?.extras.state){
    this.writerProfile = navigation.extras.state['writerProfile'];
  }
}
ngOnInit(){
   // This block now handles the case where the user refreshes the page
    // or navigates directly to the URL.
    this.writerId=this.dataService.getId();
    console.log('writer id',this.writerId);
    this.fetchProfileById(this.writerId);
    // if (!this.writerProfile) {
    //   const writerId = this.route.snapshot.paramMap.get('id');
    //   if (writerId) {
    //     const writerIdNumber = parseInt(writerId);
    //     if (!isNaN(writerIdNumber)) { 
    //   this.fetchProfileById(writerIdNumber); 
    // }
    //   } else {
        
    //     this.router.navigate(['/client-home']);
    //   }
    // }
     if (isPlatformBrowser(this.platformId)) {
 // Load client details
    const user = sessionStorage.getItem('user');
    if (user) {
      this.userDetails = JSON.parse(user);
    }}
}
fetchProfileById(id:number){
  this.isLoading = true;
    this.authService.getCurrentProfile(id).subscribe({
      next:(response)=>{
        this.writerProfile=response;
        this.isLoading = false;
      },
      error:(err)=>{
        this.isLoading = false;
         this.messageService.add({
              severity: 'error',
      summary: 'Error',
      detail:  err.error?.email ||  err.error?.message,
      life: 3000,
        });
        // Redirect back home if the profile can't be found
        setTimeout(() => this.router.navigate(['/client-home']), 3000);
      }
    })
  }

  /**
   * Sends the user's message to the backend via the ChatService.
   */
  sendMessage(): void {
    // Guard clauses: Ensure we have a profile and a message to send
    if (!this.writerProfile) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Writer profile not loaded.' });
      return;
    }
    if (!this.chatInput.trim() || this.isSending) {
      return;
    }
this.isSending = true;
 // 1. Create the payload object based on the API requirements
    const payload: SendMessagePayload = {
      profile_id: this.writerProfile.id,
      content: this.chatInput.trim(),
      attachments:[]
      // We are ignoring attachments for now
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
        // On FAILURE, show an error and restore the user's typed message
        this.isSending = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Send Failed',
          detail: err.error?.error || 'Your message could not be sent.',
          life: 3000,
        });
        // Put the failed message back in the input box so the user can retry
        this.chatInput = payload.content;
      }
    });
  }
scrollToBottom() {
const container = document.getElementById('messageArea');
if (container) container.scrollTop = container.scrollHeight;
}
navigateToClientHome():void{
  this.router.navigate(['/client-home']);
}
}
