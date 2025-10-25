import { Routes } from '@angular/router';
import { LandingPage } from './components/landing-page/landing-page';
import { Auth } from './components/auth/auth';

export const routes: Routes = [
    {path:'landing-page',component:LandingPage},
    {path:'auth',component:Auth},
    // Redirect any invalid URL to '/home'
    {path:'',component:LandingPage},
    {path:'**',component:LandingPage}

];

