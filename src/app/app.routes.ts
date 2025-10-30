import { Routes } from '@angular/router';
import { LandingPage } from './components/landing-page/landing-page';
import { Signup } from './components/signup/signup';
import { Login } from './components/login/login';
import { Chatscreen } from './components/chatscreen/chatscreen';

export const routes: Routes = [
    {path:'landing-page',component:LandingPage},
    {path:'signup',component:Signup},
    {path:'login',component:Login},
    {path:'chat-screen',component:Chatscreen},
    // Redirect any invalid URL to '/home'
    {path:'',component:LandingPage},
    {path:'**',component:LandingPage}

];

