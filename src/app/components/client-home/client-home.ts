import { AuthService } from './../../services/auth-service';
import { CommonModule } from '@angular/common';
import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import {AvatarModule} from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CardModule } from 'primeng/card';
import { Toast } from 'primeng/toast';
import { AuthenticatedUserDTO, Writer} from '../../data/auth-dto';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { isPlatformBrowser } from '@angular/common';
import { DataService } from '../../services/data-service';
@Component({
  selector: 'app-client-home',
  templateUrl: './client-home.html',
  styleUrls: ['./client-home.css'],
  imports: [AvatarModule, AvatarGroupModule, CardModule, CommonModule, Toast,DialogModule]
})
export class ClientHome{
  userDetails!:AuthenticatedUserDTO;
   imageSrc:string = '/assets/images/mainlogo.jpg';
 writerProfiles:Writer[]=[];
 selectedProfile: Writer | null = null;
 visible:boolean=false;
  isBioTruncated: boolean = true;
  readonly bioMaxLength: number = 50;
  constructor(private authService:AuthService,
    private router:Router,
    private dataService:DataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ){}
  ngOnInit(){

    this.fetchProfiles();
    this.fetchAuthenticatedUsrDetails();
    }
    fetchAuthenticatedUsrDetails():void{
      this.authService.getUserDetails().subscribe({
        next:(response)=>{
          this.userDetails = response;
          },
          error:(err)=>{
 this.dataService.handleApiError(err);
      }
      })
    }
  fetchProfiles(){
    this.authService.getProfiles().subscribe({
      next:(response)=>{
        this.writerProfiles=response.data;
      },
      error:(err)=>{
      this.dataService.handleApiError(err);
      }
    })
  }
 openProfileCard(profile: Writer) {
  this.visible=true;
  this.selectedProfile = profile;
  console.log('profile id',this.selectedProfile.id);
    this.isBioTruncated = true; 
}
closeProfileDialog() {
    this.visible = false;
     setTimeout(() => {
      this.selectedProfile = null;
    }, 300);
    
  }
  toggleBio() {
    this.isBioTruncated = !this.isBioTruncated;
  }
  checkCreditBal(profile:Writer):void{
    if(Number(this.userDetails.wallet.balance)<=0){
this.router.navigate(['/buy-credit']);
    }else{
      this.router.navigate(['/client-chat']);
      this.dataService.setId(profile.id);
      sessionStorage.setItem('user',JSON.stringify(this.userDetails));
    }
    
  }
}
