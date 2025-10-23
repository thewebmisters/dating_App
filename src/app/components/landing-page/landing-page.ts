import { ButtonModule } from 'primeng/button';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-landing-page',
  imports: [CardModule, ButtonModule],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {
  imgSrc: string = '/assets/images/logo.jpg';
  constructor() {}
  ngOnInit() {}
}
