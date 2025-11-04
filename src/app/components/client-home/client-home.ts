import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {AvatarModule} from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CardModule } from 'primeng/card';
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
  imports:[AvatarModule,AvatarGroupModule,CardModule,CommonModule]
})
export class ClientHome{
  user = {
    name: 'John Doe',
    credits: 500,
    avatar:
      'https://images.unsplash.com/photo-1566753323558-f4e0952af115?auto=format&fit=crop&w=100&q=80',
  };

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
}
