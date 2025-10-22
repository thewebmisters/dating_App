import { ButtonModule } from 'primeng/button';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CardModule} from 'primeng/card';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CardModule,ButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('dating_app');
}
