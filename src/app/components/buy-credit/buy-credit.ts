import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { Router } from "@angular/router";
@Component({
  selector: 'app-buy-credit',
  imports: [ButtonModule, AvatarModule, BadgeModule, CardModule, CommonModule],
  templateUrl: './buy-credit.html',
  styleUrl: './buy-credit.css'
})
export class BuyCredit {
   userDetails:any;
  constructor(
    private router:Router
  ){}
  ngOnInit(){
      const user=sessionStorage.getItem('user');
    if(user){
      this.userDetails=JSON.parse(user);
    }
  }
 user:any = {
    name: 'John Doe',
    credits: 500,
    avatar:
      'https://images.unsplash.com/photo-1566753323558-f4e0952af115?auto=format&fit=crop&w=100&q=80',
  };

  packages: Package[] = [
    {
      title: 'Starter Pack',
      credits: 300,
      price: 10,
    },
    {
      title: 'Connector',
      credits: 1000,
      price: 25,
      bonus: '+100 Bonus!',
      best: true,
    },
    {
      title: 'Connoisseur',
      credits: 2500,
      price: 50,
    },
  ];
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
