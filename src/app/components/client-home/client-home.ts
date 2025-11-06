import { AuthService } from './../../services/auth-service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import {AvatarModule} from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CardModule } from 'primeng/card';
import { Toast } from 'primeng/toast';
import { userProfileDTO } from '../../data/auth-dto';
interface Profile {
  name: string;
  age: number;
  img: string;
  online: boolean;
}

@Component({
  selector: 'app-client-home',
  templateUrl: './client-home.html',
  styleUrls: ['./client-home.css'],
  imports: [AvatarModule, AvatarGroupModule, CardModule, CommonModule, Toast]
})
export class ClientHome{
  userDetails:any;
  constructor(private authService:AuthService,
    private messageService:MessageService
  ){}
  ngOnInit(){
    this.fetchProfiles();
    const user=sessionStorage.getItem('user');
    if(user){
      this.userDetails=JSON.parse(user);
      console.log('user details',this.userDetails);
    }
    
    
  }
  user = {
    name: 'John Doe',
    credits: 500,
    avatar:
      'https://images.unsplash.com/photo-1566753323558-f4e0952af115?auto=format&fit=crop&w=100&q=80',
  };
imageSrc:string = '/assets/images/mainlogo.jpg';
 userProfiles:userProfileDTO[]=[];
  fetchProfiles(){
    this.authService.getProfiles().subscribe({
      next:(response)=>{
        this.userProfiles=response;
      },
      error:(err)=>{
         this.messageService.add({
              severity: 'error',
      summary: 'Error',
      detail:  err.error?.email ||  err.error?.message,
      life: 3000,
        })
      }
    })
  }
  
}
