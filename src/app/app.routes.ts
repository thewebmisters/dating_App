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
import { ResetPassword } from './components/reset-password/reset-password';
import { AccountSettings } from './components/account-settings/account-settings';

export const routes: Routes = [
    { path: 'welcome', component: LandingPage },
    { path: 'join', component: Signup },
    { path: 'signin', component: Login },
    { path: 'engage/:id', component: Chatscreen },
    { path: 'recover', component: ForgotPassword },
    { path: 'control', component: AdminPanel },
    { path: 'explore', component: ClientHome },
    { path: 'purchase', component: BuyCredit },
    { path: 'connect/:id', component: ClientChat },
    { path: 'studio', component: WriterDashboard },
    { path: 'reset', component: ResetPassword },
    { path: 'profile', component: AccountSettings },
    // Redirect any invalid URL to '/welcome'
    { path: '', component: LandingPage },
    { path: '**', component: LandingPage }
];

