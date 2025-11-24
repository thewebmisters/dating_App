import { AuthService } from './../../services/auth-service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import {AvatarModule} from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CardModule } from 'primeng/card';
import { Toast } from 'primeng/toast';
import { AuthenticatedUserDTO, Writer, WriterProfileDTO } from '../../data/auth-dto';
import { Router } from '@angular/router';
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
  userDetails!:AuthenticatedUserDTO;
   imageSrc:string = '/assets/images/mainlogo.jpg';
 writerProfiles:Writer[]=[];
  constructor(private authService:AuthService,
    private messageService:MessageService,
    private router:Router
  ){}
  ngOnInit(){

    this.fetchProfiles();
    this.fetchAuthenticatedUsrDetails();
    //const user=sessionStorage.getItem('user');
    // if(user){
    //   this.userDetails=JSON.parse(user);
    // }
    }
    fetchAuthenticatedUsrDetails():void{
      this.authService.getUserDetails().subscribe({
        next:(response)=>{
          this.userDetails = response;
          console.log('userDetails',this.userDetails);
          },
          error:(err)=>{
 this.messageService.add({
              severity: 'error',
      summary: 'Error',
      detail:   err.error?.message,
      life: 3000,
        })
      }
      })
    }
  fetchProfiles(){
    this.authService.getProfiles().subscribe({
      next:(response)=>{
        this.writerProfiles=response.data;
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
  checkCreditBal(profile:Writer):void{
    if(Number(this.userDetails.wallet.balance)<=0){
this.router.navigate(['/buy-credit']);
    }else{
      this.router.navigate(['/client-chat'],{state:{writerProfile:profile}});
    }
    
  }
}
