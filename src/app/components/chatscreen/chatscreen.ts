import { AvatarModule } from 'primeng/avatar';
import { AuthenticatedUserDTO, UserDTO } from './../../data/auth-dto';
import { MessageService } from 'primeng/api';
import { AuthService } from './../../services/auth-service';
import { Component } from '@angular/core';
import { ToastModule } from "primeng/toast";
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data-service';

@Component({
  selector: 'app-chatscreen',
  imports: [ToastModule,FormsModule,AvatarModule,CommonModule],
  templateUrl: './chatscreen.html',
  styleUrl: './chatscreen.css'
})
export class Chatscreen {
  email:string | null=null;
  password:string | null=null;
  user!:AuthenticatedUserDTO;
  name:string | null=null;
  chatId!:number;
    // Chat logic
  replyText = '';
  minChars = 100;
  writer = {
    name: 'Maria Garcia',
    balance: 125.5,
    avatar:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=100&q=80',
  };

  client = {
    name: 'John Doe',
    avatar:
      'https://images.unsplash.com/photo-1566753323558-f4e0952af115?auto=format&fit=crop&w=150&q=80',
    status: 'Online',
    details: {
      age: 58,
      location: 'Denver, USA',
      job: 'Doctor',
      marital: 'Single',
      smoking: 'Non-smoker',
    },
    bio: `Looking for a real connection. I enjoy working on cars, long drives, and good conversation.`,
  };

  logEntries: LogEntry[] = [
    {
      text: 'Sent a picture of his new truck.',
      date: 'Sep 12, 2025 - 11:34',
    },
    {
      text: 'Mentioned he had cataract surgery 6 years ago.',
      date: 'Sep 06, 2025 - 04:33',
    },
    {
      text: `He's a doctor, but currently installing an engine in his race car.`,
      date: 'Sep 01, 2025 - 14:20',
    },
    {
      text: 'Has 2 kids, both in college.',
      date: 'Aug 29, 2025 - 09:12',
    },
  ];

  messages: Message[] = [
    {
      sender: 'client',
      text: `Sounds like a great idea. How long will it take you 
        to install the engine, sweetheart?`,
      time: '11:34 AM',
      avatar:
        'https://images.unsplash.com/photo-1566753323558-f4e0952af115?auto=format&fit=crop&w=80&q=80',
    },
    {
      sender: 'writer',
      text: `It's a detailed process! I'm hoping to have it done in
        about 6 hours. I'll call you when I'm finished. I hope you have
        a wonderful day as well, my dear. ***`,
      time: '11:37 AM',
      avatar:
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=100&q=80',
    },
  ];
constructor(
  private authService:AuthService,
  private messageService:MessageService,
  private router:Router,
  private dataService:DataService
){}
ngOnInit(){
   this.chatId=this.dataService.getChatId();
  console.log('chat id',this.chatId);
  // if(!this.chatId){
  //   this.router.navigate(['writer-dashboard']);
  //   return
  // }
  const email = sessionStorage.getItem('email');
  if(email){
    this.email=email;
  }
  const password = sessionStorage.getItem('password');
  if(password){
    this.password=password;
  }
 
  this.fetchUserDetails();
}
fetchUserDetails(){
  const body={
    email:this.email,
    password:this.password
  }
  this.authService.getUserDetails().subscribe({
    next:(response)=>{
      this.user=response;
      this.name=this.user.name;
    },
    error:(err)=>{
     this.handleApiError(err);
    }
  })
}
handleLogout(){
  this.router.navigate(['/login']);
 
//   this.authService.logout().subscribe({
//     next:(response)=>{
// this.messageService.add({
//               severity: 'success',
//       summary: 'Success',
//       detail:   response?.message || 'Logged out successfully' ,
//       life: 3000,
//         })
//     },
//    error:(err)=>{
//      this.handleApiError(err);
//     }
//   })
}
handleApiError(err:any){
  return(
    this.messageService.add({
              severity: 'error',
      summary: 'Error',
      detail:   err?.error?.message ,
      life: 3000,
        })
  )
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