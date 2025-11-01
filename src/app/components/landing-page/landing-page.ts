import { ButtonModule } from 'primeng/button';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-landing-page',
  imports: [CardModule, ButtonModule,RouterLink],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {
  imgSrc: string = '/assets/images/mainlogo.jpg';
  constructor(
    private router:Router
  ) {}
  ngOnInit() {}
  navigateToAuth():void{
    this.router.navigate(['/signup']);
  }
}
