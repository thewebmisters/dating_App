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
  constructor(private authService:AuthService,
    private messageService:MessageService
  ){}
  ngOnInit(){
    this.fetchProfiles();
  }
  user = {
    name: 'John Doe',
    credits: 500,
    avatar:
      'https://images.unsplash.com/photo-1566753323558-f4e0952af115?auto=format&fit=crop&w=100&q=80',
  };
imageSrc:string = '/assets/images/mainlogo.jpg';
  profiles: Profile[] = [
    {
      name: 'Maria',
      age: 28,
      img: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80',
      online: true,
    },
    {
      name: 'Sophia',
      age: 25,
      img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      online: true,
    },
    {
      name: 'Isabella',
      age: 31,
      img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      online: true,
    },
    {
      name: 'Chloe',
      age: 27,
      img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      online: true,
    },
    {
      name: 'Elena',
      age: 29,
      img: 'https://images.unsplash.com/photo-1611601322175-80415d147128?auto=format&fit=crop&w=400&q=80',
      online: false,
    }
  ];
  userProfiles:userProfileDTO[]=[];
  fetchProfiles(){
    this.authService.getProfiles().subscribe({
      next:(response)=>{
        this.userProfiles=response;
        console.log('user profiles',this.userProfiles);
this.messageService.add({
              severity: 'error',
      summary: 'Error',
      detail:'sucessfully',
      life: 3000,
        })
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
