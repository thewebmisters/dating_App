import { AuthService } from './../../services/auth-service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import {AvatarModule} from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CardModule } from 'primeng/card';
import { Toast } from 'primeng/toast';
import { userProfileDTO } from '../../data/auth-dto';
import { Router } from '@angular/router';
import e from 'express';
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
   imageSrc:string = '/assets/images/mainlogo.jpg';
 userProfiles:userProfileDTO[]=[];
  constructor(private authService:AuthService,
    private messageService:MessageService,
    private router:Router
  ){}
  ngOnInit(){
    this.fetchProfiles();
    const user=sessionStorage.getItem('user');
    if(user){
      this.userDetails=JSON.parse(user);
    }
    }
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
  checkCreditBal():void{
    if(this.userDetails.credits_balance<0){
this.router.navigate(['/buy-credit']);
    }else{
      this.router.navigate(['/chat-screen']);
    }
    
  }
}
