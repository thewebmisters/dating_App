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
import { ResetPassword } from './components/reset-password/reset-password';
import { ClientChat } from './components/client-chat/client-chat';

export const routes: Routes = [
  { path: 'landing-page', component: LandingPage },
  { path: 'signup', component: Signup },
  { path: 'login', component: Login },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'admin-panel', component: AdminPanel },
  { path: 'client-home', component: ClientHome },
  { path: 'buy-credit', component: BuyCredit },
  { path: 'writer-dashboard', component: WriterDashboard },
  { path: 'reset', component: ResetPassword },
// Dynamic routes → SSR only
  { path: 'chat-screen/:id', component: Chatscreen},
  { path: 'client-chat/:id', component: ClientChat},

  // Default + wildcard
  { path: '', component: LandingPage },
  { path: '**', component: LandingPage }
];
