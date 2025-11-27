import { ClientChat } from './components/client-chat/client-chat';
import { Routes } from '@angular/router';
import { LandingPage } from './components/landing-page/landing-page';
import { Signup } from './components/signup/signup';
import { Login } from './components/login/login';
import { Chatscreen } from './components/chatscreen/chatscreen';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { AdminPanel } from './components/admin-panel/admin-panel';
import { ClientHome } from './components/client-home/client-home';
import { BuyCredit } from './components/buy-credit/buy-credit';
import { WriterDashboard } from './components/writer-dashboard/writer-dashboard';

export const routes: Routes = [
    {path:'landing-page',component:LandingPage},
    {path:'signup',component:Signup},
    {path:'login',component:Login},
    {path:'chat-screen',component:Chatscreen},
    {path:'forgot-password',component:ForgotPassword},
    {path:'admin-panel',component:AdminPanel},
    {path:'client-home',component:ClientHome},
    {path:'buy-credit',component:BuyCredit},
    {path:'client-chat/:id',component:ClientChat},
    {path:'writer-dashboard',component:WriterDashboard},
    // Redirect any invalid URL to '/home'
    {path:'',component:LandingPage},
    {path:'**',component:LandingPage}

];

