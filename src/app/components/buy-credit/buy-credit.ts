import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { Router } from "@angular/router";
import { AuthService } from '../../services/auth-service';
import { DataService } from '../../services/data-service';
import { PurchaseService } from '../../services/purchase-service';
import { TokenPackageDto } from '../../data/tokens-dto';
@Component({
  selector: 'app-buy-credit',
  imports: [ButtonModule, AvatarModule, BadgeModule, CardModule, CommonModule,NgIf],
  templateUrl: './buy-credit.html',
  styleUrl: './buy-credit.css'
})
export class BuyCredit {
   userDetails:any;
   packages:TokenPackageDto[]=[];
  constructor(
    private router:Router,
    private authService:AuthService,
    private dataService:DataService,
    private purchaseService:PurchaseService
  ){}
  ngOnInit(){
    //   const user=sessionStorage.getItem('user');
    // if(user){
    //   this.userDetails=JSON.parse(user);
    // }else{
    //   this.userDetails=null;
    // }

 this.fetchAuthenticatedUsrDetails();
 this.getPackages();
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
    getPackages():void{
      this.purchaseService.getPackages().subscribe({
        next:(response)=>{
this.packages=response.data;
//console.log('packages',this.packages);
        },
        error:(err)=>{
          this.dataService.handleApiError(err);
        }
      })
    }
 
  navigateToClientScreen(){
    this.router.navigate(['/client-home']);
  }
}
interface Package {
  title: string;
  credits: number;
  price: number;
  bonus?: string;
  best?: boolean;
}
