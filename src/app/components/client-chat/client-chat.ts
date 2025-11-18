import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { userProfileDTO } from '../../data/auth-dto';
import { AvatarModule } from 'primeng/avatar';
import { Chat, SendMessagePayload } from '../../services/chat';
import { MessageService } from 'primeng/api';
import {  ToastModule } from "primeng/toast";

@Component({
  selector: 'app-client-chat',
  imports: [FormsModule, CommonModule, AvatarModule, ToastModule],
  templateUrl: './client-chat.html',
  styleUrl: './client-chat.css'
})
export class ClientChat {

messages: any=[];
isSending = false; // To disable the button while sending
writerProfile!:userProfileDTO;
userDetails:any;
chatInput: string = '';
   // Access the navigation state in the constructor.
constructor(
  private router:Router,
  private chatService:Chat,
  private messageService:MessageService
){
  const navigation =  this.router.getCurrentNavigation();
  if(navigation?.extras.state){
    this.writerProfile = navigation.extras.state['writerProfile'];
  }
}
ngOnInit(){
   // If the state was not available (e.g., user refreshed the page),
    // redirect them back to the home page.
    if(!this.writerProfile){
      this.router.navigate(['/client-home']);
    }
    const user=sessionStorage.getItem('user');
     if(user){
      this.userDetails=JSON.parse(user);
    }
       // TODO: In the future,I will add a method here to fetch existing
    // messages for this chat from the backend.
    // e.g., this.fetchMessages(this.writerProfile.id);
}
sendMessage():void {
if (!this.chatInput.trim()) return;
this.isSending = true;
const payload:SendMessagePayload={
   receiver_id: this.writerProfile.id,
      message: this.chatInput.trim()
}
// Clear the input immediately for a better UX
    this.chatInput = '';
    // 2. Call the service
    this.chatService.sendMessage(payload).subscribe({
      next:(response)=>{
 // 3. On success, add the message returned from the server to the array
        // The response should be the newly created message object
        this.messages.push(response.data); 
            // Also update the user's credit balance on the frontend
        this.userDetails.credits_balance = response.new_credit_balance;
        sessionStorage.setItem('user', JSON.stringify(this.userDetails));
        this.isSending = false;
         setTimeout(() => this.scrollToBottom(), 100);
      },
      error:(err)=>{
         // 4. On failure, show an error and re-enable the button
        this.isSending = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Failed to send message.',
          life: 3000,
        });
 setTimeout(() => this.scrollToBottom(), 100);
  // Optional:  put the failed message back in the input box
        this.chatInput = payload.message; 
}
  })

}


scrollToBottom() {
const container = document.getElementById('messageArea');
if (container) container.scrollTop = container.scrollHeight;
}
navigateToClientHome():void{
  this.router.navigate(['/client-home']);
}
}
