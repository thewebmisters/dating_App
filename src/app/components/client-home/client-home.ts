import { AuthService } from './../../services/auth-service';
import { CommonModule } from '@angular/common';
import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import {AvatarModule} from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CardModule } from 'primeng/card';
import { AuthenticatedUserDTO, Writer} from '../../data/auth-dto';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { isPlatformBrowser } from '@angular/common';
import { DataService } from '../../services/data-service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-client-home',
  templateUrl: './client-home.html',
  styleUrls: ['./client-home.css'],
  imports: [AvatarModule, AvatarGroupModule, CardModule, CommonModule,DialogModule]
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
   private messageService:MessageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ){}
  ngOnInit(){
 this.fetchAuthenticatedUsrDetails();
    this.fetchProfiles();
    }
    fetchAuthenticatedUsrDetails():void{
      this.authService.getUserDetails().subscribe({
        next:(response)=>{
          this.userDetails = response;
         // console.log('user details',this.userDetails.wallet);
          },
          error:(err)=>{
 this.dataService.handleApiError(err);
      }
      })
    }
  fetchProfiles(){
    this.authService.getProfiles().subscribe({
      next:(response)=>{
        this.writerProfiles=response;
      },
      error:(err)=>{
      this.dataService.handleApiError(err);
      }
    })
  }
 openProfileCard(profile: Writer) {
  this.visible=true;
  this.selectedProfile = profile;
  //console.log('profile id',this.selectedProfile.id);
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
  //console.log('profile id>',profile.id);
    if(this.userDetails.wallet.tokens <= 0){
this.router.navigate(['/buy-credit']);
    }else{
      this.router.navigate(['/client-chat',profile.id]);
    //  this.dataService.setId(profile.id);
      sessionStorage.setItem('user',JSON.stringify(this.userDetails));
    }
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
