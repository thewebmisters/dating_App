import { ButtonModule } from 'primeng/button';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CardModule} from 'primeng/card';
import { AuthService } from './services/auth-service';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CardModule, ButtonModule,ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('dating_app');
  constructor(private authService:AuthService){}
  ngOnInit(){
     // Initialize authentication and WebSocket connection when the app starts.
    this.authService.initializeAuthentication();
  }
}
